class StoreManager {
  expense;
  constructor(key) {
    this.key = key;
    this.#loadFromStorage();
  }

  #save() {
    localStorage.setItem(this.key, JSON.stringify(this.expense));
  }

  #generateId(length=12) {
    const numbers = "@%*!1234567890";
    let id = "";
    for (let i = 0; i < length; i++) {
      id += numbers[Math.floor(Math.random() * numbers.length)];
    }
    return id;
  }

  #loadFromStorage() {
    const data = JSON.parse(localStorage.getItem(this.key)) || [];
    this.expense = data;
  }
  create(data) {
   let id = this.#generateId();
   this.expense.push({...data,id});
   this.#save();
  }
  findById(id) {
    return this.expense.find((item) => item.id == id);
  }

  delete(id) {
    const data = this.expense.filter((expense) => expense.id !== id);
    this.expense = data;
    this.#save();
  }

  update(data) { // data should send the ID and other staff
    const updatedData = this.expense.map((item) =>
      item.id === data.id ? data : item
    );
    this.expense = updatedData;
    this.#save();
  }

  filter(filterStr){
    if(filterStr === "all"){
      return this.expense
    }
    return this.expense.filter((expense) => expense.category == filterStr);
    
  }
}

export default StoreManager;



