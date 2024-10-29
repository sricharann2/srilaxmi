import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

const riceMillCollection = collection(db, "riceMillData");

// Function to add data to Firestore
async function addData(entry) {
    try {
        await addDoc(riceMillCollection, entry);
        viewData(); // Refresh data view
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}

// Function to retrieve and display data from Firestore
async function viewData() {
    const dataViewerBody = document.getElementById('dataViewerBody');
    dataViewerBody.innerHTML = '';

    try {
        const querySnapshot = await getDocs(riceMillCollection);
        if (querySnapshot.empty) {
            dataViewerBody.innerHTML = '<tr><td colspan="8">No data available.</td></tr>';
            return;
        }

        querySnapshot.forEach(doc => {
            const entry = doc.data();
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
                    ${entry.isVerified ? '' : `<button onclick="verifyEntry('${doc.id}')">Verify</button>`}
                    <button onclick="editEntry('${doc.id}')">Edit</button>
                    <button onclick="confirmDelete('${doc.id}')">Delete</button>
                </td>
            `;
            dataViewerBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

// Function to verify an entry
async function verifyEntry(id) {
    try {
        const docRef = doc(db, "riceMillData", id);
        await updateDoc(docRef, { isVerified: true });
        viewData(); // Refresh data view
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}

// Function to delete an entry
async function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        try {
            await deleteDoc(doc(db, "riceMillData", id));
            viewData(); // Refresh data view
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }
}

// Function to edit an entry (fills form with existing data for editing)
function editEntry(id) {
    // Logic for loading existing data into form for editing
}

// Handle form submission for new or edited entries
document.getElementById('dataEntryForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const village = document.getElementById('village').value;
    const vehicleNumber = document.getElementById('vehicleNumber').value;
    const loadedWeight = parseFloat(document.getElementById('loadedWeight').value);
    const emptyWeight = parseFloat(document.getElementById('emptyWeight').value);
    const bagWeight = parseFloat(document.getElementById('bagWeight').value);
    const numOfBags = Math.floor((loadedWeight - emptyWeight) / bagWeight);

    const newEntry = { village, vehicleNumber, loadedWeight, emptyWeight, bagWeight, numOfBags, isVerified: false };

    await addData(newEntry); // Add new data to Firestore
    this.reset(); // Reset the form fields
});

// Initialize data view on page load
document.addEventListener('DOMContentLoaded', viewData);
