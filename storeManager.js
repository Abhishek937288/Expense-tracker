class StoreManager {
    //  constructor(key, value) {
    //     this.key = key;
    //     this.value = value;
    //   }

    save(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    }

     async fetch (key){
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data):null;
    }
};

export default StoreManager;