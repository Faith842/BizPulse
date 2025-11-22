document.addEventListener("DOMContentLoaded", function () {
  const deleteButtons = document.querySelectorAll(".delete-sale-btn");
  const modal = document.getElementById("deleteModal");
  const modalMessage = document.getElementById("modalMessage");
  const cancelButton = document.getElementById("cancelDelete");
  const confirmButton = document.getElementById("confirmDelete");
  const closeModal = document.querySelector(".close-modal");

  let currentSaleId = null;
  let currentButton = null;

  // Function to show modal
  function showModal(saleId, productName, button) {
    currentSaleId = saleId;
    currentButton = button;

    modalMessage.textContent = `Are you sure you want to delete the sales record for "${productName}" (ID: ${saleId})? This action cannot be undone.`;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  // Function to hide modal
  function hideModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    currentSaleId = null;
    currentButton = null;
  }

  // Function to delete sale
  async function deleteSale() {
    if (!currentSaleId) return;

    // Add loading state to confirm button
    const originalText = confirmButton.innerHTML;
    confirmButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Deleting...';
    confirmButton.disabled = true;
    cancelButton.disabled = true;

    try {
      const deleteUrl = `/salerecord/removerecord/${currentSaleId}`;
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else if (response.ok) {
        // Show success and remove row
        hideModal();
        const row = currentButton.closest("tr");
        row.style.backgroundColor = "#f871711a";
        setTimeout(() => {
          row.remove();
          showSuccessMessage("Sales record deleted successfully!");
        }, 500);
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error:", error);
      hideModal();
      showErrorMessage("Failed to delete sales record. Please try again.");
    } finally {
      // Reset button state
      confirmButton.innerHTML = originalText;
      confirmButton.disabled = false;
      cancelButton.disabled = false;
    }
  }

  // Event listeners for delete buttons
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const saleId = this.getAttribute("data-sale-id");
      const productName =
        this.closest("tr").querySelector("td:nth-child(3)").textContent;
      showModal(saleId, productName, this);
    });
  });

  // Modal event listeners
  confirmButton.addEventListener("click", deleteSale);

  cancelButton.addEventListener("click", hideModal);

  closeModal.addEventListener("click", hideModal);

  // Close modal when clicking outside
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      hideModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display === "block") {
      hideModal();
    }
  });

  // Helper function to show success message
  function showSuccessMessage(message) {
    showTempMessage(message, "success");
  }

  // Helper function to show error message
  function showErrorMessage(message) {
    showTempMessage(message, "error");
  }

  // Helper function to show temporary messages
  function showTempMessage(message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transition: all 0.3s ease;
            ${
              type === "success"
                ? "background: #10b981;"
                : "background: #ef4444;"
            }
        `;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.style.opacity = "0";
      setTimeout(() => {
        messageDiv.remove();
      }, 300);
    }, 3000);
  }
});

// const expenseTable = document.getElementById('salestable');
// expenseTable.addEventListener('click', function(event) {
//     const deleteButton = event.target.closest('.delete-sale-btn');
//     if (!deleteButton) return;

//     const salesId = deleteButton.getAttribute('data-sponsor-id');

//     if (confirm(`Are you sure you want to delete record ID ${salesId}?`)) {
//         fetch(`/salerecord/removerecord/${salesId}`, {
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
