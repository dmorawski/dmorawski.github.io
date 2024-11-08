let operatorCount = 1;

function addOperator() {
    operatorCount++;
    const operatorSection = document.createElement('div');
    operatorSection.classList.add('operator-section');
    operatorSection.id = `operatorSection${operatorCount}`;

    operatorSection.innerHTML = `
        <label>Handing/Pair:</label><br>
        <input type="radio" name="handing${operatorCount}" value="RH" id="handingRH${operatorCount}">
        <label for="handingRH${operatorCount}" class="bubble">RH</label>
        
        <input type="radio" name="handing${operatorCount}" value="LH" id="handingLH${operatorCount}">
        <label for="handingLH${operatorCount}" class="bubble">LH</label>
        
        <input type="radio" name="handing${operatorCount}" value="Pair" id="handingPair${operatorCount}">
        <label for="handingPair${operatorCount}" class="bubble">Pair</label><br><br>

        <label>Finish:</label><br>
        <input type="radio" name="finish${operatorCount}" value="Dark Bronze" id="finishBronze${operatorCount}">
        <label for="finishBronze${operatorCount}" class="bubble">Dark Bronze</label>
        
        <input type="radio" name="finish${operatorCount}" value="Anodized Aluminum" id="finishAluminum${operatorCount}">
        <label for="finishAluminum${operatorCount}" class="bubble">Anodized Aluminum</label><br><br>

        <label>Arm Type:</label><br>
        <input type="radio" name="armType${operatorCount}" value="Push" id="armPush${operatorCount}">
        <label for="armPush${operatorCount}" class="bubble">Push Arm / Outswing</label>
        
        <input type="radio" name="armType${operatorCount}" value="Pull" id="armPull${operatorCount}">
        <label for="armPull${operatorCount}" class="bubble">Pull Arm / Inswing</label><br><br>

        <label for="doorWidth${operatorCount}">Enter Door Width (in inches):</label>
        <input type="number" id="doorWidth${operatorCount}" placeholder="e.g., 36" min="1"><br><br>

        <label for="quantity${operatorCount}">Quantity:</label>
        <input type="number" id="quantity${operatorCount}" value="1" min="1"><br><br>
    `;

    document.getElementById('operatorContainer').appendChild(operatorSection);
}

function generateQuote() {
    const partsList = [];
    let totalPrice = 0;

    function addOrUpdatePart(partNumber, shortCode, price, quantity) {
        const existingPart = partsList.find(part => part.partNumber === partNumber);
        if (existingPart) {
            existingPart.quantity += quantity;
            existingPart.totalPrice += price * quantity;
        } else {
            partsList.push({ partNumber, shortCode, price, quantity, totalPrice: price * quantity });
        }
    }

    // Pricing and short codes for switches and receivers
    const pricingInfo = {
        "4S1U4": { shortCode: "LAR1079", price: 158 },
        "W4S1U4": { shortCode: "LAR1082", price: 191.28 },
        "4R1U4": { shortCode: "LAR1069", price: 158 },
        "W4R1U4": { shortCode: "LAR1070", price: 182 },
        "J01J4": { shortCode: "LAR1016", price: 124 },
        "WJ01J4": { shortCode: "LAR1017", price: 148 },
        "233804": { shortCode: "LAR1015", price: 75 },
        "235215": { shortCode: "LAR1014", price: 87 }
    };

    // Generate operator part numbers and add them to parts list with appropriate prices
    for (let i = 1; i <= operatorCount; i++) {
        const handing = document.querySelector(`input[name="handing${i}"]:checked`)?.value;
        const finish = document.querySelector(`input[name="finish${i}"]:checked`)?.value;
        const armType = document.querySelector(`input[name="armType${i}"]:checked`)?.value;
        const doorWidth = document.getElementById(`doorWidth${i}`)?.value;
        const quantity = parseInt(document.getElementById(`quantity${i}`)?.value) || 1;

        if (handing && finish && armType && doorWidth) {
            let handingCode = handing === 'LH' ? 'L' : handing === 'RH' ? 'R' : 'P';
            const armCode = armType === 'Push' ? '1' : '2';
            const finishCode = finish === 'Anodized Aluminum' ? 'C' : 'D';
            const widthCode = doorWidth === '36' ? '-36' : (handing === 'Pair' && doorWidth === '72') ? '-72' : '-XX';
            const operatorPartNumber = `MAC-L${handingCode}${armCode}${finishCode}${widthCode}`;

            const price = handing === 'Pair' ? 4688.86 : 2300;
            const shortCode = "NA";
            addOrUpdatePart(operatorPartNumber, shortCode, price, quantity);

            // Add labor based on the operator type (RH/LH = 6 hours, Pair = 10 hours)
            const laborPrice = 178;
            const laborQuantity = handing === 'Pair' ? 10 * quantity : 6 * quantity;
            addOrUpdatePart("Labor", "SC104", laborPrice, laborQuantity);
        }
    }

    // Add switches and receivers from the fixed pricing info
    Object.entries(pricingInfo).forEach(([partNumber, { shortCode, price }]) => {
        const quantityInput = document.getElementById(partNumber);
        const quantity = quantityInput ? parseInt(quantityInput.value) || 0 : 0;
        if (quantity > 0) {
            addOrUpdatePart(partNumber, shortCode, price, quantity);
        }
    });

    // Add labor as the last part
    const laborPart = partsList.find(part => part.partNumber === "Labor");
    if (laborPart) {
        // Remove the labor item from its original position if already added
        const laborIndex = partsList.indexOf(laborPart);
        if (laborIndex > -1) {
            partsList.splice(laborIndex, 1);
        }
        // Add labor to the end of the list
        partsList.push(laborPart);
    }

    // Clear previous output and create table
    const output = document.getElementById('quoteOutput');
    output.innerHTML = "";

    const table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('cellpadding', '5');
    table.style.borderCollapse = 'collapse';

    // Table header
    const headerRow = table.insertRow();
    ["Part Number", "Short Code", "Price", "Quantity", "Total Price"].forEach(text => {
        const cell = headerRow.insertCell();
        cell.innerText = text;
    });

    // Populate table rows with parts and quantities, calculate total price
    partsList.forEach(item => {
        const row = table.insertRow();
        row.insertCell().innerText = item.partNumber;
        row.insertCell().innerText = item.shortCode;
        row.insertCell().innerText = `$${item.price.toFixed(2)}`;
        row.insertCell().innerText = item.quantity;
        row.insertCell().innerText = `$${item.totalPrice.toFixed(2)}`;
        totalPrice += item.totalPrice;
    });

    // Add total price row
    const totalRow = table.insertRow();
    totalRow.insertCell().colSpan = 4;
    totalRow.insertCell().innerText = `Total: $${totalPrice.toFixed(2)}`;

    // Append table to output div
    output.appendChild(table);
}
