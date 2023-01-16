import { useState } from "react";

const useToken = () => {
    const [token, setToken] = useState(localStorage.getItem("token")); 

    const get = () => {
        return token;
    }

    const save = (token) => {
        localStorage.setItem("token", token);
        setToken(token);  
    };

    const del = () => {
        localStorage.removeItem("token");
        setToken();
    };

    return {
        setToken: save,
        delToken: del,
        token
    }
};

export default useToken;