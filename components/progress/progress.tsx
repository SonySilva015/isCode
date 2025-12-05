import { useTheme } from '@/context/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';



interface ProgressProps {
    prog: {
        title: string;
        perc: number;
    };
}

const Progress: React.FC<ProgressProps> = ({ prog }) => {
    const { colors } = useTheme();
    return (
        <View>
            <View style={styles.textProgressContainer}>
                <Text style={{ color: colors.text }}>{prog.title}</Text>
                <Text style={styles.txtPerc}>{prog.perc}%</Text>
            </View>
            <View style={[styles.container, { backgroundColor: colors.border }]}>
                <View style={[styles.progress, { width: `${prog.perc}%` }]} >
                    <LinearGradient

                        colors={[colors.second, colors.primary, colors.redbar]}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />

                </View>
            </View>

        </View>
    )
}

export default Progress