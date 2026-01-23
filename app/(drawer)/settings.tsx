// src/screens/SettingsScreen.js
import ChangePasswordModal from '@/components/modals/passWordChenge';
import { useTheme } from '@/context/useTheme';
import { deleteAllData } from '@/services/delect_all.service';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import * as Updates from 'expo-updates';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    Modal,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { createSettingsStyles } from '../../styles/settings';

const SettingsScreen = (navigation: any) => {
    const [notifications, setNotifications] = useState(true);
    const [soundEffects, setSoundEffects] = useState(true);

    const [changePasswordModal, setChangePasswordModal] = useState(false);
    const [deleteDataModal, setDeleteDataModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [aboutModal, setAboutModal] = useState(false);

    const { mode, setMode, colors } = useTheme();
    const styles = createSettingsStyles(colors);

    // URLs das políticas (substitua com suas URLs reais)
    const PRIVACY_POLICY_URL = 'https://seusite.com/politica-privacidade';
    const TERMS_OF_USE_URL = 'https://seusite.com/termos-uso';

    const handleOpenPrivacyPolicy = async () => {
        try {
            await WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL);
        } catch (error) {
            console.error('Erro ao abrir política de privacidade:', error);
            Alert.alert('Erro', 'Não foi possível abrir a política de privacidade.');
        }
    };

    const handleOpenTermsOfUse = async () => {
        try {
            await WebBrowser.openBrowserAsync(TERMS_OF_USE_URL);
        } catch (error) {
            console.error('Erro ao abrir termos de uso:', error);
            Alert.alert('Erro', 'Não foi possível abrir os termos de uso.');
        }
    };


    const confirmDeleteData = async () => {
        setIsDeleting(true);

        try {
            // 1. Primeiro, tentar limpar o banco SQLite
            try {
                await deleteAllData(); // Sua função existente
            } catch (dbError) {
                console.warn('Erro ao limpar banco de dados:', dbError);
                // Continua mesmo com erro no banco
            }

            // 2. Limpar AsyncStorage (sempre funciona)
            await AsyncStorage.clear();

            // 3. Resetar estados
            setNotifications(true);
            setSoundEffects(true);

            // 4. Fechar modal
            setDeleteDataModal(false);

            // 5. Mostrar alerta de sucesso
            Alert.alert(
                '✅ Dados Limpos',
                'Todos os dados locais foram removidos com sucesso.\n\nO aplicativo será reiniciado.',
                [
                    {
                        text: 'Reiniciar Agora',
                        onPress: async () => {
                            try {
                                // Tentar reiniciar com Updates
                                if (Updates?.reloadAsync) {
                                    await Updates.reloadAsync();
                                } else {
                                    // Fallback
                                    navigation?.reset({
                                        index: 0,
                                        routes: [{ name: 'Home' }],
                                    });
                                }
                            } catch (restartError) {
                                console.error('Erro no restart:', restartError);
                                // Último recurso
                                if (typeof window !== 'undefined') {
                                    window.location.reload();
                                }
                            }
                        }
                    }
                ],
                { cancelable: false }
            );

        } catch (error) {
            console.error('Erro geral:', error);
            Alert.alert('❌ Erro', 'Ocorreu um problema ao limpar os dados.');
        } finally {
            setIsDeleting(false);
        }
    };

    const settingsSections = [
        {
            title: 'Conta',
            icon: 'person-outline',
            items: [
                {
                    icon: 'trash-outline',
                    label: 'Deletar Dados',
                    description: 'Remove dados locais do dispositivo',
                    action: () => setDeleteDataModal(true),
                    type: 'destructive',
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
        {
            title: 'Legal',
            icon: 'document-text-outline',
            items: [
                {
                    icon: 'shield-checkmark-outline',
                    label: 'Política de Privacidade',
                    description: 'Como usamos seus dados',
                    action: handleOpenPrivacyPolicy,
                    type: 'navigation',
                },
                {
                    icon: 'document-lock-outline',
                    label: 'Termos de Uso',
                    description: 'Condições do serviço',
                    action: handleOpenTermsOfUse,
                    type: 'navigation',
                },
            ],
        },
        {
            title: 'Sobre',
            icon: 'information-circle-outline',
            items: [
                {
                    icon: 'help-circle-outline',
                    label: 'Sobre o App',
                    description: 'Versão 1.0.0',
                    action: () => setAboutModal(true),
                    type: 'navigation',
                },
                {
                    icon: 'star-outline',
                    label: 'Avaliar App',
                    description: 'Deixe sua opinião',
                    action: () => Linking.openURL('market://details?id=com.seuapp'),
                    type: 'navigation',
                },
            ],
        },
    ];

    return (
        <>
            <Stack.Screen
                options={{
                    title: ''
                }}
            />
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar barStyle="light-content" backgroundColor="#6366F1" />

                <LinearGradient colors={['#6366F1', colors.second]} style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Configurações</Text>
                        <Text style={styles.headerSubtitle}>Personalize sua experiência</Text>
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
                                    style={[
                                        styles.settingItem,
                                        colors.itemSetting,
                                        item.type === 'destructive' && styles.destructiveItem
                                    ]}
                                    onPress={item.action}
                                    disabled={item.type === 'switch'}
                                >
                                    <View style={styles.settingLeft}>
                                        <View style={[
                                            styles.settingIcon,
                                            { backgroundColor: colors.iconBackground },
                                            item.type === 'destructive' && styles.destructiveIcon
                                        ]}>
                                            <Ionicons
                                                name={item.icon}
                                                size={22}
                                                color={item.type === 'destructive' ? '#EF4444' : '#6366F1'}
                                            />
                                        </View>

                                        <View style={styles.settingInfo}>
                                            <Text style={[
                                                styles.settingLabel,
                                                { color: colors.text },
                                                item.type === 'destructive' && styles.destructiveText
                                            ]}>{item.label}</Text>
                                            <Text style={[styles.settingDescription, { color: colors.subtitle }]}>
                                                {item.description}
                                            </Text>
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

                                        {(item.type === 'navigation' || item.type === 'destructive') && (
                                            <Ionicons
                                                name="chevron-forward"
                                                size={20}
                                                color={item.type === 'destructive' ? '#EF4444' : '#9CA3AF'}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </ScrollView>

                {/* Modal de Alterar Senha */}
                <ChangePasswordModal
                    visible={changePasswordModal}
                    onClose={() => setChangePasswordModal(false)}
                />

                {/* Modal de Deletar Dados */}
                <Modal
                    visible={deleteDataModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => !isDeleting && setDeleteDataModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                            <View style={styles.modalHeader}>
                                <Ionicons name="trash-outline" size={40} color="#EF4444" />
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Confirmar Deleção</Text>
                            </View>

                            <View style={styles.deleteDataInfo}>
                                <View style={styles.infoItem}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                                    <Text style={[styles.infoText, { color: colors.text }]}>
                                        Dados de preferências do app
                                    </Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                                    <Text style={[styles.infoText, { color: colors.text }]}>
                                        Histórico local de atividades
                                    </Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                                    <Text style={[styles.infoText, { color: colors.text }]}>
                                        todos os cursos e práticas baixadas
                                    </Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                                    <Text style={[styles.infoText, { color: colors.text }]}>
                                        Configurações salvas no dispositivo
                                    </Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
                                    <Text style={[styles.infoText, { color: colors.text }]}>
                                        Sua conta no servidor (não será afetada)
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => {
                                        setDeleteDataModal(false);
                                    }}
                                    disabled={isDeleting}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalButton, styles.deleteButton, isDeleting && styles.disabledButton]}
                                    onPress={confirmDeleteData}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <>
                                            <Text style={styles.deleteButtonText}>Deletar</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Modal Sobre */}
                <Modal
                    visible={aboutModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setAboutModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                            <View style={styles.modalHeader}>
                                <Ionicons name="information-circle" size={40} color="#6366F1" />
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Sobre o App</Text>
                            </View>

                            <View style={styles.aboutContent}>
                                <Text style={[styles.appName, { color: colors.title }]}>Meu App</Text>
                                <Text style={[styles.appVersion, { color: colors.subtitle }]}>Versão 1.0.0</Text>

                                <Text style={[styles.aboutDescription, { color: colors.text }]}>
                                    Um aplicativo incrível desenvolvido para melhorar sua produtividade
                                    e organização no dia a dia.
                                </Text>

                                <View style={styles.aboutInfo}>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="build-outline" size={20} color="#6366F1" />
                                        <Text style={[styles.infoText, { color: colors.text }]}>Desenvolvido com React Native</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Ionicons name="calendar-outline" size={20} color="#6366F1" />
                                        <Text style={[styles.infoText, { color: colors.text }]}>© 2024 Todos os direitos reservados</Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.closeButton, { backgroundColor: '#6366F1' }]}
                                onPress={() => setAboutModal(false)}
                            >
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
};



export default SettingsScreen;