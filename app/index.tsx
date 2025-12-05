import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    const checkUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("iscode_user");

        // Pequeno delay para exibir o splash bonito
        setTimeout(() => {
          if (stored) {
            // 🔹 Substitui a rota, não permite voltar
            router.replace("/home");
          } else {
            router.replace("/signup");
          }
        }, 2000);
      } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        router.replace("/signup");
      }
    };

    checkUser();
  }, []); // 🔹 executa apenas 1 vez ao montar

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
