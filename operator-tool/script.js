
// This will hold pricing data once the CSV is fetched
let pricingData = {};

async function fetchLastCommitDate() {
    const apiUrl = 'https://api.github.com/repos/dmorawski/dmorawski.github.io/commits?path=operator-tool/operator-pricing.csv&page=1&per_page=1';

    try {
        const response = await fetch(apiUrl);
        const commits = await response.json();
        if (commits.length > 0) {
            const commitDate = new Date(commits[0].commit.author.date).toLocaleString();
            document.getElementById('lastModifiedDisplay').innerText = `Pricing data last updated: ${commitDate}`;
        } else {
            document.getElementById('lastModifiedDisplay').innerText = 'No commit history found.';
        }
    } catch (error) {
        document.getElementById('lastModifiedDisplay').innerText = 'Error fetching commit history.';
    }
}

window.addEventListener('DOMContentLoaded', fetchLastCommitDate);


// Initialize pricing data when the page loads
window.addEventListener('DOMContentLoaded', fetchPricingData);
window.addEventListener('load', () => {
    window.scrollTo(0, 0);  // Instantly scroll to the top on page load/refresh
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired - attaching help modal events');

    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const closeHelp = document.getElementById('closeHelp');

    if (!helpButton || !helpModal || !closeHelp) {
        console.error('One or more help modal elements are missing!');
        return;
    }

    // 🚀 Force hide modal on page load for safety
    helpModal.classList.add('hidden');

    function closeHelpModal() {
        console.log('Closing help modal');
        helpModal.classList.add('hidden');
    }

    helpButton.addEventListener('click', () => {
        console.log('Help button clicked');
        helpModal.classList.remove('hidden');
    });

    closeHelp.addEventListener('click', () => {
        console.log('Close button clicked');
        closeHelpModal();
    });

    document.addEventListener('click', (event) => {
        if (
            !helpModal.classList.contains('hidden') &&
            !helpModal.querySelector('.help-content').contains(event.target) &&
            event.target !== helpButton
        ) {
            console.log('Clicked outside help content');
            closeHelpModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !helpModal.classList.contains('hidden')) {
            console.log('Escape key pressed');
            closeHelpModal();
        }
    });

    console.log('helpModal classList:', helpModal.classList.value);
    console.log('Computed display:', getComputedStyle(helpModal).display);
});

    



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

let operatorCount = 1;

