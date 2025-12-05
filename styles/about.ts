import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 10,
    },
    subtitle: {
        color: "#E0E7FF",
        fontSize: 16,
        textAlign: "center",
        marginTop: 5,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#4F46E5",
        marginBottom: 8,
    },
    cardText: {
        color: "#444",
        fontSize: 15,
        lineHeight: 22,
    },
    footer: {
        alignItems: "center",
        paddingVertical: 20,
    },
    footerText: {
        color: "#E0E7FF",
        fontSize: 13,
    },
});
