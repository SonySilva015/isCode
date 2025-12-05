import { StyleSheet } from 'react-native';

export const createHomeStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollView: {
            flex: 1,
        },
        cardContainer: {
            marginBottom: 10,
            backgroundColor: colors.card,
            width: '90%',
            paddingHorizontal: 10,
            paddingVertical: 30,
            borderRadius: 10,
            borderColor: colors.borderCard,
            borderWidth: 1,
            height: 'auto',
            alignSelf: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.title,
            marginBottom: 8,
        },
        gradient: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 10,
            borderRadius: 20
        }
        ,
        minCards: {
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            objectFit: 'cover',
            gap: 5


        },
        tcard: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.card,
            width: '50%',
            padding: 10,
            height: 80,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.borderCard,
            gap: 10

        }
    });