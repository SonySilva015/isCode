// components/game/LevelCompleteModal.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import StatItem from './StatItem';

interface LevelCompleteModalProps {
    visible: boolean;
    level: number;
    stats: {
        score: number;
        correctAnswers: number;
        maxStreak: number;
    };
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
                <LinearGradient colors={['#10B981', '#059669']} style={styles.modalContainer}>
                    <View style={styles.modalIcon}>
                        <Ionicons name="trophy" size={60} color="#FFF" />
                    </View>

                    <Text style={styles.modalTitle}>Nível Concluído! 🎯</Text>
                    <Text style={styles.modalSubtitle}>
                        Excelente desempenho no nível {level}
                    </Text>

                    <View style={styles.statsContainer}>
                        <StatItem label="Pontuação" value={`${stats.score} pontos`} />
                        <StatItem label="Acertos" value={`${stats.correctAnswers}/${totalCards}`} />
                        <StatItem label="Maior Streak" value={`${stats.maxStreak} acertos`} />
                        <View style={styles.xpBreakdown}>
                            <Text style={styles.xpBreakdownTitle}>XP Ganho:</Text>
                            <View style={styles.xpRow}>
                                <Text style={styles.xpLabel}>Acertos ({stats.correctAnswers} × 5 XP):</Text>
                                <Text style={styles.xpValue}>{stats.correctAnswers * 5} XP</Text>
                            </View>
                            {perfectScoreBonus > 0 && (
                                <View style={styles.xpRow}>
                                    <Text style={styles.xpLabel}>Bônus perfeito:</Text>
                                    <Text style={styles.xpValue}>+{perfectScoreBonus} XP</Text>
                                </View>
                            )}
                            <View style={[styles.xpRow, styles.totalXpRow]}>
                                <Text style={styles.totalXpLabel}>Total:</Text>
                                <Text style={styles.totalXpValue}>{totalXP} XP</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonSecondary]}
                            onPress={onRestart}
                        >
                            <Text style={styles.modalButtonTextSecondary}>Revisar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={onNextLevel}>
                            <Text style={styles.modalButtonText}>Próximo Nível</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
    },
    modalIcon: {
        marginBottom: 20,
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
        marginBottom: 24,
        textAlign: 'center',
    },
    statsContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    xpBreakdown: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    xpBreakdownTitle: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '600',
        marginBottom: 8,
    },
    xpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    xpLabel: {
        fontSize: 14,
        color: '#FFF',
        opacity: 0.9,
    },
    xpValue: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '500',
    },
    totalXpRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.3)',
    },
    totalXpLabel: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: '600',
    },
    totalXpValue: {
        fontSize: 20,
        color: '#FFF',
        fontWeight: 'bold',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    modalButtonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    modalButtonText: {
        color: '#059669',
        fontSize: 16,
        fontWeight: '600',
    },
    modalButtonTextSecondary: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default LevelCompleteModal;