import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const stylesGame = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255,255,255,0.9)",
        textAlign: "center",
        marginTop: 8,
        fontWeight: "500",
        letterSpacing: 0.3,
    },
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
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.1)',
        width: SCREEN_WIDTH * 0.78,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
        elevation: 15,
        zIndex: 2,
    },
    currentLevelCard: {
        borderColor: '#4ADE80',
        borderWidth: 2,
        shadowColor: "#4ADE80",
        shadowOpacity: 0.4,
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
        color: colors.titlewhite,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    currentLevelText: {
        color: '#FFF',
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
        color: colors.text,
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
});