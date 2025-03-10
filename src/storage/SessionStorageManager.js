
export class SessionStorageManager {
    static createStorage = (storageName, storage) => {
        if (!sessionStorage.getItem(storageName)) {
            this.setStorage(storageName, storage);
        }
    }

    static readValue = (storageName, itemName) => {
        let result = null;
        if (this.getStorage(storageName)) {
            const storage = this.getStorage(storageName);
            if(storage){
                result = storage[itemName];
            }
        }
        return result;
    }

    static writeValue = (storageName, itemName, value) => {
        if (this.getStorage(storageName)) {
            const storage = this.getStorage(storageName);
            if(storage[itemName]){
                storage[itemName] = value;
                this.setStorage(storageName, storage);
            }
        }
    }

    static getStorage = (storageName) => {
        return JSON.parse(sessionStorage.getItem(storageName));
    }

    static update = (storageName, storageNew) => {
        let storageOld = JSON.parse(sessionStorage.getItem(storageName));
        if(storageOld){
            let mergedObj;
            if(Array.isArray(storageNew)){
                mergedObj = [...storageOld, ...storageNew];
            } else {
                mergedObj = { ...storageOld, ...storageNew};   
            }
            this.flash(storageName, mergedObj);
        } else {
            this.flash(storageName, storageNew);
        }
    }

    static setStorage = (storageName ,storage) => {
        sessionStorage.setItem(storageName, JSON.stringify(storage));
    }

    static flash = (storageName ,storage) => {
        sessionStorage.setItem(storageName, JSON.stringify(storage));
    }

    static isHasValue = (key) => {
        return sessionStorage.hasOwnProperty(key);
    }

    saveToMap(value){
        if(!sessionStorage.hasOwnProperty(value)) {
            sessionStorage.setItem(value, value);
        }
    }

    static removeStorageItem = (storageName) => {
        if(this.isHasValue(storageName)){
            sessionStorage.removeItem(storageName);
        }
    }
}
