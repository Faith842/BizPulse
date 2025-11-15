document.addEventListener("DOMContentLoaded", () => {
    const MAX_ROWS = 5;
    const toggleButtons = document.querySelectorAll(".toggle-rows-btn");

    toggleButtons.forEach(btn => {
        const table = document.getElementById(btn.dataset.table);
        if (!table) return;

        const rows = Array.from(table.getElementsByTagName("tr")).slice(1); // skip header
        let showingAll = false;

        // initially hide rows beyond MAX_ROWS
        rows.forEach((row, index) => {
            row.style.display = index < MAX_ROWS ? "" : "none";
        });

        btn.addEventListener("click", () => {
            if (!showingAll) {
                // show all rows
                rows.forEach(row => row.style.display = "");
                btn.textContent = "View Less";
            } else {
                // collapse to MAX_ROWS
                rows.forEach((row, index) => {
                    row.style.display = index < MAX_ROWS ? "" : "none";
                });
                btn.textContent = "View All";
            }
            showingAll = !showingAll;
        });
    });
});
