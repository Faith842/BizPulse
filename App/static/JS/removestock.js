const expenseTable = document.getElementById('stocktable');
expenseTable.addEventListener('click', function(event) {
    const deleteButton = event.target.closest('.delete-stock-btn');
    if (!deleteButton) return;

    const salesId = deleteButton.getAttribute('data-sponsor-id');
    
    if (confirm(`Are you sure you want to delete record ID ${salesId}?`)) {
        fetch(`/stockrecord/removerecord/${salesId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else if (response.ok) {
                window.location.reload();
            } else {
                alert('Failed to delete record.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error occurred during deletion.');
        });
    }
});
