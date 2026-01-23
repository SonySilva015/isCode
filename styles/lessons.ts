import { StyleSheet } from "react-native";

export const stylesLesson = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: colors.background,

    },
    header: {
        paddingTop: 30,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    headerContent: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    topicStats: {
        flexDirection: 'row',
        gap: 30,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: 'rgb(255,255,255)',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 10,
        marginBottom: 50
    },
    lessonsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.title,
        marginBottom: 16,
    },
    lessonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.card,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    lessonCardCurrent: {
        backgroundColor: colors.lessonCurrent || '#EFF6FF',
        borderColor: colors.primary || '#3B82F6',
        borderWidth: 2,
        shadowColor: colors.primary || '#3B82F6',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    lessonCardLocked: {

        backgroundColor: colors.card,
        borderColor: colors.border,
        opacity: 0.6,
    },
    lessonNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    lessonNumberCompleted: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    lessonNumberCurrent: {
        backgroundColor: colors.primary || '#3B82F6',
        borderColor: colors.primary || '#3B82F6',
    },
    lessonNumberLocked: {
        backgroundColor: colors.card,
        borderColor: colors.border,
    },
    lessonNumberText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
    },
    lessonNumberTextCompleted: {
        color: '#FFFFFF',
    },
    lessonNumberTextCurrent: {
        color: '#FFFFFF',
    },
    lessonNumberTextLocked: {
        color: colors.text,
    },
    lessonInfo: {
        flex: 1,
    },
    lessonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        flex: 1,
    },
    lessonTitleCompleted: {
        color: '#065F46',
    },
    lessonTitleCurrent: {
        color: colors.primary || '#1E40AF',
        fontWeight: '700',
    },
    lessonTitleLocked: {
        color: colors.text,
    },
    lessonMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    lessonDuration: {
        fontSize: 14,
        color: colors.text,
    },
    lessonDifficulty: {
        fontSize: 14,
        color: colors.text,
    },
    lessonMetaCompleted: {
        color: '#047857',
    },
    lessonMetaCurrent: {
        color: colors.primary || '#1E40AF',
    },
    lessonMetaLocked: {
        color: colors.text,
    },
    lessonRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    lessonIcon: {
        marginRight: 8,
    },
    currentBadge: {
        backgroundColor: colors.primary || '#3B82F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    currentBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    // Adicione estes estilos:
    lessonsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    refreshButton: {
        padding: 8,
    },

    // Estilos para o container de loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
});