function addOperator() {
    operatorCount++;

    const previousOperatorSection = document.getElementById(`operatorSection${operatorCount - 1}`);

    const getRadioValue = (name) => {
        const checked = previousOperatorSection.querySelector(`input[name="${name}${operatorCount - 1}"]:checked`);
        return checked ? checked.value : null;
    };

    const getInputValue = (id) => {
        const input = previousOperatorSection.querySelector(`#${id}${operatorCount - 1}`);
        return input ? input.value : "";
    };

    const lastOperatorType = getRadioValue('operatorType') || "standard";
    const lastHanding = getRadioValue('handing') || "RH";
    const lastFinish = getRadioValue('finish') || "Dark Bronze";
    const lastArmType = getRadioValue('armType') || "Push";
    const lastDoorWidth = getInputValue('doorWidth') || "36";
    const lastQuantity = getInputValue('quantity') || "1";
    const lastReveal = getRadioValue('reveal') || "standard";

    const operatorSection = document.createElement('div');
    operatorSection.classList.add('operator-section');
    operatorSection.id = `operatorSection${operatorCount}`;

    operatorSection.innerHTML = `
        <div class="operator-item">
            <label>Operator Type:</label><br>
            <input type="radio" name="operatorType${operatorCount}" value="standard" id="lowEnergy${operatorCount}" ${lastOperatorType === "standard" ? "checked" : ""}>
            <label for="lowEnergy${operatorCount}" class="bubble">Standard</label>
            <input type="radio" name="operatorType${operatorCount}" value="low" id="lowForce${operatorCount}" ${lastOperatorType === "low" ? "checked" : ""}>
            <label for="lowForce${operatorCount}" class="bubble">Low Force</label>
        </div>
        <div class="operator-item">
            <label>Handing/Pair:</label><br>
            <input type="radio" name="handing${operatorCount}" value="LH" id="handingLH${operatorCount}" ${lastHanding === "LH" ? "checked" : ""}>
            <label for="handingLH${operatorCount}" class="bubble">LH</label>
            <input type="radio" name="handing${operatorCount}" value="RH" id="handingRH${operatorCount}" ${lastHanding === "RH" ? "checked" : ""}>
            <label for="handingRH${operatorCount}" class="bubble">RH</label>
            <input type="radio" name="handing${operatorCount}" value="Pair" id="handingPair${operatorCount}" ${lastHanding === "Pair" ? "checked" : ""}>
            <label for="handingPair${operatorCount}" class="bubble">Pair</label>
        </div>
        <div class="operator-item">
            <label>Finish:</label><br>
            <input type="radio" name="finish${operatorCount}" value="Dark Bronze" id="finishBronze${operatorCount}" ${lastFinish === "Dark Bronze" ? "checked" : ""}>
            <label for="finishBronze${operatorCount}" class="bubble">Dark Bronze</label>
            <input type="radio" name="finish${operatorCount}" value="Anodized Aluminum" id="finishAluminum${operatorCount}" ${lastFinish === "Anodized Aluminum" ? "checked" : ""}>
            <label for="finishAluminum${operatorCount}" class="bubble">Anodized Aluminum</label>
        </div>
        <div class="operator-item">
            <label>Arm Type:</label><br>
            <input type="radio" name="armType${operatorCount}" value="Push" id="armPush${operatorCount}" ${lastArmType === "Push" ? "checked" : ""} onchange="toggleRevealOptions(${operatorCount})">
            <label for="armPush${operatorCount}" class="bubble">Push Arm / Outswing</label>
            <input type="radio" name="armType${operatorCount}" value="Pull" id="armPull${operatorCount}" ${lastArmType === "Pull" ? "checked" : ""} onchange="toggleRevealOptions(${operatorCount})">
            <label for="armPull${operatorCount}" class="bubble">Pull Arm / Inswing</label>
        </div>

        <div class="operator-item reveal-options" id="revealOptions${operatorCount}" style="display: none;">
            <label>Reveal:</label><br>
            <input type="radio" name="reveal${operatorCount}" value="standard" id="revealStandard${operatorCount}" ${lastReveal === "standard" ? "checked" : ""}>
            <label for="revealStandard${operatorCount}" class="bubble">Standard</label>
            <input type="radio" name="reveal${operatorCount}" value="big" id="revealBig${operatorCount}" ${lastReveal === "big" ? "checked" : ""}>
            <label for="revealBig${operatorCount}" class="bubble">More than 8in</label>
        </div>

        <div class="operator-item">
            <label for="doorWidth${operatorCount}">Enter Door Width (in inches):</label>
            <input type="number" id="doorWidth${operatorCount}" placeholder="e.g., 36" value="${lastDoorWidth}" min="1">
        </div>
        <div class="operator-number-item">
            <label for="quantity${operatorCount}">Quantity:</label>
            <input type="number" id="quantity${operatorCount}" value="${lastQuantity}" min="1">
        </div>
    `;

    const operatorContainer = document.getElementById('operatorContainer');
    operatorContainer.appendChild(operatorSection);

    const rect = operatorSection.getBoundingClientRect();
    window.scrollTo({
        top: window.scrollY + rect.top - 35,
        behavior: 'smooth'
    });

    const addOperatorBtn = document.getElementById('addOperatorBtn');
    setTimeout(() => {
        operatorContainer.appendChild(addOperatorBtn);
        toggleRevealOptions(operatorCount);  // Automatically set visibility based on default armType
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

    // Add operators (loops through all added operators)
    for (let i = 1; i <= operatorCount; i++) {
        const optype = document.querySelector(`input[name="operatorType${i}"]:checked`)?.value;
        const handing = document.querySelector(`input[name="handing${i}"]:checked`)?.value;
        const finish = document.querySelector(`input[name="finish${i}"]:checked`)?.value;
        const armType = document.querySelector(`input[name="armType${i}"]:checked`)?.value;
        const reveal = document.querySelector(`input[name="reveal${i}"]:checked`)?.value;
        const doorWidth = document.getElementById(`doorWidth${i}`)?.value;
        const quantity = parseInt(document.getElementById(`quantity${i}`)?.value) || 1;

        if (!optype || !handing || !finish || !armType || !doorWidth) {
            alert(`Please complete all fields for Operator ${i}`);
            return;
        }

        const opCode = optype === "standard" ? "L" : "M";
        const handingCode = handing === "LH" ? "L" : handing === "RH" ? "R" : "P";
        const armCode = armType === "Push" ? "1" : "2";
        const finishCode = finish === "Anodized Aluminum" ? "C" : "D";
        
        let widthCode = "-XX";
        if (doorWidth === "72" && handing === "Pair") {
            widthCode = "-72";
        } else if (doorWidth === "36") {
            widthCode = "-36";
        }

        const operatorPartNumber = `MAC-${opCode}${handingCode}${armCode}${finishCode}${widthCode}`;
        const operatorData = pricingData[operatorPartNumber] || { shortCode: "NA", price: operatorPartNumber.startsWith("MAC-LP") ? 4688 : 2300 };

        addOrUpdatePart(operatorPartNumber, operatorData.shortCode, operatorData.mfg, operatorData.description, operatorData.price, quantity);

        const laborPrice = 178;
        const laborQuantity = handing === "Pair" ? 10 * quantity : 6 * quantity;

        addOrUpdatePart("Labor", "SC104", "", "", laborPrice, laborQuantity);

        if (reveal === "big" && armType === "Push") {
            let extensionPartNumber = "";
            if (finish === "Anodized Aluminum") {
                extensionPartNumber = "MA-EXT-KIT-CLR";
            } else if (finish === "Dark Bronze") {
                extensionPartNumber = "MA-EXT-KIT-DBZ";
            }

            if (extensionPartNumber) {
                const extensionPartData = pricingData[extensionPartNumber] || { shortCode: "NA", price: 0 };  // Default price if missing
                addOrUpdatePart(extensionPartNumber, extensionPartData.shortCode, extensionPartData.mfg, extensionPartData.description, extensionPartData.price, quantity);
            }
        }
    }

    // Add all parts (switches, receivers, etc.)
    [pricingData].forEach(pricingInfo => {
        Object.entries(pricingInfo).forEach(([partNumber, { mfg, description, shortCode, price }]) => {
            const quantityInput = document.getElementById(partNumber);
            const quantity = quantityInput ? parseInt(quantityInput.value) || 0 : 0;
            if (quantity > 0) {
                addOrUpdatePart(partNumber, shortCode, mfg, description, price, quantity);

                if (partNumber.includes("CM-42-BSU")) {
                    addOrUpdatePart("Labor", "SC104", "", "", 178, quantity);
                }
            }
        });
    });

    // Sort to make sure labor always comes last
    partsList.sort((a, b) => (a.partNumber === "Labor" ? 1 : b.partNumber === "Labor" ? -1 : 0));

    // Clear previous output
    const output = document.getElementById("quoteOutput");
    output.innerHTML = "";

    // Create table
    const table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("cellpadding", "5");
    table.style.borderCollapse = "separate";
    //table.style.borderRadius = "8px";
    table.style.overflow = "hidden";

    // Add table header
    const headerRow = table.insertRow();
    const headers = ["Mfg", "Part Number", "Short Code", "Description", "Price", "Quantity", "Total Price"];

    headers.forEach((text, index) => {
        const cell = headerRow.insertCell();
        cell.innerText = text;
        cell.style.fontWeight = "bold";
        if (index === 0 || index === 3) {
            cell.classList.add("hide-on-mobile");  // Mfg and Description hidden on mobile
        }
    });

    // Add table rows
    partsList.forEach(item => {
        const row = table.insertRow();

        const mfgCell = row.insertCell();
        mfgCell.innerText = item.mfg;
        mfgCell.classList.add("hide-on-mobile");

        const partNumberCell = row.insertCell();
        partNumberCell.innerText = item.partNumber;

        const shortCodeCell = row.insertCell();
        shortCodeCell.innerText = item.shortCode;

        const descriptionCell = row.insertCell();
        descriptionCell.innerText = item.description;
        descriptionCell.classList.add("hide-on-mobile");

        const priceCell = row.insertCell();
        priceCell.innerText = `$${item.price.toFixed(2)}`;

        const quantityCell = row.insertCell();
        quantityCell.innerText = item.quantity;

        const totalPriceCell = row.insertCell();
        totalPriceCell.innerText = `$${item.totalPrice.toFixed(2)}`;

        totalPrice += item.totalPrice;
    });

    function appendTotalRow(table, totalPrice) {
        const totalRow = table.insertRow();

        // Always generate 7 columns, even if some are hidden by CSS
        const mfgCell = totalRow.insertCell();          // Mfg (hidden on mobile)
        mfgCell.classList.add('hide-on-mobile');

        const partNumberCell = totalRow.insertCell();   // Part Number
        partNumberCell.innerText = "";

        const shortCodeCell = totalRow.insertCell();    // Short Code
        shortCodeCell.innerText = "";

        const descriptionCell = totalRow.insertCell();  // Description (hidden on mobile)
        descriptionCell.classList.add('hide-on-mobile');

        const priceCell = totalRow.insertCell();        // Price
        priceCell.innerText = "";

        // Quantity column (second-to-last) gets "Total:" text
        const quantityCell = totalRow.insertCell();
        quantityCell.innerText = "";

        // Total Price column (last column) gets the actual total price
        const totalPriceCell = totalRow.insertCell();
        totalPriceCell.style.fontWeight = "bold";
        totalPriceCell.innerText = `$${totalPrice.toFixed(2)}`;
    }

    appendTotalRow(table, totalPrice);
    output.appendChild(table);

    // scroll to the table
    output.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });}
