// script.js
function generateQuote() {
    const handing = document.querySelector('input[name="handing"]:checked')?.value;
    const finish = document.querySelector('input[name="finish"]:checked')?.value;
    const armType = document.querySelector('input[name="armType"]:checked')?.value;
    const doorWidth = document.getElementById('doorWidth').value;

    // Standard switches quantities
    const squareSwitchQty = document.getElementById('squareSwitchQty').value || 0;
    const roundSwitchQty = document.getElementById('roundSwitchQty').value || 0;
    const mullionSwitchQty = document.getElementById('mullionSwitchQty').value || 0;

    // Weatherproof switches quantities
    const weatherproofSquareSwitchQty = document.getElementById('weatherproofSquareSwitchQty').value || 0;
    const weatherproofRoundSwitchQty = document.getElementById('weatherproofRoundSwitchQty').value || 0;
    const weatherproofMullionSwitchQty = document.getElementById('weatherproofMullionSwitchQty').value || 0;

    // Receiver type and part numbers
    const receiverType = document.querySelector('input[name="receiver"]:checked')?.value;
    let receiverPartNumber = "";
    if (receiverType === "Standard Receiver") {
        receiverPartNumber = "233804";
    } else if (receiverType === "Vestibule Sequencer") {
        receiverPartNumber = "235215";
    }

    // Generate operator part number
    let operatorPartNumber = "";
    if (handing && finish && armType) {
        let handingCode = handing === 'LH' ? 'L' : handing === 'RH' ? 'R' : 'P';
        const armCode = armType === 'Push' ? '1' : '2';
        const finishCode = finish === 'Anodized Aluminum' ? 'C' : 'D';
        const widthCode = doorWidth === '36' ? '-36' : (handing === 'Pair' && doorWidth === '72') ? '-72' : '-XX';
        operatorPartNumber = `MAC-L${handingCode}${armCode}${finishCode}${widthCode}`;
    }

    // Collect parts and quantities for table display
    const partsList = [];

    if (operatorPartNumber) {
        partsList.push({ partNumber: operatorPartNumber, quantity: 1 });
    }
    if (squareSwitchQty > 0) {
        partsList.push({ partNumber: "4S1U4", quantity: squareSwitchQty });
    }
    if (roundSwitchQty > 0) {
        partsList.push({ partNumber: "4R1U4", quantity: roundSwitchQty });
    }
    if (mullionSwitchQty > 0) {
        partsList.push({ partNumber: "J01J4", quantity: mullionSwitchQty });
    }
    if (weatherproofSquareSwitchQty > 0) {
        partsList.push({ partNumber: "W4S1U4", quantity: weatherproofSquareSwitchQty });
    }
    if (weatherproofRoundSwitchQty > 0) {
        partsList.push({ partNumber: "W4R1U4", quantity: weatherproofRoundSwitchQty });
    }
    if (weatherproofMullionSwitchQty > 0) {
        partsList.push({ partNumber: "WJ01J4", quantity: weatherproofMullionSwitchQty });
    }
    if (receiverPartNumber) {
        partsList.push({ partNumber: receiverPartNumber, quantity: 1 });
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
    const partHeader = headerRow.insertCell();
    partHeader.innerText = "Part Number";
    const qtyHeader = headerRow.insertCell();
    qtyHeader.innerText = "Quantity";

    // Populate table rows with parts and quantities
    partsList.forEach(item => {
        const row = table.insertRow();
        const partCell = row.insertCell();
        partCell.innerText = item.partNumber;
        const qtyCell = row.insertCell();
        qtyCell.innerText = item.quantity;
    });

    // Append table to output div
    output.appendChild(table);
}
