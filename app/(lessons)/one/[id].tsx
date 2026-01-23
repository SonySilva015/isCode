import { useTheme } from '@/context/useTheme';
import { getLessonByid, getQuizByLesson } from '@/services/lesson.service';
import { getCountQuestions, getOptionsByQuiz } from '@/services/quiz&option.service';
import { stylesLesson } from '@/styles/oneLesson';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Easing,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { handleCompleteLesson } from '../../../function/quiz';



const QuizScreen = () => {
    const { mode, colors } = useTheme();
    const styles = stylesLesson(colors);
    const { id } = useLocalSearchParams();
    const router = useRouter();

    // Estados
    const [lesson, setLesson] = useState<any>(null);
    const [quiz, setQuiz] = useState<any[]>([]);
    const [options, setOptions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(10); // Inicia com 10 XP
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [hasVerified, setHasVerified] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [scoreChange, setScoreChange] = useState<number>(0);

    // Refs para animações
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const timerAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const scoreAnim = useRef(new Animated.Value(0)).current;

    // Carregar dados iniciais
    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            try {
                const [lessonData, quizData] = await Promise.all([
                    getLessonByid(Number(id)),
                    getQuizByLesson(Number(id)),
                    getCountQuestions(Number(id))
                ]);

                setLesson(lessonData?.[0] || null);
                setQuiz(Array.isArray(quizData) ? quizData : []);

            } catch (error) {
                console.error('Erro ao carregar quiz:', error);
                Alert.alert('Erro', 'Não foi possível carregar o quiz. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    // Carregar opções para a pergunta atual
    useEffect(() => {
        if (quiz.length > 0 && quiz[currentQuestionIndex]) {
            getOptionsByQuiz(quiz[currentQuestionIndex].id)
                .then((data) => {
                    setOptions(Array.isArray(data) ? data : []);
                })
                .catch(console.error);
        }
    }, [currentQuestionIndex, quiz]);

    // Resetar estados quando mudar de pergunta
    useEffect(() => {
        setSelectedOption(null);

        setIsCorrect(null);
        setHasVerified(false);
        setShowFeedbackModal(false);
    }, [currentQuestionIndex]);

    // Função para mostrar o modal de feedback
    const showFeedbackModalWithAnimation = (correct: boolean, points: number) => {
        setIsCorrect(correct);
        setScoreChange(points);
        setShowFeedbackModal(true);

        // Resetar animações
        fadeAnim.setValue(0);
        timerAnim.setValue(0);
        scaleAnim.setValue(0.8);

        // Sequência de animações suaves
        Animated.sequence([
            // Entrada com bounce
            Animated.parallel([
                Animated.spring(fadeAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                })
            ]),
            // Animação da barra de tempo
            Animated.timing(timerAnim, {
                toValue: 1,
                duration: 2700,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ]).start();

        // Fechar modal após 3 segundos
        setTimeout(() => {
            // Animação de saída suave
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setShowFeedbackModal(false);
                // Avança automaticamente após o modal
                if (currentQuestionIndex < quiz.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                } else {
                    setQuizCompleted(true);
                    // Marcar lição como completa apenas se aprovado (6+ XP)
                    if (score + points >= 6) {
                        handleCompleteLesson(lesson.id, lesson.fk_module, score + points);
                    }
                }
            });
        }, 3000);
    };

    // Handlers
    const handleOptionSelect = useCallback((optionIndex: number) => {
        if (hasVerified) return;
        setSelectedOption(optionIndex);
    }, [hasVerified]);

    const handleVerify = useCallback(() => {
        if (selectedOption === null) {
            Alert.alert('Selecione uma opção', 'Por favor, selecione uma resposta antes de verificar.');
            return;
        }

        const selected = options[selectedOption];
        const correct = selected.iscorrect === true;

        // Calcula pontuação
        let points = 0;
        if (correct) {
            points = score < 10 ? 1 : 0;
        } else {
            points = -1;
        }

        // Atualiza pontuação total
        setScore(prev => {
            const newScore = prev + points;
            if (newScore < 0) return 0;
            if (newScore > 10) return 10;
            return newScore;
        });

        // Mostra modal de feedback
        showFeedbackModalWithAnimation(correct, points);

        setHasVerified(true);
        setIsCorrect(correct);
    }, [selectedOption, options, score]);

    const handleNextQuestion = () => {
        if (currentQuestion?.type === 'question' && !hasVerified) {
            Alert.alert('Verifique primeiro', 'Por favor, verifique sua resposta antes de continuar.');
            return;
        }

        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setQuizCompleted(true);
            if (score >= 6) {
                handleCompleteLesson(lesson.id, lesson.fk_module, score);
            }
        }
    };

    const handlePreviousQuestion = useCallback(() => {
        if (currentQuestionIndex > 0) {
            const prevIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(prevIndex);

            if (quiz[prevIndex]) {
                getOptionsByQuiz(quiz[prevIndex].id)
                    .then((data) => {
                        setOptions(Array.isArray(data) ? data : []);
                    })
                    .catch(console.error);
            }
        }
    }, [currentQuestionIndex, quiz]);

    const handleRetryQuiz = useCallback(() => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(10);
        setQuizCompleted(false);
        setIsCorrect(null);
        setHasVerified(false);
        setShowFeedbackModal(false);
    }, []);

    const handleNextLesson = useCallback(() => {
        router.back();
    }, [router]);

    const handleBackToLessons = useCallback(() => {
        router.back();
    }, [router]);

    // Função para obter o texto do botão principal
    const getMainButtonText = () => {
        if (currentQuestion?.type === 'content') {
            return 'Continuar';
        }
        if (hasVerified) {
            return currentQuestionIndex === quiz.length - 1 ? 'Finalizar Quiz' : 'Continuar';
        }
        return 'Verificar';
    };

    // Função para obter a cor do botão principal
    const getMainButtonColor = () => {
        if (currentQuestion?.type === 'content') {
            return colors.primary;
        }
        if (hasVerified) {
            return isCorrect ? '#10B981' : '#EF4444';
        }
        return selectedOption !== null ? colors.primary : colors.border;
    };

    // Função para obter a opacidade do botão principal
    const getMainButtonOpacity = () => {
        if (currentQuestion?.type === 'content') {
            return 1;
        }
        if (hasVerified) {
            return 1;
        }
        return selectedOption !== null ? 1 : 0.6;
    };

    // Função para verificar se o botão principal está habilitado
    const isMainButtonEnabled = () => {
        if (currentQuestion?.type === 'content') {
            return true;
        }
        if (hasVerified) {
            return true;
        }
        return selectedOption !== null;
    };

    // Função para lidar com o clique do botão principal
    const handleMainButtonPress = () => {
        if (currentQuestion?.type === 'content') {
            handleNextQuestion();
            return;
        }
        if (hasVerified) {
            handleNextQuestion();
            return;
        }
        handleVerify();
    };

    // Dados memoizados
    const currentQuestion = useMemo(() =>
        quiz[currentQuestionIndex] || null,
        [quiz, currentQuestionIndex]
    );

    const progressPercentage = useMemo(() =>
        quiz.length > 0 ? ((currentQuestionIndex + 1) / quiz.length) * 100 : 0,
        [currentQuestionIndex, quiz.length]
    );

    // Cálculo da nota final
    const passingScore = 6;
    const finalScore = score;
    const isApproved = finalScore >= passingScore;

    // Animação do score na tela de resultados
    useEffect(() => {
        if (quizCompleted) {
            scoreAnim.setValue(0);
            Animated.timing(scoreAnim, {
                toValue: finalScore,
                duration: 1500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        }
    }, [quizCompleted, finalScore]);

    // Loading state
    if (loading) {
        return (
            <>
                <Stack.Screen
                    options={{
                        headerStyle: {
                            backgroundColor: colors.second,
                        },
                        headerTintColor: '#fff',
                        statusBarAnimation: 'fade',
                        headerShadowVisible: false,
                        headerTitle: '',
                        headerShown: false
                    }}
                />
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 20, color: colors.text, fontSize: 16 }}>
                        Carregando quiz...
                    </Text>
                </View>
            </>
        );
    }

    // Error state
    if (!lesson || quiz.length === 0) {
        return (
            <>
                <Stack.Screen
                    options={{
                        headerStyle: {
                            backgroundColor: colors.second,
                        },
                        headerTintColor: '#fff',
                        statusBarAnimation: 'fade',
                        headerShadowVisible: false,
                        headerTitle: '',
                        headerShown: false
                    }}
                />
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                    <Ionicons name="sad-outline" size={64} color={colors.text} style={{ opacity: 0.5 }} />
                    <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center', marginTop: 20 }}>
                        Quiz não encontrado
                    </Text>
                    <TouchableOpacity
                        style={[styles.resultButton, { backgroundColor: colors.primary, marginTop: 30 }]}
                        onPress={handleBackToLessons}
                    >
                        <Text style={[styles.resultButtonText, { color: '#FFF' }]}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerStyle: {
                        backgroundColor: colors.second,
                    },
                    headerTintColor: '#fff',
                    statusBarAnimation: 'fade',
                    headerShadowVisible: false,
                    headerTitle: '',
                    headerShown: false
                }}
            />

            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.second}
                />

                {/* Modal de Feedback */}
                <Modal
                    transparent={true}
                    visible={showFeedbackModal}
                    animationType="fade"
                    onRequestClose={() => { }}
                >
                    <View style={styles.modalOverlay}>
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ scale: scaleAnim }]
                                }
                            ]}
                        >
                            <View style={[
                                styles.modalContent,
                                {
                                    backgroundColor: isCorrect ? '#10B981' : '#EF4444',
                                    borderColor: isCorrect ? '#059669' : '#DC2626',
                                    borderWidth: 4,
                                }
                            ]}>
                                <View style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 50,
                                    padding: 15,
                                    marginBottom: 20,
                                }}>
                                    <Ionicons
                                        name={isCorrect ? "checkmark-circle" : "close-circle"}
                                        size={80}
                                        color="#FFFFFF"
                                    />
                                </View>

                                <Text style={styles.modalTitle}>
                                    {isCorrect ? '🎉 Parabéns!' : '❌ Tente Novamente'}
                                </Text>

                                <Text style={styles.modalMessage}>
                                    {isCorrect
                                        ? score === 10
                                            ? 'Resposta Correta! (XP máximo alcançado)'
                                            : 'Resposta Correta! +1 XP'
                                        : 'Resposta Incorreta! -1 XP'
                                    }
                                </Text>

                                <View style={styles.modalScoreContainer}>
                                    <Text style={styles.modalScoreText}>
                                        {scoreChange > 0 ? '+' : ''}{scoreChange} XP
                                    </Text>
                                    <Text style={styles.modalScoreLabel}>
                                        Pontuação
                                    </Text>
                                </View>

                                <View style={styles.modalTimerContainer}>
                                    <View style={styles.modalTimerBar}>
                                        <View style={styles.modalTimerFill}>
                                            <Animated.View
                                                style={[
                                                    styles.modalTimerFillInner,
                                                    {
                                                        transform: [{
                                                            scaleX: timerAnim.interpolate({
                                                                inputRange: [0, 1],
                                                                outputRange: [0, 1]
                                                            })
                                                        }]
                                                    }
                                                ]}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                    </View>
                </Modal>

                {/* Header do Quiz */}
                <LinearGradient
                    colors={[
                        colors.gradient.second,
                        mode === 'dark' ? colors.card : colors.second,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        {!quizCompleted && (
                            <View style={styles.quizProgress}>
                                <View style={styles.headerxp}>
                                    <TouchableOpacity

                                        onPress={handleBackToLessons}
                                    >
                                        <Ionicons
                                            name='close'
                                            size={20}
                                            color={'white'}
                                        />
                                    </TouchableOpacity>

                                    <Text style={styles.quizProgressText}>XP: {score}/10</Text>
                                    <Text style={styles.quizProgressText}>
                                        Nota: {Math.round((score / 10) * 100)}%
                                    </Text>
                                </View>
                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                {
                                                    width: `${progressPercentage}%`,
                                                    backgroundColor: colors.redbar,
                                                },
                                            ]}
                                        />
                                    </View>

                                    <View
                                        style={[
                                            styles.progressGlow,
                                            {
                                                width: `${progressPercentage}%`,
                                                backgroundColor: '#FFF',
                                            },
                                        ]}
                                    />

                                    <View style={styles.progressMarkers}>
                                        {quiz.map((_, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.progressMarker,
                                                    index <= currentQuestionIndex ? styles.progressMarkerActive : {},
                                                    {
                                                        left: `${(index / (quiz.length - 1)) * 100}%`,
                                                        backgroundColor: index <= currentQuestionIndex ? colors.redbar : colors.border,
                                                    }
                                                ]}
                                            />
                                        ))}
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </LinearGradient>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                >
                    {quizCompleted ? (
                        <View style={styles.quizResultContainer}>
                            {/* Medalha Animada */}
                            <Animated.View
                                style={[
                                    styles.resultIconContainer,
                                    {
                                        backgroundColor: isApproved
                                            ? `${colors.success}15`
                                            : `${colors.error}15`,
                                        borderWidth: 4,
                                        borderColor: isApproved ? colors.success : colors.error,
                                        shadowColor: isApproved ? colors.success : colors.error,
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: 0.4,
                                        shadowRadius: 16,
                                        elevation: 8,
                                        transform: [{
                                            rotate: scoreAnim.interpolate({
                                                inputRange: [0, 10],
                                                outputRange: ['0deg', '360deg']
                                            })
                                        }]
                                    }
                                ]}
                            >
                                <Ionicons
                                    name={isApproved ? 'trophy' : 'refresh-circle'}
                                    size={60}
                                    color={isApproved ? colors.success : colors.error}
                                />
                            </Animated.View>

                            {/* Título do Resultado */}
                            <Text style={[styles.resultTitle, {
                                fontSize: 32,
                                marginBottom: 12,
                                textShadowColor: 'rgba(0,0,0,0.1)',
                                textShadowOffset: { width: 0, height: 2 },
                                textShadowRadius: 4,
                            }]}>
                                {isApproved ? '🎉 Excelente!' : '📚 Continue Praticando'}
                            </Text>

                            {/* Badge de Status */}
                            <View style={{
                                backgroundColor: isApproved ? `${colors.success}20` : `${colors.error}20`,
                                paddingHorizontal: 20,
                                paddingVertical: 8,
                                borderRadius: 20,
                                marginBottom: 16,
                                borderWidth: 2,
                                borderColor: isApproved ? colors.success : colors.error,
                            }}>
                                <Text style={{
                                    color: isApproved ? colors.success : colors.error,
                                    fontSize: 14,
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                }}>
                                    {isApproved ? 'Aprovado' : 'Precisa Melhorar'}
                                </Text>
                            </View>

                            {/* Score Animado */}
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <Animated.Text
                                    style={[
                                        styles.resultScore,
                                        {
                                            fontSize: 64,
                                            color: isApproved ? colors.success : colors.error,
                                            textShadowColor: isApproved ? `${colors.success}40` : `${colors.error}40`,
                                            textShadowOffset: { width: 0, height: 4 },
                                            textShadowRadius: 12,
                                        }
                                    ]}
                                >
                                    {scoreAnim.interpolate({
                                        inputRange: [0, 10],
                                        outputRange: ['0', '10']
                                    })}
                                </Animated.Text>
                                <Text style={{
                                    fontSize: 18,
                                    color: colors.textSecondary,
                                    fontWeight: '600',
                                    marginTop: -10,
                                }}>
                                    /10 XP
                                </Text>
                            </View>

                            {/* Barra de Progresso do Score */}
                            <View style={{
                                width: '80%',
                                marginBottom: 24,
                            }}>
                                <View style={{
                                    height: 12,
                                    backgroundColor: colors.card,
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    marginBottom: 8,
                                }}>
                                    <Animated.View
                                        style={{
                                            height: '100%',
                                            backgroundColor: isApproved ? 'green' : 'red',
                                            width: scoreAnim.interpolate({
                                                inputRange: [0, 10],
                                                outputRange: ['0%', '100%']
                                            }),
                                            borderRadius: 6,
                                        }}
                                    />
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                    <Text style={{
                                        fontSize: 12,
                                        color: colors.textSecondary,
                                        fontWeight: '500',
                                    }}>
                                        0 XP
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: colors.textSecondary,
                                        fontWeight: '500',
                                    }}>
                                        10 XP
                                    </Text>
                                </View>
                            </View>

                            {/* Mensagem Motivacional */}
                            <Text style={[styles.resultMessage, {
                                fontSize: 17,
                                lineHeight: 26,
                                color: colors.text,
                                textAlign: 'center',
                                marginBottom: 40,
                                paddingHorizontal: 20,
                            }]}>
                                {isApproved
                                    ? `🎯 Incrível! Você dominou "${lesson.title}" com ${finalScore} XP. Continue assim na próxima lição!`
                                    : `📚 Você conseguiu ${finalScore} XP. Para avançar, é necessário alcançar pelo menos 6 XP. Reveja o conteúdo e tente novamente!`
                                }
                            </Text>

                            {/* Ações em Grade */}
                            <View style={[styles.resultActions, {
                                flexDirection: 'row',
                                gap: 16,
                            }]}>
                                {isApproved ? (
                                    <TouchableOpacity
                                        style={[styles.resultButton, {
                                            backgroundColor: colors.primary,
                                            flex: 1,
                                            paddingVertical: 18,
                                            borderRadius: 16,
                                            shadowColor: 'black',
                                            shadowOffset: { width: 0, height: 6 },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 12,
                                            elevation: 8,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }]}
                                        onPress={handleNextLesson}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="arrow-forward-circle" size={24} color="#FFF" style={{ marginRight: 10 }} />
                                        <Text style={[styles.resultButtonText, {
                                            fontSize: 16,
                                            fontWeight: '700',
                                            letterSpacing: 0.5,
                                        }]}>
                                            Próxima Lição
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.resultButton, {
                                            backgroundColor: 'red',
                                            flex: 1,
                                            paddingVertical: 18,
                                            borderRadius: 16,
                                            shadowColor: 'red',
                                            shadowOffset: { width: 0, height: 6 },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 12,
                                            elevation: 8,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }]}
                                        onPress={handleRetryQuiz}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="refresh-circle" size={24} color="#FFF" style={{ marginRight: 10 }} />
                                        <Text style={[styles.resultButtonText, {
                                            fontSize: 16,
                                            fontWeight: '700',
                                            letterSpacing: 0.5,
                                        }]}>
                                            Refazer Quiz
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[styles.resultButton, {
                                        backgroundColor: 'transparent',
                                        borderWidth: 2,
                                        borderColor: isApproved ? 'green' : 'red',
                                        flex: 1,
                                        paddingVertical: 18,
                                        borderRadius: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }]}
                                    onPress={handleBackToLessons}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons
                                        name="book"
                                        size={24}
                                        color={isApproved ? 'green' : 'red'}
                                        style={{ marginRight: 10 }}
                                    />
                                    <Text style={[styles.resultButtonText, {
                                        fontSize: 16,
                                        fontWeight: '700',
                                        letterSpacing: 0.5,
                                        color: isApproved ? 'green' : 'red',
                                    }]}>
                                        Lições
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Dica Final */}
                            <View style={{
                                marginTop: 32,
                                padding: 16,
                                backgroundColor: `${colors.primary}10`,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: `${colors.primary}20`,
                            }}>
                                <Text style={{
                                    fontSize: 14,
                                    color: colors.textSecondary,
                                    textAlign: 'center',
                                    fontStyle: 'italic',
                                }}>
                                    {isApproved
                                        ? "💡 Dica: Revise sempre o conteúdo aprendido para fixar o conhecimento!"
                                        : "💡 Dica: Leia atentamente cada questão e revise o material antes de responder."
                                    }
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <>
                            {/* Container da Pergunta */}
                            <View style={[styles.questionContainer, {
                                marginTop: 32,
                                borderRadius: 20,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 12,
                                elevation: 6,
                            }]}>
                                <Text style={[styles.questionText, {
                                    fontSize: 20,
                                    lineHeight: 30,
                                }]}>
                                    {currentQuestion?.type === 'content'
                                        ? currentQuestion.content
                                        : currentQuestion.questions}
                                </Text>
                            </View>

                            {/* Opções de Resposta */}
                            {currentQuestion?.type === 'question' && options.length > 0 && (
                                <View style={styles.optionsContainer}>
                                    {options.map((option, index) => (
                                        <TouchableOpacity
                                            key={option.id || index}
                                            style={[
                                                styles.optionCard,
                                                selectedOption === index && styles.optionCardSelected,
                                                {
                                                    borderRadius: 16,
                                                    borderWidth: selectedOption === index ? 2 : 1,
                                                    borderColor: selectedOption === index ? colors.primary : colors.border,
                                                    shadowColor: selectedOption === index ? colors.primary : 'transparent',
                                                    shadowOffset: { width: 0, height: 4 },
                                                    shadowOpacity: selectedOption === index ? 0.2 : 0,
                                                    shadowRadius: 8,
                                                    elevation: selectedOption === index ? 4 : 0,
                                                    marginBottom: 12,
                                                },
                                            ]}
                                            onPress={() => handleOptionSelect(index)}
                                            activeOpacity={0.7}
                                            disabled={hasVerified}
                                        >
                                            <View style={styles.optionContent}>
                                                <View
                                                    style={[
                                                        styles.optionRadio,
                                                        selectedOption === index && styles.optionRadioSelected,
                                                        {
                                                            width: 28,
                                                            height: 28,
                                                            borderRadius: 14,
                                                        }
                                                    ]}
                                                >
                                                    {selectedOption === index && (
                                                        <View style={[
                                                            styles.optionRadioInner,
                                                            {
                                                                width: 16,
                                                                height: 16,
                                                                borderRadius: 8,
                                                            }
                                                        ]} />
                                                    )}
                                                </View>
                                                <Text
                                                    style={[
                                                        styles.optionText,
                                                        selectedOption === index && styles.optionTextSelected,
                                                        {
                                                            fontSize: 16,
                                                            lineHeight: 24,
                                                            marginLeft: 12,
                                                        }
                                                    ]}
                                                    numberOfLines={3}
                                                >
                                                    {option.content}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {/* Botões de Navegação */}
                            <View style={styles.quizActions}>
                                <View style={styles.navigationButtons}>
                                    {/* Botão Anterior */}
                                    {currentQuestionIndex > 0 && (
                                        <TouchableOpacity
                                            style={[
                                                styles.navButton,
                                                {
                                                    backgroundColor: 'transparent',
                                                    borderWidth: 2,
                                                    borderColor: colors.primary,
                                                    borderRadius: 14,
                                                    paddingVertical: 14,
                                                },
                                            ]}
                                            onPress={handlePreviousQuestion}
                                            activeOpacity={0.8}
                                            disabled={!hasVerified && currentQuestion?.type === 'question'}
                                        >
                                            <Ionicons name="arrow-back" size={20} color={colors.primary} />
                                            <Text style={[styles.navButtonText, {
                                                color: colors.primary,
                                                marginLeft: 10,
                                                opacity: (!hasVerified && currentQuestion?.type === 'question') ? 0.5 : 1,
                                                fontWeight: '600',
                                            }]}>
                                                Anterior
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    {/* Botão Principal Único */}
                                    <TouchableOpacity
                                        style={[
                                            styles.navButton,
                                            {
                                                backgroundColor: getMainButtonColor(),
                                                opacity: getMainButtonOpacity(),
                                                flex: 1,
                                                borderRadius: 14,
                                                paddingVertical: 14,
                                                marginLeft: currentQuestionIndex > 0 ? 10 : 0,
                                            },
                                        ]}
                                        onPress={handleMainButtonPress}
                                        disabled={!isMainButtonEnabled()}
                                        activeOpacity={0.8}
                                    >
                                        {!hasVerified && currentQuestion?.type === 'question' && selectedOption !== null && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={20}
                                                color="#FFF"
                                                style={{ marginRight: 8 }}
                                            />
                                        )}

                                        {currentQuestion?.type === 'content' && (
                                            <Ionicons
                                                name="arrow-forward"
                                                size={20}
                                                color="#FFF"
                                                style={{ marginRight: 8 }}
                                            />
                                        )}

                                        <Text style={[styles.navButtonText, {
                                            fontSize: 16,
                                            fontWeight: '700',
                                        }]}>
                                            {getMainButtonText()}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}
                </ScrollView>
            </View>
        </>
    );
};

export default React.memo(QuizScreen);