// removestock.js - Updated with modal functionality
document.addEventListener("DOMContentLoaded", function () {
  const deleteModal = document.getElementById("deleteModal");
  const deleteMessage = document.getElementById("deleteMessage");
  const cancelDelete = document.getElementById("cancelDelete");
  const confirmDelete = document.getElementById("confirmDelete");
  let currentStockId = null;
  let currentProductName = null;

  // Delete button click handler
  document.addEventListener("click", function (event) {
    const deleteButton = event.target.closest(".delete-stock-btn");
    if (deleteButton) {
      event.preventDefault();

      currentStockId = deleteButton.getAttribute("data-stock-id");
      currentProductName = deleteButton.getAttribute("data-product-name");

      // Update modal message
      deleteMessage.textContent = `Are you sure you want to delete stock record for "${currentProductName}" (ID: ${currentStockId})? This action cannot be undone.`;

      // Show modal
      deleteModal.style.display = "flex";
      setTimeout(() => {
        deleteModal.classList.add("active");
      }, 10);
    }
  });

  // Cancel delete
  cancelDelete.addEventListener("click", function () {
    closeModal();
  });

  // Close modal when clicking X
  document.querySelector(".close-modal").addEventListener("click", function () {
    closeModal();
  });

  // Close modal when clicking outside
  deleteModal.addEventListener("click", function (event) {
    if (event.target === deleteModal) {
      closeModal();
    }
  });

  // Confirm delete
  confirmDelete.addEventListener("click", function () {
    if (currentStockId) {
      performDelete(currentStockId);
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && deleteModal.classList.contains("active")) {
      closeModal();
    }
  });

  function closeModal() {
    deleteModal.classList.remove("active");
    setTimeout(() => {
      deleteModal.style.display = "none";
      currentStockId = null;
      currentProductName = null;
    }, 300);

    // Reset button state
    confirmDelete.innerHTML = '<i class="fas fa-trash"></i> Delete';
    confirmDelete.disabled = false;
  }

  function performDelete(stockId) {
    // Show loading state
    confirmDelete.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Deleting...';
    confirmDelete.disabled = true;

    fetch(`/stockrecord/removerecord/${stockId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => {
        if (response.redirected) {
          window.location.href = response.url;
        } else if (response.ok) {
          // Success - reload the page
          window.location.reload();
        } else {
          throw new Error("Failed to delete record");
        }
      })
      .catch((err) => {
        console.error("Delete error:", err);
        alert("Error occurred during deletion. Please try again.");

        // Reset button state
        confirmDelete.innerHTML = '<i class="fas fa-trash"></i> Delete';
        confirmDelete.disabled = false;
      });
  }
});

// const expenseTable = document.getElementById('stocktable');
// expenseTable.addEventListener('click', function(event) {
//     const deleteButton = event.target.closest('.delete-stock-btn');
//     if (!deleteButton) return;

//     const salesId = deleteButton.getAttribute('data-sponsor-id');

//     if (confirm(`Are you sure you want to delete record ID ${salesId}?`)) {
//         fetch(`/stockrecord/removerecord/${salesId}`, {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' }
//         })
//         .then(response => {
//             if (response.redirected) {
//                 window.location.href = response.url;
//             } else if (response.ok) {
//                 window.location.reload();
//             } else {
//                 alert('Failed to delete record.');
//             }
//         })
//         .catch(err => {
//             console.error(err);
//             alert('Error occurred during deletion.');
//         });
//     }
// });
