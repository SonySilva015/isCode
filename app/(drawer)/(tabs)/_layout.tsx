import { useTheme } from '@/context/useTheme';
import { createSettingsStyles } from '@/styles/TabLauyt';
import { Ionicons } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';


const Layout = () => {
    const { colors } = useTheme();
    const styles = createSettingsStyles(colors);
    return (

        <Tabs
            screenOptions={{
                headerLeft: () => <DrawerToggleButton tintColor={colors.text} />,
                headerRight: () => (
                    <View style={{ flexDirection: 'row', marginRight: 10 }}>
                        <TouchableOpacity
                            onPress={() => router.push('../../notification')}
                            style={{ marginHorizontal: 8 }}
                        >
                            <Ionicons name="notifications-outline" size={24} color={colors.text} />
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
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="learn"
                options={{
                    title: 'Lições',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'book' : "book-outline"} size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="test"
                options={{
                    title: 'Testes',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "clipboard" : "clipboard-outline"} size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="game"
                options={{
                    title: 'Jogar',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? "game-controller" : "game-controller"} size={size} color={color} />
                    ),
                }}
            />
        </Tabs>


    );
};





export default Layout;
