import { useTheme } from '@/context/useTheme';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface SecondaryButtonProps {
    title: string;
    onPress: () => void;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    title,
    onPress,
    icon,
    style,
    textStyle,
}) => {

    const { colors } = useTheme();
    const styles = Mystyles(colors);
    return (
        <TouchableOpacity
            style={[styles.button, style]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {icon && icon}
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

export default SecondaryButton;

const Mystyles = (colors: any) => StyleSheet.create({
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(121, 9, 185, 0.08)',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgb(121, 9, 185)',
    },
    text: {
        color: colors.secondButton,
        fontWeight: '600',
        fontSize: 15,
    },
});
