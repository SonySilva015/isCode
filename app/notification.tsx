import { deleteNotifyById, getNotify } from '@/services/notify.service';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";



// Função para determinar tipo da notificação baseado no conteúdo
const detectNotificationType = (content: string, title: string) => {
    const contentLower = content.toLowerCase();
    const titleLower = title.toLowerCase();

    if (titleLower.includes('nível') || titleLower.includes('level') || contentLower.includes('nível') || contentLower.includes('level')) {
        return 'level_up';
    }
    if (titleLower.includes('conquista') || titleLower.includes('badge') || titleLower.includes('troféu') || contentLower.includes('conquista')) {
        return 'achievement';
    }
    if (titleLower.includes('streak') || titleLower.includes('sequência') || contentLower.includes('dias seguidos')) {
        return 'streak';
    }
    if (titleLower.includes('progresso') || titleLower.includes('completou') || contentLower.includes('completou')) {
        return 'progress';
    }
    if (titleLower.includes('lição') || titleLower.includes('curso') || titleLower.includes('conteúdo') || contentLower.includes('nova lição')) {
        return 'new_content';
    }
    if (titleLower.includes('motivação') || titleLower.includes('continue') || contentLower.includes('continue aprendendo')) {
        return 'motivation';
    }
    if (titleLower.includes('desafio') || contentLower.includes('desafio')) {
        return 'challenge';
    }
    if (titleLower.includes('amigo') || titleLower.includes('seguidor') || contentLower.includes('seguindo')) {
        return 'social';
    }
    return 'default';
};

// Mapear tipos para ícones e cores
const mapNotificationType = (type: string) => {
    const mappings: Record<string, { icon: string; color: string; category: string }> = {
        'level_up': { icon: 'trophy', color: '#7C3AED', category: 'conquista' },
        'achievement': { icon: 'trophy', color: '#7C3AED', category: 'conquista' },
        'streak': { icon: 'flame', color: '#F59E0B', category: 'progresso' },
        'progress': { icon: 'trending-up', color: '#10B981', category: 'progresso' },
        'new_content': { icon: 'book', color: '#10B981', category: 'conteúdo' },
        'lesson': { icon: 'book', color: '#10B981', category: 'conteúdo' },
        'motivation': { icon: 'rocket', color: '#6366F1', category: 'motivação' },
        'reminder': { icon: 'notifications', color: '#6366F1', category: 'lembrete' },
        'challenge': { icon: 'flash', color: '#3B82F6', category: 'desafio' },
        'social': { icon: 'people', color: '#8B5CF6', category: 'social' },
        'default': { icon: 'notifications', color: '#6366F1', category: 'geral' }
    };

    return mappings[type] || mappings['default'];
};

// Formatar data
const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Data desconhecida';
        }

        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                if (diffMinutes === 0) {
                    return 'Agora mesmo';
                }
                return `Há ${diffMinutes} min`;
            }
            return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays === 1) {
            return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays <= 7) {
            return `Há ${diffDays} dias`;
        } else {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: diffDays > 365 ? 'numeric' : undefined
            });
        }
    } catch {
        return 'Data desconhecida';
    }
};

