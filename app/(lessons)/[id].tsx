import { useTheme } from '@/context/useTheme';
import { getModuleById } from '@/services/course.service';
import { getLessons } from '@/services/lesson.service';
import { stylesLesson } from '@/styles/lessons';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // Importar o useFocusEffect
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type Lesson = {
    id: number;
    fk_module: number | null;
    title: string;
    conteudo: string | null;
    status: string;
};

const TopicScreen = () => {
    const { mode, colors } = useTheme()
    const styles = stylesLesson(colors)
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [module, setModule] = useState<any>();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true); // Estado de carregamento
    const [refreshing, setRefreshing] = useState(false); // Estado para pull-to-refresh

    // Função para carregar os dados
    const loadData = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        try {
            // Usar Promise.all para carregar em paralelo
            const [lessonsData, moduleData] = await Promise.all([
                getLessons(Number(id)),
                getModuleById(Number(id))
            ]);

            setLessons(lessonsData || []);
            setModule(moduleData?.[0] || null);
        } catch (err) {
            console.error('Erro ao buscar dados:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    // Usar useFocusEffect para carregar sempre que a tela receber foco
    useFocusEffect(
        useCallback(() => {
            loadData();

            // Opcional: limpar dados quando sair da tela
            return () => {
                // Você pode adicionar limpeza aqui se necessário
            };
        }, [loadData])
    );

    // Função para pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData();
    }, [loadData]);

    const handleLessonPress = (lessonId: number) => {
        router.push(`./one/${lessonId}`);
    };

    // Estado de carregamento inicial
    if (loading && !refreshing) {
        return (
            <>
                <Stack.Screen
                    options={{
                        title: '',
                        headerStyle: { backgroundColor: 'rgb(126, 93, 148)' },
                        headerTintColor: "#fff",
                        headerTitleStyle: { fontWeight: "bold" },
                        headerShadowVisible: true,
                        headerShown: true,
                    }}
                />
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 20, color: colors.text, fontSize: 16 }}>
                        Carregando lições...
                    </Text>
                </View>
            </>
        );
    }

    // Estado quando não há lições
    if (!lessons || lessons.length === 0) {
        return (
            <>

                <Stack.Screen
                    options={{
                        title: '',
                        headerStyle: { backgroundColor: 'rgb(126, 93, 148)' },
                        headerTintColor: "#fff",
                        headerTitleStyle: { fontWeight: "bold" },
                        headerShadowVisible: true,
                        headerShown: true,
                    }}
                />

                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <Text style={styles.title}>{module?.title || 'Módulo'}</Text>
                        </View>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[colors.primary]}
                                tintColor={colors.primary}
                            />
                        }
                    >
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Ionicons name="document-text-outline" size={64} color={colors.text} style={{ opacity: 0.5 }} />
                            <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center', marginTop: 20 }}>
                                Nenhuma lição disponível
                            </Text>
                            <TouchableOpacity
                                style={[styles.lessonCard, { marginTop: 20 }]}
                                onPress={loadData}
                            >
                                <Text style={[styles.lessonTitle, { textAlign: 'center' }]}>
                                    Tentar novamente
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: '',
                    headerStyle: { backgroundColor: 'rgb(126, 93, 148)' },
                    headerTintColor: "#fff",
                    headerTitleStyle: { fontWeight: "bold" },
                    headerShadowVisible: false,
                    statusBarAnimation: 'fade',
                }}
            />
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={'white'} />

                <LinearGradient
                    colors={[
                        'rgb(122, 93, 148)',
                        mode === 'dark' ? colors.card : colors.second,
                    ]}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>{module?.title || 'Módulo'}</Text>

                        <View style={styles.topicStats}>
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>
                                    {lessons.length}
                                </Text>
                                <Text style={styles.statLabel}>Lições</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>
                                    {lessons.filter(l => l.status === 'completed').length}
                                </Text>
                                <Text style={styles.statLabel}>Concluídas</Text>
                            </View>
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>
                                    {lessons.filter(l => l.status === 'opened').length}
                                </Text>
                                <Text style={styles.statLabel}>Em andamento</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                >
                    <View style={styles.lessonsHeader}>
                        <Text style={styles.lessonsTitle}>Lições</Text>
                        <TouchableOpacity onPress={loadData} style={styles.refreshButton}>
                            <Ionicons name="refresh" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {lessons.map((lesson, index) => {
                        const isLocked = lesson.status === 'locked';
                        const isCurrent = lesson.status === 'opened';
                        const isCompleted = lesson.status === 'completed';

                        return (
                            <TouchableOpacity
                                key={lesson.id}
                                style={[
                                    styles.lessonCard,
                                    isCurrent && styles.lessonCardCurrent,
                                    isLocked && styles.lessonCardLocked
                                ]}
                                onPress={() => handleLessonPress(lesson.id)}
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

                                    {lesson.conteudo && (
                                        <Text
                                            numberOfLines={2}
                                        >

                                        </Text>
                                    )}
                                </View>

                                <View style={styles.lessonRight}>
                                    <Ionicons
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