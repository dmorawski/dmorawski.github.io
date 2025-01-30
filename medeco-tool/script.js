const data = {
    cylinderTypes: {
        "Mortise": "10",
        "Rim": "10",    
        "KIK": "20",
        "SFIC": "33"
    },
    numPins: { // X4 Only
        "6 Pin": "6",
        "7 Pin": "7"
    },
    keyways: {
        "H": "43",
        "N": "DBQ",
        "T": "FHS",
        "W": "X3"
    },
    technologies: {
        "M4": "H",
        "M3": "T",
        "Biaxial": "W",
        "X4": "N"
    },
    finishes: {
        "Bright Brass (US03)": "05",
        "Satin Brass (US04)": "06",
        "Antique Brass (US5)": "09",
        "Satin Brass Blackened": "10",
        "Bright Bronze (US9)": "11",
        "Satin Bronze (US10)": "12",
        "Dark Bronze (US10B)": "13",
        "Bright Nickel (US14)": "18",
        "Satin Nickel (US15)": "19",
        "Antique Nickel (US15A)": "20",
        "Flat Black (US19)": "22",
        "Dark Bronze Clear Coat (US20A)": "24",
        "Bright Chrome (US26)": "25",
        "Satin Chrome (US26D)": "26",
        "Matte Black": "BB"
    },
    pinningOptions: {
        "Sub-assembled": "S",
        "Pinned": "P",
        "Master Keyed": "M"
    },
    mortiseLengths: {
        "1\" 5 Pin (6 pin for X4)": "0100",  
        "1-1/8\" 6 Pin": "0200",
        "1-1/4\" 6 Pin": "0500",
        "1-3/8\" 6 Pin": "5100",
        "1-1/2\" 6 Pin": "5200"
    },
    cams: {
        "Corbin Russwin": "Z00",
        "Standard Yale": "Z01",
        "Adams Rite": "Z02",
        "Schlage": "Z34",
        "Sargent": "Z20",
        "Falcon": "Z22"
    },
    kikTypes: {
        "Schlage (A, AL, C, D, ND)": "200S1",
        "Lazy Motion for Deadbolt": "009S4"
    }
};


// This will hold pricing data once the CSV is fetched
let pricingData = {};

// Fetch the pricing data from the CSV file
async function fetchPricingData() {
    const url = 'https://dmorawski.github.io/medeco-tool/pricing.csv?' + new Date().getTime();  // Add timestamp to bypass cache
    const response = await fetch(url);
    const csvText = await response.text();
    
    const parsedData = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        quoteChar: '"', // Ensure quoted fields are handled correctly
    });
    
    parsedData.data.forEach(row => {
        const partNumber = row['Item'];
        const priceM4 = parseFloat(row['M4']) || 0;
        const priceM4Bi = parseFloat(row['M4 BiLevel']) || 0;
        const priceM3 = parseFloat(row['M3']) || 0;
        const priceM3Bi = parseFloat(row['M3 BiLevel']) || 0;
        const priceX4 = parseFloat(row['X4']) || 0;
        const priceElectronic = parseFloat(row['Electronic']) || 0;
        const priceOrig = parseFloat(row['Orig/Biax']) || 0;
        const priceKeymark = parseFloat(row['Keymark']) || 0;

        // Add the part number and pricing info directly to the pricingData object
        pricingData[partNumber] = { priceM4, priceM4Bi, priceM3, priceM3Bi, priceX4, priceElectronic, priceOrig, priceKeymark };
    });
}

// Initialize pricing data when the page loads
window.addEventListener('DOMContentLoaded', fetchPricingData);

function populateDropdown(elementId, options) {
    const dropdown = document.getElementById(elementId);
    dropdown.innerHTML = ""; // Clear existing options

    for (const [description, code] of Object.entries(options)) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = `${code}: ${description}`;
        dropdown.appendChild(option);
    }
}

function populateDropdownBrief(elementId, options) {
    const dropdown = document.getElementById(elementId);
    dropdown.innerHTML = ""; // Clear existing options

    for (const [description, code] of Object.entries(options)) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = `${description}`;
        dropdown.appendChild(option);
    }
}

