import { useTheme } from '@/context/useTheme';
import { stylesGame } from '@/styles/game';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";



// Interface para o progresso do usuário
interface UserProgress {
    currentLevel: number;
    completedLevels: number[];
    starsPerLevel: { [key: number]: number };
}

// Mock data - substitua pelos dados reais do seu jogo
const USER_PROGRESS: UserProgress = {
    currentLevel: 8,
    completedLevels: [1, 2, 3, 4, 5, 6, 7],
    starsPerLevel: {
        1: 3, 2: 2, 3: 3, 4: 1, 5: 2, 6: 3, 7: 2
    }
};

type LevelStatus = 'current' | 'completed' | 'locked';

const LevelsScreen = () => {
    const { mode, colors } = useTheme();
    const styles = stylesGame(colors);
    const levels = Array.from({ length: 20 }, (_, i) => i + 1);

    const getLevelStatus = (level: number): LevelStatus => {
        if (level === USER_PROGRESS.currentLevel) return 'current';
        if (USER_PROGRESS.completedLevels.includes(level)) return 'completed';
        return 'locked';
    };

    const getLevelGradient = (level: number, status: LevelStatus) => {
        if (status === 'current') {
            return [colors.primary, colors.second, "#4ADE80"];
        }
        if (status === 'completed') {
            return [colors.gradient.primary, colors.gradient.second];
        }
        return ["#6B7280", "#9CA3AF", "#4B5563"];
    };

    const getStarCount = (level: number): number => {
        if (USER_PROGRESS.starsPerLevel[level]) {
            return USER_PROGRESS.starsPerLevel[level];
        }
        return 0;
    };

    const handleLevelPress = (level: number, status: LevelStatus) => {
        if (status === 'locked') {
            // Mostrar mensagem ou feedback visual
            console.log(`Nível ${level} está bloqueado!`);
            return;
        }

        if (status === 'current' || status === 'completed') {
            // Navegar para o nível ou mostrar detalhes
            console.log(`Iniciar nível ${level}`);
            // navigation.navigate('Game', { level });
        }
    };

    return (
        <LinearGradient
            colors={[
                colors.gradient.primary,
                colors.gradient.second,
                mode === 'dark' ? colors.card : colors.gradient.second,
            ]}
            style={styles.container}
        >
            <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Trilha de Níveis ☕</Text>
                <Text style={styles.subtitle}>
                    Nível atual: {USER_PROGRESS.currentLevel} • Concluídos: {USER_PROGRESS.completedLevels.length}
                </Text>
            </View>

            {/* Timeline dos níveis */}
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {levels.map((level, index) => {
                    const status = getLevelStatus(level);
                    const isMilestone = level % 5 === 0;
                    const starCount = getStarCount(level);

                    return (
                        <View key={level} style={styles.levelWrapper}>
                            {/* Linha conectora */}
                            {index !== 0 && (
                                <View style={[
                                    styles.connector,
                                    status === 'locked' && styles.connectorLocked,
                                    status === 'current' && styles.connectorCurrent,
                                    isMilestone && styles.milestoneConnector,
                                ]} />
                            )}

                            {/* Card do nível */}
                            <TouchableOpacity
                                onPress={() => handleLevelPress(level, status)}
                                activeOpacity={status === 'locked' ? 1 : 0.7}
                                style={[
                                    styles.levelCard,
                                    index % 2 === 0 ? styles.alignLeft : styles.alignRight,
                                    isMilestone && styles.milestoneCard,
                                    status === 'current' && styles.currentLevelCard,
                                    status === 'locked' && styles.lockedLevelCard,
                                ]}
                            >
                                <LinearGradient
                                    colors={getLevelGradient(level, status)}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={[
                                        styles.levelCircle,
                                        isMilestone && styles.milestoneCircle,
                                        status === 'current' && styles.currentLevelCircle,
                                        status === 'locked' && styles.lockedLevelCircle,
                                    ]}
                                >
                                    {status === 'locked' ? (
                                        <Ionicons
                                            name="lock-closed"
                                            size={20}
                                            color="#FFF"
                                        />
                                    ) : isMilestone ? (
                                        <Ionicons
                                            name="trophy"
                                            size={16}
                                            color="#FFF"
                                            style={styles.trophyIcon}
                                        />
                                    ) : null}

                                    {status !== 'locked' && (
                                        <Text style={[
                                            styles.levelText,
                                            status === 'current' && styles.currentLevelText
                                        ]}>
                                            {level}
                                        </Text>
                                    )}
                                </LinearGradient>

                                <View style={styles.levelInfo}>
                                    <View style={styles.levelHeader}>
                                        <Text style={[
                                            styles.levelTitle,
                                            status === 'current' && styles.currentLevelTitle,
                                            status === 'locked' && styles.lockedLevelTitle,
                                            isMilestone && styles.milestoneTitle,
                                        ]}>
                                            {isMilestone ? `Nível ${level} 🏆` : `Nível ${level}`}
                                            {status === 'current' && ' • Atual'}
                                        </Text>

                                        {status === 'locked' && (
                                            <Ionicons
                                                name="lock-closed"
                                                size={14}
                                                color="#6B7280"
                                            />
                                        )}
                                    </View>

                                    {status !== 'locked' && (
                                        <View style={styles.stars}>
                                            {[1, 2, 3].map((star) => (
                                                <Ionicons
                                                    key={star}
                                                    name={star <= starCount ? "star" : "star-outline"}
                                                    size={14}
                                                    color={star <= starCount ? "#FACC15" : "#6B7280"}
                                                />
                                            ))}
                                        </View>
                                    )}

                                    <Text style={[
                                        styles.levelDescription,
                                        status === 'locked' && styles.lockedLevelDescription
                                    ]}>
                                        {getLevelDescription(level, status)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </LinearGradient>
    );
};

// Função auxiliar para descrições dos níveis
const getLevelDescription = (level: number, status: LevelStatus): string => {
    if (status === 'locked') {
        return "Complete o nível anterior para desbloquear";
    }

    const descriptions = [
        "Iniciante", "Básico", "Intermediário", "Avançado", "Expert",
        "Mestre", "Lenda", "Ícone", "Lendário", "Mítico"
    ];
    return descriptions[Math.min(level - 1, descriptions.length - 1)];
};

export default LevelsScreen;