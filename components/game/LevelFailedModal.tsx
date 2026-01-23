// components/game/LevelFailedModal.tsx
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
                <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.modalContainer}>
                    <View style={styles.modalIcon}>
                        <Ionicons name="alert-circle" size={60} color="#FFF" />
                    </View>

                    <Text style={styles.modalTitle}>Continue Praticando</Text>
                    <Text style={styles.modalSubtitle}>
                        Você está quase lá! Faltaram {missingCorrect} acertos para passar.
                    </Text>

                    <View style={styles.statsContainer}>
                        <StatItem label="Seus Acertos" value={`${correctAnswers}/${totalCards}`} />
                        <StatItem label="Necessário" value={`${requiredCorrect}/${totalCards}`} />
                        <StatItem label="XP Ganho" value={`${xpEarned} XP`} />
                        <StatItem label="Pontuação" value={`${score} pontos`} />
                    </View>

                    <Text style={styles.tipText}>
                        💡 Revise as respostas e tente novamente para ganhar o bônus de 15 XP!
                    </Text>

                    <TouchableOpacity style={styles.modalButton} onPress={onRestart}>
                        <Text style={styles.modalButtonText}>Tentar Novamente</Text>
                    </TouchableOpacity>
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
    tipText: {
        fontSize: 14,
        color: '#FFF',
        opacity: 0.9,
        marginBottom: 24,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 20,
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        width: '100%',
    },
    modalButtonText: {
        color: '#D97706',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default LevelFailedModal;