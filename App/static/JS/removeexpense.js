document.addEventListener("DOMContentLoaded", function () {
  const deleteButtons = document.querySelectorAll(".delete-expense-btn");
  const modal = document.getElementById("deleteModal");
  const modalMessage = document.getElementById("modalMessage");
  const cancelButton = document.getElementById("cancelDelete");
  const confirmButton = document.getElementById("confirmDelete");
  const closeModal = document.querySelector(".close-modal");

  let currentExpenseId = null;
  let currentButton = null;

  // Function to show modal
  function showModal(expenseId, productName, button) {
    currentExpenseId = expenseId;
    currentButton = button;

    modalMessage.textContent = `Are you sure you want to delete the expense record for "${productName}" (ID: ${expenseId})? This action cannot be undone.`;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  // Function to hide modal
  function hideModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    currentExpenseId = null;
    currentButton = null;
  }

  // Function to delete expense
  async function deleteExpense() {
    if (!currentExpenseId) return;

    // Add loading state to confirm button
    const originalText = confirmButton.innerHTML;
    confirmButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Deleting...';
    confirmButton.disabled = true;
    cancelButton.disabled = true;

    try {
      const deleteUrl = `/record/removerecord/${currentExpenseId}`;
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
          showSuccessMessage("Expense record deleted successfully!");
        }, 500);
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error:", error);
      hideModal();
      showErrorMessage("Failed to delete expense record. Please try again.");
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
      const expenseId = this.getAttribute("data-expense-id");
      const productName =
        this.closest("tr").querySelector("td:nth-child(3)").textContent;
      showModal(expenseId, productName, this);
    });
  });

  // Modal event listeners
  confirmButton.addEventListener("click", deleteExpense);

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

// document.addEventListener("DOMContentLoaded", function () {
//   const deleteButtons = document.querySelectorAll(".delete-expense-btn");

//   deleteButtons.forEach((button) => {
//     button.addEventListener("click", async function () {
//       const expenseId = this.getAttribute("data-expense-id");
//       const productName =
//         this.closest("tr").querySelector("td:nth-child(3)").textContent;

//       if (
//         confirm(
//           `Are you sure you want to delete expense record for "${productName}" (ID: ${expenseId})?`
//         )
//       ) {
//         // Add loading state
//         const originalText = this.innerHTML;
//         this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
//         this.disabled = true;

//         try {
//           const deleteUrl = `/record/removerecord/${expenseId}`;
//           const response = await fetch(deleteUrl, {
//             method: "DELETE",
//             headers: {
//               "Content-Type": "application/json",
//               "X-Requested-With": "XMLHttpRequest",
//             },
//           });

//           if (response.redirected) {
//             window.location.href = response.url;
//           } else if (response.ok) {
//             // Show success message and remove row
//             const row = this.closest("tr");
//             row.style.backgroundColor = "#f871711a";
//             setTimeout(() => {
//               row.remove();
//               // Show a temporary success message
//               showTempMessage(
//                 "Expense record deleted successfully!",
//                 "success"
//               );
//             }, 500);
//           } else {
//             throw new Error("Delete failed");
//           }
//         } catch (error) {
//           console.error("Error:", error);
//           // Reset button state
//           this.innerHTML = originalText;
//           this.disabled = false;
//           alert("Failed to delete expense record. Please try again.");
//         }
//       }
//     });
//   });

//   // Helper function to show temporary messages
//   function showTempMessage(message, type) {
//     const messageDiv = document.createElement("div");
//     messageDiv.textContent = message;
//     messageDiv.style.cssText = `
//             position: fixed;
//             top: 100px;
//             right: 20px;
//             padding: 12px 20px;
//             border-radius: 8px;
//             color: white;
//             font-weight: 500;
//             z-index: 10000;
//             transition: all 0.3s ease;
//             ${
//               type === "success"
//                 ? "background: #10b981;"
//                 : "background: #ef4444;"
//             }
//         `;
//     document.body.appendChild(messageDiv);

//     setTimeout(() => {
//       messageDiv.remove();
//     }, 3000);
//   }
// });

// // document.addEventListener('DOMContentLoaded', function() {
// //     const deleteButtons = document.querySelectorAll('.delete-talent-btn');

// //     deleteButtons.forEach(button => {
// //         button.addEventListener('click', function() {
// //             // Retrieve the talent ID from the custom data attribute
// //             const talentId = this.getAttribute('data-sponsor-id');

// //             if (confirm(`Are you sure you want to delete talent ID ${talentId}?`)) {

// //                 // Construct the DELETE URL
// //                 const deleteUrl = `/record/removerecord/${talentId}`;

// //                 // Send the DELETE request using Fetch API
// //                 fetch(deleteUrl, {
// //                     method: 'DELETE',
// //                     headers: {
// //                         'Content-Type': 'application/json'
// //                     }
// //                 })
// //                 .then(response => {
// //                     // Flask is redirecting, so we need to reload the page or handle the flash message
// //                     if (response.redirected) {
// //                         window.location.href = response.url; // Follow the redirect (to mytalents)
// //                     } else if (response.ok) {
// //                         // If no redirect, just reload the page to show changes
// //                         window.location.reload();
// //                     } else {
// //                         alert('Failed to delete talent.');
// //                     }
// //                 })
// //                 .catch(error => {
// //                     console.error('Error:', error);
// //                     alert('An unexpected error occurred during deletion.');
// //                 });
// //             }
// //         });
// //     });
// // });
