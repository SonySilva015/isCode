import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/context/useTheme';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';


const Theme = () => {
    const { colors } = useTheme();


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.statusBarStyle} />


            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.title, { color: colors.text }]}>Olá — Tema atual</Text>
                <Text style={[styles.p, { color: colors.text }]}>Este é um exemplo de implementação de tema claro/escuro.</Text>
                <ThemeToggle />
            </View>


        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 20,
    },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    p: { fontSize: 15, lineHeight: 20 },
});

export default Theme;