import { getTopicById } from '@/data/learn';
import { stylesLesson } from '@/styles/lessons';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useTheme } from '@/context/useTheme';

const TopicScreen = () => {
    const { mode, colors } = useTheme()
    const styles = stylesLesson(colors)
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const topic = getTopicById(id);

    if (!topic) {
        return (
            <>
                <Stack.Screen
                    options={{
                        title: '',
                        headerStyle: { backgroundColor: '#fff' },
                        headerTintColor: "#000",
                        headerTitleStyle: { fontWeight: "bold" },
                        headerShadowVisible: false,
                    }}
                />
                <View style={styles.container}>
                    <Text>Tópico não encontrado</Text>
                </View>
            </>
        );
    }

    // Encontrar a primeira lição não completada (lição atual)
    const currentLessonIndex = topic.lessons.findIndex(lesson => !lesson.completed);
    const currentLessonId = currentLessonIndex !== -1 ? topic.lessons[currentLessonIndex].id : null;

    const handleLessonPress = (lessonId: number, completed: boolean, isCurrent: boolean) => {
        if (!completed && !isCurrent) {
            // Opcional: mostrar mensagem ou feedback visual
            return;
        }
        router.push(`./one/${lessonId}`);
    };

    const getLessonIcon = (type: string) => {
        switch (type) {
            case 'video': return 'play-circle';
            case 'text': return 'document-text';
            case 'interactive': return 'code-slash';
            case 'project': return 'rocket';
            default: return 'book';
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: '',
                    headerStyle: { backgroundColor: topic.color },
                    headerTintColor: "#fff",
                    headerTitleStyle: { fontWeight: "bold" },
                    headerShadowVisible: false,
                    statusBarAnimation: 'fade',
                }}
            />
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={topic.color} />

                {/* 🔹 Header personalizado com gradiente */}
                <LinearGradient
                    colors={[
                        topic.color,
                        mode === 'dark' ? colors.card : colors.second,
                    ]}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>{topic.title}</Text>

                        <View style={styles.topicStats}>
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>
                                    {topic.completedLessons}/{topic.totalLessons}
                                </Text>
                                <Text style={styles.statLabel}>Lições</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>{topic.progress}%</Text>
                                <Text style={styles.statLabel}>Completo</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <ScrollView style={styles.scrollView}>
                    <Text style={styles.lessonsTitle}>Lições</Text>

                    {topic.lessons.map((lesson, index) => {
                        const isLocked = !lesson.completed && lesson.id !== currentLessonId;
                        const isCurrent = lesson.id === currentLessonId;
                        const isCompleted = lesson.completed;

                        return (
                            <TouchableOpacity
                                key={lesson.id}
                                style={[
                                    styles.lessonCard,
                                    isCurrent && styles.lessonCardCurrent,
                                    isLocked && styles.lessonCardLocked
                                ]}
                                onPress={() => handleLessonPress(lesson.id, lesson.completed, isCurrent)}
                                disabled={isLocked}
                            >
                                <View style={[
                                    styles.lessonNumber,
                                    isCompleted && styles.lessonNumberCompleted,
                                    isCurrent && styles.lessonNumberCurrent,
                                    isLocked && styles.lessonNumberLocked
                                ]}>
                                    <Text style={[
                                        styles.lessonNumberText,
                                        isCompleted && styles.lessonNumberTextCompleted,
                                        isCurrent && styles.lessonNumberTextCurrent,
                                        isLocked && styles.lessonNumberTextLocked
                                    ]}>
                                        {index + 1}
                                    </Text>
                                </View>

                                <View style={styles.lessonInfo}>
                                    <View style={styles.lessonHeader}>
                                        <Text style={[
                                            styles.lessonTitle,
                                            isCompleted && styles.lessonTitleCompleted,
                                            isCurrent && styles.lessonTitleCurrent,
                                            isLocked && styles.lessonTitleLocked
                                        ]}>
                                            {lesson.title}
                                        </Text>
                                        {isCurrent && (
                                            <View style={styles.currentBadge}>
                                                <Text style={styles.currentBadgeText}>Atual</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.lessonMeta}>
                                        <Text style={[
                                            styles.lessonDuration,
                                            isCompleted && styles.lessonMetaCompleted,
                                            isCurrent && styles.lessonMetaCurrent,
                                            isLocked && styles.lessonMetaLocked
                                        ]}>
                                            {lesson.duration}
                                        </Text>
                                        <Text style={[
                                            styles.lessonDifficulty,
                                            isCompleted && styles.lessonMetaCompleted,
                                            isCurrent && styles.lessonMetaCurrent,
                                            isLocked && styles.lessonMetaLocked
                                        ]}>
                                            {lesson.difficulty}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.lessonRight}>
                                    <Ionicons
                                        name={getLessonIcon(lesson.type)}
                                        size={20}
                                        color={
                                            isCompleted ? "#10B981" :
                                                isCurrent ? colors.primary :
                                                    "#9CA3AF"
                                        }
                                        style={styles.lessonIcon}
                                    />
                                    <Ionicons
                                        name={
                                            isCompleted ? "checkmark-circle" :
                                                isCurrent ? "play-circle" :
                                                    "lock-closed"
                                        }
                                        size={24}
                                        color={
                                            isCompleted ? "#10B981" :
                                                isCurrent ? colors.primary :
                                                    "#9CA3AF"
                                        }
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </>
    );
};

export default TopicScreen;