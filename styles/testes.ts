import { StyleSheet } from 'react-native'



export const stylesTest = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: colors.background,
        alignItems: 'center',
        gap: 20
    },
    icon1: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(14, 245, 52, 0.3)',
        borderRadius: 50,
        width: 40,
        height: 40
    },
    icon2: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(17, 64, 218, 0.3)',
        borderRadius: 50,
        width: 40,
        height: 40
    },
    icon3: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(230, 14, 201, 0.3)',
        borderRadius: 50,
        width: 40,
        height: 40
    },
    header: {
        padding: 10,
        width: '100%',
        height: 'auto',
        justifyContent: 'center',
        backgroundColor: '',
        borderRadius: 5,
        gap: 10,

    },
    blocks: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 10
    },

    CardBlocks: {
        width: '30%',
        backgroundColor: colors.transWhite,
        flexDirection: 'column',
        height: 'auto',
        borderRadius: 15,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,

    },
    prog: {
        width: '100%',

    }
    , gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 200,
        borderRadius: 15
    },
    title: {
        color: colors.title,
        fontSize: 24,
        fontWeight: 'bold'
    },
    texts: {
        color: colors.text,
        fontSize: 12,

    },
    textBody: {
        fontSize: 14,
        color: colors.text,
        fontWeight: '500',
        marginBottom: 10,
    },
    cardContainer: {
        marginBottom: 10,
        backgroundColor: colors.card,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignSelf: 'center',
        shadowColor: colors.shadow,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    button: {
        padding: 10,
        backgroundColor: colors.colorButtonprimary,
        borderRadius: 8,
        marginTop: 20,
    },
    textButton: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },

})