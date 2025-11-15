document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const table = document.querySelector(".data-table");   // correct selector
    const rows = table.getElementsByTagName("tr");
    const noResults = document.getElementById("no-results");

    function removeHighlights(row) {
        row.innerHTML = row.innerHTML.replace(/<mark class="highlight">|<\/mark>/g, "");
    }

    function highlightMatches(cell, text) {
        const regex = new RegExp(`(${text})`, "gi");
        cell.innerHTML = cell.textContent.replace(regex, '<mark class="highlight">$1</mark>');
    }

    searchInput.addEventListener("keyup", function () {
        const text = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        for (let i = 1; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName("td");
            if (cells.length === 0) continue;

            removeHighlights(rows[i]); // reset marks

            let product = cells[2].textContent.toLowerCase();
            let debit = cells[6].textContent.toLowerCase();
            let payment = cells[7].textContent.toLowerCase();
            let rowText = rows[i].textContent.toLowerCase();

            let match = false;

            // product search
            if (product.includes(text)) match = true;

            // payment method search
            if (payment.includes(text)) match = true;

            // "credit" means looking for debit = "yes"
            if (text === "debit" && debit === "yes") match = true;

            // general match (anywhere in row)
            if (rowText.includes(text)) match = true;

            // empty → show all
            if (text === "") match = true;

            if (match) {
                rows[i].style.display = "";
                visibleCount++;

                if (text !== "") {
                    for (let cell of cells) highlightMatches(cell, text);
                }

            } else {
                rows[i].style.display = "none";
            }
        }

        noResults.style.display = visibleCount === 0 ? "block" : "none";
    });
});

