import { StyleSheet } from 'react-native';

export const createSettingsStyles = (colors: any) =>
    StyleSheet.create({
        header: {
            backgroundColor: colors.card,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
        },
        headerRightContainer: {
            flexDirection: 'row',
            marginRight: 16,
        },
        headerButton: {
            marginHorizontal: 12,
            padding: 4,
            borderRadius: 8,
            backgroundColor: colors.text,
        },
        tabBar: {
            height: 100,
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingTop: 8,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,


        },
        tabBarLabel: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
        },
        activeTabIcon: {
            backgroundColor: '#F0EBFF',
            padding: 8,
            borderRadius: 12,
        }
    });
