import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },

    // Tela de lista de problemas
    problemsContainer: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    problemCount: {
        fontSize: 14,
        color: '#7f8c8d',
        fontWeight: '500',
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e1e8ed',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    problemsList: {
        flex: 1,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    problemCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e1e8ed',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    problemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    problemOJ: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3498db',
        flex: 1,
    },
    problemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    problemDescription: {
        fontSize: 14,
        color: '#5d6d7e',
        lineHeight: 20,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    difficultyEasy: {
        backgroundColor: '#d4edda',
    },
    difficultyMedium: {
        backgroundColor: '#fff3cd',
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#155724',
    },

    // Tela de resolução de problema
    problemSolvingContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    problemHeader1: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
    },
    backButton: {
        marginRight: 16,
    },
    backButtonText: {
        fontSize: 16,
        color: '#3498db',
        fontWeight: '600',
    },
    problemInfo: {
        flex: 1,
    },
    problemContent: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    ioContainer: {
        gap: 12,
    },
    ioBox: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e1e8ed',
    },
    ioTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
    },
    codeBlock: {
        fontFamily: 'monospace',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 6,
        fontSize: 14,
        color: '#2c3e50',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },

    // Seletor de linguagem
    languageSelector: {
        marginBottom: 8,
    },
    languageButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e1e8ed',
        marginRight: 8,
    },
    languageButtonSelected: {
        backgroundColor: '#3498db',
        borderColor: '#3498db',
    },
    languageText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#7f8c8d',
    },
    languageTextSelected: {
        color: '#fff',
    },

    // Editor de código
    codeEditor: {
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        padding: 16,
        borderRadius: 8,
        fontSize: 14,
        fontFamily: 'monospace',
        minHeight: 200,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#34495e',
    },

    // Botão de submissão
    submitButton: {
        backgroundColor: '#27ae60',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#27ae60',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#95a5a6',
        shadowOpacity: 0,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Resultados
    resultSection: {
        marginBottom: 24,
    },
    resultCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e1e8ed',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    resultStatus: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    resultStatusAccepted: {
        backgroundColor: '#d4edda',
        color: '#155724',
    },
    resultStatusError: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
    },
    resultMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    resultMetaText: {
        fontSize: 12,
        color: '#7f8c8d',
        fontWeight: '500',
    },
    resultOutput: {
        marginTop: 8,
    },
    resultOutputTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
    },
});