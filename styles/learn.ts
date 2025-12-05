import { StyleSheet } from "react-native";


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
    cardHeader: {
        flexDirection: 'row',
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
        backgroundColor: '#10B981',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
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
    }
});