// game-screen.tsx
import { useTheme } from '@/context/useTheme';
import {
    getCurrentLevel, handleCompleteLesson
} from '@/function/game_quiz';
import { QuizGame as DBQuizGame, getGameLevelById, getQuizGames } from '@/services/game.service';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Keyboard,
    Modal,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// =======================
// Types & Interfaces
// =======================

interface Flashcard {
    id: number;
    question: string;
    answer: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

interface GameStats {
    score: number;
    streak: number;
    maxStreak: number;
    hintsUsed: number;
    correctAnswers: number;
    totalAnswers: number;
}

// =======================
// Utility Functions
// =======================

const mapQuizToFlashcard = (quiz: DBQuizGame, index: number): Flashcard => {
    let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
    if (index >= 8) difficulty = 'hard';
    else if (index >= 3) difficulty = 'medium';

    return {
        id: quiz.id,
        question: quiz.question,
        answer: quiz.answer,
        difficulty: difficulty,
    };
};

// =======================
// Modal Components
// =======================

interface LevelCompleteModalProps {
    visible: boolean;
    level: number;
    stats: GameStats;
    xpEarned: number;
    totalCards: number;
    onRestart: () => void;
    onNextLevel: () => void;
}

const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
    visible,
    level,
    stats,
    xpEarned,
    totalCards,
    onRestart,
    onNextLevel
}) => {
    const perfectScoreBonus = stats.correctAnswers === totalCards ? 15 : 0;
    const totalXP = xpEarned + perfectScoreBonus;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <LinearGradient
                        colors={['#10B981', '#059669', '#047857']}
                        style={styles.modalHeader}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.modalIconContainer}>
                            <Ionicons name="trophy" size={48} color="#FFF" />
                        </View>
                        <Text style={styles.modalTitle}>Nível Concluído!</Text>
                        <Text style={styles.modalSubtitle}>
                            Excelente trabalho no Nível {level}
                        </Text>
                    </LinearGradient>

                    <View style={styles.modalBody}>
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <Ionicons name="star" size={20} color="#FACC15" />
                                <Text style={styles.statCardValue}>{stats.score}</Text>
                                <Text style={styles.statCardLabel}>Pontuação</Text>
                            </View>

                            <View style={styles.statCard}>
                                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                <Text style={styles.statCardValue}>{stats.correctAnswers}/{totalCards}</Text>
                                <Text style={styles.statCardLabel}>Acertos</Text>
                            </View>

                            <View style={styles.statCard}>
                                <Ionicons name="flame" size={20} color="#F97316" />
                                <Text style={styles.statCardValue}>{stats.maxStreak}</Text>
                                <Text style={styles.statCardLabel}>Maior Streak</Text>
                            </View>
                        </View>

                        <View style={styles.xpContainer}>
                            <Text style={styles.xpTitle}>XP Ganho</Text>
                            <View style={styles.xpBreakdown}>
                                <View style={styles.xpRow}>
                                    <Text style={styles.xpLabel}>Acertos ({stats.correctAnswers} × 5 XP)</Text>
                                    <Text style={styles.xpValue}>{stats.correctAnswers * 5} XP</Text>
                                </View>
                                {perfectScoreBonus > 0 && (
                                    <View style={styles.xpRow}>
                                        <Text style={styles.xpLabel}>Bônus de Perfeição</Text>
                                        <Text style={styles.xpValue}>+{perfectScoreBonus} XP</Text>
                                    </View>
                                )}
                                <View style={styles.totalXpRow}>
                                    <Text style={styles.totalXpLabel}>Total XP</Text>
                                    <Text style={styles.totalXpValue}>{totalXP} XP</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.secondaryButton]}
                                onPress={onRestart}
                            >
                                <Ionicons name="refresh" size={20} color="#059669" />
                                <Text style={styles.secondaryButtonText}>Revisar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.primaryButton]}
                                onPress={onNextLevel}
                            >
                                <Ionicons name="arrow-forward" size={20} color="#FFF" />
                                <Text style={styles.primaryButtonText}>Próximo Nível</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

interface LevelFailedModalProps {
    visible: boolean;
    score: number;
    correctAnswers: number;
    totalCards: number;
    xpEarned: number;
    onRestart: () => void;
}

