import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 16,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        position: 'relative',
    },
    cardHeader: {
        flexDirection: 'row',
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
        color: '#2D3748',
        marginBottom: 6,
    },
    textBody: {
        fontSize: 14,
        color: '#718096',
        lineHeight: 20,
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
        backgroundColor: 'rgba(121, 9, 185, 0.1)',
        borderWidth: 1,
        borderColor: 'rgb(121, 9, 185)',
    },
    secondaryButtonText: {
        color: 'rgb(121, 9, 185)',
        fontSize: 14,
        fontWeight: '600',
    },
    completedBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
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
});
