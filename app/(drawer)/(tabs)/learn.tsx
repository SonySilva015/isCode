import PrimaryButton from '@/components/butttons/primary';
import SecondButton from '@/components/butttons/second';
import Progress from '@/components/progress/progress';
import { useTheme } from '@/context/useTheme';
import { courseData } from '@/data/learn';
import { createLearnStyles } from '@/styles/learn';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StatusBar, Text, View, } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ScrollView } from 'react-native-gesture-handler';

const Learn = () => {
    const { mode, colors } = useTheme();
    const styles = createLearnStyles(colors)

    const router = useRouter();

    const openTopic = (topicId: number) => {
        router.push(`../../lessons/${topicId}`);
    };

    const openLesson = (lessonId: number) => {
        router.push(`../../lessons/${lessonId}`);
    };

    const getNextLessonId = (topic: any) => {
        const nextLesson = topic.lessons.find((lesson: any) => !lesson.completed);
        return nextLesson ? nextLesson.id : topic.lessons[0].id;
    };


    const calculaEstado = () => {
        let totalLessons = 0;
        let completedLessons = 0;
        let totalTopics = courseData.length;
        let completedTopics = 0;

        courseData.forEach(topic => {
            totalLessons += topic.lessons.length;
            completedLessons += topic.completedLessons;
            if (topic.progress === 100) completedTopics++;
        });

        return { totalLessons, completedLessons, totalTopics, completedTopics };
    };

    const TopicCard = ({ topic }: { topic: any }) => (
        <Animatable.View
            animation="fadeInRight"
            duration={500}
            delay={500}
            easing="ease-out-cubic"
            style={{ flex: 1 }}
        >
            <View style={styles.cardContainer}>
                <LinearGradient

                    colors={[
                        topic.color,  // roxo escuro
                        colors.card,   // rosa intermediário
                        colors.card,
                        colors.card,   // rosa intermediário
                        colors.card,
                        colors.card,
                        colors.card,   // rosa intermediário
                        colors.card,
                        colors.card,   // rosa intermediário
                        colors.card,   // rosa intermediário
                        colors.card,
                        colors.card,
                        colors.card,   // rosa intermediário
                        colors.card,
                        colors.card,   // rosa intermediário
                        colors.card,   // rosa intermediário
                        colors.card,
                        colors.card,
                        colors.card,   // rosa intermediário
                        // rosa intermediário


                    ]}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                {/*MInha Header */}
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${topic.color}20` }]}>
                        <FontAwesome5
                            name={topic.icon}
                            size={24}
                            color={topic.color}
                        />
                    </View>
                    <View style={styles.topicInfo}>
                        <Text style={styles.title}>{topic.title}</Text>
                        <Text style={styles.textBody}>{topic.description}</Text>
                    </View>
                </View>

                <Progress
                    prog={{
                        title: `${topic.completedLessons} de ${topic.totalLessons} lições`,
                        perc: topic.progress
                    }}
                />



                <View style={styles.actions}>
                    <PrimaryButton
                        title="Ver Lições"
                        onPress={() => openTopic(topic.id)}
                        icon={<Ionicons name="book-outline" size={18} color="#fff" />}
                    />
                    <SecondButton
                        title={topic.completedLessons > 0 ? 'Continuar' : 'Começar'}
                        onPress={() => openLesson(getNextLessonId(topic))}
                    />
                </View>


                {topic.progress === 100 && (
                    <View style={styles.completed}>
                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                        <Text style={styles.completedText}>Completo</Text>
                    </View>
                )}


            </View>
        </Animatable.View>
    );

    const stats = calculaEstado();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >

                <Animatable.View
                    animation="fadeInDown"
                    duration={500}
                    delay={500}
                    easing="ease-out-cubic"
                    style={{ flex: 1 }}
                >
                    <View style={[styles.cardContainer, styles.statsCard]}>

                        <View style={styles.statsHeader}>
                            <Ionicons name="stats-chart" size={24} color="#6366F1" />
                            <Text style={styles.statsTitle}>Seu Progresso Geral</Text>
                        </View>
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.completedLessons}/{stats.totalLessons}</Text>
                                <Text style={styles.statLabel}>Lições</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.completedTopics}/{stats.totalTopics}</Text>
                                <Text style={styles.statLabel}>Tópicos</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>
                                    {Math.round((stats.completedLessons / stats.totalLessons) * 100)}%
                                </Text>

                            </View>
                        </View>
                    </View>

                </Animatable.View>
                {courseData.map((topic) => (
                    <TopicCard key={topic.id} topic={topic} />
                ))}


            </ScrollView>
        </View>
    );
};

export default Learn;

