import { useTheme } from '@/context/useTheme';
import { getUnreadNotificationCount } from '@/services/notify.service'; // Importe a função
import { createSettingsStyles } from '@/styles/TabLauyt';
import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Tabs, router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const Layout = () => {
    const { colors } = useTheme();
    const styles = createSettingsStyles(colors);
    const [notificationCount, setNotificationCount] = useState(0);

    // Função para buscar o contador
    const fetchNotificationCount = async () => {
        try {
            const count = await getUnreadNotificationCount();
            setNotificationCount(count);
        } catch (error) {
            console.error('Erro ao buscar contador:', error);
        }
    };

    // Buscar quando o componente montar
    useEffect(() => {
        fetchNotificationCount();
    }, []);

    // Atualizar sempre que a tela receber foco
    useFocusEffect(
        React.useCallback(() => {
            fetchNotificationCount();
        }, [])
    );

    // Opcional: Atualizar a cada 30 segundos
    useEffect(() => {
        const interval = setInterval(fetchNotificationCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleNotificationPress = () => {
        // Você pode marcar como lidas aqui se quiser
        // await markAllNotificationsAsRead();
        setNotificationCount(0); // Resetar localmente
        router.push('../../notification');
    };

    return (
        <Tabs
            screenOptions={{
                headerLeft: () => <DrawerToggleButton tintColor={colors.text} />,
                headerRight: () => (
                    <View style={{ flexDirection: 'row', marginRight: 10, alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={handleNotificationPress}
                            style={{ marginHorizontal: 8 }}
                        >
                            <View style={{ position: 'relative' }}>
                                <Ionicons name="notifications-outline" size={24} color={colors.text} />

                                {/* Badge com número de notificações */}
                                {notificationCount > 0 && (
                                    <View style={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        backgroundColor: '#FF3B30',
                                        borderRadius: 10,
                                        minWidth: 20,
                                        height: 20,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 2,
                                        borderColor: colors.background || '#fff',
                                    }}>
                                        <Text style={{
                                            color: 'white',
                                            fontSize: 11,
                                            fontWeight: 'bold',
                                        }}>
                                            {notificationCount > 99 ? '99+' : notificationCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('../../settings')}
                            style={{ marginHorizontal: 8 }}
                        >
                            <Ionicons name="settings-outline" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                ),
                headerStyle: styles.header,
                headerTintColor: colors.text,
                headerTitleAlign: 'center',
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text,
                tabBarStyle: styles.tabBar,
            }}
        >
            {/* ... restante do seu código ... */}
        </Tabs>
    );
};

export default Layout;