import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    header: {
        backgroundColor: 'rgba(112, 13, 226, 0.93)',
        borderRadius: 20,
        marginTop: 50,
        elevation: 2,
        padding: 20,
        width: '90%',
        height: 'auto',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: 10
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 20
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    allside: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        objectFit: 'cover',
        gap: 8
    },
    eachSide: {
        backgroundColor: 'rgba(255, 255, 255,0.4)',
        borderRadius: 10,
        padding: 10,
        textAlign: 'center',
        width: '50%',
        height: 'auto',

    },
    minCards: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 5,
        marginBottom: 5,
    },
    greeting: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffff',
    },
    subtitle: {
        fontSize: 12,
        color: '#ffff',
        marginTop: 4,

    },

    notificationButton: {
        position: 'relative',
        padding: 8,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255,0.3)',
        color: '#ffff',
    },
    notificationBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF6B6B',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'transparent',
        marginBottom: 15,

    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#333',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 205,
        borderRadius: 20
    }
});

