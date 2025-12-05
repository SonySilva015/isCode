import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen: React.FC<Props> = ({ navigation }) {
    useEffect(() => {
        const checkUser = async () => {
            const stored = await AsyncStorage.getItem("iscode_user");
            setTimeout(() => {
                if (stored) navigation.replace("Home");
                else navigation.replace("SignUp");
            }, 2000);
        };
        checkUser();
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: "https://i.imgur.com/6u1f8QX.png" }} // pode substituir pela sua logo
                style={styles.logo}
            />
            <Text style={styles.title}>iscode</Text>
            <Text style={styles.subtitle}>Aprenda. Pratique. Domine.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#3b2667", // lilás escuro
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 90,
        height: 90,
        borderRadius: 20,
        marginBottom: 20,
    },
    title: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold",
    },
    subtitle: {
        color: "#d8b4fe",
        fontSize: 16,
        marginTop: 6,
    },
});
