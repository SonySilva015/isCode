import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const createSettingsStyles = (colors: any) => StyleSheet.create({
    gestureContainer: {
        flex: 1,
    },
    drawerContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: Platform.OS === 'ios' ? 100 : 80,
    },

    headerGradient: {
        paddingVertical: 50,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 12,
    },
    userStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
        color: 'rgba(240, 162, 110, 0.7)',
    },
    statLabel: {
        fontSize: 11,
        color: 'rgba(243, 166, 114, 0.7)',
        marginTop: 2,
        fontWeight: '700',
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },

    // Premium Card
    premiumCard: {
        height: 60,
        marginHorizontal: 20,
        marginTop: -20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
    premiumCardGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 16,
    },
    premiumCardContent: {
        flex: 1,
        marginLeft: 12,
    },
    premiumCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 2,
    },
    premiumCardSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
    },

    // Menu Sections
    menuSection: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    menuSectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.title,
        letterSpacing: 1,
        marginBottom: 12,
        opacity: 0.7,
    },
    menuItemsContainer: {
        borderTopWidth: 1,
        borderTopColor: colors.border + '20',
    },
    menuItem: {
        width: '100%',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + '20',
    },
    menuItemActive: {
        backgroundColor: colors.transWhite,

    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuLabel: {
        fontSize: 15,
        color: colors.text,
        fontWeight: '500',
        flex: 1,
    },
    menuLabelActive: {
        color: colors.activeItens,
        fontWeight: '600',
    },
    activeIndicator: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: colors.activeItens,
        borderTopLeftRadius: 2,
        borderBottomLeftRadius: 2,
    },

    // Quick Actions
    quickActions: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    quickActionsTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        letterSpacing: 1,
        marginBottom: 12,
        opacity: 0.7,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickActionItem: {
        width: (width - 60) / 4,
        alignItems: 'center',
        marginBottom: 16,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 11,
        color: colors.textSecondary,
        textAlign: 'center',
    },

    // Drawer Footer
    drawerFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: Platform.OS === 'ios' ? 20 : 16,
        paddingHorizontal: 20,
    },
    footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.error + '10',
        borderRadius: 20,
    },
    logoutText: {
        color: colors.error,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    footerInfo: {
        alignItems: 'flex-end',
    },
    versionText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    buildText: {
        fontSize: 10,
        color: colors.textSecondary + '80',
        marginTop: 2,
    },
});