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
    chart: {
        "Bloomington": "Bloomington",
        "Minneapolis": "Minneapolis",
        "TRANS-Alarm": "TRANS-Alarm",
        "Mobile": "Mobile",
    },
    keyways: {
        "BloomingtonH": "43", // M4
        "BloomingtonP": "43", // M4 BiLevel
        "MinneapolisH": "43", // M4
        "MinneapolisP": "43", // M4 BiLevel
        "BloomingtonN": "DBQ",// X4
        "MinneapolisN": "DBV",// X4
        "BloomingtonT": "FH", // M3
        "BloomingtonJ": "FH", // M3 BiLevel
        "MinneapolisT": "DH", // M3
        "MinneapolisJ": "DH", // M3 BiLevel
        "MobileT": "FK",      // M3
        "MobileJ": "FK",      // M3 BiLevel
        "TRANS-AlarmT": "DX", // M3
        "TRANS-AlarmJ": "DX", // M3 BiLevel
        "BloomingtonW": "X3", // Biaxial
        "MobileW": "Z3",      // Biaxial
        "BloomingtonK": "7G", // Keymark
        "MinneapolisK": "7H", // Keymark
        "MobileK": "7C",      // Keymark
        "TRANS-AlarmK": "DBK" // Keymark
    },
    technologies: {
        "X4": "N",
        "M4": "H",
        "M4 BiLevel": "P",
        "M3": "T",
        "M3 BiLevel": "J",
        "Biaxial": "W",
        //"Patriot": "W",
        "M3 BiLevel": "J", 
        "Keymark": "K"
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
        "Lazy Motion for Schlage Deadbolt": "009S4",
        "Yale (5300/5400LN)": "0503",
        "Corbin-Russwin (CK 4200)": "5005"
    }
};


// This will hold pricing data once the CSV is fetched
let pricingData = {};

// Fetch the pricing data from the CSV file
async function fetchPricingData() {
    //const url = 'https://dmorawski.github.io/medeco-tool/pricing.csv?' + new Date().getTime();
    const url = 'fake-numbers.csv'
    const response = await fetch(url);
    const csvText = await response.text();
    
    const parsedData = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        quoteChar: '"', // Ensure quoted fields are handled correctly
    });

    parsedData.data.forEach(row => {
        const partNumber = row['Manufacturer Part Number'];
        const shortCode = row['Short Code'];
        const description = row['Description'];
        const price = parseFloat(row['Price']) || 0;

        // Add the part number and pricing info directly to the pricingData object
        pricingData[partNumber] = { shortCode, price, description };
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
    populateDropdownBrief("chart", data.chart);
    populateDropdown("finish", data.finishes);
    populateDropdown("pinning", data.pinningOptions);
    populateDropdown("cams", data.cams);

    // Set default selections
    document.getElementById("cylinderType").value = "10";
    document.getElementById("mortiseLength").value = "0200";
    document.getElementById("numPins").value = "7";
    document.getElementById("technology").value = "H";
    document.getElementById("chart").value = "Bloomington";
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
    document.getElementById("chart").addEventListener("change", generatePartNumber);
    document.getElementById("finish").addEventListener("change", generatePartNumber);
    document.getElementById("pinning").addEventListener("change", generatePartNumber);
    document.getElementById("cams").addEventListener("change", generatePartNumber);
};

function handleCylinderTypeChange() {
    const cylinderTypeDropdown = document.getElementById("cylinderType");
    const selectedOption = cylinderTypeDropdown.options[cylinderTypeDropdown.selectedIndex];
    const cylinderType = selectedOption.text.split(":")[1]?.trim(); // Extract description

    // Show/hide mortise options
    document.getElementById("mortiseLengthContainer").style.display = (cylinderType === "Mortise") ? "block" : "none";
    document.getElementById("camContainer").style.display = (cylinderType === "Mortise") ? "block" : "none";
    document.getElementById("cam-text").style.display = (cylinderType === "Mortise") ? "block" : "none";

    // Show/hide number of pins for SFIC
    document.getElementById("numPinsContainer").style.display = (cylinderType === "SFIC") ? "block" : "none";

    // Show/hide KIK options
    document.getElementById("kikTypeContainer").style.display = (cylinderType === "KIK") ? "block" : "none";
}


function generatePartNumber() {
    const cylinderTypeDropdown = document.getElementById("cylinderType");
    const selectedOption = cylinderTypeDropdown.options[cylinderTypeDropdown.selectedIndex];
    const cylinderType = selectedOption.text.split(":")[1]?.trim();
    const chart = document.getElementById("chart").value;
    const cylinderTypeCode = document.getElementById("cylinderType").value;
    const mortiseLength = document.getElementById("mortiseLength").value;
    const numPins = document.getElementById("numPins").value;
    const kikType = document.getElementById("kikType").value;
    const technology = document.getElementById("technology").value;
    const keyway = data.keyways[chart+technology] || "UNKNOWN";
    const finish = document.getElementById("finish").value;
    const pinning = document.getElementById("pinning").value;
    const cam = document.getElementById("cams").value;

    let productListing = "";
    let partNumber = "";

    if (cylinderType === "SFIC") {
        productListing = "00006";
        partNumber = `${cylinderTypeCode}${numPins}${productListing}${technology}-${finish}-${keyway}${pinning}`;
    } else if (cylinderType === "Mortise") {
        productListing = `${mortiseLength}`;
        partNumber = `${cylinderTypeCode}${productListing}${technology}-${finish}-${keyway}${pinning}`;
    } else if (cylinderType === "Rim") {
        productListing = "0400H";
        partNumber = `${cylinderTypeCode}${productListing}${technology}-${finish}-${keyway}${pinning}`;
    } else if (cylinderType === "KIK") {
        productListing = kikType;
        partNumber = `${cylinderTypeCode}${productListing}${technology}-${finish}-${keyway}${pinning}`;
    } else {
        productListing = "";
    }

    if (productListing === "") {
        partNumber = "INVALID ENTRY";
    } else if (keyway === "UNKNOWN") {
        partNumber = "No technology exists for the selected chart."
    }

    document.getElementById("partNumberOutput").textContent = partNumber;

    if (pricingData[partNumber] != null) {
        const price = pricingData[partNumber].price || 0;
        const formattedPrice = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        document.getElementById("shortCodeOutput").textContent = pricingData[partNumber].shortCode || "N/A";
        document.getElementById("priceOutput").textContent = formattedPrice;
        document.getElementById("descriptionOutput").textContent = pricingData[partNumber].description || "N/A";
    } else {
        document.getElementById("shortCodeOutput").textContent = "N/A";
        document.getElementById("priceOutput").textContent = "N/A";
        document.getElementById("descriptionOutput").textContent = "N/A";
    }
    
    document.getElementById("camOutput").textContent = "CT-"+`${cam}`;
}
