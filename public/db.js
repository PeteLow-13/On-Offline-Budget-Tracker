let db; 
const request = window.indexedDB.open('budget', 1);

//creating object store 'pending' set autoIncrement: true
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore('pending', { autoIncrement: true });
};

//making sure app is online before accessing and reading db
request.onsuccess = (event) => {
    db = event.target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};
//error handler
request.onerror = (event) => {
    console.log(error);
};

function saveRecord(record) {
    //creating transaction on pending db w readwrite access
    const transaction = db.transaction(['pending'], 'readwrite');
    //access pending objectStore
    const store = transaction.objectStore('pending');
    //add records from store
    store.add(record);
};

function checkDatabase() {
    //open transaciton on pending db
    const transaction = db.transaction(['pending'], 'readwrite');
    //access pending object store
    const store = transaction.objectStore('pending');
    //getAll records from store and set to variable
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            var body = JSON.stringify(getAll.result);
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body : body,
                headers: {
                     'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then(()=> {
                //if successful open transaction with pending db
                const transaction = db.transaction(['pending'], 'readwrite');
                //accessing peding object store
                const store = transaction.objectStore('pending');
                //clear the store
                store.clear();
            });
        }
    };
}


//listen for app to come back online
window.addEventListener('online', checkDatabase);