// src/screens/SettingsScreen.js
import EditProfileModal from '@/components/modals/editeProfile';
import ChangePasswordModal from '@/components/modals/passWordChenge';
import { useTheme } from '@/context/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, Switch, Text, TouchableOpacity, View } from 'react-native';
import { createSettingsStyles } from '../../styles/settings';






const SettingsScreen = () => {


    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [soundEffects, setSoundEffects] = useState(true);

    const [editProfileModal, setEditProfileModal] = useState(false);
    const [changePasswordModal, setChangePasswordModal] = useState(false);

    const { mode, setMode, colors } = useTheme();
    const styles = createSettingsStyles(colors);
    const user = {
        name: 'Sony da Silva',
        email: 'sony@email.com',
        avatar: require('@/assets/images/eu.jpg'),
    };




    const settingsSections = [
        {
            title: 'Conta',
            icon: 'person-outline',
            items: [
                {
                    icon: 'person-circle-outline',
                    label: 'Editar Perfil',
                    description: 'Altere suas informações pessoais',
                    action: () => setEditProfileModal(true),
                    type: 'navigation',
                },
                {
                    icon: 'lock-closed-outline',
                    label: 'Alterar Senha',
                    description: 'Atualize sua senha de acesso',
                    action: () => setChangePasswordModal(true),
                    type: 'navigation',
                },
            ],
        },
        {
            title: 'Preferências',
            icon: 'settings-outline',
            items: [
                {
                    icon: 'notifications-outline',
                    label: 'Notificações',
                    description: 'Receba alertas',
                    value: notifications,
                    action: undefined,
                    onValueChange: setNotifications,
                    type: 'switch',
                },
                {
                    icon: mode === 'dark' ? 'sunny-outline' : 'moon-outline',
                    label: 'Modo Escuro',
                    description: 'Interface escura',
                    value: mode === 'dark',
                    action: undefined,
                    onValueChange: (v: any) => setMode(v ? 'dark' : 'light'),
                    type: 'switch',
                },
                {
                    icon: 'save-outline',
                    label: 'Salvamento Automático',
                    description: 'Salva progresso',
                    value: autoSave,
                    onValueChange: setAutoSave,
                    action: undefined,
                    type: 'switch',
                },
                {
                    icon: 'volume-high-outline',
                    label: 'Efeitos Sonoros',
                    description: 'Sons do app',
                    value: soundEffects,
                    action: undefined,
                    onValueChange: setSoundEffects,
                    type: 'switch',
                },
            ],
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" backgroundColor="#6366F1" />

            <LinearGradient colors={['#6366F1', colors.second]} style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.userInfo}>
                        <Image source={user.avatar} style={styles.avatar} />
                        <View style={styles.userDetails}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.settingsContainer}>
                {settingsSections.map((section, sIndex) => (
                    <View key={sIndex} style={[styles.section]}>
                        <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
                            <Ionicons name={section.icon} size={20} color={colors.title} />
                            <Text style={[styles.sectionTitle, { color: colors.title }]}>{section.title}</Text>
                        </View>

                        {section.items.map((item, iIndex) => (
                            <TouchableOpacity
                                key={iIndex}
                                style={[styles.settingItem, colors.itemSetting]}
                                onPress={item.type === 'navigation' ? item.action : undefined}
                            >
                                <View style={styles.settingLeft}>
                                    <View style={[styles.settingIcon, { backgroundColor: colors.iconBackground }]}>
                                        <Ionicons
                                            name={item.icon}
                                            size={22}
                                            color="#6366F1"
                                        />
                                    </View>

                                    <View style={styles.settingInfo}>
                                        <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                                        <Text style={[styles.settingDescription, { color: colors.subtitle }]}>{item.description}</Text>
                                    </View>
                                </View>

                                <View style={styles.settingRight}>
                                    {item.type === 'switch' && (
                                        <Switch
                                            value={item.value}
                                            onValueChange={item.onValueChange}
                                            trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
                                            thumbColor="#fff"
                                        />
                                    )}

                                    {item.type === 'navigation' && (
                                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>

            {/* ---- MODAIS ---- */}
            <EditProfileModal
                visible={editProfileModal}
                onClose={() => setEditProfileModal(false)}
                user={user}
            />

            <ChangePasswordModal
                visible={changePasswordModal}
                onClose={() => setChangePasswordModal(false)}
            />
        </View>
    );
};

export default SettingsScreen;
