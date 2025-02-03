
// This will hold pricing data once the CSV is fetched
let pricingData = {};

// Fetch the pricing data from the CSV file
async function fetchPricingData() {
    const url = 'operator-pricing.csv?' + new Date().getTime();  // Add timestamp to bypass cache
    const response = await fetch(url);
    const csvText = await response.text();
    
    const parsedData = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        quoteChar: '"', // Ensure quoted fields are handled correctly
    });
    
    parsedData.data.forEach(row => {
        const mfg = row['Manufacturer'];
        const description = row['Description']
        const partNumber = row['Manufacturer Part Number'];
        const shortCode = row['Short Number'];
        const price = parseFloat(row['Price']) || 0;

        // Add the part number and pricing info directly to the pricingData object
        pricingData[partNumber] = { mfg, description, shortCode, price };
    });
}

// Initialize pricing data when the page loads
window.addEventListener('DOMContentLoaded', fetchPricingData);

let operatorCount = 1;

function addOperator() {
    operatorCount++;

    // Create the new operator section
    const operatorSection = document.createElement('div');
    operatorSection.classList.add('operator-section');
    operatorSection.id = `operatorSection${operatorCount}`;

    operatorSection.innerHTML = `
        <div class="operator-item">
            <label>Handing/Pair:</label><br>
            <input type="radio" name="handing${operatorCount}" value="RH" id="handingRH${operatorCount}">
            <label for="handingRH${operatorCount}" class="bubble">RH</label>
            <input type="radio" name="handing${operatorCount}" value="LH" id="handingLH${operatorCount}">
            <label for="handingLH${operatorCount}" class="bubble">LH</label>
            <input type="radio" name="handing${operatorCount}" value="Pair" id="handingPair${operatorCount}">
            <label for="handingPair${operatorCount}" class="bubble">Pair</label>
        </div>

        <div class="operator-item">
            <label>Finish:</label><br>
            <input type="radio" name="finish${operatorCount}" value="Dark Bronze" id="finishBronze${operatorCount}">
            <label for="finishBronze${operatorCount}" class="bubble">Dark Bronze</label>
            <input type="radio" name="finish${operatorCount}" value="Anodized Aluminum" id="finishAluminum${operatorCount}">
            <label for="finishAluminum${operatorCount}" class="bubble">Anodized Aluminum</label>
        </div>

        <div class="operator-item">
            <label>Arm Type:</label><br>
            <input type="radio" name="armType${operatorCount}" value="Push" id="armPush${operatorCount}">
            <label for="armPush${operatorCount}" class="bubble">Push Arm / Outswing</label>
            <input type="radio" name="armType${operatorCount}" value="Pull" id="armPull${operatorCount}">
            <label for="armPull${operatorCount}" class="bubble">Pull Arm / Inswing</label>
        </div>

        <div class="operator-item">
            <label for="doorWidth${operatorCount}">Enter Door Width (in inches):</label>
            <input type="number" id="doorWidth${operatorCount}" placeholder="e.g., 36" min="1">
        </div>

        <div class="operator-number-item">
            <label for="quantity${operatorCount}">Quantity:</label>
            <input type="number" id="quantity${operatorCount}" value="1" min="1">
        </div>
    `;

    // Append the operator section to the container
    const operatorContainer = document.getElementById('operatorContainer');
    operatorContainer.appendChild(operatorSection);

    // Get the "Add Another Operator" button
    const addOperatorBtn = document.getElementById('addOperatorBtn');

    // Use setTimeout to ensure the DOM is updated before moving the button
    setTimeout(() => {
        operatorContainer.appendChild(addOperatorBtn);  // Move button to the bottom after the new operator section is added
    }, 10);
}



