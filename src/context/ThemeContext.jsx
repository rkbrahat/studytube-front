import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage or system preference
        if (localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        return 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove the old theme class
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');

        // Add the new theme class
        root.classList.add(theme);

        // Save to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
