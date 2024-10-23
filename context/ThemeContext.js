import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from './translations'; // Import translations

const ThemeContext = createContext();

const themes = {
    light: {
        background: '#fff',
        color: '#000',
    },
    dark: {
        background: '#000',
        color: '#fff',
    },
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            const theme = await AsyncStorage.getItem('theme');
            const language = await AsyncStorage.getItem('language');
            if (theme) {
                setIsDarkMode(theme === 'dark');
            }
            if (language) {
                setIsEnglish(language === 'en');
            }
        };

        loadSettings();
    }, []);

    const toggleDarkMode = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
    };

    const toggleLanguage = async () => {
        const newLanguage = isEnglish ? 'vi' : 'en';
        setIsEnglish(!isEnglish);
        await AsyncStorage.setItem('language', newLanguage);
    };

    const currentTheme = isDarkMode ? themes.dark : themes.light;
    const currentLanguage = isEnglish ? translations.en : translations.vi; // Get current language

    return (
        <ThemeContext.Provider value={{ currentTheme, isDarkMode, toggleDarkMode, isEnglish, toggleLanguage, currentLanguage }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
