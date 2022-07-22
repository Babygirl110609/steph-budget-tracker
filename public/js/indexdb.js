
const indexedDB = window.indexedDB;
let openRequest = indexedDB.open("storeBudgetData", 1);
let db;

openRequest.onupgradeneeded = function({target}) {
  // triggers if the client had no database
  // ...perform initialization...
  let db = target.result;
  db.createObjectStore("offlinetransactions",{autoIncrement:true})
};

openRequest.onerror = function() {
  console.error("Error", openRequest.error);
};

openRequest.onsuccess = function({target}) {
  let db = target.result;
  // continue working with database using db object
  if(navigator.onLine) checkDatabasaeConnection()
};

function saveRecord(record){
    const transaction = db.transaction(["offlinetransactions"],"readwrite");
    const store = transaction.objectStore("offlinetransactions")
    store.add(record)
} // Save in IndexDB

function checkDatabasaeConnection(){
    const transaction = db.transaction(["offlinetransactions"],"readwrite");
    const store = transaction.objectStore("offlinetransactions")
   const storedTransactions =  store.getAll();
   storedTransactions.onsuccess = function(){
       if(storedTransactions.result.length > 0){
           fetch("/api/transaction/bulk",{
               method:"POST",
               body:JSON.stringify(storedTransactions.result),
               
           }).then(response => {
               return response.json()
           }).then(result => {
               console.log("Saved transactions to Mongodb",result) 
               const transaction = db.transaction(["offlinetransactions"],"readwrite");
               const store = transaction.objectStore("offlinetransactions")
               store.clear()
           })
       }
   }
}

window.addEventListener("online",checkDatabasaeConnection)