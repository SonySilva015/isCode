import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

export const createLearnStyles = (colors: any) => StyleSheet.create({
    scrollContainer: {
        padding: 16,
        paddingBottom: 20,
        backgroundColor: colors.background,
    },
    header: {
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#718096',
        lineHeight: 22,
    },
    cardContainer: {
        marginBottom: 16,
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        position: 'relative',
        borderWidth: 1,
        borderColor: colors.borderCard,
    },
    cardLocked: {
        backgroundColor: colors.card,
        opacity: 0.6,

    },
    cardHeader: {

        marginTop: 5,
        marginBottom: 16,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    topicInfo: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.title,
        marginBottom: 6,
    },
    textBody: {
        fontSize: 14,
        color: colors.text,
        lineHeight: 20,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 12,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 12,
        color: colors.text,
        marginLeft: 4,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    button: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    primaryButton: {
        backgroundColor: 'rgb(121, 9, 185)',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: colors.second,
        borderWidth: 1,
        borderColor: 'rgb(121, 9, 185)',
    },
    secondaryButtonText: {
        color: 'rgb(121, 9, 185)',
        fontSize: 14,
        fontWeight: '600',
    },
    completed: {
        position: 'absolute',
        top: 1,
        right: 2,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 3


    },
    completedText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },

    statsCard: {
        backgroundColor: colors.card,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    statsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.title1,
        marginLeft: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'rgb(121, 9, 185)',
    },
    statLabel: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
    },
    motivationCard: {
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    motivationContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    motivationText: {
        flex: 1,
        marginLeft: 12,
    },
    motivationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 4,
    },
    motivationSubtitle: {
        fontSize: 14,
        color: '#718096',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 140,
        borderRadius: 20
    },
    dropdownContainer: {
        marginHorizontal: 20,
        marginTop: 60,
        marginBottom: 10,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary || '#667eea',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    dropdownButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    dropdownButtonText: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        paddingTop: 120,
    },
    modalContent: {
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
    },
    dropdownList: {
        backgroundColor: colors.card || '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border || '#f1f5f9',
    },
    dropdownItemText: {
        fontSize: 16,
        color: colors.text || '#1e293b',
        fontWeight: '500',
        flex: 1,
    },
    modulesList: {
        marginTop: 16,
    },
    moduleItem: {
        backgroundColor: colors.surface || '#f8fafc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    lastModuleItem: {
        marginBottom: 0,
    },
    moduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moduleNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.primary || '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    moduleNumberText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    moduleInfo: {
        flex: 1,
    },
    moduleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text || '#1e293b',
        marginBottom: 4,
    },
    moduleDescription: {
        fontSize: 14,
        color: colors.textSecondary || '#64748b',
        lineHeight: 20,
        marginBottom: 8,
    },
    moduleDuration: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    durationText: {
        fontSize: 12,
        color: colors.textSecondary || '#64748b',
        marginLeft: 4,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        fontSize: 16,
        color: colors.textSecondary || '#64748b',
        marginTop: 16,
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    errorText: {
        fontSize: 16,
        color: colors.error || '#ef4444',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: colors.primary || '#667eea',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    overlay: {
        position: 'absolute',
        width,
        height,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContainer: {

        position: 'absolute',
        width,
        height: 'auto', // altura do modal
        backgroundColor: colors.background,
        top: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingTop: 16,
        zIndex: 1000,
    },
    courseCard: {
        width: 150,
        height: 150,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 12,
        marginLeft: 8,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
});
