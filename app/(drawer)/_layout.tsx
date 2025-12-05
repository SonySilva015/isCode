import { useTheme } from '@/context/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useMemo } from 'react';
import {
    Image,
    Platform,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({ navigation }) => {
    const { mode, colors } = useTheme();
    const styles = createSettingsStyles(colors);
    const pathname = usePathname();


    const menuItems: MenuItem[] = useMemo(() => [
        {
            key: 'home',
            label: 'Home',
            icon: 'home',
            route: 'home',
        },
        {
            key: 'profile',
            label: 'Perfil',
            icon: 'person',
            route: 'profile',
        },
        {
            key: 'progress',
            label: 'Progresso',
            icon: 'trending-up',
            route: 'progress',
        },
        {
            key: 'courses',
            label: 'Meus Cursos',
            icon: 'school',
            route: 'learn',
        },
        {
            key: 'favorites',
            label: 'Favoritos',
            icon: 'favorite',
            route: 'favorites',
        },
        {
            key: 'settings',
            label: 'Configurações',
            icon: 'settings',
            route: 'settings',
        },
        {
            key: 'help',
            label: 'Ajuda',
            icon: 'help-outline',
            route: '/(drawer)/help',
        },
        {
            key: 'about',
            label: 'Sobre',
            icon: 'info-outline',
            route: '/(drawer)/about',
        },
    ], []);

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
        // Aqui você adicionaria a lógica de logout
        setTimeout(() => {
            router.replace('/');
        }, 300);
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
                    <View style={[
                        styles.menuIconContainer

                    ]}>
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
                            <Image
                                source={require('../../assets/images/eu.jpg')}
                                style={styles.avatar}
                                resizeMode="cover"
                            />
                            <View style={styles.onlineIndicator} />
                        </View>

                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>Sony Silva</Text>
                            <Text style={styles.userEmail}>sony.silva@example.com</Text>

                            <View style={styles.userStats}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>12</Text>
                                    <Text style={styles.statLabel}>Cursos</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>85%</Text>
                                    <Text style={styles.statLabel}>Progresso</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Botão Premium Destaque */}
                <TouchableOpacity
                    style={styles.premiumCard}
                    onPress={() => handleNavigation('/payment')}
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
                        </View>
                        <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Seção do Menu */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>MENU PRINCIPAL</Text>
                    <View style={styles.menuItemsContainer}>
                        {menuItems.slice(0, 5).map(renderMenuItem)}
                    </View>
                </View>

                {/* Seção de Configurações */}
                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>CONFIGURAÇÕES</Text>
                    <View style={styles.menuItemsContainer}>
                        {menuItems.slice(5).map(renderMenuItem)}
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
                        <Text style={styles.versionText}>Versão 2.1.4</Text>
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
                screenOptions={screenOptions}
            >
                <Drawer.Screen
                    name="home"
                    options={{
                        drawerLabel: 'Home',
                        title: 'Início',
                    }}
                />
                <Drawer.Screen
                    name="profile"
                    options={{
                        headerShown: true,
                        drawerLabel: 'Perfil',
                        title: 'Meu Perfil',
                        headerStyle: {
                            backgroundColor: colors.primary,
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        headerTintColor: '#FFF',
                    }}
                />
                <Drawer.Screen
                    name="progress"
                    options={{
                        headerShown: true,
                        drawerLabel: 'Progresso',
                        title: 'Meu Progresso',
                    }}
                />
                <Drawer.Screen
                    name="courses"
                    options={{
                        headerShown: true,
                        drawerLabel: 'Cursos',
                        title: 'Meus Cursos',
                    }}
                />
                <Drawer.Screen
                    name="favorites"
                    options={{
                        headerShown: true,
                        drawerLabel: 'Favoritos',
                        title: 'Conteúdos Favoritos',
                    }}
                />
                <Drawer.Screen
                    name="settings"
                    options={{
                        headerShown: true,
                        drawerLabel: 'Configurações',
                        title: 'Configurações',
                        headerStyle: {
                            backgroundColor: colors.primary,
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        headerTintColor: '#FFF',
                    }}
                />
                <Drawer.Screen
                    name="help"
                    options={{
                        headerShown: true,
                        drawerLabel: 'Ajuda',
                        title: 'Central de Ajuda',
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
                <Drawer.Screen
                    name="payment"
                    options={{
                        headerShown: true,
                        drawerLabel: 'Premium',
                        title: 'Assinatura Premium',
                        drawerItemStyle: { display: 'none' },
                        headerStyle: {
                            backgroundColor: colors.primary,
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        headerTintColor: '#FFF',
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
};

export default DrawerLayout;