import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react'; // Adicionei useRef
import {
    ActivityIndicator,
    Animated, Dimensions, Modal, Pressable,
    RefreshControl,
    ScrollView,
    StatusBar, Text, TouchableOpacity, View
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import PrimaryButton from '@/components/butttons/primary';
import Progress from '@/components/progress/progress';
import { useTheme } from '@/context/useTheme';
import { getLocalCourses, getModuleByCourse } from '@/services/course.service';
import { createLearnStyles } from '@/styles/learn';

const { height } = Dimensions.get('window');

const Learn = () => {
    const { mode, colors } = useTheme();
    const styles = createLearnStyles(colors);
    const router = useRouter();

    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [modules, setModules] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingModules, setLoadingModules] = useState(false);
    const slideAnim = useState(new Animated.Value(-height))[0];

    // Use ref para evitar dependência cíclica
    const selectedCourseRef = useRef<any>(null);
    useEffect(() => {
        selectedCourseRef.current = selectedCourse;
    }, [selectedCourse]);

    // Estado para acompanhar atualizações
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    // Função para calcular o progresso com duas casas decimais
    const calculateProgress = useCallback((completed: number, total: number): number => {
        if (total === 0) return 0;
        const progress = (completed / total) * 100;
        // Limita a duas casas decimais
        return Math.round(progress * 100) / 100;
    }, []);

    const loadCourses = useCallback(async () => {
        try {
            const data = await getLocalCourses();
            setCourses(data || []);

            // Se houver cursos mas nenhum selecionado, seleciona o primeiro
            if (data && data.length > 0 && !selectedCourseRef.current) {
                const firstCourse = data[0];
                setSelectedCourse(firstCourse);
                return firstCourse;
            }

            return selectedCourseRef.current;
        } catch (error) {
            console.error('Erro ao carregar cursos:', error);
            return null;
        }
    }, []); // Removi a dependência de selectedCourse

    // Função para carregar módulos do curso selecionado
    const loadModules = useCallback(async (course: any) => {
        if (!course) return;

        setLoadingModules(true);
        try {
            const data = await getModuleByCourse(course.id);

            // Processa os módulos para calcular porcentagens com duas casas decimais
            const processedModules = data.map((module: any) => ({
                ...module,
                porcent: calculateProgress(module.lessons_completed || 0, module.lessons_count || 0),
                // Garante que temos os valores numéricos corretos
                lessons_completed: module.lessons_completed || 0,
                lessons_count: module.lessons_count || 0
            }));

            setModules(processedModules || []);
        } catch (error) {
            console.error('Erro ao carregar módulos:', error);
            setModules([]);
        } finally {
            setLoadingModules(false);
        }
    }, [calculateProgress]);

    // Função para carregar todos os dados
    const loadAllData = useCallback(async () => {
        setLoading(true);
        try {
            const courseToUse = await loadCourses();
            if (courseToUse) {
                await loadModules(courseToUse);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            // Atualiza o timestamp para forçar recálculo
            setLastUpdate(Date.now());
        }
    }, [loadCourses, loadModules]);

    // Carregar dados quando a tela receber foco
    useFocusEffect(
        useCallback(() => {
            // Força recarregar sempre que a tela recebe foco
            loadAllData();

            // Limpeza
            return () => {
                // Pode adicionar limpeza aqui se necessário
            };
        }, [loadAllData])
    );

    // Adicionei um useEffect para reagir a mudanças de lastUpdate
    useEffect(() => {
        if (selectedCourse && modules.length > 0) {
            // Atualiza o progresso do curso com base nos módulos
            const { completedLessons, totalLessons } = calculaEstado();
            const courseProgress = calculateProgress(completedLessons, totalLessons);

            // Só atualiza se o progresso for diferente
            if (selectedCourse.progress !== courseProgress) {
                setSelectedCourse((prev: any) => ({
                    ...prev,
                    progress: courseProgress
                }));
            }
        }
    }, [lastUpdate, modules, selectedCourse, calculateProgress, calculaEstado]);

    // Função para pull-to-refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadAllData();
    }, [loadAllData]);

    // Abrir modal com animação
    const openModal = useCallback(() => {
        setModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [slideAnim]);

    // Fechar modal
    const closeModal = useCallback(() => {
        Animated.timing(slideAnim, {
            toValue: -height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setModalVisible(false));
    }, [slideAnim]);

    // Selecionar curso
    const handleSelectCourse = useCallback(async (course: any) => {
        setSelectedCourse(course);
        closeModal();
        // Carregar módulos do novo curso selecionado
        await loadModules(course);
        // Atualiza o timestamp
        setLastUpdate(Date.now());
    }, [closeModal, loadModules]);

    const openTopic = useCallback((ModuleId: number) => {
        router.push(`/(lessons)/${ModuleId}`);
    }, [router]);

    const calculaEstado = useCallback(() => {
        if (!modules || modules.length === 0) {
            return {
                totalLessons: 0,
                completedLessons: 0,
                totalModules: 0,
                completedModules: 0
            };
        }

        let totalLessons = 0;
        let completedLessons = 0;
        let totalModules = modules.length;
        let completedModules = 0;

        modules.forEach(module => {
            totalLessons += module.lessons_count || 0;
            if (module.status === 'completed') completedModules++;
            completedLessons += module.lessons_completed || 0;
        });

        return { totalLessons, completedLessons, totalModules, completedModules };
    }, [modules]);

    // Função para obter progresso do curso formatado
    const getCourseProgress = useCallback(() => {
        if (!selectedCourse) return '0%';

        // Tenta usar o progresso calculado, caso contrário usa do curso
        if (modules.length > 0) {
            const { completedLessons, totalLessons } = calculaEstado();
            const progress = calculateProgress(completedLessons, totalLessons);
            return `${progress.toFixed(2)}%`;
        }

        return `${(selectedCourse.progress || 0).toFixed(2)}%`;
    }, [selectedCourse, modules, calculaEstado, calculateProgress]);

    const TopicCard = ({ module }: { module: any }) => {
        // Verifica se temos os valores necessários
        const completedLessons = module.lessons_completed || 0;
        const totalLessons = module.lessons_count || 0;
        const progressPercentage = module.porcent || 0;

        // Texto para mostrar na barra de progresso
        const progressText = `${completedLessons} de ${totalLessons} lições`;

        return (
            <View style={[styles.cardContainer, module.status === 'locked' && styles.cardLocked]}>
                <View style={styles.cardHeader}>
                    <View style={styles.topicInfo}>
                        <Text style={styles.title}>{module.title}</Text>
                        <Text style={styles.textBody}>{module.description}</Text>
                    </View>
                </View>

                {/* Componente Progress - mostra o número de lições */}
                <Progress
                    prog={{
                        title: progressText, // Mostra "X de Y lições"
                        perc: progressPercentage // Porcentagem para a barra visual
                    }}
                />

                <View style={styles.actions}>
                    <PrimaryButton
                        title={progressPercentage > 0 ? 'Continuar' : 'Começar'}
                        disabled={module.status === 'locked'}
                        onPress={() => openTopic(module.id)}
                        icon={<Ionicons name="book-outline" size={18} color="#fff" />}
                    />
                </View>

                <View style={styles.completed}>
                    <Ionicons
                        name={module.status === 'completed' ? "checkmark-circle" :
                            module.status === 'opened' ? "play-circle" : "lock-closed"
                        }
                        size={20}
                        color={mode === 'dark' ? 'white' : 'black'}
                    />
                </View>
            </View>
        );
    };

    const stats = calculaEstado();

    // Estado de carregamento
    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 20, color: colors.text, fontSize: 16 }}>
                    Carregando cursos...
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

            {/* ================= HEADER DROPDOWN ================= */}
            <View style={{ padding: 16, backgroundColor: colors.card }}>
                <TouchableOpacity
                    onPress={openModal}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <View>
                        <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>
                            {selectedCourse?.title ?? 'Selecione um curso'}
                        </Text>
                        <Text style={{ color: colors.primary, fontSize: 12, marginTop: 2 }}>
                            Progresso: {stats.completedLessons}/{stats.totalLessons} lições ({getCourseProgress()})
                        </Text>
                    </View>
                    <Ionicons name="chevron-down" size={20} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* ================= MODAL DE CURSOS ================= */}
            <Modal transparent visible={modalVisible} animationType="none">
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeModal} />
                <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
                    <ScrollView
                        contentContainerStyle={{ padding: 16 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {courses.map((course) => (
                            <Pressable
                                key={course.id}
                                onPress={() => handleSelectCourse(course)}
                                style={[styles.courseCard, {
                                    backgroundColor: selectedCourse?.id === course.id ? colors.primary : colors.card
                                }]}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        color: selectedCourse?.id === course.id ? '#fff' : colors.text,
                                        fontWeight: '600',
                                        fontSize: 16
                                    }}>
                                        {course.title}
                                    </Text>
                                    <Text style={{
                                        color: selectedCourse?.id === course.id ? 'rgba(255,255,255,0.8)' : colors.text,
                                        fontSize: 12,
                                        marginTop: 2
                                    }}>
                                        Progresso: {(course.progress || 0).toFixed(2)}%
                                    </Text>
                                </View>
                                {selectedCourse?.id === course.id && (
                                    <Ionicons name="checkmark" size={20} color="#fff" style={{ marginLeft: 8 }} />
                                )}
                            </Pressable>
                        ))}
                    </ScrollView>
                </Animated.View>
            </Modal>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            >
                {/* ================= PROGRESSO GERAL ================= */}
                <Animatable.View animation="fadeInDown" duration={500} delay={500} easing="ease-out-cubic" style={{ flex: 1 }}>
                    <View style={[styles.cardContainer, styles.statsCard]}>
                        <View style={styles.statsHeader}>
                            <Ionicons name="stats-chart" size={24} color="#6366F1" />
                            <Text style={styles.statsTitle}>Seu Progresso Geral</Text>
                            <TouchableOpacity onPress={loadAllData} style={{ marginLeft: 'auto' }}>
                                <Ionicons name="refresh" size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.completedLessons}/{stats.totalLessons}</Text>
                                <Text style={styles.statLabel}>Lições</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{stats.completedModules}/{stats.totalModules}</Text>
                                <Text style={styles.statLabel}>Módulos</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>
                                    {getCourseProgress()}
                                </Text>
                                <Text style={styles.statLabel}>Progresso</Text>
                            </View>
                        </View>
                    </View>
                </Animatable.View>

                {/* Indicador de carregamento dos módulos */}
                {loadingModules && (
                    <View style={[styles.cardContainer, { alignItems: 'center', padding: 20 }]}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={{ color: colors.text, marginTop: 10 }}>
                            Carregando módulos...
                        </Text>
                    </View>
                )}

                {/* Lista de módulos */}
                {modules.length === 0 && !loadingModules ? (
                    <View style={[styles.cardContainer, { alignItems: 'center', padding: 20 }]}>
                        <Ionicons name="book-outline" size={48} color={colors.text} style={{ opacity: 0.5 }} />
                        <Text style={{ color: colors.text, fontSize: 16, textAlign: 'center', marginTop: 16 }}>
                            Nenhum módulo disponível para este curso
                        </Text>
                        <TouchableOpacity
                            style={{
                                marginTop: 16,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                backgroundColor: colors.primary,
                                borderRadius: 8
                            }}
                            onPress={loadAllData}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600' }}>Recarregar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    modules.map((module) => (
                        <TopicCard key={module.id} module={module} />
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default Learn;