import { useTheme } from '@/context/useTheme';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const ThemeToggle = () => {
    const { mode, setMode, colors } = useTheme();

    const toggle = () => {
        setMode(mode === 'light' ? 'dark' : 'light');
    };

    return (
        <TouchableOpacity
            onPress={toggle}
            style={{
                padding: 10,
                backgroundColor: colors.card,
                borderRadius: 10,
            }}
        >
            <Text style={{ color: colors.text }}>
                {mode === 'light' ? '🌙 Modo escuro' : '☀️ Modo claro'}
            </Text>
        </TouchableOpacity>
    );
};
