import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PremiumScreen() {
    const [selectedPlan, setSelectedPlan] = useState("monthly");

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#0f172a" }}
            contentContainerStyle={{ padding: 24 }}
        >
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: "white",
                    marginBottom: 10,
                    textAlign: "center",
                }}
            >
                Torne-se Premium
            </Text>

            <Text
                style={{
                    fontSize: 16,
                    color: "#cbd5e1",
                    textAlign: "center",
                    marginBottom: 24,
                }}
            >
                Desbloqueie todos os exercícios, desafios e conteúdos exclusivos.
            </Text>

            {/* Benefícios */}
            <View
                style={{
                    backgroundColor: "#1e293b",
                    padding: 20,
                    borderRadius: 16,
                    marginBottom: 32,
                }}
            >
                {[
                    "Acesso ilimitado a todos os módulos",
                    "Certificados de conclusão",
                    "Desafios avançados de lógica",
                    "Novos conteúdos todos os meses",
                    "Suporte prioritário",
                ].map((item, index) => (
                    <View
                        key={index}
                        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
                    >
                        <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                        <Text style={{ color: "white", fontSize: 16, marginLeft: 8 }}>{item}</Text>
                    </View>
                ))}
            </View>

            {/* Seleção de Planos */}
            <View style={{ gap: 16 }}>

                <TouchableOpacity
                    onPress={() => setSelectedPlan("monthly")}
                    style={{
                        backgroundColor: selectedPlan === "monthly" ? "#334155" : "#1e293b",
                        padding: 20,
                        borderRadius: 16,
                        borderWidth: selectedPlan === "monthly" ? 2 : 0,
                        borderColor: "#3b82f6",
                    }}
                >
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>Plano Mensal</Text>
                    <Text style={{ color: "#cbd5e1", marginTop: 6 }}>Apenas 9,99€/mês</Text>
                </TouchableOpacity>

                {/* Anual */}
                <TouchableOpacity
                    onPress={() => setSelectedPlan("annual")}
                    style={{
                        backgroundColor: selectedPlan === "annual" ? "#334155" : "#1e293b",
                        padding: 20,
                        borderRadius: 16,
                        borderWidth: selectedPlan === "annual" ? 2 : 0,
                        borderColor: "#3b82f6",
                    }}
                >
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>Plano Anual</Text>
                    <Text style={{ color: "#cbd5e1", marginTop: 6 }}> 99,99€ / ano (Poupe 20%)</Text>
                </TouchableOpacity>
            </View>

            {/* Botão Comprar */}
            <TouchableOpacity
                onPress={() => console.log("Comprar: ", selectedPlan)}
                style={{
                    marginTop: 32,
                    backgroundColor: "#3b82f6",
                    padding: 18,
                    borderRadius: 16,
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                    Assinar {selectedPlan === "monthly" ? "Plano Mensal" : "Plano Anual"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
