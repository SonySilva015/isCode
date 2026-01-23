import { useTheme } from '@/context/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import CustomAlert, { AlertType } from '@/components/message/sms';
import { enrolledCourses } from '@/services/enrolleCourse.service';

const { width } = Dimensions.get('window');

/* ===================== INTERFACES ===================== */

interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    type: 'free' | 'premium';
    instructor?: string;
    duration?: string;
    rating?: number;
}

interface CourseCardProps {
    course: Course;
    onPress: () => void;
    onEnroll: (courseId: string) => Promise<void>;
    enrollingCourseId: string | null;
}

/* ===================== COURSE CARD ===================== */

const CourseCard: React.FC<CourseCardProps> = ({
    course,
    onPress,
    onEnroll,
    enrollingCourseId,
}) => {
    const isEnrolling = enrollingCourseId === course.id;
    const [imageError, setImageError] = useState(false);
    const scaleValue = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.98,
            useNativeDriver: true,
            speed: 50,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity
                style={styles.courseCard}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.95}
                disabled={isEnrolling}
            >
                {/* Card Header with Image */}
                <View style={styles.courseImageContainer}>
                    {course.imageUrl && !imageError ? (
                        <Image
                            source={{ uri: course.imageUrl }}
                            style={styles.courseImage}
                            resizeMode="cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            style={styles.courseImagePlaceholder}
                        >
                            <MaterialIcons name="school" size={40} color="#fff" />
                        </LinearGradient>
                    )}

                    {/* Type Badge */}
                    <LinearGradient
                        colors={course.type === 'free' ? ['#10b981', '#059669'] : ['#f59e0b', '#d97706']}
                        style={styles.courseTypeBadge}
                    >
                        <Text style={styles.courseTypeText}>
                            {course.type === 'free' ? 'GRÁTIS' : 'PREMIUM'}
                        </Text>
                    </LinearGradient>

                    {/* Category Tag */}
                    {course.category && (
                        <View style={styles.categoryTag}>
                            <Text style={styles.categoryText}>{course.category}</Text>
                        </View>
                    )}

                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.3)']}
                        style={styles.imageOverlay}
                    />
                </View>

                {/* Card Content */}
                <View style={styles.courseContent}>
                    {/* Course Meta Info */}
                    <View style={styles.metaContainer}>
                        {course.duration && (
                            <View style={styles.metaItem}>
                                <MaterialIcons name="schedule" size={14} color="#64748b" />
                                <Text style={styles.metaText}>{course.duration}</Text>
                            </View>
                        )}
                        {course.instructor && (
                            <View style={styles.metaItem}>
                                <MaterialIcons name="person" size={14} color="#64748b" />
                                <Text style={styles.metaText}>{course.instructor}</Text>
                            </View>
                        )}
                        {course.rating && (
                            <View style={styles.metaItem}>
                                <MaterialIcons name="star" size={14} color="#f59e0b" />
                                <Text style={[styles.metaText, { color: '#f59e0b' }]}>{course.rating}</Text>
                            </View>
                        )}
                    </View>

                    {/* Course Title */}
                    <Text style={styles.courseTitle} numberOfLines={2}>
                        {course.title}
                    </Text>

                    {/* Course Description */}
                    <Text style={styles.courseDescription} numberOfLines={2}>
                        {course.description}
                    </Text>

                    {/* Enroll Button */}
                    <TouchableOpacity
                        style={[
                            styles.enrollButton,
                            isEnrolling && styles.enrollButtonDisabled,
                        ]}
                        onPress={(e) => {
                            e.stopPropagation();
                            if (!isEnrolling) {
                                onEnroll(course.id);
                            }
                        }}
                        disabled={isEnrolling}
                    >
                        {isEnrolling ? (
                            <View style={styles.enrollButtonContent}>
                                <ActivityIndicator
                                    size="small"
                                    color="#fff"
                                    style={styles.enrollSpinner}
                                />
                                <Text style={styles.enrollButtonText}>Processando...</Text>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.enrollButtonText}>Inscrever-se</Text>
                                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

/* ===================== SCREEN ===================== */

const CoursesScreen: React.FC = () => {
    const { colors } = useTheme();
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        free: 0,
        premium: 0,
    });

    const [alert, setAlert] = useState<{
        visible: boolean;
        title: string;
        message: string;
        type: AlertType;
        action?: () => void;
    }>({
        visible: false,
        title: '',
        message: '',
        type: 'info',
    });

    const API_URL = 'https://server-iscode.vercel.app/courses';

    /* ===================== DATA ===================== */

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const data: Course[] = await response.json(); // Correção aqui
            setCourses(data);
            setFilteredCourses(data);

            // Calculate stats
            const freeCount = data.filter((c: Course) => c.type === 'free').length;
            const premiumCount = data.filter((c: Course) => c.type === 'premium').length;
            setStats({
                total: data.length,
                free: freeCount,
                premium: premiumCount,
            });
        } catch (error) {
            setCourses([]);
            setFilteredCourses([]);
            console.error('Erro ao buscar cursos:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    /* ===================== ACTIONS ===================== */

    const handleEnroll = async (courseId: string) => {
        setEnrollingCourseId(courseId);

        try {
            const result = await enrolledCourses(courseId);
            console.log('Resultado da inscrição:', result);

            switch (result) {
                case 'ok':
                    setAlert({
                        visible: true,
                        title: 'Inscrição Realizada! 🎉',
                        message: 'Parabéns! Você foi inscrito no curso com sucesso.',
                        type: 'success',
                        action: () => router.push('/(drawer)/(tabs)/learn'),
                    });
                    break;

                case 'already_enrolled':
                    setAlert({
                        visible: true,
                        title: 'Curso Já Inscrito',
                        message: 'Você já está inscrito neste curso. Acesse seus cursos para continuar aprendendo.',
                        type: 'warning',
                    });
                    break;

                case 'payment_required':
                    setAlert({
                        visible: true,
                        title: 'Conteúdo Premium',
                        message: 'Este curso requer assinatura premium. Desbloqueie todos os recursos!',
                        type: 'info',
                        action: () => router.push('/payment'),
                    });
                    break;

                case 'error':
                    setAlert({
                        visible: true,
                        title: 'Erro na Inscrição',
                        message: 'Não foi possível completar a inscrição. Por favor, tente novamente.',
                        type: 'error',
                    });
                    break;
            }
        } catch (error) {
            console.error('Erro ao processar inscrição:', error);
            setAlert({
                visible: true,
                title: 'Erro de Conexão',
                message: 'Verifique sua conexão com a internet e tente novamente.',
                type: 'error',
            });
        } finally {
            setEnrollingCourseId(null);
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);

        if (!text.trim()) {
            setFilteredCourses(courses);
            return;
        }

        const q = text.toLowerCase();
        setFilteredCourses(
            courses.filter(
                (c) =>
                    c.title.toLowerCase().includes(q) ||
                    c.description.toLowerCase().includes(q) ||
                    c.category?.toLowerCase().includes(q) ||
                    c.instructor?.toLowerCase().includes(q)
            )
        );
    };

    /* ===================== UI ===================== */

    if (loading) {
        return (
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.loadingContainer}
            >
                <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Carregando catálogo...</Text>
                </View>
            </LinearGradient>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerTitle}>Cursos Disponíveis</Text>
                        <Text style={styles.headerSubtitle}>
                            {stats.total} cursos • {stats.free} gratuitos • {stats.premium} premium
                        </Text>
                    </View>
                    <MaterialIcons name="library-books" size={28} color="#fff" />
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <MaterialIcons name="search" size={20} color="#667eea" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar cursos, instrutores, categorias..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <MaterialIcons name="close" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </LinearGradient>

            {/* Courses List */}
            {filteredCourses.length > 0 ? (
                <FlatList
                    data={filteredCourses}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={fetchCourses}
                            colors={['#667eea']}
                            tintColor="#667eea"
                        />
                    }
                    renderItem={({ item }) => (
                        <CourseCard
                            course={item}
                            onPress={() => router.push(`/course/${item.id}`)}
                            onEnroll={handleEnroll}
                            enrollingCourseId={enrollingCourseId}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="search-off" size={80} color="#cbd5e1" />
                    <Text style={styles.emptyTitle}>Nenhum curso encontrado</Text>
                    <Text style={styles.emptyText}>
                        {searchQuery
                            ? `Não encontramos resultados para "${searchQuery}"`
                            : 'Não há cursos disponíveis no momento'
                        }
                    </Text>
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearSearchButton}
                            onPress={() => setSearchQuery('')}
                        >
                            <Text style={styles.clearSearchText}>Limpar busca</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Alert */}
            <CustomAlert
                visible={alert.visible}
                title={alert.title}
                message={alert.message}
                type={alert.type}
                buttons={[
                    {
                        text: 'OK',
                        style: 'primary',
                        onPress: () => {
                            setAlert((prev) => ({ ...prev, visible: false }));
                            alert.action?.();
                        },
                    },
                ]}
                onClose={() => setAlert((prev) => ({ ...prev, visible: false }))}
            />
        </View>
    );
};

export default CoursesScreen;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContent: {
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 4,
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '500',
    },
    searchContainer: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 4,
    },
    searchBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    searchInput: {
        marginLeft: 12,
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    courseCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 8,
    },
    courseImageContainer: {
        height: 150,
        position: 'relative',
    },
    courseImage: {
        width: '100%',
        height: '100%',
    },
    courseImagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#667eea',
    },
    courseTypeBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    courseTypeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    categoryTag: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    categoryText: {
        color: '#1e293b',
        fontSize: 12,
        fontWeight: '600',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    courseContent: {
        padding: 20,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        flexWrap: 'wrap',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        marginBottom: 4,
    },
    metaText: {
        marginLeft: 4,
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    courseTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 8,
        lineHeight: 26,
    },
    courseDescription: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 20,
        lineHeight: 20,
    },
    enrollButton: {
        backgroundColor: '#667eea',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    enrollButtonDisabled: {
        backgroundColor: '#94a3b8',
        shadowColor: '#94a3b8',
    },
    enrollButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    enrollSpinner: {
        marginRight: 8,
    },
    enrollButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        marginRight: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#334155',
        marginTop: 20,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
    },
    clearSearchButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#e2e8f0',
        borderRadius: 12,
    },
    clearSearchText: {
        color: '#475569',
        fontWeight: '600',
        fontSize: 14,
    },
});