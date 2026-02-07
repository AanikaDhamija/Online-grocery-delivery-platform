// src/COMPONENTS/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
        // On mount, always sync both user and token from localStorage
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        console.log('[AuthContext] useEffect (mount): token from localStorage:', storedToken);
        console.log('[AuthContext] useEffect (mount): storedUser from localStorage:', storedUser);
        setToken(storedToken);
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, []);

    const login = (newToken, userData) => {
        console.log('[AuthContext] login: saving token and user', newToken, userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData)); // Store user details
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        console.log('[AuthContext] logout: clearing token and user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isLoggedIn = !!user && !!token;
    console.log('[AuthContext] Render: user', user, 'token', token, 'isLoggedIn', isLoggedIn);
    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};