import {useDebounce} from "@uidotdev/usehooks";
import {useEffect, useState} from "react";

export const useIsOnline = () => {
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);

    const debouncedIsOnline = useDebounce(isOnline, 3000);
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    return {isOnline, debouncedIsOnline};
}