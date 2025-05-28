import StoreManager from "./storeManager.js";
const formEl = document.querySelector("#expenses-form");
const tableEl = document.querySelector(".table-el");
const totalAmountEl = document.querySelector("#total-amount");
const filterEl = document.querySelector("#filter");

const storeFunctions = new StoreManager();
const saveFn = storeFunctions.save;
const fetchFn = storeFunctions.fetch;

const storedExpenses = await fetchFn("expenses");
if(storedExpenses){
  display(storedExpenses);
}

let expenses = [];

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const datas = {};

  for (const item of formData.entries()) {
    const [name, value] = item;
    datas[name] = value;
    datas.id = generateId();
  }
  expenses.push(datas);
  formEl.reset();
  saveFn("expenses",expenses);
  display(expenses);
  totalAmount(expenses);
  
});

function display(expenses) {
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
}

tableEl.addEventListener("click", async (event)=> {
  if (event.target.classList.contains("delete")) {
    const id = event.target.dataset.id;
    expenses = expenses.filter((expense) => expense.id !== id);
    saveFn("expenses",expenses);
    const storedExpenses = await fetchFn("expenses");
    display(expenses);
  }

  // if(event.target.classList.contains("edit")){
  //   const id = event
  // }
});

function generateId() {
  const numbers = "@%*!1234567890";
  let id = "";
  for (let i = 0; i < 5; i++) {
    id += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return id;
}

async function totalAmount(){
  const expenses =  await fetchFn("expenses");
  const amount = expenses.reduce((sum, expense) => {
    return sum + parseFloat(expense.expenseAmount);
  }, 0);
  totalAmountEl.textContent = amount;
}

filterEl.addEventListener("change",async (event)=>{
  const filter = event.target.value;
  let expenses = await fetchFn("expenses");
  if(filter == "all"){
    display(expenses)
  }else{
  expenses = expenses.filter((expense) => expense.category == filter);
    display(expenses);
    totalAmount(expenses);}
}
);