document.addEventListener('click', (event) => {
    const helpLinks = document.querySelectorAll('.help-link');
    let clickedOnHelp = false;

    helpLinks.forEach(link => {
        if (link.contains(event.target)) {
            event.preventDefault();  // Prevent page jump
            clickedOnHelp = true;

            // Remove any existing tooltip
            document.querySelectorAll('.help-tooltip').forEach(tip => tip.remove());

            // Create new tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'help-tooltip';
            tooltip.innerText = link.getAttribute('data-help');

            // Apply initial styles (including wrapping behavior)
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = '#fff';
            tooltip.style.color = '#000';
            tooltip.style.padding = '5px 8px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
            tooltip.style.fontSize = '0.875rem';
            tooltip.style.zIndex = '1000';
            tooltip.style.maxWidth = '90vw';  // Allow it to be up to 90% of screen width
            tooltip.style.width = 'max-content';
            tooltip.style.overflowWrap = 'break-word';  // Force wrapping if needed
            tooltip.style.wordBreak = 'break-word';  // Alternative for better compatibility
            tooltip.style.lineHeight = '1.4';  // Improve readability on small screens

            // Temporarily append to measure
            document.body.appendChild(tooltip);

            // Measure and position
            const linkRect = link.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            let left = linkRect.left;
            if (left + tooltipRect.width > viewportWidth) {
                left = viewportWidth - tooltipRect.width - 10;  // Prevent overflow (10px padding)
            }

            // Apply final positioning
            tooltip.style.top = `${linkRect.bottom + window.scrollY + 5}px`;
            tooltip.style.left = `${Math.max(left, 10)}px`;  // Keep at least 10px from left edge

        }
    });

    // Remove tooltip if user clicks outside
    if (!clickedOnHelp) {
        document.querySelectorAll('.help-tooltip').forEach(tip => tip.remove());
    }
});

function toggleRevealOptions(operatorIndex) {
    const armType = document.querySelector(`input[name="armType${operatorIndex}"]:checked`)?.value;
    const revealSection = document.getElementById(`revealOptions${operatorIndex}`);

    if (revealSection) {
        if (armType === "Push") {
            revealSection.style.display = "block";
        } else {
            revealSection.style.display = "none";
        }
    }
}

// Run on page load for the first operator
document.addEventListener('DOMContentLoaded', () => {
    toggleRevealOptions(1);  // Check initial state for Operator 1
});
