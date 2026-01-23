import { styles } from "@/styles/about";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";

const SobreScreen = () => {
    return (
        <LinearGradient colors={["#4F46E5", "#6366F1"]} style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Ionicons name="information-circle-outline" size={80} color="#fff" />
                    <Text style={styles.title}>Sobre o App</Text>
                    <Text style={styles.subtitle}>Aprende programação de forma divertida 🚀</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📱 O que é este App?</Text>
                    <Text style={styles.cardText}>
                        Este aplicativo foi criado para ajudar estudantes a aprenderem lógica de programação
                        e conceitos de Java de forma prática e interativa. Através de lições, quizzes e desafios,
                        tu vais evoluindo de nível enquanto fortaleces as tuas habilidades como programador.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🎯 Objetivo</Text>
                    <Text style={styles.cardText}>
                        Tornar o aprendizado de programação mais acessível, divertido e envolvente. O app utiliza
                        elementos de gamificação como níveis, conquistas e pontuações para manter a motivação.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>👨‍💻 Desenvolvido por</Text>
                    <Text style={styles.cardText}>
                        Equipa ISCODE © 2025
                        {"\n"}Versão: 1.0.0
                        {"\n"}Feito com ❤️ usando React Native e Expo.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2025 ISCODE. Todos os direitos reservados.</Text>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};


export default SobreScreen;
