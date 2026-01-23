import { useTheme } from '@/context/useTheme';
import {
    getGameById,
    getGameLevels,
    type GameLevel as DBGameLevel
} from '@/services/game.service';
import { stylesGame } from '@/styles/game';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// ================= Interfaces =================
interface Level {
    id: number;
    level: number;
    status: 'locked' | 'opened' | 'completed';
    gameId: number;
}

// ================= Utils =================
const mapStatus = (status: string | null): 'locked' | 'opened' | 'completed' => {
    if (!status) return 'locked';

    switch (status.toLowerCase()) {
        case 'completed':
        case 'concluído':
        case 'concluido':
            return 'completed';
        case 'in_progress':
        case 'opened':
        case 'em_andamento':
        case 'progresso':
            return 'opened';
        default:
            return 'locked';
    }
};

// ================= Screen =================
const GameLevelsScreen = () => {
    const { mode, colors } = useTheme();
    const styles = stylesGame(colors);

    const { id } = useLocalSearchParams<{ id: string }>();
    const gameId = Number(id);

    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);
    const [gameTitle, setGameTitle] = useState('');
    const [completedLevels, setCompletedLevels] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // ================= Função para carregar dados =================
    const loadLevelsData = useCallback(async () => {
        if (isNaN(gameId)) return;

        try {
            setLoading(true);

            const [dbGame, dbLevels] = await Promise.all([
                getGameById(gameId),
                getGameLevels(gameId)
            ]);

            if (dbGame) {
                setGameTitle(
                    dbGame.title ||
                    dbGame.desc ||
                    'Jogo de Programação'
                );
            }

            if (!dbLevels || dbLevels.length === 0) {
                setLevels([]);
                setCompletedLevels(0);
                return;
            }

            const uiLevels: Level[] = dbLevels.map((dbLevel: DBGameLevel) => ({
                id: dbLevel.id,
                level: dbLevel.level || 0,
                status: mapStatus(dbLevel.status),
                gameId: dbLevel.gameId || gameId
            }));

            uiLevels.sort((a, b) => a.level - b.level);

            // ===== Lógica sequencial =====
            let lastCompletedIndex = -1;

            for (let i = 0; i < uiLevels.length; i++) {
                if (uiLevels[i].status === 'completed') {
                    lastCompletedIndex = i;
                } else {
                    break;
                }
            }

            if (lastCompletedIndex < uiLevels.length - 1) {
                uiLevels[lastCompletedIndex + 1].status = 'opened';
            }

            for (let i = lastCompletedIndex + 2; i < uiLevels.length; i++) {
                uiLevels[i].status = 'locked';
            }

            setLevels(uiLevels);
            setCompletedLevels(
                uiLevels.filter(l => l.status === 'completed').length
            );

        } catch (error) {
            console.error('Erro ao carregar níveis:', error);
            setLevels([]);
            setCompletedLevels(0);
            setGameTitle('Erro ao carregar');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [gameId]);

    // ================= Carregar dados ao entrar na tela =================
    useEffect(() => {
        loadLevelsData();
    }, [loadLevelsData]);

    // ================= Atualizar sempre que a tela ganhar foco =================
    useFocusEffect(
        useCallback(() => {
            // Carrega os dados sempre que a tela receber foco
            loadLevelsData();

            // Opcional: Você pode adicionar um debounce se a atualização for muito frequente
            // const timer = setTimeout(() => loadLevelsData(), 300);
            // return () => clearTimeout(timer);
        }, [loadLevelsData])
    );

    // ================= Função para recarregar manualmente =================
    const handleRefresh = () => {
        setIsRefreshing(true);
        loadLevelsData();
    };

    // ================= Actions =================
    const handleStartLevel = (level: Level) => {
        if (level.status === 'locked') return;
        router.push(`/game/${level.id}`);
    };

    // ================= UI =================
    const renderLevelCard = (level: Level, index: number) => (
        <View key={level.id} style={styles.levelWrapper}>
            {index > 0 && (
                <View
                    style={[
                        styles.connector,
                        level.status === 'locked' && styles.connectorLocked,
                        level.status === 'opened' && styles.connectorCurrent,
                        level.status === 'completed' && { backgroundColor: '#10B981' }
                    ]}
                />
            )}

            <TouchableOpacity
                onPress={() => handleStartLevel(level)}
                disabled={level.status === 'locked'}
                style={[
                    styles.levelCard,
                    level.status === 'opened' && styles.currentLevelCard,
                    level.status === 'locked' && styles.lockedLevelCard,
                    index % 2 === 0 ? styles.alignLeft : styles.alignRight
                ]}
            >
                <View
                    style={[
                        styles.levelCircle,
                        {
                            backgroundColor:
                                level.status === 'completed'
                                    ? '#10B981'
                                    : level.status === 'opened'
                                        ? colors.primary
                                        : '#6B7280'
                        }
                    ]}
                >
                    <Text style={styles.levelText}>{level.level}</Text>
                </View>

                <View style={styles.levelInfo}>
                    <View style={styles.statusContainer}>
                        <View style={styles.statusBadge}>
                            <Ionicons
                                name={
                                    level.status === 'completed'
                                        ? 'checkmark-circle'
                                        : level.status === 'opened'
                                            ? 'play-circle'
                                            : 'lock-closed'
                                }
                                size={14}
                                color={
                                    level.status === 'completed'
                                        ? '#10B981'
                                        : level.status === 'opened'
                                            ? colors.primary
                                            : '#9CA3AF'
                                }
                            />
                            <Text style={styles.statusText}>
                                {level.status === 'completed'
                                    ? 'Concluído'
                                    : level.status === 'opened'
                                        ? 'Começar'
                                        : 'Bloqueado'}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    // ================= Loading =================
    if (loading && !isRefreshing) {
        return (
            <LinearGradient
                colors={[
                    colors.gradient.primary,
                    colors.gradient.second,
                    mode === 'dark' ? colors.card : colors.gradient.second
                ]}
                style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}
            >
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.text, marginTop: 16 }}>
                    Carregando níveis...
                </Text>
            </LinearGradient>
        );
    }

    // ================= Render =================
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
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { marginLeft: 10, flex: 1 }]}>
                        {gameTitle}
                    </Text>

                    {/* Botão de atualizar */}
                    <TouchableOpacity onPress={handleRefresh} disabled={isRefreshing}>
                        <Ionicons
                            name="refresh"
                            size={24}
                            color={isRefreshing ? colors.textSecondary : colors.primary}
                        />
                    </TouchableOpacity>
                </View>


            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={[colors.text]}
                        tintColor={colors.text}
                    />
                }
            >
                {levels.length === 0 ? (
                    <View style={styles.finalMessage}>
                        <Ionicons name="alert-circle-outline" size={48} color={colors.primary} />
                        <Text style={styles.finalMessageText}>
                            Nenhum nível disponível para este jogo.
                        </Text>
                        <TouchableOpacity
                            style={[styles.startButton, { marginTop: 16 }]}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.startButtonText}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {levels.map(renderLevelCard)}

                        {completedLevels === levels.length && (
                            <View style={styles.finalMessage}>
                                <Ionicons name="trophy-outline" size={48} color={colors.primary} />
                                <Text style={styles.finalMessageText}>
                                    Parabéns! Você completou todos os níveis deste módulo 🎉
                                </Text>
                                <TouchableOpacity
                                    style={[styles.startButton, { marginTop: 16 }]}
                                    onPress={() => router.push('/game')}
                                >
                                    <Text style={styles.startButtonText}>
                                        Voltar para Práticas
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </LinearGradient>
    );
};

export default GameLevelsScreen;