const LevelFailedModal: React.FC<LevelFailedModalProps> = ({
    visible,
    score,
    correctAnswers,
    totalCards,
    xpEarned,
    onRestart
}) => {
    const requiredCorrect = Math.ceil(totalCards * 0.7);
    const missingCorrect = requiredCorrect - correctAnswers;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <LinearGradient
                        colors={['#F59E0B', '#D97706', '#B45309']}
                        style={styles.modalHeader}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={styles.modalIconContainer}>
                            <Ionicons name="alert-circle" size={48} color="#FFF" />
                        </View>
                        <Text style={styles.modalTitle}>Continue Praticando</Text>
                        <Text style={styles.modalSubtitle}>
                            Faltaram {missingCorrect} acertos para passar
                        </Text>
                    </LinearGradient>

                    <View style={styles.modalBody}>
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <Ionicons name="checkmark-circle" size={20} color={correctAnswers >= requiredCorrect ? '#10B981' : '#EF4444'} />
                                <Text style={styles.statCardValue}>{correctAnswers}/{totalCards}</Text>
                                <Text style={styles.statCardLabel}>Seus Acertos</Text>
                            </View>

                            <View style={styles.statCard}>
                                <Ionicons name="flag" size={20} color="#6B7280" />
                                <Text style={styles.statCardValue}>{requiredCorrect}/{totalCards}</Text>
                                <Text style={styles.statCardLabel}>Necessário</Text>
                            </View>

                            <View style={styles.statCard}>
                                <Ionicons name="trending-up" size={20} color="#8B5CF6" />
                                <Text style={styles.statCardValue}>{xpEarned}</Text>
                                <Text style={styles.statCardLabel}>XP Ganho</Text>
                            </View>
                        </View>

                        <View style={styles.tipContainer}>
                            <Ionicons name="bulb" size={24} color="#F59E0B" />
                            <Text style={styles.tipText}>
                                Revise as respostas e tente novamente para ganhar o bônus de 15 XP!
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.primaryButton, { backgroundColor: '#F59E0B' }]}
                            onPress={onRestart}
                        >
                            <Ionicons name="refresh" size={20} color="#FFF" />
                            <Text style={styles.primaryButtonText}>Tentar Novamente</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// =======================
// Main Component
// =======================

