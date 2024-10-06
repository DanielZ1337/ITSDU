/*
import {useCallback, useSyncExternalStore} from "react";

export default function useLocalStorage(key: string) {
    const subscribe = useCallback((callback: () => void) => {
        window.addEventListener("custom-storage-event-name", callback);
        return () => window.removeEventListener("custom-storage-event-name", callback);
    }, []);

    const item = useSyncExternalStore(subscribe, getSnapshot);

    // Parse the json string
    // You should probably further narrow down the JSON.parse type because JSON.parse returns any
    const value = JSON.parse(item);

    const setValue = (key: string) => {
        localStorage.setItem("item", JSON.stringify("new-value"));
        //The event name has to match the eventListeners defined in the subscribe function
        window.dispatchEvent(new StorageEvent("custom-storage-event-name"));
    };

    const removeValue = () => {
        localStorage.removeItem("item");
        //The event name has to match the eventListeners defined in the subscribe function
        window.dispatchEvent(new StorageEvent("custom-storage-event-name"));
    }

    const clearValue = () => {
        localStorage.clear();
        //The event name has to match the eventListeners defined in the subscribe function
        window.dispatchEvent(new StorageEvent("custom-storage-event-name"));
    }

    return [value, setValue, removeValue, clearValue] as const;
}

//Return the current value from the browser API
function getSnapshot() {
    alert("localStorage changed")
    return localStorage.getItem("item");
}*/
