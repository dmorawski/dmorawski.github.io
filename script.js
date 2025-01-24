// Add theme toggling functionality
document.getElementById('toggleTheme').addEventListener('click', () => {
    const body = document.body;

    // Toggle the dark-mode class
    body.classList.toggle('dark-mode');

    // Save the theme preference in localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Apply the saved theme on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
});

let operatorCount = 1;

// This will hold pricing data once the CSV is fetched
let pricingData = {
    operatorPricingInfo: {},
    powerSupplyPricingInfo: {},
    bollardPricingInfo: {},
    switchPricingInfo: {}
};

// Fetch the pricing data from the CSV file
async function fetchPricingData() {
    const response = await fetch('https://dmorawski.github.io/pricing.csv');
    const csvText = await response.text();
    
    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    
    parsedData.data.forEach(row => {
        // Check if it's a product category (you can replace with your own logic)
        // Adjust according to the CSV structure: "Manufacturer Part Number", "Price", "Short Number"
        
        const partNumber = row['Manufacturer Part Number'];
        const shortCode = row['Short Number'];
        const price = parseFloat(row['Price']) || 0;

        // Add operator pricing info
        if (row['Description'].toLowerCase().includes('operator')) {
            pricingData.operatorPricingInfo[partNumber] = {
                shortCode,
                price
            };
        }
        // Add power supply pricing info
        else if (row['Description'].toLowerCase().includes('power supply')) {
            pricingData.powerSupplyPricingInfo[partNumber] = {
                shortCode,
                price
            };
        }
        // Add bollard pricing info
        else if (row['Description'].toLowerCase().includes('bollard')) {
            pricingData.bollardPricingInfo[partNumber] = {
                shortCode,
                price
            };
        }
        // Add switch pricing info
        else if (row['Description'].toLowerCase().includes('switch')) {
            pricingData.switchPricingInfo[partNumber] = {
                shortCode,
                price
            };
        }
    });
}

// Initialize pricing data when the page loads
window.addEventListener('DOMContentLoaded', fetchPricingData);

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
        const widthCode = doorWidth === "36" ? "-36" : "-XX";
        const operatorPartNumber = `MAC-L${handingCode}${armCode}${finishCode}${widthCode}`;

        const operatorData = pricingData.operatorPricingInfo[operatorPartNumber] || { shortCode: "NA", price: 2300 };
        addOrUpdatePart(operatorPartNumber, operatorData.shortCode, operatorData.price, quantity);

        const laborPrice = 178;
        const laborQuantity = handing === "Pair" ? 10 * quantity : 6 * quantity;
        addOrUpdatePart("Labor", "SC104", laborPrice, laborQuantity);
    }

    // Add bollards using the same logic as switches and receivers
Object.entries(pricingData.bollardPricingInfo).forEach(([partNumber, { shortCode, price }]) => {
    const bollardInput = document.getElementById(partNumber);
    console.log(bollardInput);  // Check if the input element is correctly fetched
    
    const bollardQuantity = bollardInput ? parseInt(bollardInput.value) || 0 : 0;
    console.log(`Bollard ${partNumber} Quantity: `, bollardQuantity);  // Check if the quantity is 0 or a valid number
    
    if (bollardQuantity > 0) {
        addOrUpdatePart(partNumber, shortCode, price, bollardQuantity);

        // Add labor for bollards (1 hour per bollard)
        const laborBollardPrice = 178; // Labor price per bollard (same as before)
        addOrUpdatePart("Labor", "SC104", laborBollardPrice, bollardQuantity); // Add labor with the same part number
    }
});




    // Add switches, power supplies, etc.
    [pricingData.powerSupplyPricingInfo, pricingData.switchPricingInfo].forEach(pricingInfo => {
        Object.entries(pricingInfo).forEach(([partNumber, { shortCode, price }]) => {
            const quantityInput = document.getElementById(partNumber);
            const quantity = quantityInput ? parseInt(quantityInput.value) || 0 : 0;
            if (quantity > 0) {
                addOrUpdatePart(partNumber, shortCode, price, quantity);
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
    table.style.borderCollapse = "collapse";

    // Add header row
    const headerRow = table.insertRow();
    ["Part Number", "Short Code", "Price", "Quantity", "Total Price"].forEach(text => {
        const cell = headerRow.insertCell();
        cell.innerText = text;
        cell.style.fontWeight = "bold";
    });

    // Add parts to table
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
