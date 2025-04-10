/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const customerForm = document.getElementById('customerForm');
    const itemTable = document.getElementById('itemTable');
    const addItemButton = document.getElementById('addItem');
    const calculateInvoiceButton = document.getElementById('calculateInvoice');
    const invoicePreview = document.getElementById('invoicePreview');
    const discountTypeSelect = document.getElementById('discountType');
    const discountValueInput = document.getElementById('discountValue');
    const submitInvoiceButton = document.getElementById('submitInvoice');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const apiDataDisplay = document.getElementById('apiDataDisplay');
    const refreshDataButton = document.getElementById('refreshData');

    let apiData = [];

    // Dark Mode Functionality
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Function to add a new item row
    const addItemRow = () => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" class="form-control itemName" required></td>
            <td><input type="number" class="form-control quantity" value="1" min="1" required></td>
            <td><input type="number" class="form-control unitPrice" value="0.00" min="0.00" step="0.01" required></td>
            <td><input type="number" class="form-control taxRate" value="0.00" min="0.00" step="0.01" required></td>
            <td><button class="btn btn-danger removeItem"><i class="fas fa-trash"></i></button></td>
        `;
        itemTable.querySelector('tbody').appendChild(newRow);

        // Add event listener to the remove button
        newRow.querySelector('.removeItem').addEventListener('click', (e) => {
            e.target.closest('tr').remove();
        });
    };

    // Event listener for adding a new item
    addItemButton.addEventListener('click', addItemRow);

    // Event delegation for removing item rows
    itemTable.querySelector('tbody').addEventListener('click', (e) => {
        if (e.target.classList.contains('removeItem')) {
            e.preventDefault();
            e.target.closest('tr').remove();
        }
    });

    // Function to calculate the invoice
    const calculateInvoice = () => {
        // Validate Customer Info
        if (!customerForm.checkValidity()) {
            customerForm.classList.add('was-validated');
            return;
        } else {
            customerForm.classList.remove('was-validated');
        }
        // Get customer information
        const customerName = document.getElementById('customerName').value;
        const customerAddress = document.getElementById('customerAddress').value;
        const customerContact = document.getElementById('customerContact').value;

        // Get item details
        const items = [];
        const rows = itemTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const itemName = row.querySelector('.itemName').value;
            const quantity = parseFloat(row.querySelector('.quantity').value);
            const unitPrice = parseFloat(row.querySelector('.unitPrice').value);
            const taxRate = parseFloat(row.querySelector('.taxRate').value);

            items.push({
                itemName,
                quantity,
                unitPrice,
                taxRate
            });
        });

        // Calculate subtotal, tax, and total
        let subtotal = 0;
        let totalTax = 0;

        items.forEach(item => {
            const itemTotal = item.quantity * item.unitPrice;
            const itemTax = itemTotal * (item.taxRate / 100);
            subtotal += itemTotal;
            totalTax += itemTax;
        });

        let total = subtotal + totalTax;

        // Apply discount
        const discountType = discountTypeSelect.value;
        const discountValue = parseFloat(discountValueInput.value);

        if (discountType === 'percentage') {
            total -= (total * (discountValue / 100));
        } else if (discountType === 'fixed') {
            total -= discountValue;
        }

        // Generate invoice preview
        let previewHTML = `
            <h2>Invoice Preview</h2>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Address:</strong> ${customerAddress}</p>
            <p><strong>Contact:</strong> ${customerContact}</p>
            <hr>
            <h3>Items:</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                        <th>Tax</th>
                        <th>Line Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        items.forEach(item => {
            const itemTotal = item.quantity * item.unitPrice;
            const itemTax = itemTotal * (item.taxRate / 100);
            const lineTotal = itemTotal + itemTax;

            previewHTML += `
                <tr>
                    <td>${item.itemName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>${itemTotal.toFixed(2)}</td>
                    <td>${itemTax.toFixed(2)}</td>
                    <td>${lineTotal.toFixed(2)}</td>
                </tr>
            `;
        });

        previewHTML += `
                </tbody>
            </table>
            <hr>
            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>Tax:</strong> ${totalTax.toFixed(2)}</p>
            <p><strong>Total:</strong> ${total.toFixed(2)}</p>
        `;

        invoicePreview.innerHTML = previewHTML;
    };

    // Event listener for calculating the invoice
    calculateInvoiceButton.addEventListener('click', calculateInvoice);

    // Event listener for submit button
    submitInvoiceButton.addEventListener('click', () => {
        calculateInvoice();
        // Clear input fields
        document.getElementById('customerName').value = '';
        document.getElementById('customerAddress').value = '';
        document.getElementById('customerContact').value = '';

        // Remove all item rows except the first one
        const rows = itemTable.querySelectorAll('tbody tr');
        for (let i = 1; i < rows.length; i++) {
            rows[i].remove();
        }

        // Reset the values in the first row
        const firstRow = itemTable.querySelector('tbody tr');
        firstRow.querySelector('.itemName').value = '';
        firstRow.querySelector('.quantity').value = '1';
        firstRow.querySelector('.unitPrice').value = '0.00';
        firstRow.querySelector('.taxRate').value = '0.00';
    });
    // Function to fetch data from API
    async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            const proxyUrl = `https://api.allorigins.win/raw?url=${url}`;
            const proxyResponse = await fetch(proxyUrl);
            if (proxyResponse.ok) {
                return await proxyResponse.json();
            } else {
                console.error('Failed to fetch data from both direct URL and proxy.');
                return null;
            }
        }
    } catch (error) {
        const proxyUrl = `https://api.allorigins.win/raw?url=${url}`;
        const proxyResponse = await fetch(proxyUrl);
        if (proxyResponse.ok) {
            return await proxyResponse.json();
        } else {
            console.error('Failed to fetch data from both direct URL and proxy.');
            return null;
        }
    }
}

    // Function to display API data
    const displayApiData = (data) => {
        if (!data || !Array.isArray(data)) {
            apiDataDisplay.innerHTML = '<p class="text-danger">Failed to load or process API data.</p>';
            return;
        }

        // Shuffle the data
        const shuffledData = data.sort(() => Math.random() - 0.5);

        let html = '<div class="row">';
        shuffledData.slice(0, 3).forEach(item => {
            html += `
                <div class="col-md-4">
                    <div class="card">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="card-text">Price: $${item.price}</p>
                            <p class="card-text">Rating: ${item.rating}</p>
                            <p class="card-text">Brand: ${item.brand}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        apiDataDisplay.innerHTML = html;
    };

    // Initial API data fetch
    const loadApiData = async () => {
        apiDataDisplay.innerHTML = '<p>Loading API data...</p>';
        const data = await fetchData('https://freetestapi.com/api/v1/products');
        apiData = data;
        displayApiData(data);
    };

    loadApiData();

    // Refresh data event listener
    refreshDataButton.addEventListener('click', () => {
        loadApiData();
    });

    // Initial item row
    addItemRow();

});