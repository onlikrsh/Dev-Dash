// save: takes a key and value, stringifies, stores to local storage
export function save(key, value){
    try{
        const data = JSON.stringify(value);
        localStorage.setItem(key, data);

    } catch(error){
        console.error(`Failed to save "${key}" to localStorage:`, error);
    }
}

// load: takes a key and fallback, retrieves, parses
export function load(key, fallback = null){
    try{
        const data = localStorage.getItem(key);
        if(data === null) return fallback;
        return JSON.parse(data);
    }catch(error){
        console.error(`Failed to load "${key} from localStorage:"`, error);
        return fallback
    }
}

// remove: takes a key, deletes it
export function remove(key){
    localStorage.removeItem(key);
}