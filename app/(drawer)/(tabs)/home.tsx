import Header from '@/components/header/Header';
import Progress from '@/components/progress/progress';
import { useTheme } from '@/context/useTheme';
import { createHomeStyles } from '@/styles/home';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    View
} from 'react-native';
import * as Animatable from 'react-native-animatable';


const Homescreen = () => {


    const { mode, colors } = useTheme();
    const styles = createHomeStyles(colors);

    return (

        <View style={[styles.container]}>
            <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

            <Animatable.View
                animation="fadeInUp"
                duration={1000}
                delay={500}
                easing="ease-out-cubic"
                style={{ flex: 1 }}
            >

                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                    <Header />

                    <View style={styles.cardContainer} >
                        <Text style={styles.title}>Seu Progresso</Text>
                        <Progress prog={{ title: 'Em logica', perc: 100 }} />
                        <Progress prog={{ title: 'Em Algoritmo', perc: 50 }} />
                        <Progress prog={{ title: 'Em Estruturas', perc: 40 }} />
                    </View>

                    <View style={styles.minCards}>
                        <View style={styles.tcard}>
                            <Ionicons name="time-outline" size={28} color="#D64FD2" style={{ backgroundColor: 'rgba(214, 79, 191,0.3)', padding: 5, borderRadius: 50 }} />
                            <View>
                                <Text style={{ color: colors.text }}>
                                    Lições Total
                                </Text>
                                <Text style={{ color: colors.text }}>
                                    25
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tcard}>
                            <Ionicons name="flash-outline" size={28} color="#4F5AD6" style={{ backgroundColor: 'rgba(79, 90, 214,0.3)', padding: 5, borderRadius: 50 }} />
                            <View>
                                <Text style={{ color: colors.text }}>
                                    Soluções
                                </Text>
                                <Text style={{ color: colors.text }}>
                                    10
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>

    );
};



export default Homescreen;