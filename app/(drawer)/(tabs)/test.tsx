import { useTheme } from '@/context/useTheme';
import { stylesTest } from '@/styles/testes';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Progress from '../../../components/progress/progress';

const Test = () => {
    const { mode, colors } = useTheme();
    const styles = stylesTest(colors);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

            <ScrollView>

                <View style={styles.container} >

                    <Text style={styles.title} >
                        Teste e avaliações
                    </Text>
                    <Text style={styles.textBody}>
                        Teste o seu conhecimento,
                        ganha medalhas e suba de nivel
                    </Text>

                    <View style={styles.header} >
                        <LinearGradient

                            colors={[
                                mode === 'dark' ? 'rgba(210, 114, 223, 0.5)' : 'rgba(186, 23, 207, 0.3)',
                                mode === 'dark' ? 'rgba(39, 47, 53, 0.8)' : 'rgba(216, 228, 231, 0.8)',
                                mode === 'dark' ? colors.second : 'rgba(185, 197, 219, 0.3)'
                            ]}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                        <View style={styles.blocks}>

                            <View style={styles.CardBlocks}>
                                <View style={styles.icon1}>
                                    <Ionicons name="home" size={24} color={'rgb(18, 133, 37)'} />
                                </View>
                                <Text style={styles.title}>{80}</Text>
                                <Text style={styles.texts}>Completos</Text>
                            </View>
                            <View style={styles.CardBlocks}>
                                <View style={styles.icon2}>
                                    <Ionicons name="star-outline" size={24} color='rgba(11, 43, 114, 1)' />
                                </View>
                                <Text style={styles.title}>{50}%</Text>
                                <Text style={styles.texts}>Média</Text>
                            </View>
                            <View style={styles.CardBlocks}>
                                <View style={styles.icon3}>
                                    <Ionicons name="trophy-outline" size={24} color='rgb(124, 11, 134)' />
                                </View>
                                <Text style={styles.title}>{4}</Text>
                                <Text style={styles.texts}>Trofeus</Text>
                            </View>
                        </View>
                        <View style={styles.prog} >
                            <Progress prog={{ title: `progresso para o nivel ${10}`, perc: 50 }} />
                        </View>
                    </View>

                    <View style={styles.cardContainer}>
                        <Text style={styles.title}>Teste de Lógica</Text>
                        <Text style={styles.textBody}>Teste a sua lógica e ganhe mais estrelas( if, switch, loops, etc. ) </Text>
                        <TouchableOpacity style={styles.button} >
                            <Text style={styles.textButton}>Testar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardContainer}>
                        <Text style={styles.title}>Teste de Estrutura</Text>
                        <Text style={styles.textBody}>Teste a sua lógica e ganhe mais estrelas ( if, switch, loops, etc. ) </Text>
                        <TouchableOpacity style={styles.button} >
                            <Text style={styles.textButton}>Testar</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </ScrollView>
        </View>
    )
}

export default Test