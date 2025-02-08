document.addEventListener("DOMContentLoaded", () => {
  // Get Elements
  const expenseForm = document.getElementById("expense-form");
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseList = document.getElementById("expense-list");
  const totalAmountDisplay = document.getElementById("total-amount");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let totalAmount = calculateTotal();

  renderItems();

  // Input Items
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());
    if (name !== "" && !isNaN(amount) && amount > 0) {
      const expense = {
        id: Date.now(),
        name: name,
        amount: amount,
      };
      expenses.push(expense);
      saveItems();
      renderItems();
      updateTotal();

      // Clear Input
      expenseAmountInput.value = "";
      expenseNameInput.value = "";
    }
  });

  // Render Items
  function renderItems() {
    expenseList.innerHTML = "";
    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.classList.add("expense-item", "slide-in");
      li.innerHTML = `
        <span class="expense-details">
          <span class="expense-name">${expense.name}</span>
          <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
        </span>
        <button data-id="${expense.id}" class="delete-button">Delete</button>
      `;
      expenseList.appendChild(li);
    });
    updateTotal();
  }

  // Total Amount
  function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  // Update Total
  function updateTotal() {
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
    const totalElement = document.getElementById("total");
    totalElement.classList.add("pulse");
    setTimeout(() => {
      totalElement.classList.remove("pulse");
    }, 600);
  }

  // Save Items
  function saveItems() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  // Delete Items
  expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      const itemToRemove = e.target.closest("li");

      itemToRemove.classList.add("slide-out");
      setTimeout(() => {
        expenses = expenses.filter((expense) => expense.id !== expenseId);
        saveItems();
        renderItems();
        updateTotal();
      }, 300);
    }
  });
});
