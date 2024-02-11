import { useState, useEffect } from 'react';

export const useEnvironment = () => {
    const [environment, setEnvironment] = useState<string | null>(null);
    const isProduction = import.meta.env.PROD;

    useEffect(() => {
        const currentEnvironment = import.meta.env.MODE;
        setEnvironment(currentEnvironment);
    }, []);

    return { environment, isProduction };
};