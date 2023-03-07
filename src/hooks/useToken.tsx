import React, { useEffect, useState } from "react";

const useToken = (): [string|null, (token: string) => void] => {

    const [userToken, setUserToken] = useState<string | null>(null);

    useEffect(() => {
        const storedUserToken = localStorage.getItem('userToken');
        if (storedUserToken) setUserToken(storedUserToken);
    }, []);

    const setToken = (token: string) => {
        setUserToken(token);
        localStorage.setItem('userToken', token);
    };

    return [userToken, setToken]
}

export default useToken;
