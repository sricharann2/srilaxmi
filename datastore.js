let riceMillData = JSON.parse(localStorage.getItem('riceMillData')) || []; // Load saved data or initialize empty array

function saveDataToLocalStorage() {
    localStorage.setItem('riceMillData', JSON.stringify(riceMillData));
}

function addData(entry) {
    riceMillData.push(entry);
    saveDataToLocalStorage(); // Save data every time a new entry is added
}

function viewData() {
    const dataViewerBody = document.getElementById('dataViewerBody');
    dataViewerBody.innerHTML = '';

    if (riceMillData.length === 0) {
        dataViewerBody.innerHTML = '<tr><td colspan="8">No data available.</td></tr>';
        return;
    }

    riceMillData.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.village}</td>
            <td>${entry.vehicleNumber}</td>
            <td>${entry.loadedWeight}</td>
            <td>${entry.emptyWeight}</td>
            <td>${entry.bagWeight}</td>
            <td>${entry.numOfBags}</td>
            <td>${entry.isVerified ? 'Yes' : 'No'}</td>
            <td>
                ${entry.isVerified ? '' : `<button onclick="verifyEntry(${index})">Verify</button>`}
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="confirmDelete(${index})">Delete</button>
            </td>
        `;
        dataViewerBody.appendChild(row);
    });
}

function verifyEntry(index) {
    riceMillData[index].isVerified = true;
    saveDataToLocalStorage(); // Save changes after verification
    viewData(); // Refresh the data view
}

function confirmDelete(index) {
    if (confirm('Are you sure you want to delete this entry?')) {
        riceMillData.splice(index, 1);
        saveDataToLocalStorage(); // Save changes after deletion
        viewData(); // Refresh the data view
    }
}

function editEntry(index) {
    const entry = riceMillData[index];
    document.getElementById('village').value = entry.village;
    document.getElementById('vehicleNumber').value = entry.vehicleNumber;
    document.getElementById('loadedWeight').value = entry.loadedWeight;
    document.getElementById('emptyWeight').value = entry.emptyWeight;
    document.getElementById('bagWeight').value = entry.bagWeight;

    document.getElementById('editIndex').value = index; // Store index for saving edits
    openTab('dataEntry');
}

document.getElementById('dataEntryForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const village = document.getElementById('village').value;
    const vehicleNumber = document.getElementById('vehicleNumber').value;
    const loadedWeight = parseFloat(document.getElementById('loadedWeight').value);
    const emptyWeight = parseFloat(document.getElementById('emptyWeight').value);
    const bagWeight = parseFloat(document.getElementById('bagWeight').value);
    const numOfBags = Math.floor((loadedWeight - emptyWeight) / bagWeight);

    const newEntry = { village, vehicleNumber, loadedWeight, emptyWeight, bagWeight, numOfBags, isVerified: false };
    const editIndex = document.getElementById('editIndex').value;

    if (editIndex) {
        riceMillData[editIndex] = newEntry;
        document.getElementById('editIndex').value = ''; // Clear edit index
    } else {
        addData(newEntry);
    }

    saveDataToLocalStorage(); // Save changes after editing or adding data
    viewData(); // Refresh the data view
    this.reset(); // Reset the form fields
});

// Function to switch between tabs
function openTab(tabName) {
    const dataEntry = document.getElementById('dataEntry');
    const dataViewer = document.getElementById('dataViewer');
    if (tabName === 'dataEntry') {
        dataEntry.style.display = 'block';
        dataViewer.style.display = 'none';
    } else {
        dataEntry.style.display = 'none';
        dataViewer.style.display = 'block';
        viewData(); // Refresh data viewer when opened
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', viewData);
