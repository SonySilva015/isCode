import { useTheme } from '@/context/useTheme';
import { db } from '@/db';
import { users } from '@/db/schemas';
import { getLocalCourses } from '@/services/course.service';
import { getCurrentXpLevel } from '@/services/progress_here.service';
import { stylesProfile } from '@/styles/profile';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { eq } from 'drizzle-orm';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

/* =========================
   INTERFACES
========================= */
interface User {
    id: number;
    name: string;
    email: string;
    age: number | null;
    picture: string | null;
    plan: 'free' | 'premium';
    xp: number;
    level: string;
    location: string | null;
}

interface XpLevel {
    id: number;
    level: number | null;
    xp: number | null;
    nextLevel: number | null;
}

interface Course {
    id: number;
    title: string;
    description: string | null;
    type: string | null;
    modules_count: number;
    progress: number;
}

interface Achievement {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
    earned: boolean;
    progress?: number;
}

const STORAGE_PREFIX = 'user_photo_';

const ProfileScreen = ({ navigation }: any) => {
    const { colors } = useTheme();
    const styles = stylesProfile(colors);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'sobre' | 'cursos' | 'conquistas'>('sobre');
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [editedName, setEditedName] = useState('');
    const [editedAge, setEditedAge] = useState<string>('');
    const [editedLocation, setEditedLocation] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [xpLevel, setXpLevel] = useState<XpLevel | null>(null);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [tempPhotoUri, setTempPhotoUri] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [userModules, setUserModules] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [changeEmailModal, setChangeEmailModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [confirmNewEmail, setConfirmNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [changingEmail, setChangingEmail] = useState(false);

    const headerScrollY = new Animated.Value(0);

    /* =========================
       ANIMAÇÕES
    ========================= */
    const headerHeight = headerScrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [280, 200],
        extrapolate: 'clamp',
    });

    const avatarScale = headerScrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.8],
        extrapolate: 'clamp',
    });

    /* =========================
       BUSCAR DADOS DO USUÁRIO
    ========================= */
    const fetchUserData = useCallback(async () => {
        try {
            const [userResult] = await db
                .select()
                .from(users)
                .limit(1);

            if (!userResult) {
                Alert.alert('Erro', 'Usuário não encontrado');
                return;
            }

            const userData = userResult as User;
            const xp = await getCurrentXpLevel();
            setXpLevel(xp);
            setUser(userData);
            setEditedName(userData.name ?? '');
            setEditedAge(userData.age ? userData.age.toString() : '');
            setEditedLocation(userData.location ?? '');
            setEditedEmail(userData.email ?? '');

            // Buscar foto
            try {
                const storedPhoto = await AsyncStorage.getItem(
                    `${STORAGE_PREFIX}${userData.email}`
                );
                if (storedPhoto) {
                    setPhotoUri(storedPhoto);
                    setTempPhotoUri(storedPhoto);
                } else {
                    setPhotoUri(null);
                    setTempPhotoUri(null);
                }
            } catch {
                console.warn('Erro ao carregar foto do AsyncStorage');
                setPhotoUri(null);
                setTempPhotoUri(null);
            }

        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
        }
    }, []);

    /* =========================
       BUSCAR CURSOS DO USUÁRIO
    ========================= */
    const fetchUserCourses = useCallback(async () => {
        try {
            const userCourses = await getLocalCourses();
            setCourses(userCourses);
            const flattenedModules = userCourses.flatMap(course => course.modules_count);
            setUserModules(flattenedModules);
        } catch (error) {
            console.error('Erro ao buscar cursos:', error);
        }
    }, []);

    /* =========================
       ATUALIZAR TODOS OS DADOS
    ========================= */
    const refreshAllData = useCallback(async () => {
        try {
            setRefreshing(true);
            await Promise.all([
                fetchUserData(),
                fetchUserCourses()
            ]);
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, [fetchUserData, fetchUserCourses]);

    /* =========================
       EFEITO: ATUALIZAR AO ABRIR A TELA
    ========================= */
    useFocusEffect(
        useCallback(() => {
            refreshAllData();

            // Limpeza (opcional)
            return () => {
                console.log('Profile screen unfocused');
            };
        }, [refreshAllData])
    );

    /* =========================
       EFEITO: CARREGAMENTO INICIAL
    ========================= */
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                await refreshAllData();
            } catch (error) {
                console.error('Erro no carregamento inicial:', error);
            }
        };

        loadInitialData();
    }, []);

    /* =========================
       CALCULAR ESTATÍSTICAS REAIS
    ========================= */
    const calculateStats = useMemo(() => {
        if (courses.length === 0) {
            return {
                totalCourses: 0,
                completedCourses: 0,
                enrolledCourses: 0,
                studyTime: 0,
                streakDays: 0,
                totalModules: 0,
                completedModules: 0,
                totalLessons: 0,
                completedLessons: 0,
            };
        }

        const totalModules = userModules.length;
        const completedModules = userModules.filter(module => module.porcent === 100).length;

        const totalLessons = userModules.reduce((sum, module) => sum + (module.lessons_count || 0), 0);
        const completedLessons = userModules.reduce((sum, module) => sum + (module.lessons_completed || 0), 0);

        // Cursos completos (progresso >= 100%)
        const completedCourses = courses.filter(course => course.progress >= 100).length;

        return {
            totalCourses: courses.length,
            completedCourses,
            enrolledCourses: courses.length - completedCourses,
            streakDays: user?.xp ? Math.min(Math.floor(user.xp / 100), 365) : 0,
            totalModules,
            completedModules,
            totalLessons,
            completedLessons,
        };
    }, [courses, userModules, user?.xp]);


    /* =========================
       IMAGE PICKER
    ========================= */
    const pickImage = useCallback(async (useCamera = false) => {
        try {
            const permission = useCamera
                ? await ImagePicker.requestCameraPermissionsAsync()
                : await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert('Permissão necessária', 'Precisamos de permissão para continuar');
                return;
            }

            const result = useCamera
                ? await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.85,
                })
                : await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.85,
                });

            if (!result.canceled && result.assets?.[0]?.uri) {
                setTempPhotoUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert('Erro', 'Falha ao selecionar imagem');
        }
    }, []);

    /* =========================
       REMOVER FOTO
    ========================= */
    const removePhoto = useCallback(() => {
        Alert.alert(
            'Remover Foto',
            'Tem certeza que deseja remover sua foto de perfil?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => {
                        setTempPhotoUri(null);
                    }
                }
            ]
        );
    }, []);

    /* =========================
       VALIDAR EMAIL
    ========================= */
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    /* =========================
       ALTERAR EMAIL
    ========================= */
    const handleChangeEmail = useCallback(async () => {
        if (!user) return;

        // Validações
        if (!newEmail.trim()) {
            Alert.alert('Erro', 'Por favor, digite o novo email');
            return;
        }

        if (!validateEmail(newEmail)) {
            Alert.alert('Erro', 'Por favor, digite um email válido');
            return;
        }

        if (newEmail !== confirmNewEmail) {
            Alert.alert('Erro', 'Os emails não coincidem');
            return;
        }

        if (!password.trim()) {
            Alert.alert('Erro', 'Por favor, digite sua senha atual');
            return;
        }

        // Verificar se o novo email é diferente do atual
        if (newEmail === user.email) {
            Alert.alert('Aviso', 'O novo email é igual ao atual');
            return;
        }

        try {
            setChangingEmail(true);

            // Verificar se o email já existe no banco (opcional)
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.email, newEmail))
                .limit(1);

            if (existingUser.length > 0) {
                Alert.alert('Erro', 'Este email já está em uso por outro usuário');
                return;
            }

            // Aqui você deve verificar a senha do usuário
            // Como não temos sistema de autenticação, vamos fazer uma verificação simples
            // Em um sistema real, você faria a autenticação aqui
            Alert.alert(
                'Confirmação',
                `Deseja alterar seu email de ${user.email} para ${newEmail}?`,
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel'
                    },
                    {
                        text: 'Confirmar',
                        onPress: async () => {
                            try {
                                // Atualizar email no banco de dados
                                await db
                                    .update(users)
                                    .set({ email: newEmail.trim() })
                                    .where(eq(users.id, user.id));

                                // Atualizar foto no AsyncStorage (se houver)
                                if (photoUri) {
                                    const oldKey = `${STORAGE_PREFIX}${user.email}`;
                                    const newKey = `${STORAGE_PREFIX}${newEmail.trim()}`;
                                    const photo = await AsyncStorage.getItem(oldKey);
                                    if (photo) {
                                        await AsyncStorage.setItem(newKey, photo);
                                        await AsyncStorage.removeItem(oldKey);
                                    }
                                }

                                // Atualizar estado local
                                setUser(prev => prev ? { ...prev, email: newEmail.trim() } : prev);
                                setEditedEmail(newEmail.trim());

                                Alert.alert('Sucesso', 'Email alterado com sucesso!');
                                setChangeEmailModal(false);

                                // Limpar campos
                                setNewEmail('');
                                setConfirmNewEmail('');
                                setPassword('');

                                // Atualizar dados
                                await refreshAllData();

                            } catch (error) {
                                console.error('Erro ao alterar email:', error);
                                Alert.alert('Erro', 'Não foi possível alterar o email');
                            }
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('Erro ao verificar email:', error);
            Alert.alert('Erro', 'Não foi possível verificar o email');
        } finally {
            setChangingEmail(false);
        }
    }, [user, newEmail, confirmNewEmail, password, photoUri, refreshAllData]);

    /* =========================
       SALVAR PERFIL
    ========================= */
    const handleSaveProfile = useCallback(async () => {
        if (!user) return;

        if (editedName.trim().length < 3) {
            Alert.alert('Erro', 'O nome deve ter pelo menos 3 caracteres');
            return;
        }

        // Validar idade
        const ageNum = parseInt(editedAge);
        if (editedAge && (isNaN(ageNum) || ageNum < 1 || ageNum > 120)) {
            Alert.alert('Erro', 'Idade deve ser um número entre 1 e 120');
            return;
        }

        // Validar email (se foi alterado)
        if (editedEmail !== user.email) {
            if (!validateEmail(editedEmail)) {
                Alert.alert('Erro', 'Por favor, digite um email válido');
                return;
            }
        }

        try {
            setSaving(true);

            // Processar foto
            if (tempPhotoUri === null && photoUri !== null) {
                // Remover foto se existia e agora está null
                await AsyncStorage.removeItem(`${STORAGE_PREFIX}${user.email}`);
                setPhotoUri(null);
            } else if (tempPhotoUri && tempPhotoUri !== photoUri) {
                // Adicionar ou atualizar foto
                await AsyncStorage.setItem(
                    `${STORAGE_PREFIX}${user.email}`,
                    tempPhotoUri
                );
                setPhotoUri(tempPhotoUri);
            }

            // Preparar dados para atualização
            const updateData: any = {
                name: editedName.trim(),
                age: editedAge ? parseInt(editedAge) : null,
                location: editedLocation.trim() || null
            };

            // Se email foi alterado, adicionar ao updateData
            if (editedEmail !== user.email) {
                updateData.email = editedEmail.trim();

                // Mover foto para o novo email no AsyncStorage
                if (photoUri) {
                    const oldKey = `${STORAGE_PREFIX}${user.email}`;
                    const newKey = `${STORAGE_PREFIX}${editedEmail.trim()}`;
                    const photo = await AsyncStorage.getItem(oldKey);
                    if (photo) {
                        await AsyncStorage.setItem(newKey, photo);
                        await AsyncStorage.removeItem(oldKey);
                    }
                }
            }

            // Atualizar no banco de dados
            await db
                .update(users)
                .set(updateData)
                .where(eq(users.id, user.id));

            // Atualizar estado local
            setUser(prev =>
                prev ? { ...prev, ...updateData } : prev
            );

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            setEditModalVisible(false);

            // Atualizar dados após salvar
            await refreshAllData();

        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            Alert.alert('Erro', 'Não foi possível salvar as alterações');
        } finally {
            setSaving(false);
        }
    }, [user, editedName, editedAge, editedLocation, editedEmail, tempPhotoUri, photoUri, refreshAllData]);

    /* =========================
       NAVEGAR PARA PAGAMENTO
    ========================= */
    const handleNavigateToPayment = useCallback(() => {
        if (user?.plan === 'premium') {
            Alert.alert('Plano Premium', 'Você já possui o plano Premium!');
        } else {
            router.push('/payment');
        }
    }, [user?.plan]);

    /* =========================
       REFRESH MANUAL
    ========================= */
    const handleManualRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await refreshAllData();
        } catch (error) {
            console.error('Erro ao atualizar:', error);
        } finally {
            setRefreshing(false);
        }
    }, [refreshAllData]);

    /* =========================
       HELPERS
    ========================= */
    const hasPhoto = useMemo(
        () => Boolean(photoUri && photoUri.trim().length > 0),
        [photoUri]
    );

    const getLevelBadge = (level: string) => {
        const levels: Record<string, { label: string, color: string }> = {
            'amador': { label: 'Amador', color: '#94a3b8' },
            'iniciante': { label: 'Iniciante', color: '#10b981' },
            'intermediário': { label: 'Intermediário', color: '#3b82f6' },
            'avançado': { label: 'Avançado', color: '#f59e0b' },
            'especialista': { label: 'Especialista', color: '#ef4444' },
            'mestre': { label: 'Mestre', color: '#8b5cf6' },
        };
        return levels[level] || { label: level, color: '#94a3b8' };
    };

    /* =========================
       RENDER ITEMS
    ========================= */
    const renderCourseCard = (course: Course, index: number) => {
        const levelBadge = getLevelBadge(course.type || 'amador');

        return (
            <View key={course.id} style={styles.courseCard}>
                <LinearGradient
                    colors={[levelBadge.color, `${levelBadge.color}80`]}
                    style={styles.courseTypeBadge}
                >
                    <Text style={styles.courseTypeText}>
                        {levelBadge.label.toUpperCase()}
                    </Text>
                </LinearGradient>

                <View style={styles.courseContent}>
                    <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
                    <Text style={styles.courseDescription} numberOfLines={2}>
                        {course.description || 'Sem descrição'}
                    </Text>

                    <View style={styles.courseProgressContainer}>
                        <View style={styles.courseProgressBar}>
                            <View
                                style={[
                                    styles.courseProgressFill,
                                    { width: `${course.progress || 0}%` }
                                ]}
                            />
                        </View>
                        <Text style={styles.courseProgressText}>{course.progress || 0}%</Text>
                    </View>

                    <View style={styles.courseModulesInfo}>
                        <FontAwesome5 name="layer-group" size={12} color="#64748b" />
                        <Text style={styles.courseModulesText}>
                            {course.modules_count || 0} módulos
                        </Text>
                    </View>
                </View>
            </View>
        );
    };


    /* =========================
       LOADING
    ========================= */
    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.emptyState}>
                <MaterialIcons name="error-outline" size={60} color="#cbd5e1" />
                <Text style={styles.emptyStateTitle}>Usuário não encontrado</Text>
                <Text style={styles.emptyStateText}>
                    Faça login para acessar seu perfil.
                </Text>
            </View>
        );
    }

    /* =========================
       DADOS PARA RENDERIZAÇÃO
    ========================= */
    const levelBadge = getLevelBadge(user.level);


    // Calcular progresso para próximo nível
    const xpProgress = xpLevel ?
        Math.round(((xpLevel.xp || 1) % 1000) / (xpLevel.nextLevel || 1000) * 100) :
        0;

    // Informações da aba Sobre - COM PLANO VISÍVEL E CLICÁVEL
    const infoItems = [
        {
            icon: 'mail-outline',
            label: 'Email',
            value: user.email,
            clickable: false
        },
        {
            icon: 'star-outline',
            label: 'Nível',
            value: xpLevel?.level,
            color: levelBadge.color,
            clickable: false
        },
        {
            icon: 'trending-up-outline',
            label: 'XP',
            value: xpLevel?.xp || 0,
            clickable: false
        },
        {
            icon: 'person-outline',
            label: 'Idade',
            value: user.age ? `${user.age} anos` : 'Não informada',
            clickable: false
        },
        {
            icon: 'location-outline',
            label: 'Localização',
            value: user.location || 'Não informada',
            clickable: false
        },
        // NOVO ITEM: PLANO DO USUÁRIO
        {
            icon: user.plan === 'premium' ? 'diamond' : 'card-outline',
            label: 'Plano Atual',
            value: user.plan === 'premium' ? 'Premium' : 'Free',
            color: user.plan === 'premium' ? '#FFD700' : '#94a3b8',
            clickable: true, // Este é clicável
            isPlan: true // Flag para identificar que é o item do plano
        },
    ];

    /* =========================
       RENDER
    ========================= */
    return (
        <View style={styles.container}>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: headerScrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleManualRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                        progressBackgroundColor="#fff"
                    />
                }
            >
                {/* HEADER COM GRADIENTE */}
                <Animated.View style={[styles.gradientHeader, { height: headerHeight }]}>
                    <LinearGradient
                        colors={[colors.gradient.primary, colors.second]}
                        style={styles.gradientHeaderInner}

                    >
                        <View style={styles.headerContent}>
                            <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
                                <View style={styles.avatarContainer}>
                                    {hasPhoto ? (
                                        <Image
                                            source={{ uri: photoUri! }}
                                            style={styles.avatar}
                                            onError={() => setPhotoUri(null)}
                                        />
                                    ) : (
                                        <View style={styles.avatarPlaceholder}>
                                            <Ionicons name="person" size={50} color="rgba(255,255,255,0.9)" />
                                        </View>
                                    )}

                                    <TouchableOpacity
                                        style={styles.uploadButton}
                                        onPress={() => setEditModalVisible(true)}
                                    >
                                        <Ionicons name="camera" size={16} color="#fff" />
                                    </TouchableOpacity>

                                    {user.plan === 'premium' && (
                                        <View style={styles.premiumBadge}>
                                            <MaterialIcons name="workspace-premium" size={14} color="#FFD700" />
                                        </View>
                                    )}
                                </View>
                            </Animated.View>

                            <View style={styles.userInfo}>
                                <View style={styles.userHeaderRow}>
                                    <Text style={styles.userName}>{user.name || 'Usuário'}</Text>
                                </View>
                                <Text style={styles.userEmail}>{user.email}</Text>

                                <View style={styles.userBadges}>
                                    <View style={[styles.userPlanBadge, {
                                        backgroundColor: user.plan === 'premium' ? '#FFD70020' : '#94a3b820'
                                    }]}>
                                        <Text style={[
                                            styles.userPlanText,
                                            {
                                                color: user.plan === 'premium' ? '#FFD700' : '#94a3b8'
                                            }
                                        ]}>
                                            {user.plan === 'premium' ? 'Premium' : 'Free'}
                                        </Text>
                                    </View>

                                    <View style={[styles.userLevelBadge, { backgroundColor: `${levelBadge.color}20` }]}>
                                        <Text style={[styles.userLevelText, { color: levelBadge.color }]}>
                                            {levelBadge.label}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* TABS */}
                <View style={styles.tabsContainer}>
                    {[
                        { key: 'sobre', label: 'Sobre', icon: 'person' },
                        { key: 'cursos', label: 'Cursos', icon: 'book' },

                    ].map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.tab,
                                activeTab === tab.key && styles.tabActive,
                            ]}
                            onPress={() => setActiveTab(tab.key as any)}
                        >
                            <Ionicons
                                name={tab.icon as any}
                                size={20}
                                color={activeTab === tab.key ? colors.primary : '#94a3b8'}
                            />
                            <Text style={[
                                styles.tabText,
                                activeTab === tab.key && styles.tabTextActive,
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* CONTEÚDO DAS TABS */}
                <View style={styles.tabContent}>
                    {activeTab === 'sobre' && (
                        <>
                            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                            <View style={styles.infoGrid}>
                                {infoItems.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.infoCard,
                                            item.clickable && styles.infoCardClickable
                                        ]}
                                        onPress={() => item.clickable && handleNavigateToPayment()}
                                        activeOpacity={item.clickable ? 0.7 : 1}
                                    >
                                        <View style={styles.infoCardContent}>
                                            <Ionicons
                                                name={item.icon as any}
                                                size={24}
                                                color={item.color || '#667eea'}
                                            />
                                            <Text style={styles.infoLabel}>{item.label}</Text>
                                            <View style={styles.infoValueContainer}>
                                                <Text style={[
                                                    styles.infoValue,
                                                    item.color && { color: item.color, fontWeight: '600' }
                                                ]}>
                                                    {item.value}
                                                </Text>
                                                {item.clickable && user.plan === 'free' && (
                                                    <Ionicons
                                                        name="arrow-forward"
                                                        size={16}
                                                        color="#94a3b8"
                                                        style={styles.infoArrow}
                                                    />
                                                )}
                                            </View>
                                            {item.isPlan && user.plan === 'free' && (
                                                <View style={styles.planUpgradeBadge}>
                                                    <Text style={styles.planUpgradeText}>Atualizar</Text>
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.sectionTitle}>Progresso Geral</Text>
                            <View style={styles.aboutCard}>
                                <View style={styles.xpProgress}>
                                    <Text style={styles.xpLabel}>Progresso para próximo nível</Text>
                                    <View style={styles.xpBar}>
                                        <View
                                            style={[
                                                styles.xpFill,
                                                {
                                                    width: `${xpProgress}%`,
                                                    backgroundColor: colors.primary
                                                }
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.xpText}>
                                        {xpLevel?.xp} XP ({xpProgress}% do nível {xpLevel?.level})
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}

                    {activeTab === 'cursos' && (
                        <>
                            <View style={styles.coursesHeader}>
                                <Text style={styles.sectionTitle}>Meus Cursos</Text>
                                <Text style={styles.coursesCount}>{courses.length} cursos</Text>
                            </View>
                            <View style={styles.coursesGrid}>
                                {courses.length > 0 ? (
                                    courses.map(renderCourseCard)
                                ) : (
                                    <View style={styles.emptyState}>
                                        <MaterialIcons name="school" size={60} color="#cbd5e1" />
                                        <Text style={styles.emptyStateTitle}>Nenhum curso inscrito</Text>
                                        <Text style={styles.emptyStateText}>
                                            Explore nossa biblioteca de cursos para começar sua jornada de aprendizado!
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </>
                    )}


                </View>
            </Animated.ScrollView>

            {/* MODAL DE EDIÇÃO DE PERFIL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => !saving && setEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar Perfil</Text>
                            <TouchableOpacity
                                onPress={() => !saving && setEditModalVisible(false)}
                                disabled={saving}
                            >
                                <Ionicons name="close" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            {/* FOTO DE PERFIL */}
                            <View style={styles.modalAvatarSection}>
                                <View style={styles.modalAvatarContainer}>
                                    {tempPhotoUri ? (
                                        <Image source={{ uri: tempPhotoUri }} style={styles.modalAvatar} />
                                    ) : (
                                        <View style={styles.modalAvatarPlaceholder}>
                                            <Ionicons name="person" size={50} color="#9ca3af" />
                                        </View>
                                    )}
                                </View>

                                <View style={styles.modalAvatarActions}>
                                    <TouchableOpacity
                                        style={styles.avatarActionButton}
                                        onPress={() => pickImage(false)}
                                        disabled={saving}
                                    >
                                        <LinearGradient
                                            colors={['#667eea', '#764ba2']}
                                            style={styles.avatarActionGradient}
                                        >
                                            <Ionicons name="image" size={20} color="#fff" />
                                            <Text style={styles.avatarActionText}>Galeria</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.avatarActionButton}
                                        onPress={() => pickImage(true)}
                                        disabled={saving}
                                    >
                                        <LinearGradient
                                            colors={['#10b981', '#059669']}
                                            style={styles.avatarActionGradient}
                                        >
                                            <Ionicons name="camera" size={20} color="#fff" />
                                            <Text style={styles.avatarActionText}>Câmera</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    {tempPhotoUri && (
                                        <TouchableOpacity
                                            style={styles.avatarActionButton}
                                            onPress={removePhoto}
                                            disabled={saving}
                                        >
                                            <LinearGradient
                                                colors={['#ef4444', '#dc2626']}
                                                style={styles.avatarActionGradient}
                                            >
                                                <Ionicons name="trash" size={20} color="#fff" />
                                                <Text style={styles.avatarActionText}>Remover</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            {/* FORMULÁRIO */}
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Nome Completo</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={editedName}
                                    onChangeText={setEditedName}
                                    placeholder="Digite seu nome"
                                    placeholderTextColor="#9ca3af"
                                    maxLength={50}
                                    editable={!saving}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Email</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={editedEmail}
                                    onChangeText={setEditedEmail}
                                    placeholder="Digite seu email"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!saving}
                                />
                                <Text style={styles.formHelperText}>
                                    Digite seu novo email
                                </Text>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Idade</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={editedAge}
                                    onChangeText={setEditedAge}
                                    placeholder="Digite sua idade"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="numeric"
                                    maxLength={3}
                                    editable={!saving}
                                />
                                <Text style={styles.formHelperText}>
                                    Deixe em branco se não quiser informar
                                </Text>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Localização</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={editedLocation}
                                    onChangeText={setEditedLocation}
                                    placeholder="Digite sua localização (cidade, estado)"
                                    placeholderTextColor="#9ca3af"
                                    maxLength={100}
                                    editable={!saving}
                                />
                                <Text style={styles.formHelperText}>
                                    Deixe em branco se não quiser informar
                                </Text>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Plano</Text>
                                <View style={[styles.formInput, styles.formInputDisabled]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcons
                                            name={user.plan === 'premium' ? 'workspace-premium' : 'credit-card'}
                                            size={20}
                                            color={user.plan === 'premium' ? '#FFD700' : '#94a3b8'}
                                        />
                                        <Text style={[
                                            styles.formInputText,
                                            {
                                                marginLeft: 8,
                                                color: user.plan === 'premium' ? '#FFD700' : '#94a3b8',
                                                fontWeight: user.plan === 'premium' ? '600' : '400'
                                            }
                                        ]}>
                                            {user.plan === 'premium' ? 'Premium' : 'Free'}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.formHelperText}>
                                    {user.plan === 'premium'
                                        ? 'Você possui o plano Premium'
                                        : 'Clique no seu plano na aba "Sobre" para atualizar'}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                                onPress={handleSaveProfile}
                                disabled={saving || !editedName.trim() || !editedEmail.trim()}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* MODAL PARA ALTERAÇÃO DE EMAIL COM CONFIRMAÇÃO DE SENHA */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={changeEmailModal}
                onRequestClose={() => !changingEmail && setChangeEmailModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Alterar Email</Text>
                            <TouchableOpacity
                                onPress={() => !changingEmail && setChangeEmailModal(false)}
                                disabled={changingEmail}
                            >
                                <Ionicons name="close" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Email Atual</Text>
                                <View style={[styles.formInput, styles.formInputDisabled]}>
                                    <Text style={styles.formInputText}>{user?.email}</Text>
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Novo Email</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={newEmail}
                                    onChangeText={setNewEmail}
                                    placeholder="Digite o novo email"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!changingEmail}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Confirmar Novo Email</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={confirmNewEmail}
                                    onChangeText={setConfirmNewEmail}
                                    placeholder="Confirme o novo email"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!changingEmail}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Senha Atual</Text>
                                <TextInput
                                    style={styles.formInput}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Digite sua senha atual"
                                    placeholderTextColor="#9ca3af"
                                    secureTextEntry
                                    editable={!changingEmail}
                                />
                                <Text style={styles.formHelperText}>
                                    Por segurança, digite sua senha atual
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.saveButton, changingEmail && styles.saveButtonDisabled]}
                                onPress={handleChangeEmail}
                                disabled={changingEmail || !newEmail.trim() || !confirmNewEmail.trim() || !password.trim()}
                            >
                                {changingEmail ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="mail" size={20} color="#fff" />
                                        <Text style={styles.saveButtonText}>Alterar Email</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setChangeEmailModal(false)}
                                disabled={changingEmail}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProfileScreen;