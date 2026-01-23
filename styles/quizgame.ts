// Adicionar estes estilos ao seu arquivo styles/game.ts
import { StyleSheet } from 'react-native';

export const stylesGame = (colors: any) => StyleSheet.create({
    // ... outros estilos existentes

    // Quiz Styles
    quizContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    quizQuestionContainer: {
        marginBottom: 30,
    },
    quizQuestion: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
        lineHeight: 26,
    },
    quizOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.border,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 2,
    },
    optionText: {
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
    optionLabel: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        lineHeight: 22,
    },
    optionsContainer: {
        marginBottom: 30,
    },
    quizProgress: {
        marginTop: 16,
    },
    progressText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        marginBottom: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: `${colors.text}20`,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        padding: 10,
        backgroundColor: `${colors.primary}10`,
        borderRadius: 8,
    },
    hintText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        marginLeft: 8,
    },
    explanationContainer: {
        backgroundColor: `${colors.primary}10`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    explanationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    explanationHeaderText: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        marginLeft: 8,
    },
    explanationText: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        lineHeight: 20,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        minWidth: 140,
    },
    navButtonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
    },
    navButtonText: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        marginHorizontal: 8,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: 'Inter_700Bold',
        marginTop: 16,
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        marginBottom: 24,
        textAlign: 'center',
    },
    resultsContainer: {
        width: '100%',
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    resultLabel: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    resultValue: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
    },
    explanationBox: {
        width: '100%',
        backgroundColor: `${colors.primary}10`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    modalButtons: {
        width: '100%',
        gap: 12,
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
        marginRight: 8,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
});