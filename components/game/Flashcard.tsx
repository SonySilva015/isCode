// components/game/Flashcard.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import DifficultyBadge from './DifficultyBadge';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FlashcardProps {
    card: {
        id: number;
        question: string;
        answer: string;
        difficulty: 'easy' | 'medium' | 'hard';
    };
    mode: 'light' | 'dark';
    colors: any;
    isFlipped: boolean;
    userAnswer: string;
    setUserAnswer: (text: string) => void;
    answerResult: 'correct' | 'incorrect' | null;
    showTimer: boolean;
    timeLeft: number;
    inputRef: React.RefObject<TextInput>;
    onManualFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
    card,
    mode,
    colors,
    isFlipped,
    userAnswer,
    setUserAnswer,
    answerResult,
    showTimer,
    timeLeft,
    inputRef,
    onManualFlip
}) => {
    const flipAnim = useRef(new Animated.Value(0)).current;

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

    // Animate when isFlipped changes
    React.useEffect(() => {
        Animated.spring(flipAnim, {
            toValue: isFlipped ? 180 : 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    }, [isFlipped]);

    return (
        <View style={styles.flashcardContainer}>
            {/* Frente da Carta */}
            <Animated.View
                style={[
                    styles.card,
                    styles.cardFront,
                    frontAnimatedStyle,
                    {
                        backgroundColor: colors.card,
                    }
                ]}
            >
                <View style={styles.cardHeader}>
                    <DifficultyBadge difficulty={card?.difficulty || 'easy'} />
                </View>

                <View style={styles.questionContainer}>
                    <Text style={[styles.questionText, { color: colors.text }]}>
                        {card?.question}
                    </Text>

                    <View style={styles.answerInputContainer}>
                        <Text style={[styles.inputLabel, { color: colors.text }]}>
                            Sua resposta:
                        </Text>
                        <TextInput
                            ref={inputRef}
                            style={[
                                styles.answerInput,
                                {
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    borderColor: answerResult === 'correct' ? '#10B981' :
                                        answerResult === 'incorrect' ? '#EF4444' : colors.primary
                                }
                            ]}
                            value={userAnswer}
                            onChangeText={setUserAnswer}
                            placeholder="Digite sua resposta..."
                            placeholderTextColor={colors.text + '80'}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus={true}
                            editable={!answerResult && !isFlipped}
                        />
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <TouchableOpacity
                        style={[styles.revealButton, {
                            borderColor: colors.primary,
                            backgroundColor: isFlipped ? colors.primary + '20' : 'transparent'
                        }]}
                        onPress={onManualFlip}
                        disabled={!!answerResult}
                    >
                        <Ionicons
                            name={isFlipped ? "eye-off" : "eye"}
                            size={16}
                            color={isFlipped ? colors.text : colors.primary}
                        />
                        <Text style={[styles.revealButtonText, {
                            color: isFlipped ? colors.text : colors.primary
                        }]}>
                            {isFlipped ? 'Voltando em...' : 'Ver Resposta'}
                        </Text>
                        {isFlipped && showTimer && (
                            <View style={styles.timerCircle}>
                                <Text style={styles.timerText}>{timeLeft}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Verso da Carta */}
            <Animated.View
                style={[
                    styles.card,
                    styles.cardBack,
                    backAnimatedStyle,
                    {
                        backgroundColor: mode === 'dark' ? '#1E293B' : '#F8FAFC'
                    }
                ]}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.difficultyBadge, { backgroundColor: '#6B7280' }]}>
                        <Text style={styles.difficultyText}>RESPOSTA</Text>
                    </View>
                    {showTimer && (
                        <View style={styles.autoFlipIndicator}>
                            <Ionicons name="time-outline" size={16} color="#6B7280" />
                            <Text style={styles.autoFlipText}>
                                Voltando em {timeLeft}s
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.answerContainer}>
                    <View style={styles.answerHeader}>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        <Text style={[styles.answerTitle, { color: mode === 'dark' ? '#CBD5E1' : '#1E293B' }]}>
                            Resposta Correta
                        </Text>
                    </View>

                    <View style={[
                        styles.answerBox,
                        {
                            backgroundColor: mode === 'dark' ? '#0F172A' : '#E2E8F0',
                            borderColor: mode === 'dark' ? '#334155' : '#CBD5E1'
                        }
                    ]}>
                        <Text style={[
                            styles.correctAnswerText,
                            {
                                color: mode === 'dark' ? '#F1F5F9' : '#1E293B'
                            }
                        ]}>
                            {card?.answer}
                        </Text>
                    </View>

                    <View style={styles.backInfo}>
                        <Ionicons name="information-circle" size={16} color="#6B7280" />
                        <Text style={[styles.backInfoText, { color: '#6B7280' }]}>
                            {answerResult === 'incorrect'
                                ? 'Você errou esta questão. A carta voltará automaticamente.'
                                : 'Estude esta resposta. A carta voltará automaticamente.'}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <TouchableOpacity
                        style={[styles.returnButton, { backgroundColor: colors.primary }]}
                        onPress={onManualFlip}
                    >
                        <Ionicons name="arrow-back" size={16} color="#FFF" />
                        <Text style={styles.returnButtonText}>
                            Voltar agora
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    flashcardContainer: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.6,
        position: 'relative',
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 24,
        padding: 24,
        backfaceVisibility: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    cardFront: {
        justifyContent: 'space-between',
    },
    cardBack: {
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    difficultyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    difficultyText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    autoFlipIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    autoFlipText: {
        color: '#6B7280',
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 4,
    },
    questionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    questionText: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 32,
        marginBottom: 32,
    },
    answerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    answerTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 8,
    },
    answerBox: {
        width: '100%',
        padding: 32,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    correctAnswerText: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        letterSpacing: 0.5,
    },
    backInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        maxWidth: '80%',
    },
    backInfoText: {
        fontSize: 14,
        marginLeft: 8,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    answerInputContainer: {
        width: '100%',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
        textAlign: 'center',
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
    cardFooter: {
        marginTop: 24,
    },
    revealButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
    },
    revealButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    timerCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    timerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    returnButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
    },
    returnButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default Flashcard;