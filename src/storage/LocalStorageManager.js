
export class LocalStorageManager {
    static createStorage = (storageName, storage) => {
        if (!localStorage.getItem(storageName)) {
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
        if (localStorage.hasOwnProperty(storageName)) {
            return JSON.parse(localStorage.getItem(storageName));
        } else {
            return {};
        }
    }

    static getStorageAsMap = (storageName) => {
        let  result = new Map();
        if (localStorage.hasOwnProperty(storageName)) {
            try{
                result = new Map(JSON.parse(localStorage.getItem(storageName)));
            } catch(e) {
               console.error(e);
            }
        }
        return result;
    }

    static update = (storageName, storageNew) => {
        if (!localStorage.hasOwnProperty(storageName)) {
            return;
        }
        let storageOld = JSON.parse(localStorage.getItem(storageName));
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
        localStorage.setItem(storageName, JSON.stringify(storage));
    }

    static flash = (storageName ,storage) => {
        localStorage.setItem(storageName, JSON.stringify(storage));
    }

    static isPropertyExist = (key) => {
        return localStorage.hasOwnProperty(key);
    }

    static isHasValue = (key) => {
        return localStorage.hasOwnProperty(key);
    }

    static removeStorageItem = (storageName) => {
        if(this.isHasValue(storageName)){
            localStorage.removeItem(storageName);
        }
    }
}
