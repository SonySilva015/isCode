import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
    },
    languageText: {
        fontSize: 13,
        fontWeight: '600',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 6,
    },
    activeTab: {
        borderBottomWidth: 2,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
    },
    tabBadge: {
        fontSize: 11,
    },
    content: {
        flex: 1,
    },
    editorContent: {
        flex: 1,
    },
    editorScroll: {
        flex: 1,
        padding: 16,
    },
    codeSection: {
        marginBottom: 20,
    },
    codeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
    trashButton: {
        padding: 4,
    },
    codeInput: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        minHeight: 300,
        fontSize: 14,
        fontFamily: 'monospace',
        textAlignVertical: 'top',
    },
    inputSection: {
        marginBottom: 20,
    },
    stdinInput: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        minHeight: 80,
        fontSize: 14,
        fontFamily: 'monospace',
        textAlignVertical: 'top',
    },
    hintText: {
        fontSize: 12,
        marginTop: 4,
        fontStyle: 'italic',
    },
    outputContent: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: 14,
        marginTop: 12,
    },
    outputScroll: {
        flex: 1,
    },
    outputWrapper: {
        borderRadius: 8,
        borderWidth: 1,
        padding: 16,
    },
    outputText: {
        fontSize: 14,
        fontFamily: 'monospace',
        lineHeight: 20,
    },
    emptyOutput: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 14,
        marginTop: 16,
        textAlign: 'center',
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    executeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
    },
    executeButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    languageList: {
        maxHeight: 400,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 8,
        marginBottom: 6,
        gap: 12,
    },
    languageItemText: {
        fontSize: 16,
        flex: 1,
    },
});