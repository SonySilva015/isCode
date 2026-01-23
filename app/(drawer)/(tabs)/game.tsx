import { useTheme } from '@/context/useTheme';
import {
    Game,
    GameLevel,
    getGameLevels,
    getLocalCourses,
    getQuizGames,
    QuizGame
} from '@/services/game.service';
import { stylesGame } from '@/styles/game';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from "react-native";

// ===== Interfaces =====
interface Practice {
    id: number;
    title: string;
    description: string;
    quizCount: number;
}

interface PracticeWithDetails extends Practice {
    difficulty?: 'easy' | 'medium' | 'hard';
    completed?: boolean;
    progress?: number;
    lastAccessed?: Date;
    topics?: string[];
    courseId?: number | null;
}

// ===== Screen =====
const PracticesScreen = () => {
    const { mode, colors } = useTheme();
    const styles = stylesGame(colors);

    const [practices, setPractices] = useState<PracticeWithDetails[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // ===== Load data (run once) =====
    useEffect(() => {
        const loadPracticesData = async () => {
            try {
                setLoading(true);

                const games: Game[] = await getLocalCourses();

                const allLevels: GameLevel[] = [];
                const allQuizzes: QuizGame[] = [];

                for (const game of games) {
                    const levels = await getGameLevels(game.id);
                    allLevels.push(...levels);

                    for (const level of levels) {
                        const quizzes = await getQuizGames(level.id);
                        allQuizzes.push(...quizzes);
                    }
                }

                const practicesData: PracticeWithDetails[] = games.map(game => {
                    const gameLevels = allLevels.filter(
                        level => level.gameId === game.id
                    );

                    const completedLevels = gameLevels.filter(
                        level => level.status === 'completed'
                    ).length;

                    const totalLevels = gameLevels.length;

                    const progress =
                        totalLevels > 0
                            ? Math.round((completedLevels / totalLevels) * 100)
                            : 0;

                    const gameQuizzes = allQuizzes.filter(quiz => {
                        const level = allLevels.find(l => l.id === quiz.game_fk);
                        return level?.gameId === game.id;
                    });

                    const difficulty = determineDifficulty(
                        gameLevels.length,
                        gameQuizzes.length
                    );

                    return {
                        id: game.id,
                        title: game.title || `Prática ${game.id}`,
                        description: game.desc || 'Pratique seus conhecimentos',
                        quizCount: gameQuizzes.length,
                        difficulty,
                        completed: progress === 100,
                        progress,
                        lastAccessed: new Date(),
                        topics: ['Python', 'Programação', 'Lógica'],
                        courseId: game.courseId || null
                    };
                });

                setPractices(practicesData);
            } catch (error) {
                console.error('Erro ao carregar práticas:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPracticesData();
    }, []);

    // ===== Helpers =====
    const determineDifficulty = (
        levelsCount: number,
        quizzesCount: number
    ): 'easy' | 'medium' | 'hard' => {
        const totalItems = levelsCount + quizzesCount;
        if (totalItems <= 5) return 'easy';
        if (totalItems <= 15) return 'medium';
        return 'hard';
    };

    const sortedPractices = [...practices].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return (b.progress || 0) - (a.progress || 0);
    });

    const handleStartPractice = (practiceId: number) => {
        router.push(`/game/level/${practiceId}`);
    };

    const renderTopics = (topics: string[] = []) => (
        <View style={styles.topicsContainer}>
            {topics.map((topic, index) => (
                <View key={index} style={styles.topicBadge}>
                    <Ionicons name="pricetag" size={12} color="#6B7280" />
                    <Text style={styles.topicText}>{topic}</Text>
                </View>
            ))}
        </View>
    );

    // ===== Loading =====
    if (loading) {
        return (
            <LinearGradient
                colors={[
                    colors.gradient.primary,
                    colors.gradient.second,
                    mode === 'dark' ? colors.card : colors.gradient.second
                ]}
                style={[
                    styles.container,
                    { justifyContent: 'center', alignItems: 'center' }
                ]}
            >
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.text, marginTop: 16 }}>
                    Carregando práticas...
                </Text>
            </LinearGradient>
        );
    }

    // ===== UI =====
    return (
        <LinearGradient
            colors={[
                colors.gradient.primary,
                colors.gradient.second,
                mode === 'dark' ? colors.card : colors.gradient.second
            ]}
            style={styles.container}
        >
            <StatusBar
                barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />

            <View style={styles.header}>
                <Text style={styles.title}>Práticas de Programação</Text>
                <Text style={styles.subtitle}>Aprimore suas habilidades</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.practicesList}
                showsVerticalScrollIndicator={false}
            >
                {sortedPractices.map((practice, index) => (
                    <TouchableOpacity
                        key={practice.id}
                        onPress={() => handleStartPractice(practice.id)}
                        activeOpacity={0.7}
                        style={[
                            styles.practiceCard,
                            practice.completed && styles.practiceCardCompleted,
                            index === 0 && styles.firstPracticeCard
                        ]}
                    >
                        <View style={styles.practiceOrder}>
                            <Text style={styles.practiceOrderText}>
                                {index + 1}
                            </Text>
                        </View>

                        <View style={styles.practiceHeader}>
                            <View style={styles.practiceTitleContainer}>
                                <Text
                                    style={[
                                        styles.practiceTitle,
                                        practice.completed &&
                                        styles.practiceTitleCompleted
                                    ]}
                                >
                                    {practice.title}
                                </Text>

                                {practice.completed && (
                                    <View style={styles.completedBadge}>
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={16}
                                            color="#10B981"
                                        />
                                        <Text style={styles.completedText}>
                                            Concluído
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <Text style={styles.practiceDescription}>
                            {practice.description}
                        </Text>

                        {renderTopics(practice.topics)}

                        <View style={styles.practiceMeta}>
                            <View style={styles.quizCount}>
                                <Ionicons
                                    name="document-text"
                                    size={16}
                                    color={colors.textSecondary}
                                />
                                <Text style={styles.quizCountText}>
                                    {practice.quizCount} quizzes
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() =>
                                handleStartPractice(practice.id)
                            }
                            style={[
                                styles.startButton,
                                practice.completed &&
                                styles.reviewButton
                            ]}
                        >
                            <Text style={styles.startButtonText}>
                                {practice.completed
                                    ? 'Revisar'
                                    : 'Iniciar Módulo'}
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={16}
                                color="#FFF"
                                style={styles.buttonIcon}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}

                {sortedPractices.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="book-outline"
                            size={64}
                            color={colors.textSecondary}
                        />
                        <Text style={styles.emptyStateText}>
                            Nenhuma prática disponível
                        </Text>
                        <Text style={styles.emptyStateSubtext}>
                            Adicione práticas ao banco de dados
                        </Text>
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
};

export default PracticesScreen;
