import { useTheme } from '@/context/useTheme';
import { getCurrentXpLevel } from '@/services/progress_here.service';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Image,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { db } from '../../db';
import { users } from '../../db/schemas';
import { createSettingsStyles } from '../../styles/layout';

interface MenuItem {
    key: string;
    label: string;
    icon: string;
    route: string;
}

interface CustomDrawerContentProps {
    navigation: any;
}

interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    picture: string;
    plan: string;
}
interface xpLevel {
    id: number;
    level: number | null;
    xp: number | null;
}


const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({ navigation }) => {
    const STORAGE_PREFIX = 'user_photo_';
    const { mode, colors } = useTheme();
    const styles = createSettingsStyles(colors);
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userPhotoUri, setUserPhotoUri] = useState<string | null>(null);
    const [xpLevel, setXpLevel] = useState<xpLevel | null>(null);

    // Função para carregar os dados do usuário
    const loadUserData = useCallback(async () => {
        try {
            setLoading(true);

            // 1. Buscar usuário do banco de dados
            const result = await db.select().from(users).limit(1).execute();
            const currentXpLevel = await getCurrentXpLevel();

            if (currentXpLevel) {
                setXpLevel(currentXpLevel);
            } else {
                setXpLevel(null);
            }

            if (result.length > 0) {
                const userData = result[0] as User;
                setUser(userData);

                // 2. Se o usuário tem foto personalizada (custom_photo), buscar do AsyncStorage
                if (userData.picture === 'custom_photo') {
                    const photoUri = await AsyncStorage.getItem(`user_photo_${userData.email}`);
                    if (photoUri) {
                        setUserPhotoUri(photoUri);
                    } else {
                        setUserPhotoUri(null);
                    }
                } else {
                    setUserPhotoUri(null);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Carregar dados quando o drawer receber foco
    useFocusEffect(
        useCallback(() => {
            loadUserData();
            getAvatarSource();

        }, [loadUserData])
    );

    // Carregar dados na montagem inicial também
    useEffect(() => {
        getAvatarSource();
        loadUserData();
    }, [loadUserData]);

    const menuItems: MenuItem[] = [
        { key: 'profile', label: 'Perfil', icon: 'person', route: '/profile' },
        { key: 'courses', label: 'Cursos Online', icon: 'menu-book', route: '/courses' },
        { key: 'settings', label: 'Configurações', icon: 'settings', route: '/settings' },
        { key: 'about', label: 'Sobre', icon: 'info-outline', route: '/about' },
    ];

    const isActive = (route: string): boolean => {
        const routeSegment = route.split('/').pop() || '';
        const currentSegment = pathname.split('/').pop() || '';
        return routeSegment === currentSegment;
    };

    const handleNavigation = (route: string) => {
        router.push(route as any);
        navigation.closeDrawer();
    };

    const handleLogout = () => {
        navigation.closeDrawer();
        // Aqui você adicionaria a lógica de logout (limpar tokens, etc.)
        setTimeout(() => {
            router.replace('/');
        }, 300);
    };

    const getAvatarSource = async () => {
        try {
            const storedPhoto = await AsyncStorage.getItem(
                `${STORAGE_PREFIX}${user?.email}`
            );
            if (storedPhoto) {
                setUserPhotoUri(storedPhoto);
            } else {
                setUserPhotoUri(null);
            }

        } catch (error) {
            console.error('Erro ao obter fonte do avatar:', error);
        }
        return null;
    };

    const renderAvatar = () => {
        if (loading) {
            return (
                <View style={[styles.avatar, { backgroundColor: colors.card }]}>
                    <Ionicons name="person" size={50} color="rgba(255,255,255,0.9)" />
                </View>
            );
        }


        if (userPhotoUri) {
            return (
                <Image
                    source={{ uri: userPhotoUri }}
                    style={styles.avatar}
                    resizeMode="cover"
                    onError={() => {
                        // Se der erro ao carregar a imagem, mostrar ícone
                        console.log('Erro ao carregar imagem do usuário');
                    }}
                />
            );
        } else {
            return (
                <View style={[styles.avatar, { backgroundColor: colors.card }]}>
                    <Ionicons name="person" size={35} color="rgba(255,255,255,0.9)" />
                </View>
            );
        }

    };

    const renderMenuItem = (item: MenuItem) => {
        const active = isActive(item.route);

        return (
            <TouchableOpacity
                key={item.key}
                style={[
                    styles.menuItem,
                    active && styles.menuItemActive
                ]}
                onPress={() => handleNavigation(item.route)}
                activeOpacity={0.6}
            >
                <View style={styles.menuItemContent}>
                    <View style={styles.menuIconContainer}>
                        <MaterialIcons
                            name={item.icon as any}
                            size={22}
                            color={active ? colors.activeItens : colors.text}
                        />
                    </View>
                    <Text style={[
                        styles.menuLabel,
                        active && styles.menuLabelActive
                    ]}>
                        {item.label}
                    </Text>
                </View>
                {active && (
                    <View style={styles.activeIndicator} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.drawerContainer}>
            <StatusBar
                backgroundColor={colors.primary}
                barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
            />

            <DrawerContentScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Header do Drawer */}
                <LinearGradient
                    colors={[colors.primary, colors.second]}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <TouchableOpacity
                        style={styles.headerContent}
                        onPress={() => handleNavigation('/(drawer)/profile')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.avatarContainer}>
                            {renderAvatar()}
                            <View style={styles.onlineIndicator} />
                        </View>

                        <View style={styles.userInfo}>
                            {loading ? (
                                <>
                                    <Text style={styles.userName}>Carregando...</Text>
                                    <Text style={styles.userEmail}>Por favor aguarde</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.userName}>
                                        {user?.name || 'Usuário'}
                                    </Text>
                                    <Text style={styles.userEmail}>
                                        {user?.email || 'usuario@exemplo.com'}
                                    </Text>
                                </>
                            )}

                            <View style={styles.userStats}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{xpLevel?.level || 0}</Text>
                                    <Text style={styles.statLabel}>nível</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{xpLevel?.xp || 0}</Text>
                                    <Text style={styles.statLabel}>xp</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Botão Premium Destaque */}
                <TouchableOpacity
                    style={styles.premiumCard}
                    onPress={() => router.push('/payment')}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={['#FFD700', colors.second]}
                        style={styles.premiumCardGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <MaterialIcons name="workspace-premium" size={24} color="#FFF" />
                        <View style={styles.premiumCardContent}>
                            <Text style={styles.premiumCardTitle}>Torne-se Premium</Text>
                            <Text style={styles.premiumCardSubtitle}>
                                {user?.plan === 'free'
                                    ? 'Desbloqueie recursos'
                                    : 'Plano Premium Ativo'}
                            </Text>
                        </View>
                        <MaterialIcons
                            name={user?.plan === 'premium' ? "check-circle" : "arrow-forward"}
                            size={20}
                            color="#FFF"
                        />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Seção do Menu */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>MENU PRINCIPAL</Text>
                    <View style={styles.menuItemsContainer}>
                        {menuItems.map(renderMenuItem)}
                    </View>
                </View>

            </DrawerContentScrollView>

            {/* Footer do Drawer */}
            <View style={styles.drawerFooter}>
                <View style={styles.footerContent}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="logout" size={20} color={colors.error} />
                        <Text style={styles.logoutText}>Sair</Text>
                    </TouchableOpacity>

                    <View style={styles.footerInfo}>
                        <Text style={styles.versionText}>Versão 1.1.5</Text>
                        <Text style={styles.buildText}>Build #2156</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const DrawerLayout: React.FC = () => {
    const { colors } = useTheme();
    const styles = createSettingsStyles(colors);

    const screenOptions = {
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerStyle: {
            width: Platform.OS === 'ios' ? 320 : 300,
            backgroundColor: colors.background,
        },
        sceneContainerStyle: {
            backgroundColor: colors.background,
        },
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        swipeEdgeWidth: Platform.OS === 'ios' ? 30 : 50,
        swipeEnabled: true,
    };

    return (
        <GestureHandlerRootView style={styles.gestureContainer}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    ...screenOptions,
                    headerLeft: () => (
                        <TouchableOpacity
                            style={{ padding: 12 }}
                            onPress={() => router.push('/home')}
                        >
                            <MaterialIcons name="arrow-back" size={24} color={'white'} />
                        </TouchableOpacity>
                    )
                }}
            >
                <Drawer.Screen
                    name="profile"
                    options={{
                        headerShown: true,
                        drawerLabel: 'Perfil',
                        title: 'Meu Perfil',
                        headerStyle: {
                            backgroundColor: colors.gradient.primary,
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        headerTintColor: '#FFF',
                    }}
                />
                <Drawer.Screen
                    name="settings"
                    options={{
                        headerShown: true,
                        drawerLabel: 'Configurações',
                        title: 'Configurações',
                        headerStyle: {
                            backgroundColor: '#6366F1',
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        headerTintColor: '#FFF',
                    }}
                />
                <Drawer.Screen
                    name="courses"
                    options={{
                        headerShown: true,
                        drawerLabel: 'Cursos',
                        title: 'Cursos',
                        headerStyle: {
                            backgroundColor: '#667eea',
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        headerTintColor: '#FFF',
                    }}
                />
                <Drawer.Screen
                    name="about"
                    options={{
                        headerShown: true,
                        drawerLabel: 'Sobre',
                        title: 'Sobre o App',
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
};

export default DrawerLayout;