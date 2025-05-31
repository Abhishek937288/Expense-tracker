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
  await totalAmount();
}

let expenses = [];

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  // if we are updaing or creating
  const formData = new FormData(e.currentTarget);
  const datas = {};
  for (const item of formData.entries()) {
    const [name, value] = item;
    datas[name] = value;
  }

  let allExpense = await fetchFn("expenses");
  if(datas.id){
    allExpense = allExpense.map(item => item.id == datas.id ? datas : item)
    formEl["submit"].textContent = "Add Expense"
  }else {
   datas.id = generateId();
   allExpense.push(datas);
  }
  formEl.reset();
  saveFn("expenses",allExpense);
  display(allExpense);
  await totalAmount(allExpense);
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
    display(storedExpenses);
    await totalAmount();
  }

  if(event.target.classList.contains("edit")){
    const id = event.target.dataset.id;
     const expenses = await fetchFn("expenses");
    const targetExpense = expenses.find((item)=> item.id == id)
    // if (formEl.elements[key]) {
    // formEl.elements[key].value = expense[0][key];
    // console.log(id)
    // formEl['expenseName'].value = "New value";
    // console.log(targetExpense)
    

    for(const [key,value] of Object.entries(targetExpense)){
      formEl[key].value = value;
    }
    formEl["submit"].textContent = "Update Expense"
  }

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

