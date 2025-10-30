document.getElementById("bizForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("fullName").value;
  const company = document.getElementById("companyName").value;
  const years = document.getElementById("yearsActive").value;
  const currency = document.getElementById("currency").value;
  const income = parseFloat(document.getElementById("income").value);
  const expenses = parseFloat(document.getElementById("expenses").value);
  const profit = income - expenses;

  document.getElementById("displayName").textContent = name;
  document.getElementById("displayCompany").textContent = company;
  document.getElementById("displayYears").textContent = years;
  document.getElementById("displayCurrency").textContent = currency;
  document.getElementById("displayIncome").textContent = `${income.toLocaleString()} ${currency}`;
  document.getElementById("displayExpenses").textContent = `${expenses.toLocaleString()} ${currency}`;
  document.getElementById("displayProfit").textContent = `${profit.toLocaleString()} ${currency}`;

  document.getElementById("results").classList.remove("hidden");
});
