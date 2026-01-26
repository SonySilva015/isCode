// styles/profile.ts
import { StyleSheet } from 'react-native';


export const stylesProfile = (colors: any) => StyleSheet.create({


    infoCardClickable: {

    },

    infoCardContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    infoValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },

    infoArrow: {
        marginLeft: 8,
    },

    // Badge para upgrade de plano
    planUpgradeBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#f97316',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },

    planUpgradeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },

    // Estilos para o modal
    modalAvatarActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },

    avatarActionButton: {
        flex: 1,
        marginHorizontal: 4,
    },

    avatarActionGradient: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    avatarActionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },

    // Ajuste para os badges no header
    userPlanBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginVertical: 4,
        alignSelf: 'flex-start',
    },

    userPlanText: {
        fontSize: 14,
        fontWeight: '500',
    },

    userLevelBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginVertical: 4,
        alignSelf: 'flex-start',
    },

    userLevelText: {
        fontSize: 14,
        fontWeight: '500',
    },

    userBadges: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748b',
    },

    // Header
    gradientHeader: {
        overflow: 'hidden',

    },
    gradientHeaderInner: {
        flex: 1,
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    headerContent: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    uploadButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    premiumBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,215,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    userInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
        textAlign: 'center',
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 12,
    },


    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        marginHorizontal: 20,
        borderRadius: 16,
        marginBottom: 24,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    tabActive: {
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
    },
    tabText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
        marginTop: 4,
    },
    tabTextActive: {
        color: '#667eea',
    },

    // Tab Content
    tabContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        backgroundColor: colors.background,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.title,
        marginBottom: 16,
    },

    // Sobre Tab
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
    },
    infoCard: {
        width: '50%',
        padding: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 12,
        color: colors.text,
        marginTop: 8,
        marginBottom: 4,
        textAlign: 'center',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.title,
        textAlign: 'center',
    },
    aboutCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    aboutText: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.text,
        textAlign: 'center',
    },
    xpProgress: {
        marginTop: 8,
    },
    xpLabel: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    xpBar: {
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    xpFill: {
        height: '100%',
        borderRadius: 4,
    },
    xpText: {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
        fontWeight: '500',
    },

    // Cursos Tab
    coursesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    coursesCount: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    coursesGrid: {
        marginBottom: 24,
    },
    courseCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
        position: 'relative',
    },
    courseTypeBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    courseTypeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    courseContent: {
        marginTop: 8,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.title,
        marginBottom: 8,
    },
    courseDescription: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 12,
        lineHeight: 20,
    },
    courseModulesInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    courseModulesText: {
        fontSize: 12,
        color: colors.text,
        marginLeft: 6,
    },
    courseProgressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    courseProgressBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#f1f5f9',
        borderRadius: 3,
        overflow: 'hidden',
        marginRight: 8,
    },
    courseProgressFill: {
        height: '100%',
        backgroundColor: '#10b981',
        borderRadius: 3,
    },
    courseProgressText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#059669',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#475569',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    exploreButton: {
        backgroundColor: '#667eea',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    exploreButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
    },
    modalContent: {
        padding: 20,
        paddingBottom: 40,
    },
    modalAvatarSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    modalAvatarContainer: {
        marginBottom: 16,
    },
    modalAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#e5e7eb',
    },
    modalAvatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#e5e7eb',
    },

    // Form
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    formInput: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1e293b',
    },
    formInputDisabled: {
        backgroundColor: '#f1f5f9',
    },
    formInputText: {
        fontSize: 16,
        color: '#6b7280',
    },
    formHelperText: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 6,
    },

    // Save Button
    saveButton: {
        backgroundColor: '#667eea',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 5,
        marginBottom: 30,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    // Adicione ao seu arquivo styles.ts ou styles.js:

    // ... outros estilos existentes ...

    refreshButton: {
        marginLeft: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
    },

    userHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },

    // Estilo para quando estiver refreshing
    refreshingIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    // Adicione estes estilos aos seus estilos existentes

    // Botão de cancelar
    cancelButton: {
        marginTop: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },

    cancelButtonText: {
        color: '#6b7280',
        fontSize: 16,
        fontWeight: '500',
    },

    // Estilos para o modal de alteração de email
    changeEmailButton: {
        marginTop: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    changeEmailButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },

});