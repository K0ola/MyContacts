import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthAPI } from "./api";
import { setToken as persistToken, getToken as readToken } from "./api";



const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const t = readToken();
        setToken(t);
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
    }, []);

    const login = async ({ email, password }) => {
        try {
            const { data } = await AuthAPI.login({ email, password });
            persistToken(data.token);
            setToken(data.token);
            const u = { id: data.id, email: data.email };
            setUser(u);
            localStorage.setItem("user", JSON.stringify(u));
            return u;
        } catch (err) {
            throw err;
        }
    };

    const register = async ({ email, password }) => {
        try {
            const { data } = await AuthAPI.register({ email, password });
            persistToken(data.token);
            setToken(data.token);
            const u = { id: data.id, email: data.email };
            setUser(u);
            localStorage.setItem("user", JSON.stringify(u));
            return u;
        } catch (err) {
            throw err;
        }
    };

    const logout = () => {
        persistToken(null);
        setToken(null);
        setUser(null);
        localStorage.removeItem("user");
        if (window.location.pathname !== "/auth") {
            window.location.href = "/auth";
        }
    };

    const value = useMemo(
        () => ({
            token,
            user,
            isAuthenticated: Boolean(token),
            login,
            register,
            logout,
        }),
        [token, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
