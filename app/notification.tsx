import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";

const notifications = [
    {
        id: "1",
        title: "Novo nível desbloqueado!",
        message: "Parabéns 🎉 — você agora pode acessar o Nível 2.",
        icon: "trophy-outline",
        date: "13 Nov 2025",
        color: "#4F46E5",
    },
    {
        id: "2",
        title: "Meta diária atingida!",
        message: "Você completou sua meta de aprendizado hoje. 👏",
        icon: "flame-outline",
        date: "12 Nov 2025",
        color: "#F59E0B",
    },
    {
        id: "3",
        title: "Nova lição disponível",
        message: "Uma nova lição de lógica está pronta para você.",
        icon: "book-outline",
        date: "11 Nov 2025",
        color: "#10B981",
    },
    {
        id: "4",
        title: "Continue aprendendo",
        message: "Você está a 2 dias de uma nova conquista! 🚀",
        icon: "rocket-outline",
        date: "10 Nov 2025",
        color: "#6366F1",
    },
];

const NotificationsScreen = () => {
    return (
        <LinearGradient colors={["#8629CF", "#000"]} style={styles.container}>
            <StatusBar barStyle="light-content" />

            <Text style={styles.header}>Notificações</Text>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={[styles.iconContainer, { backgroundColor: item.color + "33" }]}>
                            <Ionicons name={item.icon as any} size={26} color={item.color} />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.message}>{item.message}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                        </View>
                    </View>
                )}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 20,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1F2937",
    },
    message: {
        fontSize: 14,
        color: "#4B5563",
        marginTop: 4,
    },
    date: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 6,
    },
});

export default NotificationsScreen;
