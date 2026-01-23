import { StyleSheet } from 'react-native';

export const stylesLesson = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },

    // Header moderno
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    headerxp: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    headerContent: {
        alignItems: 'center',
        width: '100%',
    },

    // Progresso melhorado
    quizProgress: {
        width: '100%',
    },
    quizProgressText: {
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.5,
    },

    progressContainer: {
        position: 'relative',
        width: '100%',
        marginTop: 10,
    },
    progressBar: {
        height: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 7,
        overflow: 'hidden',
        position: 'relative',
    },
    progressFill: {
        height: '100%',
        borderRadius: 7,
        backgroundColor: colors.redbar,
    },
    progressGlow: {
        position: 'absolute',
        height: 14,
        borderRadius: 7,
        top: 0,
        left: 0,
        opacity: 0.4,
    },

    // Tela de resultados premium
    quizResultContainer: {
        alignItems: 'center',
        padding: 24,
        paddingTop: 40,
    },
    resultIconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 6,
    },
    resultTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    resultScore: {
        fontSize: 64,
        fontWeight: '900',
        marginBottom: 10,
        letterSpacing: 1,
    },
    resultMessage: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 0.3,
    },

    // Botões premium
    resultActions: {
        width: '100%',
        gap: 16,
    },
    resultButton: {
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    resultButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    // Estatísticas premium
    resultStats: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 20,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
        paddingVertical: 10,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        opacity: 0.8,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        opacity: 0.3,
    },

    // Perguntas premium
    questionContainer: {
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 24,
        marginTop: 30,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 8,
    },
    questionText: {
        fontSize: 20,
        color: colors.text,
        fontWeight: '600',
        lineHeight: 30,
        letterSpacing: 0.3,
    },

    // Opções premium
    optionsContainer: {
        gap: 12,
        marginBottom: 32,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.card,
        borderRadius: 18,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionCardSelected: {
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}08`,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionRadio: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionRadioSelected: {
        borderColor: colors.primary,
    },
    optionRadioInner: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: colors.primary,
    },
    optionText: {
        fontSize: 16,
        color: colors.text,
        flex: 1,
        fontWeight: '500',
        lineHeight: 22,
    },
    optionTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },

    // Navegação premium
    quizActions: {
        paddingBottom: 40,
        marginTop: 30,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        minHeight: 56,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
        letterSpacing: 0.3,
    },

    // Modal premium
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        maxWidth: 320,
    },
    modalContent: {
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
        elevation: 20,
        borderWidth: 4,
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    modalMessage: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 24,
        textAlign: 'center',
        opacity: 0.95,
        fontWeight: '500',
        lineHeight: 24,
    },
    modalScoreContainer: {
        alignItems: 'center',
        marginVertical: 24,
    },
    modalScoreText: {
        fontSize: 42,
        fontWeight: '900',
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 6,
        letterSpacing: 1,
    },
    modalScoreLabel: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        marginTop: 6,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    modalTimerContainer: {
        width: '100%',
        marginTop: 24,
    },
    modalTimerBar: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    modalTimerFill: {
        flex: 1,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    modalTimerFillInner: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        transformOrigin: 'left center',
    },

    // Marcação de progresso
    progressMarkers: {
        position: 'absolute',
        top: -3,
        left: 0,
        right: 0,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.border,
        borderWidth: 3,
        borderColor: colors.card,
        position: 'absolute',
        transform: [{ translateX: -10 }],
    },
    progressMarkerActive: {
        shadowColor: colors.redbar,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 4,
    },

    // Estilos de loading e error
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    feedbackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 2,
    },
    feedbackText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
        textAlign: 'center',
        flex: 1,
    },

});