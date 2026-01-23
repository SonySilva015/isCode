import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { db } from '../db';
import { users } from '../db/schemas';

interface Props {
    navigation: any;
}

export default function SplashScreen({ navigation }: Props) {
    useEffect(() => {
        const checkUser = async () => {
            const user = await db.select().from(users).limit(1).get();
            alert(user ? `User found: ${user.name}` : 'No user found');
            setTimeout(() => {
                if (user) navigation.replace("Home");
                else navigation.replace("Home");
            }, 2000);
        };

        checkUser();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/icon/ChatGPT Image 12_11_2025, 15_36_46 (Edited).png')}
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
        backgroundColor: "#3b2667",
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
