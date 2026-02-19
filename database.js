'use strict';

class Database {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    // Open the database
    open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                // Create an object store with auto-incrementing key
                if (!this.db.objectStoreNames.contains('items')) {
                    this.db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject('Database error: ' + event.target.errorCode);
            };
        });
    }

    // Create a record
    create(item) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['items'], 'readwrite');
            const store = transaction.objectStore('items');
            const request = store.add(item);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject('Add error: ' + event.target.errorCode);
            };
        });
    }

    // Read records
    read() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['items'], 'readonly');
            const store = transaction.objectStore('items');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject('Read error: ' + event.target.errorCode);
            };
        });
    }

    // Update a record
    update(item) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['items'], 'readwrite');
            const store = transaction.objectStore('items');
            const request = store.put(item);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject('Update error: ' + event.target.errorCode);
            };
        });
    }

    // Delete a record
    delete(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['items'], 'readwrite');
            const store = transaction.objectStore('items');
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve(`Record with id ${id} deleted`);
            };

            request.onerror = (event) => {
                reject('Delete error: ' + event.target.errorCode);
            };
        });
    }
}

// Export the Database class
module.exports = Database;
