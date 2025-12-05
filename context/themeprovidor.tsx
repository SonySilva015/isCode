import { darkColors, lightColors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    useEffect,
    useState
} from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (val: ThemeMode) => void;
    colors: any;
    isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = '@app_theme_mode';

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [mode, setMode] = useState<ThemeMode>('light'); // padrão light

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved === 'light' || saved === 'dark') {
                    setMode(saved);
                }
            } catch (e) {
                console.warn('Erro ao ler tema:', e);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, mode);
            } catch (e) {
                console.warn('Erro ao salvar tema:', e);
            }
        })();
    }, [mode]);

    const colors = mode === 'dark' ? darkColors : lightColors;

    const value: ThemeContextType = {
        mode,
        setMode,
        colors,
        isDark: mode === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
