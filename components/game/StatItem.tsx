// components/game/StatItem.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatItemProps {
    label: string;
    value: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
    <View style={styles.statItem}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    statItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#FFF',
        opacity: 0.9,
    },
    statValue: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },
});

export default StatItem;