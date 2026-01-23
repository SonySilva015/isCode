import { useTheme } from '@/context/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';


interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    picture: string;
    plan: string;
}

interface HeaderProps {
    user: User | null;  // Garantir que o usuário pode ser null
}
const Header: React.FC<HeaderProps> = ({ user }) => {
    const { colors } = useTheme();
    return (
        <View style={styles.header}>

            <LinearGradient

                colors={[
                    colors.gradient.primary,  // roxo escuro
                    colors.gradient.midle,   // rosa intermediário
                    colors.gradient.second,                // transparente à direita
                ]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <View style={styles.allside}>
                <View style={styles.eachSide}>


                    <View style={styles.minCards}>
                        <Ionicons name="trophy" size={24} color="rgb(255,215,0)" />
                        <Text style={{ color: colors.text }}>Conquistas </Text>
                    </View>


                    <Text style={{ color: colors.text }}>250</Text>
                </View>


                <View style={styles.eachSide}>

                    <View style={styles.minCards}>
                        <Ionicons name="star" size={24} color="rgb(226, 130, 92)" />
                        <Text style={{ color: colors.text }}>Total de ispm</Text>
                    </View>


                    <Text style={{ color: colors.text }}>250</Text>
                </View>
            </View>

        </View>
    );
};



export default Header;