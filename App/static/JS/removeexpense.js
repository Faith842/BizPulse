document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.delete-talent-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retrieve the talent ID from the custom data attribute
            const talentId = this.getAttribute('data-sponsor-id');
            
            if (confirm(`Are you sure you want to delete talent ID ${talentId}?`)) {
                
                // Construct the DELETE URL
                const deleteUrl = `/record/removerecord/${talentId}`;

                // Send the DELETE request using Fetch API
                fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    // Flask is redirecting, so we need to reload the page or handle the flash message
                    if (response.redirected) {
                        window.location.href = response.url; // Follow the redirect (to mytalents)
                    } else if (response.ok) {
                        // If no redirect, just reload the page to show changes
                        window.location.reload(); 
                    } else {
                        alert('Failed to delete talent.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An unexpected error occurred during deletion.');
                });
            }
        });
    });
});