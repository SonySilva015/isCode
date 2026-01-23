import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { db } from '../db';
import { users } from '../db/schemas';

export default function SplashScreen() {
  useEffect(() => {
    const bootstrap = async () => {
      try {
        // 🔒 pequena garantia extra
        await new Promise(res => setTimeout(res, 300));

        const result = await db
          .select()
          .from(users)
          .limit(1)
          .all();

        const user = result.length > 0;

        setTimeout(() => {
          router.replace(user ? "/(drawer)/(tabs)/home" : "/signup");
        }, 2000);

      } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        router.replace("/signup");
      }
    };

    bootstrap();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icon/ChatGPT Image 12_11_2025, 15_36_46 (Edited).png')} // troque pela sua logo
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