export default function GameScreen() {
    const { id } = useLocalSearchParams();
    const { mode, colors } = useTheme();
    const levelId = parseInt(id as string) || 1;

    // State Management
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [gameStats, setGameStats] = useState<GameStats>({
        score: 0,
        streak: 0,
        maxStreak: 0,
        hintsUsed: 0,
        correctAnswers: 0,
        totalAnswers: 0
    });

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFailedModal, setShowFailedModal] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [answerResult, setAnswerResult] = useState<'correct' | 'incorrect' | null>(null);
    const [loading, setLoading] = useState(true);
    const [levelNumber, setLevelNumber] = useState(1);
    const [gameTitle, setGameTitle] = useState('Python');
    const [userLevel, setUserLevel] = useState({ level: 1, xp: 0 });
    const [xpEarned, setXpEarned] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Refs
    const answerInputRef = useRef<TextInput>(null);
    const feedbackAnim = useRef(new Animated.Value(0)).current;
    const flipAnim = useRef(new Animated.Value(0)).current;

    const currentCard = cards[currentCardIndex];

    // =======================
    // Effects
    // =======================

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (cards.length > 0 && !isFlipped) {
            setTimeout(() => {
                answerInputRef.current?.focus();
            }, 300);
        }
    }, [currentCardIndex, cards.length, isFlipped]);

    // Flip animation interpolation
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
        transform: [{ rotateY: backInterpolate }],
    };

    // =======================
    // Data Loading
    // =======================

    const loadInitialData = async () => {
        try {
            setLoading(true);
            await loadUserProgress();
            await loadQuizData();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os dados do jogo.');
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUserProgress = async () => {
        try {
            const progress = await getCurrentLevel();
            if (progress) {
                setUserLevel(progress);
            }
        } catch (error) {
            console.error('Erro ao carregar progresso:', error);
        }
    };

    const loadQuizData = async () => {
        try {
            setGameStats({
                score: 0,
                streak: 0,
                maxStreak: 0,
                hintsUsed: 0,
                correctAnswers: 0,
                totalAnswers: 0
            });
            setCurrentCardIndex(0);
            setUserAnswer('');
            setAnswerResult(null);
            setIsFlipped(false);
            setXpEarned(0);
            flipAnim.setValue(0);

            const dbLevel = await getGameLevelById(levelId);
            if (dbLevel) {
                setLevelNumber(dbLevel.level || 1);
            }

            const dbQuizzes = await getQuizGames(levelId);

            if (dbQuizzes.length > 0) {
                const flashcards = dbQuizzes.map((quiz, index) => mapQuizToFlashcard(quiz, index));
                setCards(flashcards);
                setGameTitle(`Python - Nível ${dbLevel?.level || 1}`);
            } else {
                Alert.alert('Aviso', 'Nenhum quiz encontrado para este nível.');
            }
        } catch (error) {
            throw error;
        }
    };

    // =======================
    // Game Logic
    // =======================

    const checkAnswer = useCallback(() => {
        if (!userAnswer.trim()) {
            Alert.alert('Ops!', 'Por favor, digite sua resposta.');
            return;
        }

        const normalizedUserAnswer = userAnswer.trim().toLowerCase();
        const normalizedCorrectAnswer = currentCard.answer.toLowerCase();

        const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

        setAnswerResult(isCorrect ? 'correct' : 'incorrect');
        handleAnswerResult(isCorrect);
    }, [currentCard, userAnswer, gameStats.streak]);

    const handleAnswerResult = (isCorrect: boolean) => {
        const newTotalAnswers = gameStats.totalAnswers + 1;
        const newCorrectAnswers = isCorrect ? gameStats.correctAnswers + 1 : gameStats.correctAnswers;
        const newStreak = isCorrect ? gameStats.streak + 1 : 0;
        const newMaxStreak = Math.max(gameStats.maxStreak, newStreak);

        if (isCorrect) {
            const newScore = gameStats.score + 5;

            setGameStats(prev => ({
                ...prev,
                score: newScore,
                streak: newStreak,
                maxStreak: newMaxStreak,
                correctAnswers: newCorrectAnswers,
                totalAnswers: newTotalAnswers
            }));

            // Quando acertar, apenas mostrar a resposta por 1.5 segundos e ir para próxima
            flipCard();
            setAnswerResult('correct');

            animateFeedback(() => {
                if (currentCardIndex === cards.length - 1) {
                    completeLevel(newScore, newCorrectAnswers);
                } else {
                    nextCard();
                }
            }, 1500); // Reduzir tempo para 1.5 segundos
        } else {
            // Mostrar resposta ao errar - card com background vermelho
            flipCard();
            setAnswerResult('incorrect');

            setGameStats(prev => ({
                ...prev,
                streak: 0,
                totalAnswers: newTotalAnswers
            }));

            animateFeedback(() => {
                setTimeout(() => {
                    if (currentCardIndex === cards.length - 1) {
                        completeLevel(gameStats.score, gameStats.correctAnswers);
                    } else {
                        nextCard();
                    }
                }, 3000);
            }, 3000);
        }
    };

    const completeLevel = async (finalScore: number, correctAnswers: number) => {
        const accuracy = (correctAnswers / cards.length) * 100;
        const xpPerQuestion = 5;
        const xpEarnedValue = correctAnswers * xpPerQuestion;
        setXpEarned(xpEarnedValue);

        if (correctAnswers === cards.length) {
            setXpEarned(prev => prev < xpEarnedValue ? xpEarnedValue : prev);
        }

        await handleCompleteLesson(levelId, xpEarnedValue);

        if (accuracy >= 70) {
            setShowSuccessModal(true);
        } else {
            setShowFailedModal(true);
        }
    };

    const nextCard = () => {
        setCurrentCardIndex(prev => prev + 1);
        setUserAnswer('');
        setAnswerResult(null);
        setIsFlipped(false);
        flipAnim.setValue(0);
        feedbackAnim.setValue(0);
    };

    // =======================
    // Flip Animation
    // =======================

    const flipCard = () => {
        setIsFlipped(!isFlipped);
        Animated.spring(flipAnim, {
            toValue: isFlipped ? 0 : 180,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    };

    // =======================
    // Animations
    // =======================

    const animateFeedback = (callback: () => void, delay: number = 1500) => {
        Animated.sequence([
            Animated.timing(feedbackAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.delay(delay),
            Animated.timing(feedbackAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            })
        ]).start(callback);
    };


    // =======================
    // Event Handlers
    // =======================

    const handleRestart = () => {
        loadQuizData();
        setShowSuccessModal(false);
        setShowFailedModal(false);
    };

    const handleNextLevel = () => {
        const nextLevel = levelNumber + 1;
        router.push(`/game/${nextLevel}`);
    };

    const handleSubmitAnswer = () => {
        checkAnswer();
    };

    const handleSkip = () => {
        flipCard();
        setAnswerResult('incorrect');

        setGameStats(prev => ({
            ...prev,
            streak: 0,
            totalAnswers: prev.totalAnswers + 1
        }));

        animateFeedback(() => {
            setTimeout(() => {
                if (currentCardIndex === cards.length - 1) {
                    completeLevel(gameStats.score, gameStats.correctAnswers);
                } else {
                    nextCard();
                }
            }, 3000);
        }, 3000);
    };

    const handleBackToLevels = () => {
        router.back();
    };

    // =======================
    // Loading State
    // =======================

    if (loading) {
        return (
            <>
                <Stack.Screen
                    options={{
                        title: '',
                        headerShadowVisible: false,
                        headerShown: false,
                    }}
                />
                <LinearGradient
                    colors={[
                        colors.gradient.primary,
                        colors.gradient.second,
                        mode === 'dark' ? colors.card : colors.gradient.second,
                    ]}
                    style={styles.loadingContainer}
                >
                    <View style={styles.loadingContent}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[styles.loadingText, { color: colors.text }]}>
                            Preparando o jogo...
                        </Text>
                    </View>
                </LinearGradient>
            </>
        );
    }

    // =======================
    // Render
    // =======================

    return (
        <>
            <Stack.Screen
                options={{
                    title: '',
                    headerShadowVisible: false,
                    headerShown: false,
                }}
            />

            <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <LinearGradient
                            colors={[
                                colors.gradient.primary,
                                colors.gradient.second,
                                mode === 'dark' ? colors.card : colors.gradient.second,
                            ]}
                            style={styles.gradientBackground}
                        >
                            <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />

                            {/* Header - Fixo no topo */}
                            <View style={[
                                styles.header,
                                { backgroundColor: mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)' }
                            ]}>
                                <View style={styles.headerLeft}>
                                    <TouchableOpacity
                                        style={styles.backButton}
                                        onPress={handleBackToLevels}
                                    >
                                        <Ionicons name="arrow-back" size={24} color={'white'} />
                                    </TouchableOpacity>

                                    <View style={styles.gameInfo}>
                                        <Text style={[styles.gameTitle, { color: 'white' }]}>
                                            {gameTitle}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.headerRight}>
                                    <View style={[styles.levelBadge, { backgroundColor: colors.primary + '20' }]}>
                                        <Ionicons name="trending-up" size={14} color={'white'} />
                                        <Text style={[styles.levelText, { color: 'white' }]}>
                                            Nv {userLevel.level}
                                        </Text>
                                    </View>

                                    {gameStats.streak > 0 && (
                                        <View style={styles.streakBadge}>
                                            <Ionicons name="flame" size={14} color="#F97316" />
                                            <Text style={styles.streakText}>×{gameStats.streak}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Conteúdo principal SEM KeyboardAvoidingView */}
                            <View style={styles.mainContent}>
                                {/* Flashcard com posição fixa */}
                                <View style={styles.flashcardContainer}>
                                    <View style={styles.flashcardWrapper}>
                                        <Animated.View
                                            style={[
                                                styles.flashcard,
                                                frontAnimatedStyle,
                                                {
                                                    backgroundColor: colors.card,
                                                    opacity: isFlipped ? 0 : 1
                                                }
                                            ]}
                                            pointerEvents={isFlipped ? "none" : "auto"}
                                        >
                                            <View style={styles.cardContent}>
                                                {/* Card Header com botões */}
                                                <View style={styles.cardHeader}>
                                                    {/* Botão Pular - Esquerda */}
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.cardHeaderButton,
                                                            styles.skipButtonHeader,
                                                            {
                                                                borderColor: colors.primary,
                                                                opacity: (answerResult || isFlipped) ? 0.5 : 1
                                                            }
                                                        ]}
                                                        onPress={handleSkip}
                                                        disabled={!!answerResult || isFlipped}
                                                    >
                                                        <View style={styles.buttonIconSmall}>
                                                            <Ionicons name="arrow-forward" size={16} color={mode === 'dark' ? 'white' : colors.primary} />
                                                        </View>
                                                        <Text style={[styles.skipButtonText, { color: mode === 'dark' ? 'white' : colors.primary }]}>
                                                            Pular
                                                        </Text>
                                                    </TouchableOpacity>

                                                    {/* Número da pergunta - Centro */}
                                                    <View style={[styles.questionNumberBadge, { backgroundColor: colors.primary + '20' }]}>
                                                        <Text style={[styles.questionNumberText, { color: 'white' }]}>
                                                            {currentCardIndex + 1}/{cards.length}
                                                        </Text>
                                                    </View>

                                                    {/* Botão Enviar - Direita */}
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.cardHeaderButton,
                                                            styles.submitButtonHeader,
                                                            {
                                                                backgroundColor: colors.primary,
                                                                opacity: (answerResult || isFlipped) ? 0.5 : 1
                                                            }
                                                        ]}
                                                        onPress={handleSubmitAnswer}
                                                        disabled={!!answerResult || isFlipped}
                                                    >
                                                        <View style={styles.buttonIconSmall}>
                                                            <Ionicons name="send" size={16} color="#FFF" />
                                                        </View>
                                                        <Text style={styles.submitButtonText}>
                                                            Enviar
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>

                                                {/* Conteúdo da pergunta */}
                                                <View style={styles.questionContainer}>
                                                    <View style={styles.questionHeader}>
                                                        <View style={[styles.difficultyBadge, { backgroundColor: colors.primary }]}>
                                                            <Ionicons name="help-circle" size={14} color="#FFF" />
                                                            <Text style={styles.difficultyText}>
                                                                PERGUNTA
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    <Text style={[styles.question, { color: colors.text }]}>
                                                        {currentCard?.question}
                                                    </Text>

                                                    <View style={styles.answerSection}>
                                                        <View style={styles.inputContainer}>
                                                            <Text style={[styles.inputLabel, { color: colors.text }]}>
                                                                Digite sua resposta:
                                                            </Text>
                                                            <TextInput
                                                                ref={answerInputRef}
                                                                style={[
                                                                    styles.answerInput,
                                                                    {
                                                                        backgroundColor: colors.inputBackground || colors.background,
                                                                        color: colors.text,
                                                                        borderColor: answerResult === 'correct' ? '#10B981' :
                                                                            answerResult === 'incorrect' ? '#EF4444' : colors.primary
                                                                    }
                                                                ]}
                                                                value={userAnswer}
                                                                onChangeText={setUserAnswer}
                                                                placeholder="Digite sua resposta aqui..."
                                                                placeholderTextColor={colors.text + '60'}
                                                                autoCapitalize="none"
                                                                autoCorrect={false}
                                                                onSubmitEditing={handleSubmitAnswer}
                                                                returnKeyType="send"
                                                                autoFocus={true}
                                                                editable={!answerResult}
                                                            />
                                                            <View style={styles.inputHelper}>

                                                                <Text style={[styles.helperText, { color: colors.text + '60' }]}>
                                                                    Pressione Enter para enviar
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </Animated.View>

                                        {/* Card Back - MODIFICADO */}
                                        <Animated.View
                                            style={[
                                                styles.flashcard,
                                                styles.flashcardBack,
                                                backAnimatedStyle,
                                                {
                                                    backgroundColor: answerResult === 'correct' ? '#10B981' :
                                                        answerResult === 'incorrect' ? '#EF4444' :
                                                            colors.card,
                                                    opacity: isFlipped ? 1 : 0
                                                }
                                            ]}
                                            pointerEvents={isFlipped ? "auto" : "none"}
                                        >
                                            <View style={styles.cardContent}>
                                                <View style={styles.cardHeader}>
                                                    {/* Espaço vazio na esquerda */}
                                                    <View style={styles.cardHeaderButtonPlaceholder} />

                                                    {/* Número da pergunta - Centro */}
                                                    <View style={[styles.questionNumberBadge, {
                                                        backgroundColor: answerResult === 'correct' ? 'rgba(255, 255, 255, 0.3)' :
                                                            answerResult === 'incorrect' ? 'rgba(255, 255, 255, 0.3)' :
                                                                colors.primary + '20'
                                                    }]}>
                                                        <Text style={[styles.questionNumberText, {
                                                            color: answerResult === 'correct' || answerResult === 'incorrect' ? '#FFF' : colors.primary
                                                        }]}>
                                                            {currentCardIndex + 1}/{cards.length}
                                                        </Text>
                                                    </View>

                                                    {/* Botão Voltar - Direita */}
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.cardHeaderButton,
                                                            styles.returnButtonHeader,
                                                            {
                                                                backgroundColor: answerResult === 'correct' ? '#059669' :
                                                                    answerResult === 'incorrect' ? '#DC2626' :
                                                                        colors.primary
                                                            }
                                                        ]}
                                                        onPress={flipCard}
                                                    >
                                                        <View style={styles.buttonIconSmall}>
                                                            <Ionicons name="arrow-back" size={16} color="#FFF" />
                                                        </View>
                                                        <Text style={styles.submitButtonText}>
                                                            Voltar
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>

                                                <View style={styles.answerContainer}>
                                                    <View style={styles.answerHeader}>
                                                        <View style={[styles.answerIconContainer, {
                                                            backgroundColor: answerResult === 'correct' ? 'rgba(255, 255, 255, 0.3)' :
                                                                answerResult === 'incorrect' ? 'rgba(255, 255, 255, 0.3)' :
                                                                    'rgba(16, 185, 129, 0.1)'
                                                        }]}>
                                                            <Ionicons
                                                                name={answerResult === 'correct' ? "checkmark-circle" : "close-circle"}
                                                                size={28}
                                                                color={answerResult === 'correct' || answerResult === 'incorrect' ? "#FFF" : "#10B981"}
                                                            />
                                                        </View>
                                                        <Text style={[styles.answerTitle, {
                                                            color: answerResult === 'correct' || answerResult === 'incorrect' ? "#FFF" : colors.text
                                                        }]}>
                                                            {answerResult === 'correct' ? 'Parabéns!' : 'Errou! a resposta é:'}
                                                        </Text>
                                                    </View>

                                                    <View style={[styles.answerBox,
                                                    {
                                                        backgroundColor: answerResult === 'correct' ? 'rgba(255, 255, 255, 0.2)' :
                                                            answerResult === 'incorrect' ? 'rgba(255, 255, 255, 0.2)' :
                                                                mode === 'dark' ? '#1E293B' : '#F1F5F9',
                                                        borderColor: answerResult === 'correct' ? 'rgba(255, 255, 255, 0.4)' :
                                                            answerResult === 'incorrect' ? 'rgba(255, 255, 255, 0.4)' :
                                                                mode === 'dark' ? '#334155' : '#E2E8F0'
                                                    }
                                                    ]}>
                                                        <Text style={[styles.correctAnswer, {
                                                            color: answerResult === 'correct' || answerResult === 'incorrect' ? "#FFF" : colors.text
                                                        }]}>
                                                            {currentCard?.answer}
                                                        </Text>
                                                    </View>

                                                    <View style={styles.answerHint}>
                                                        <Ionicons
                                                            name="information-circle"
                                                            size={18}
                                                            color={answerResult === 'correct' || answerResult === 'incorrect' ? "rgba(255, 255, 255, 0.8)" : colors.text + '80'}
                                                        />
                                                        <Text style={[styles.answerHintText, {
                                                            color: answerResult === 'correct' || answerResult === 'incorrect' ? "rgba(255, 255, 255, 0.8)" : colors.text + '80'
                                                        }]}>
                                                            {answerResult === 'incorrect' ? 'Sua resposta estava incorreta' : answerResult === 'correct' ? 'Parabéns! Resposta correta!' : 'Esta é a resposta correta'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </Animated.View>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </TouchableWithoutFeedback>

                {/* Modals */}
                <LevelCompleteModal
                    visible={showSuccessModal}
                    level={levelNumber}
                    stats={gameStats}
                    xpEarned={xpEarned}
                    totalCards={cards.length}
                    onRestart={handleRestart}
                    onNextLevel={handleNextLevel}
                />

                <LevelFailedModal
                    visible={showFailedModal}
                    score={gameStats.score}
                    correctAnswers={gameStats.correctAnswers}
                    totalCards={cards.length}
                    xpEarned={xpEarned}
                    onRestart={handleRestart}
                />
            </View>
        </>
    );
}

