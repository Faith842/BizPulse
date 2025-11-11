const form = document.getElementById('expenseform');
    const tableBody = document.querySelector('#expensetable tbody');

    let editIndex = null;

    form.addEventListener('submit', (e) => {e.preventDefault();
        const category = document.getElementById('category').value;
        const product = document.getElementById('product-name').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        const amount = document.getElementById('amount').value;
        const payment = document.getElementById('payment-method').value;
        if (editIndex === null) {
        addRow(category, product, description, date, amount, payment);
        } else {
        const row = tableBody.children[editIndex];
        row.children[0].textContent = category;
        row.children[1].textContent = product;
        row.children[2].textContent = description;
        row.children[3].textContent = date;
        row.children[4].textContent = amount;
        row.children[5].textContent = payment;

        editIndex = null;
        form.querySelector('button[type="submit"]').textContent = 'Submit';
        }

        form.reset();
    });

    function addRow(product, description, date, amount, payment, category) {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${category}</td>
        <td>${product}</td>
        <td>${description}</td>
        <td>${date}</td>
        <td>${amount}</td>
        <td>${payment}</td>
        <td class="actions">
            <button onclick="editRow(this)">Edit</button>
            <button onclick="deleteRow(this)">Remove</button>
        </td>
        `;
        tableBody.appendChild(row);
    }

    
    window.editRow = function (button) {
        const row = button.closest('tr');
        editIndex = Array.from(tableBody.children).indexOf(row);
        document.getElementById('category').value = row.children[0].textContent;
        document.getElementById('product').value = row.children[1].textContent;
        document.getElementById('description').value = row.children[2].textContent;
        document.getElementById('date').value = row.children[3].textContent;
        document.getElementById('amount').value = row.children[4].textContent;
        document.getElementById('payment').value = row.children[5].textContent;
        form.querySelector('button[type="submit"]').textContent = 'Update';
    };
    window.deleteRow = function (button) {
        const row = button.closest('tr');
        tableBody.removeChild(row);
    };
