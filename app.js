import StoreManager from "./storeManager.js";
const formEl = document.querySelector("#expenses-form");
const tableEl = document.querySelector(".table-el");
const totalAmountEl = document.querySelector("#total-amount");
const filterEl = document.querySelector("#filter");

const storage = new StoreManager("expenses-v2");

display();

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const datas = {};
  for (const item of formData.entries()) {
    const [name, value] = item;
    datas[name] = value;
  }

  if (datas.id) {
    storage.update(datas);
    formEl["submit"].textContent = "Add Expense";
  } else {
    storage.create(datas);
  }
  formEl.reset();
  display();
});

function display(expenses = storage.expense) {
  tableEl.innerHTML = "";
  expenses.forEach((expense) => {
    const row = document.createElement("tr");
    row.innerHTML = `
   <td><span> ${expense.expenseName}</span></td>
   <td> ${expense.expenseAmount}</td>
   <td> ${expense.category}</td>
   <td> ${expense.date}</td>
   <td> 
   <button class="delete" data-id="${expense.id}" >Delete </button>
   <button class="edit" data-id="${expense.id}" >Edit</button>
   </td>
   `;
    tableEl.appendChild(row);
  });
  totalAmount();

 document.querySelectorAll(".delete").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    storage.delete(id);
    display();
  });
});

document.querySelectorAll(".edit").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const targetExpense = storage.expense.find((item) => item.id == id);
    for (const [key, value] of Object.entries(targetExpense)) {
      formEl[key].value = value;
    }
    formEl["submit"].textContent = "Update Expense";
  });
});

}


function totalAmount(expense = storage.expense) {
  const amount = expense.reduce((sum, expense) => {
    return sum + parseFloat(expense.expenseAmount);
  }, 0);
  totalAmountEl.textContent = amount;
}

filterEl.addEventListener("change", async (event) => {
  const filterStr = event.target.value;
  const filterdExpense  = storage.filter(filterStr);
    display(filterdExpense);
    totalAmount(filterdExpense);
  
});