const NotificationsScreen = () => {
    const [notificationsData, setNotificationsData] = useState<any[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // Carregar notificações do banco de dados
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const notifications = await getNotify();

            // Mapear dados do banco para o formato do componente
            const formattedNotifications = notifications.map((notification: any) => {
                // Detectar tipo baseado no conteúdo
                const detectedType = detectNotificationType(
                    notification.content || '',
                    notification.title || ''
                );
                const typeMapping = mapNotificationType(detectedType);

                return {
                    id: notification.id.toString(),
                    title: notification.title || 'Notificação',
                    message: notification.content || 'Sem conteúdo',
                    icon: typeMapping.icon,
                    date: formatDate(notification.date || new Date().toISOString()),
                    color: typeMapping.color,
                    category: typeMapping.category,
                    read: notification.checked || false,
                    rawDate: notification.date,
                    type: detectedType
                };
            });

            // Ordenar por data (mais recente primeiro)
            formattedNotifications.sort((a, b) => {
                const dateA = new Date(a.rawDate || 0);
                const dateB = new Date(b.rawDate || 0);
                return dateB.getTime() - dateA.getTime();
            });

            setNotificationsData(formattedNotifications);
        } catch (error) {

            Alert.alert('Erro', 'Não foi possível carregar as notificações');
        } finally {
            setLoading(false);
        }
    }, []);

    // Atualizar notificações sempre que a tela for aberta
    useFocusEffect(
        useCallback(() => {

            loadNotifications();
        }, [loadNotifications])
    );

    const handleNotificationPress = (notification: any) => {
        // Aqui você poderia marcar como lida no banco se tiver essa função
        // Por enquanto, apenas marca localmente
        setNotificationsData(prev =>
            prev.map(n =>
                n.id === notification.id ? { ...n, read: true } : n
            )
        );
        setSelectedNotification(notification);
        setModalVisible(true);
    };

    const clearAll = async () => {
        if (notificationsData.length === 0) return;

        Alert.alert(
            "Limpar todas as notificações",
            "Tem certeza que deseja remover todas as notificações?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Limpar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Deletar todas as notificações do banco
                            const deletePromises = notificationsData.map(notif =>
                                deleteNotifyById(parseInt(notif.id))
                            );
                            await Promise.all(deletePromises);

                            // Limpar estado local
                            setNotificationsData([]);
                            Alert.alert("Sucesso", "Todas as notificações foram removidas");
                        } catch (error) {
                            console.error('Erro ao deletar notificações:', error);
                            Alert.alert("Erro", "Não foi possível remover as notificações");
                        }
                    }
                }
            ]
        );
    };

    const deleteSingleNotification = async (id: string) => {
        Alert.alert(
            "Remover notificação",
            "Deseja excluir esta notificação?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteNotifyById(parseInt(id));
                            setNotificationsData(prev => prev.filter(n => n.id !== id));

                            // Fechar modal se a notificação deletada está aberta
                            if (selectedNotification?.id === id) {
                                setModalVisible(false);
                            }
                        } catch (error) {
                            console.error('Erro ao deletar notificação:', error);
                            Alert.alert("Erro", "Não foi possível remover a notificação");
                        }
                    }
                }
            ]
        );
    };

    const markAsRead = (id: string) => {
        setNotificationsData(prev =>
            prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            )
        );
    };

    const markAllAsRead = () => {
        setNotificationsData(prev =>
            prev.map(n => ({ ...n, read: true }))
        );
    };

    const renderNotificationItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[
                styles.card,
                !item.read && styles.cardUnread
            ]}
            onPress={() => handleNotificationPress(item)}
            onLongPress={() => deleteSingleNotification(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: item.color + "20" }
                ]}>
                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>

                <View style={styles.textContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                        {!item.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                    <View style={styles.footerRow}>
                        <Text style={styles.date}>{item.date}</Text>
                        <TouchableOpacity
                            style={styles.readButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                markAsRead(item.id);
                            }}
                            disabled={item.read}
                        >
                            <Ionicons
                                name={item.read ? "checkmark-done" : "checkmark"}
                                size={14}
                                color={item.read ? "#10B981" : "#9CA3AF"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );

    const renderModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <LinearGradient
                        colors={[selectedNotification?.color || "#7C3AED", "#4F46E5"]}
                        style={styles.modalHeader}
                    >
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Ionicons name="close" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <View style={styles.modalIconContainer}>
                            <Ionicons name={selectedNotification?.icon} size={40} color="#FFFFFF" />
                        </View>
                        <Text style={styles.modalTitle}>{selectedNotification?.title}</Text>
                    </LinearGradient>

                    <ScrollView style={styles.modalContent}>
                        <Text style={styles.modalMessage}>{selectedNotification?.message}</Text>

                        <View style={styles.modalDetails}>
                            <View style={styles.detailItem}>
                                <Ionicons name="time-outline" size={18} color="#6B7280" />
                                <Text style={styles.detailText}>{selectedNotification?.date}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="pricetag-outline" size={18} color="#6B7280" />
                                <Text style={styles.detailText}>
                                    {selectedNotification?.category?.charAt(0).toUpperCase() + selectedNotification?.category?.slice(1)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalActionButton, styles.deleteButton]}
                                onPress={() => {
                                    if (selectedNotification) {
                                        deleteSingleNotification(selectedNotification.id);
                                        setModalVisible(false);
                                    }
                                }}
                            >
                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                <Text style={styles.deleteButtonText}>Excluir</Text>
                            </TouchableOpacity>

                            {selectedNotification && !selectedNotification.read && (
                                <TouchableOpacity
                                    style={[styles.modalActionButton, styles.readButton]}
                                    onPress={() => {
                                        markAsRead(selectedNotification.id);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Ionicons name="checkmark" size={18} color="#10B981" />
                                    <Text style={styles.readButtonText}>Marcar como lida</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    if (loading) {
        return (
            <LinearGradient
                colors={["#0F172A", "#1E1B4B", "#312E81"]}
                style={styles.loadingContainer}
            >
                <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
                <View style={styles.loadingContent}>
                    <Ionicons name="notifications" size={60} color="#A5B4FC" />
                    <Text style={styles.loadingText}>Carregando notificações...</Text>
                </View>
            </LinearGradient>
        );
    }

    const unreadCount = notificationsData.filter(n => !n.read).length;

    return (
        <LinearGradient
            colors={["#0F172A", "#1E1B4B", "#312E81"]}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="notifications" size={28} color="#FFFFFF" />
                        <Text style={styles.headerTitle}>Notificações</Text>
                        {unreadCount > 0 && (
                            <View style={styles.headerBadge}>
                                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.headerActions}>
                        {unreadCount > 0 && (
                            <TouchableOpacity
                                style={styles.headerButton}
                                onPress={markAllAsRead}
                            >
                                <Ionicons name="checkmark-done" size={22} color="#A5B4FC" />
                            </TouchableOpacity>
                        )}
                        {notificationsData.length > 0 && (
                            <TouchableOpacity style={styles.headerButton} onPress={clearAll}>
                                <Ionicons name="trash-outline" size={22} color="#A5B4FC" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <Text style={styles.headerSubtitle}>
                    {loading ? "Carregando..." :
                        notificationsData.length === 0
                            ? "Nenhuma notificação"
                            : unreadCount > 0
                                ? `${unreadCount} não lida${unreadCount === 1 ? '' : 's'} de ${notificationsData.length}`
                                : `${notificationsData.length} notificaç${notificationsData.length === 1 ? 'ão' : 'ões'}`
                    }
                </Text>
            </View>

            {/* Notifications List */}
            {notificationsData.length > 0 ? (
                <FlatList
                    data={notificationsData}
                    renderItem={renderNotificationItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={loadNotifications}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Ionicons name="notifications-off-outline" size={80} color="#4F46E5" />
                    <Text style={styles.emptyStateTitle}>Sem notificações</Text>
                    <Text style={styles.emptyStateText}>
                        Você não tem notificações no momento.
                    </Text>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={loadNotifications}
                    >
                        <Ionicons name="refresh" size={20} color="#FFFFFF" />
                        <Text style={styles.refreshButtonText}>Recarregar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal de detalhes */}
            {renderModal()}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
        color: '#A5B4FC',
        fontSize: 16,
        marginTop: 16,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    headerBadge: {
        backgroundColor: '#EF4444',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#A5B4FC',
        opacity: 0.8,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
    },
    cardUnread: {
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderColor: 'rgba(124, 58, 237, 0.3)',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 14,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#7C3AED',
    },
    message: {
        fontSize: 13,
        color: '#CBD5E1',
        lineHeight: 18,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    date: {
        fontSize: 11,
        color: '#94A3B8',
    },
    readButton: {
        padding: 4,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 20,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#A5B4FC',
        textAlign: 'center',
        lineHeight: 20,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(79, 70, 229, 0.5)',
    },
    refreshButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#1E293B',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        maxHeight: '80%',
    },
    modalHeader: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        alignItems: 'center',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    modalIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    modalContent: {
        padding: 24,
    },
    modalMessage: {
        fontSize: 16,
        color: '#E2E8F0',
        lineHeight: 24,
        marginBottom: 24,
    },
    modalDetails: {
        gap: 12,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailText: {
        fontSize: 14,
        color: '#94A3B8',
    },
    modalActions: {
        gap: 12,
    },
    modalActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderRadius: 12,
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    deleteButtonText: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: '500',
    },

    readButtonText: {
        color: '#10B981',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default NotificationsScreen;