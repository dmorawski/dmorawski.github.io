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

    // Operator pricing and short codes from CSV
const operatorPricingInfo = {
    "LP1C-72": { shortCode: "MOT1029", price: 4530.0 },
    "MA-END-PLATES": { shortCode: "MOT1038", price: 46.66 },
    "MA-GND-ASM": { shortCode: "MOT1040", price: 56.33 },
    "MA-PUSH-LH-DBZ": { shortCode: "MOT1039", price: 0.0 },
    "MA40011": { shortCode: "MOT1032", price: 83.09 },
    "MA50777T-L": { shortCode: "MOT1033", price: 960.61 },
    "MA50782": { shortCode: "MOT1043", price: 15.76 },
    "MA81000-901": { shortCode: "MOT1037", price: 1135.08 },
    "MA81000-902": { shortCode: "MOT1028", price: 1080.0 },
    "MA83000-901": { shortCode: "MOT1041", price: 1254.0 },
    "MAC-LL1C-36": { shortCode: "MOT1017", price: 2300.0 },
    "MAC-LL1C-XX": { shortCode: "MOT1008", price: 2300.0 },
    "MAC-LL1D-36": { shortCode: "MOT1016", price: 2300.0 },
    "MAC-LL1D-XX": { shortCode: "MOT1012", price: 2300.0 },
    "MAC-LL2C-36": { shortCode: "MOT1020", price: 2300.0 },
    "MAC-LL2C-XX": { shortCode: "MOT1009", price: 2300.0 },
    "MAC-LL2D-36": { shortCode: "MOT1022", price: 2300.0 },
    "MAC-LL2D-XX": { shortCode: "MOT1013", price: 2300.0 },
    "MAC-LL3C-XX": { shortCode: "MOT1010", price: 2300.0 },
    "MAC-LL3D-XX": { shortCode: "MOT1014", price: 2300.0 },
    "MAC-LL4C-XX": { shortCode: "MOT1011", price: 2300.0 },
    "MAC-LL4D-XX": { shortCode: "MOT1015", price: 2300.0 },
    "MAC-LP1C-XX": { shortCode: "MOT1025", price: 4688.87 },
    "MAC-LP1D-72": { shortCode: "MOT1024", price: 4688.87 },
    "MAC-LR1C-36": { shortCode: "MOT1019", price: 2300.0 },
    "MAC-LR1C-42": { shortCode: "MOT1026", price: 2300.0 },
    "MAC-LR1C-XX": { shortCode: "MOT1000", price: 2300.0 },
    "MAC-LR1D-36": { shortCode: "MOT1018", price: 2300.0 },
    "MAC-LR1D-XX": { shortCode: "MOT1004", price: 2300.0 },
    "MAC-LR2C-36": { shortCode: "MOT1021", price: 2300.0 },
    "MAC-LR2C-XX": { shortCode: "MOT1001", price: 2300.0 },
    "MAC-LR2D-36": { shortCode: "MOT1023", price: 2300.0 },
    "MAC-LR2D-XX": { shortCode: "MOT1005", price: 2300.0 },
    "MAC-LR3C-36": { shortCode: "MOT1002", price: 2300.0 },
    "MAC-LR3D-XX": { shortCode: "MOT1006", price: 2300.0 },
    "MAC-LR4C-XX": { shortCode: "MOT1003", price: 2300.0 },
    "MAC-LR4D-XX": { shortCode: "MOT1007", price: 2300.0 },
    "MAR-C-18": { shortCode: "MOT1034", price: 1957.95 },
    "MAR-C-29": { shortCode: "MOT1027", price: 1890.0 },
    "MAR-D-18": { shortCode: "MOT1035", price: 1957.95 },
    "MAR-D-29": { shortCode: "MOT1036", price: 2103.91 },
    "MAX-KIT-S1": { shortCode: "MOT1030", price: 338.42 },
    "MP1C-72": { shortCode: "MOT1031", price: 4761.03 },
    "MR1D-36": { shortCode: "MOT1042", price: 2300.0 }
};


    const powerSupplyPricingInfo = {
        "LRS-75-24": { shortCode: "MEW1000", price: 27.28 },
        "LRS-75-12": { shortCode: "MEW1001", price: 33.63 }
    };

    const bollardPricingInfo = {
        "CM-42-BSU-BRZ": { shortCode: "CAM1002", price: 440 },
        "CM-42-BSU-CLR": { shortCode: "CAM1040", price: 440 }
    };

    const switchPricingInfo = {
        "4S1U4": { shortCode: "LAR1079", price: 158 },
        "W4S1U4": { shortCode: "LAR1082", price: 191.28 },
        "4R1U4": { shortCode: "LAR1069", price: 158 },
        "W4R1U4": { shortCode: "LAR1070", price: 182 },
        "J01J4": { shortCode: "LAR1016", price: 124 },
        "WJ01J4": { shortCode: "LAR1017", price: 148 },
        "233804": { shortCode: "LAR1015", price: 75 },
        "235215": { shortCode: "LAR1014", price: 87 }
    };

    // Generate operator part numbers
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

        const operatorData = operatorPricingInfo[operatorPartNumber] || { shortCode: "NA", price: 2300 };
        addOrUpdatePart(operatorPartNumber, operatorData.shortCode, operatorData.price, quantity);

        const laborPrice = 178;
        const laborQuantity = handing === "Pair" ? 10 * quantity : 6 * quantity;
        addOrUpdatePart("Labor", "SC104", laborPrice, laborQuantity);
    }

    // Add power supplies, switches, and bollards
    [powerSupplyPricingInfo, switchPricingInfo, bollardPricingInfo].forEach(pricingInfo => {
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