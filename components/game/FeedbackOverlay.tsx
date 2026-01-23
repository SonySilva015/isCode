// components/game/FeedbackOverlay.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface FeedbackOverlayProps {
    result: 'correct' | 'incorrect';
    feedback: string;
    opacity: Animated.AnimatedInterpolation<string | number>;
    translateY: Animated.AnimatedInterpolation<string | number>;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ result, feedback, opacity, translateY }) => (
    <Animated.View
        style={[
            styles.feedbackContainer,
            {
                opacity,
                transform: [{ translateY }],
                backgroundColor: result === 'correct' ? '#10B981' : '#EF4444'
            }
        ]}
    >
        <Ionicons
            name={result === 'correct' ? "checkmark-circle" : "close-circle"}
            size={24}
            color="#FFF"
        />
        <Text style={styles.feedbackText}>{feedback}</Text>
    </Animated.View>
);

const styles = StyleSheet.create({
    feedbackContainer: {
        position: 'absolute',
        top: -60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    feedbackText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        flexShrink: 1,
    },
});

export default FeedbackOverlay;