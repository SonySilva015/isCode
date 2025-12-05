import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Progress from '../progress/progress';
import { styles } from './styles';

interface TopicCardProps {
    topic: any;
    onOpenTopic: (id: number) => void;
    onOpenLesson: (id: number) => void;
}

const TopicCard = ({ topic, onOpenTopic, onOpenLesson }: TopicCardProps) => (
    <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${topic.color}20` }]}>
                <FontAwesome5 name={topic.icon} size={24} color={topic.color} />
            </View>
            <View style={styles.topicInfo}>
                <Text style={styles.title}>{topic.title}</Text>
                <Text style={styles.textBody}>{topic.description}</Text>
            </View>
        </View>

        <Progress
            prog={{
                title: `${topic.completedLessons} de ${topic.totalLessons} lições`,
                perc: topic.progress,
            }}
        />

        <View style={styles.actions}>
            <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => onOpenTopic(topic.id)}
            >
                <Ionicons name="book-outline" size={18} color="#fff" />
                <Text style={styles.primaryButtonText}>Ver Lições</Text>
            </TouchableOpacity>

        </View>

        {topic.progress === 100 && (
            <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#fff" />
                <Text style={styles.completedText}>Completo</Text>
            </View>
        )}
    </View>
);

export default TopicCard;

