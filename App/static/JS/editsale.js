document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('salesform');
    const expenseTable = document.getElementById('salestable');
    
    // Check if the base URL template is available from the HTML template
    if (typeof EDIT_URL_BASE === 'undefined') {
        console.error("EDIT_URL_BASE not found. Check HTML script tags.");
        return;
    }

    // Attach event listener to the table body for delegation
    expenseTable.addEventListener('click', function(event) {
        // Find the closest ancestor element with the class 'edit-expense-btn'
        const editButton = event.target.closest('.edit-sale-btn');
        if (!editButton) return;
        
        // Prevent default action (which might be an empty link if 'href' was set)
        event.preventDefault(); 

        // 1. Get the row data
        const row = editButton.closest('tr');
        const cells = row.querySelectorAll('td');
        
        // Extract data based on cell index (0-based)
    const recordData = {
        id: cells[0].textContent.trim(),
        date: cells[1].textContent.trim().substring(0, 10),
        productname: cells[2].textContent.trim(),
        description: cells[3].textContent.trim(),
        quantity: cells[4].textContent.trim(),
        price: cells[5].textContent.trim(),
        debit: cells[6].textContent.trim(),
        paymentmethod: cells[7].textContent.trim(),
        amount: cells[8].textContent.trim(),
    };


        // 2. Populate the form fields and update the action

        // FIX 3: SIMPLIFY URL CONSTRUCTION. Replace the placeholder '0' with the actual ID.
        // If EDIT_URL_BASE is '/record/editrecord/0', this will result in '/record/editrecord/123'
        const finalEditUrl = EDIT_URL_BASE.replace('/0', '/' + recordData.id); 

        expenseForm.action = finalEditUrl; 

        // Set the form field values, using the correct/unique IDs
        
        // Dropdowns need .value set directly
        //document.getElementById('category').value = recordData.category; 
        document.getElementById('debit').value = recordData.debit;
        document.getElementById('paymentmethod').value = recordData.paymentmethod;
        
        // Inputs using the corrected IDs
        document.getElementById('Productname').value = recordData.productname;
        document.getElementById('quantity').value = recordData.quantity; // <-- CORRECTED ID
        document.getElementById('description').value = recordData.description;
        document.getElementById('date').value = recordData.date;           // <-- CORRECTED ID
        document.getElementById('price').value = recordData.price;
        document.getElementById('amount').value = recordData.amount;
        
        // 3. Update Submit Button
        const submitButton = expenseForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Update Record';
        submitButton.style.backgroundColor = '#7c3aed';

        // 4. Scroll to the form
        window.scrollTo({
            top: expenseForm.offsetTop - 100,
            behavior: 'smooth'
        });

    });
});