// =======================
// Styles
// =======================

const styles = StyleSheet.create({
    // Layout
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContent: {
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        paddingBottom: 16,
        borderBottomWidth: 1,
        zIndex: 10,
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    gameInfo: {
        flex: 1,
    },
    gameTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    progressContainer: {
        alignItems: 'center',
    },
    progressBar: {
        width: '90%',
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '500',
        opacity: 0.8,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    levelText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
        color: '#fff',
    },
    scoreBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    scoreText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        borderRadius: 10,
    },
    streakText: {
        color: '#F97316',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 2,
    },

    // Main Content - FIXO
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 150 : 200,
    },
    flashcardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    flashcardWrapper: {
        width: SCREEN_WIDTH * 0.9,
        maxHeight: SCREEN_HEIGHT * 0.6,
        minHeight: SCREEN_HEIGHT * 0.5,
        position: 'relative',
    },
    flashcard: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 20,
        padding: 20,
        backfaceVisibility: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    flashcardBack: {
        backgroundColor: '#FFF',
    },
    cardContent: {
        flex: 1,
    },

    // Card Header com botões
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardHeaderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        minWidth: 90,
    },
    cardHeaderButtonPlaceholder: {
        width: 90,
    },
    skipButtonHeader: {
        borderWidth: 1.5,
        backgroundColor: 'transparent',
    },
    submitButtonHeader: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    returnButtonHeader: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonIconSmall: {
        marginRight: 6,
    },
    questionNumberBadge: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Question Container
    questionContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    questionHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    difficultyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    difficultyText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    question: {
        fontSize: 22,
        fontWeight: '600',
        lineHeight: 30,
        textAlign: 'center',
        marginBottom: 20,
        flex: 1,
    },

    // Input Section - Ajustado para não mover
    answerSection: {
        width: '100%',
        marginTop: 'auto',
    },
    inputContainer: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 12,
        textAlign: 'center',
        color: '#666',
    },
    answerInput: {
        width: '100%',
        height: 56,
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 20,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '500',
    },
    inputHelper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 10,
    },
    helperText: {
        fontSize: 12,
        marginLeft: 4,
    },

    // Card Back (Answer)
    answerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    answerIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    answerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    answerBox: {
        width: '100%',
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    correctAnswer: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    answerHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    answerHintText: {
        fontSize: 14,
        marginLeft: 8,
        fontStyle: 'italic',
        textAlign: 'center',
    },

    // Button Text Styles
    skipButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    questionNumberText: {
        fontSize: 14,
        fontWeight: '600',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 20,
    },
    modalHeader: {
        padding: 32,
        alignItems: 'center',
    },
    modalIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 28,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#FFF',
        opacity: 0.9,
        textAlign: 'center',
    },
    modalBody: {
        padding: 24,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        marginHorizontal: 4,
    },
    statCardValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginVertical: 8,
    },
    statCardLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    xpContainer: {
        marginBottom: 24,
    },
    xpTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 16,
    },
    xpBreakdown: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
    },
    xpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    xpLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    xpValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    totalXpRow: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    totalXpLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    totalXpValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#059669',
    },
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#92400E',
        marginLeft: 12,
        fontStyle: 'italic',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        minHeight: 56,
    },
    primaryButton: {
        backgroundColor: '#059669',
    },
    secondaryButton: {
        borderWidth: 2,
        borderColor: '#059669',
        backgroundColor: 'transparent',
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    secondaryButtonText: {
        color: '#059669',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    statItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 14,
        opacity: 0.9,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});