// Populate dropdowns on page load
window.onload = async function () {
    await fetchPricingData(); // Ensure pricing data is ready before anything else

    populateDropdown("cylinderType", data.cylinderTypes);
    populateDropdown("mortiseLength", data.mortiseLengths);
    populateDropdown("kikType", data.kikTypes); 
    populateDropdownBrief("numPins", data.numPins);
    populateDropdown("technology", data.technologies);
    populateDropdown("finish", data.finishes);
    populateDropdown("pinning", data.pinningOptions);
    populateDropdown("cams", data.cams);

    // Set default selections
    document.getElementById("cylinderType").value = "10";
    document.getElementById("mortiseLength").value = "0200";
    document.getElementById("numPins").value = "7";
    document.getElementById("technology").value = "H";
    document.getElementById("finish").value = "26";
    document.getElementById("pinning").value = "S";
    document.getElementById("cams").value = "Z02";

    // Hide mortise length and numPins initially
    //document.getElementById("mortiseLengthContainer").style.display = "none";
    document.getElementById("numPinsContainer").style.display = "none";
    document.getElementById("kikTypeContainer").style.display = "none";


    generatePartNumber();
    // Attach event listener to cylinder type dropdown
    document.getElementById("cylinderType").addEventListener("change", handleCylinderTypeChange);
    document.getElementById("cylinderType").addEventListener("change", generatePartNumber);
    document.getElementById("kikType").addEventListener("change", generatePartNumber);
    document.getElementById("mortiseLength").addEventListener("change", generatePartNumber);
    document.getElementById("numPins").addEventListener("change", generatePartNumber);
    document.getElementById("technology").addEventListener("change", generatePartNumber);
    document.getElementById("finish").addEventListener("change", generatePartNumber);
    document.getElementById("pinning").addEventListener("change", generatePartNumber);
    document.getElementById("cams").addEventListener("change", generatePartNumber);
};

function handleCylinderTypeChange() {
    const cylinderTypeDropdown = document.getElementById("cylinderType");
    const selectedOption = cylinderTypeDropdown.options[cylinderTypeDropdown.selectedIndex];
    const cylinderType = selectedOption.text.split(":")[1]?.trim(); // Extract description

    // Show/hide mortise length dropdown
    document.getElementById("mortiseLengthContainer").style.display = (cylinderType === "Mortise") ? "block" : "none";

    // Show/hide mortise length dropdown
    document.getElementById("camContainer").style.display = (cylinderType === "Mortise") ? "block" : "none";

    // Show/hide numPins dropdown
    document.getElementById("numPinsContainer").style.display = (cylinderType === "SFIC") ? "block" : "none";

    document.getElementById("kikTypeContainer").style.display = (cylinderType === "KIK") ? "block" : "none";
}


function generatePartNumber() {
    const cylinderTypeDropdown = document.getElementById("cylinderType");
    const selectedOption = cylinderTypeDropdown.options[cylinderTypeDropdown.selectedIndex];
    const cylinderType = selectedOption.text.split(":")[1]?.trim(); // Extract description

    const cylinderTypeCode = document.getElementById("cylinderType").value;
    const mortiseLength = document.getElementById("mortiseLength").value;
    const numPins = document.getElementById("numPins").value;
    const kikType = document.getElementById("kikType").value;
    let technology = document.getElementById("technology").value;

    if (cylinderType === "SFIC") { 
        technology = "N"; 
    }

    const keyway = data.keyways[technology] || "UNKNOWN";
    const finish = document.getElementById("finish").value;
    const pinning = document.getElementById("pinning").value;
    const cams = document.getElementById("cams").value;

    let productListing = "";
    let partNumber = "";

    if (cylinderType === "SFIC") {
        productListing = "00006";
        partNumber = `${cylinderTypeCode}${numPins}${productListing} ${technology} ${finish} ${keyway} ${pinning}`;
    } else if (cylinderType === "Mortise") {
        productListing = `${mortiseLength}`;
        partNumber = `${cylinderTypeCode}${productListing} ${technology} ${finish} ${keyway} ${pinning} ${cams}`;
    } else if (cylinderType === "Rim") {
        productListing = "0400H";
        partNumber = `${cylinderTypeCode}${productListing} ${technology} ${finish} ${keyway} ${pinning}` + " Y02";
    } else if (cylinderType === "KIK") {
        productListing = kikType;
        partNumber = `${cylinderTypeCode}${productListing} ${technology} ${finish} ${keyway} ${pinning}`;
    } else {
        productListing = "";
    }

    if (productListing === "") {
        partNumber = "INVALID ENTRY";
    }
    console.log(`${cylinderTypeCode}${productListing}` + '-' + `${pinning}`);
    console.log(pricingData[`${cylinderTypeCode}${productListing}` + '-' + `${pinning}`]);

    let price = 0;

    if (technology == "H") {
        price = pricingData[`${cylinderTypeCode}${productListing}` + '-' + `${pinning}`].priceM4;
    } else if (technology == "T") {
        price = pricingData[`${cylinderTypeCode}${productListing}` + '-' + `${pinning}`].priceM3;
    } else if (technology == "W") {
        price = pricingData[`${cylinderTypeCode}${productListing}` + '-' + `${pinning}`].priceOrig;
    } else if (technology == "N") {
        price = pricingData[`${cylinderTypeCode}${productListing}` + '-' + `${pinning}`].priceX4;
    }
    const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    document.getElementById("partNumberOutput").textContent = partNumber;
    document.getElementById("priceOutput").textContent = formattedPrice;
}
