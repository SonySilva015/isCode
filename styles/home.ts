// styles/home.ts
import { StyleSheet } from 'react-native';


export const createHomeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },

    scrollContent: {
        paddingBottom: 30,
    },

    // Header
    header: {
        paddingTop: 60,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '400',
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    motivation: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 20,
    },
    avatarButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
        position: 'relative',
    },
    avatar: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    premiumBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
    },

    // Estatísticas rápidas
    quickStats: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statDivider: {
        width: 1,
        height: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    statText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginLeft: 6,
        fontWeight: '500',
    },

    // Progresso Diário
    dailyProgressCard: {
        backgroundColor: colors.card,
        marginHorizontal: 20,
        marginTop: -15,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    dailyProgressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dailyProgressTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'goldenrod',
    },
    dailyProgressValue: {
        fontSize: 24,
        fontWeight: '700',
        color: 'goldenrod',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: 'goldenrod',
        borderRadius: 4,
    },
    dailyProgressTip: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
        lineHeight: 20,
        textAlign: 'center',
        fontStyle: 'italic',
    },

    // Seções
    quickActionsSection: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    featuredSection: {
        marginTop: 24,
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.title,
    },
    seeAllText: {
        fontSize: 14,
        color: '#667eea',
        fontWeight: '600',
    },

    // Ações Rápidas
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickActionCard: {
        width: '48%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
    },
    quickActionGradient: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
    quickActionLabel: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },

    // Cursos em Destaque
    coursesScroll: {
        paddingHorizontal: 20,
    },
    featuredCourseCard: {
        width: 160,
        marginRight: 12,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
    },
    courseCardGradient: {
        padding: 20,
        alignItems: 'center',
        minHeight: 180,
        justifyContent: 'space-between',
    },
    courseIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    courseCardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 4,
    },
    courseCardCategory: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 16,
    },
    courseCardButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    courseCardButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    // Dica do Dia
    tipCard: {
        backgroundColor: colors.tip,
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#fed7aa',
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#92400e',
        marginLeft: 12,
    },
    tipSubtitle: {
        fontSize: 12,
        color: '#b45309',
        marginLeft: 12,
        marginTop: 2,
    },
    tipText: {
        fontSize: 14,
        color: '#78350f',
        lineHeight: 22,
        textAlign: 'center',
        fontStyle: 'italic',
    },

    // Próximos Passos
    nextSteps: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    stepsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    stepCard: {
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.borderCard,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.title,
        marginTop: 12,
        marginBottom: 4,
        textAlign: 'center',
    },
    stepDescription: {
        fontSize: 12,
        color: colors.text,
        textAlign: 'center',
    },
});