function generateQuote() {
    const partsList = [];
    let totalPrice = 0;

    function addOrUpdatePart(partNumber, shortCode, mfg, description, price, quantity) {
        const existingPart = partsList.find(part => part.partNumber === partNumber);
        if (existingPart) {
            existingPart.quantity += quantity;
            existingPart.totalPrice += price * quantity;
        } else {
            partsList.push({ mfg, partNumber, shortCode, description, price, quantity, totalPrice: price * quantity });
        }
    }

// Add operators
for (let i = 1; i <= operatorCount; i++) {
    const handing = document.querySelector(`input[name="handing${i}"]:checked`)?.value;
    const finish = document.querySelector(`input[name="finish${i}"]:checked`)?.value;
    const armType = document.querySelector(`input[name="armType${i}"]:checked`)?.value;
    const doorWidth = document.getElementById(`doorWidth${i}`)?.value;
    const quantity = parseInt(document.getElementById(`quantity${i}`)?.value) || 1;

    if (!handing || !finish || !armType || !doorWidth) {
        alert(`Please complete all fields for Operator ${i}`);
        return;
    }

    const handingCode = handing === "LH" ? "L" : handing === "RH" ? "R" : "P";
    const armCode = armType === "Push" ? "1" : "2";
    const finishCode = finish === "Anodized Aluminum" ? "C" : "D";
    
    // Default to -XX for door width
    let widthCode = "-XX";

    // If the door width is 72 and Pair is selected, set widthCode to -72
    if (doorWidth === "72" && handing === "Pair") {
        widthCode = "-72";
    } else if (doorWidth === "36") {
        widthCode = "-36";
    }

    // Build the operator part number
    let operatorPartNumber = `MAC-L${handingCode}${armCode}${finishCode}${widthCode}`;

    // Get operator data from pricingData or set default price for double door operators (MAC-LP)
    const operatorData = pricingData[operatorPartNumber] || { shortCode: "NA", price: operatorPartNumber.startsWith("MAC-LP") ? 4688 : 2300 };

    // Add or update the operator part
    addOrUpdatePart(operatorPartNumber, operatorData.shortCode, operatorData.mfg, operatorData.description, operatorData.price, quantity);

    // Labor price logic
    const laborPrice = 178;
    const laborQuantity = handing === "Pair" ? 10 * quantity : 6 * quantity;

    // Add or update the labor part
    addOrUpdatePart("Labor", "SC104", "", "", laborPrice, laborQuantity);
}


    // Add bollards and other parts (no filtering needed)
    [pricingData].forEach(pricingInfo => {
        Object.entries(pricingInfo).forEach(([partNumber, { mfg, description, shortCode, price }]) => {
            const quantityInput = document.getElementById(partNumber);
            const quantity = quantityInput ? parseInt(quantityInput.value) || 0 : 0;
            if (quantity > 0) {
                addOrUpdatePart(partNumber, shortCode, mfg, description, price, quantity);

                // If this part is a bollard, add labor for each bollard
                if (partNumber.includes("CM-42-BSU")) {  // Check if partNumber is a bollard
                    addOrUpdatePart("Labor", "SC104", "", "", 178, quantity);  // One labor unit for each bollard
                }
            }
        });
    });

    // Sort partsList to ensure labor is last
    partsList.sort((a, b) => (a.partNumber === "Labor" ? 1 : b.partNumber === "Labor" ? -1 : 0));

    // Create table
    const output = document.getElementById("quoteOutput");
    output.innerHTML = "";

    const table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("cellpadding", "5");
    table.style.borderCollapse = "separate";  // Ensure rounded corners work
    table.style.borderRadius = "8px";  // Round corners for the table
    table.style.overflow = "hidden";  // Make sure the content respects the rounded corners


    // Add header row
    const headerRow = table.insertRow();
    ["Mfg", "Part Number", "Short Code", "Description", "Price", "Quantity", "Total Price"].forEach(text => {
        const cell = headerRow.insertCell();
        cell.innerText = text;
        cell.style.fontWeight = "bold";
    });

    // Add parts to table
    partsList.forEach(item => {
        const row = table.insertRow();
        row.insertCell().innerText = item.mfg;
        row.insertCell().innerText = item.partNumber;
        row.insertCell().innerText = item.shortCode;
        row.insertCell().innerText = item.description;
        row.insertCell().innerText = `$${item.price.toFixed(2)}`;
        row.insertCell().innerText = item.quantity;
        row.insertCell().innerText = `$${item.totalPrice.toFixed(2)}`;
        totalPrice += item.totalPrice;
    });

    // Add total price row
    const totalRow = table.insertRow();
    const totalLabelCell = totalRow.insertCell();
    totalLabelCell.colSpan = 4;
    totalLabelCell.style.textAlign = "right";
    totalLabelCell.style.fontWeight = "bold";
    totalLabelCell.innerText = "Total";

    const totalPriceCell = totalRow.insertCell();
    totalPriceCell.style.fontWeight = "bold";
    totalPriceCell.innerText = `$${totalPrice.toFixed(2)}`;

    output.appendChild(table);
}

