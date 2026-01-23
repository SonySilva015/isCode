// components/game/DifficultyBadge.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DifficultyBadgeProps {
    difficulty: 'easy' | 'medium' | 'hard';
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
    const colors = {
        easy: '#10B981',
        medium: '#F59E0B',
        hard: '#EF4444'
    };
    const labels = {
        easy: 'FÁCIL',
        medium: 'MÉDIO',
        hard: 'DIFÍCIL'
    };

    return (
        <View style={[styles.difficultyBadge, { backgroundColor: colors[difficulty] }]}>
            <Text style={styles.difficultyText}>{labels[difficulty]}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default DifficultyBadge;