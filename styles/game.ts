import { StyleSheet } from 'react-native';



export const stylesGame = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.9)",
        textAlign: "center",
        marginTop: 4,
        fontWeight: "500",
        letterSpacing: 0.3,
    },

    // Estatísticas
    courseStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginHorizontal: 16,
        marginBottom: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 16,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },

    // Lista de práticas
    practicesList: {
        padding: 16,
        paddingBottom: 40,
    },

    // Cards de prática
    practiceCard: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        position: 'relative',
    },
    practiceCardCompleted: {
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderWidth: 1,
        borderColor: '#10B981',
    },
    firstPracticeCard: {
        borderWidth: 2,
        borderColor: '#3B82F6',
    },

    // Ordem da prática
    practiceOrder: {
        position: 'absolute',
        top: -10,
        left: -10,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    practiceOrderText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },

    // Cabeçalho do card
    practiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
        paddingRight: 8,
    },
    practiceTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    practiceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginRight: 8,
    },
    practiceTitleCompleted: {
        color: '#065F46',
    },

    // Badge de concluído
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    completedText: {
        fontSize: 12,
        color: '#065F46',
        marginLeft: 4,
        fontWeight: '600',
    },

    // Botão de menu
    moreButton: {
        padding: 4,
        marginLeft: 8,
    },

    // Descrição
    practiceDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
        lineHeight: 20,
    },

    // Tópicos
    topicsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
        gap: 6,
    },
    topicBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    topicText: {
        fontSize: 11,
        color: '#4B5563',
        fontWeight: '500',
    },

    // Metadados
    practiceMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        flexWrap: 'wrap',
        gap: 8,
    },

    // Dificuldade
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Contador de quizzes
    quizCount: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quizCountText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
    },

    // Último acesso
    lastAccessed: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lastAccessedText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginLeft: 4,
    },

    // Barra de progresso
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        overflow: 'hidden',
        marginRight: 12,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#111827',
        minWidth: 40,
    },

    // Botões
    startButton: {
        backgroundColor: '#3B82F6',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    reviewButton: {
        backgroundColor: '#10B981',
    },
    startButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonIcon: {
        marginLeft: 8,
    },

    // Estado vazio
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6B7280',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },

    // Níveis e progressão (mantidos para compatibilidade)
    scroll: {
        paddingHorizontal: 10,
        paddingBottom: 120,
    },
    levelWrapper: {
        alignItems: "center",
        marginVertical: 12,
        position: 'relative',
    },
    connector: {
        position: "absolute",
        top: -32,
        width: 3,
        height: 35,
        backgroundColor: 'rgba(255,255,255,0.4)',
        zIndex: 1,
    },
    connectorLocked: {
        backgroundColor: 'rgba(107, 114, 128, 0.4)',
    },
    connectorCurrent: {
        backgroundColor: '#4ADE80',
    },
    milestoneConnector: {
        backgroundColor: '#FFD700',
        width: 4,
    },
    levelCard: {
        backgroundColor: colors.card,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.1)',
        width: '65%',
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
        elevation: 15,
        zIndex: 2,
    },
    currentLevelCard: {
        borderColor: colors.primary,
        borderWidth: 2,
        shadowColor: colors.primary,
        shadowOpacity: 1,
        transform: [{ scale: 1.03 }],
    },
    lockedLevelCard: {
        backgroundColor: 'rgba(107, 114, 128, 0.3)',
        borderColor: 'rgba(107, 114, 128, 0.5)',
        opacity: 0.8,
    },
    milestoneCard: {
        borderColor: '#FFD700',
        shadowColor: "#FFD700",
        shadowOpacity: 0.3,
    },
    alignLeft: {
        alignSelf: "flex-start",
        marginLeft: 10,
    },
    alignRight: {
        alignSelf: "flex-end",
        marginRight: 10,
    },
    levelCircle: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        position: 'relative',
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 8,
    },
    currentLevelCircle: {
        shadowColor: "#4ADE80",
        shadowOpacity: 0.6,
        transform: [{ scale: 1.1 }],
    },
    lockedLevelCircle: {
        shadowColor: "#6B7280",
        shadowOpacity: 0.2,
    },
    milestoneCircle: {
        shadowColor: "#FFD700",
        shadowOpacity: 0.4,
    },
    trophyIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    levelText: {
        fontSize: 20,
        fontWeight: "800",
        color: colors.text,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    currentLevelText: {
        color: colors.text,
        textShadowColor: 'rgba(74, 222, 128, 0.5)',
    },
    levelInfo: {
        flex: 1,
    },
    levelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    levelTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.text || '#FFF',
        letterSpacing: 0.3,
        flex: 1,
    },
    currentLevelTitle: {
        color: '#4ADE80',
        fontWeight: '800',
    },
    lockedLevelTitle: {
        color: '#9CA3AF',
    },
    milestoneTitle: {
        color: '#FFD700',
        fontWeight: '800',
    },
    stars: {
        flexDirection: "row",
        gap: 3,
        marginBottom: 4,
    },
    levelDescription: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
        fontStyle: 'italic',
    },
    lockedLevelDescription: {
        color: 'rgba(156, 163, 175, 0.8)',
    },
    levelContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    currentLevelContainer: {
        borderWidth: 2,
        borderColor: '#6366F1',
    },
    lockedLevelContainer: {
        backgroundColor: '#F9FAFB',
        opacity: 0.9,
    },
    milestoneContainer: {
        borderWidth: 2,
        borderColor: '#F59E0B',
    },
    levelIndicator: {
        alignItems: 'center',
        marginRight: 16,
    },
    levelNumber: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelNumberGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    currentLevelNumber: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    lockedLevelNumber: {
        opacity: 0.7,
    },
    milestoneNumber: {
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    levelNumberText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 2,
    },
    currentLevelNumberText: {
        fontSize: 18,
    },
    levelConnector: {
        width: 2,
        height: 40,
        backgroundColor: '#E5E7EB',
        marginTop: 8,
    },
    currentLevelConnector: {
        backgroundColor: '#6366F1',
    },
    lockedLevelConnector: {
        backgroundColor: '#D1D5DB',
        opacity: 0.5,
    },
    levelContent: {
        flex: 1,
    },
    levelTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    levelFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusContainer: {
        flex: 1,
    },
    statusBadge: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    finalMessage: {
        alignItems: 'center',
        padding: 24,
        marginTop: 8,
    },
    finalMessageText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
    },
});