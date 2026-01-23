import { useTheme } from '@/context/useTheme';
import { db } from '@/db';
import { users } from '@/db/schemas';
import { getCurrentXpLevel } from '@/services/progress_here.service';
import { createHomeStyles } from '@/styles/home';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
interface User {
    id: number;
    name: string;
    email: string;
    picture: string;
    plan: string;
}

const Homescreen: React.FC = () => {
    const { mode, colors } = useTheme();
    const styles = createHomeStyles(colors);
    const router = useRouter();
    const [level, setLevel] = useState<number>(1);
    const [user, setUser] = useState<User | null>(null);
    const [userPhotoUri, setUserPhotoUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadData = async () => {
            const xpLevel = await getCurrentXpLevel();
            setLevel(xpLevel?.level || 1);
        };
        const fetchUserData = async () => {
            try {
                const result = await db.select().from(users).limit(1).execute();

                if (result.length > 0) {
                    const userData = result[0] as User;
                    setUser(userData);

                    // Buscar foto
                    const photoUri = await AsyncStorage.getItem(`user_photo_${userData.email}`);
                    if (photoUri) {
                        setUserPhotoUri(photoUri);
                    }



                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
        fetchUserData();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const getMotivation = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Um ótimo dia para aprender!';
        if (hour < 18) return 'Continue progredindo!';
        return 'Hora de consolidar o conhecimento!';
    };

    const getDailyTip = () => {
        const tips = [
            'Consistência é a chave. 30 minutos por dia valem mais que 5 horas uma vez por semana.',
            'Faça pausas regulares. A técnica Pomodoro (25min estudo, 5min pausa) aumenta a produtividade.',
            'Pratique o que aprendeu. Aplicar o conhecimento é mais eficaz que apenas ler ou assistir.',
            'Ensine o que aprendeu. Explicar para outras pessoas solidifica seu entendimento.',
            'Não tenha medo de errar. Cada erro é uma oportunidade de aprendizado.',
            'Revise regularmente. Repetição espaçada ajuda na memorização a longo prazo.',
            'Defina metas claras. Saber o que você quer alcançar mantém o foco e a motivação.',
            'Varie seus métodos de estudo. Use vídeos, livros, exercícios e projetos práticos.',
            'Consulte o Sony, ele adora ajudar com dicas de programação!',
        ];
        const dayOfWeek = new Date().getDay();
        return tips[dayOfWeek % tips.length];
    };


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Animatable.View animation="pulse" iterationCount="infinite">
                    <Ionicons name="code-slash" size={50} color={colors.primary} />
                </Animatable.View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header com Avatar */}
                <LinearGradient
                    colors={[colors.primary, colors.second]}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.greeting}>{getGreeting()}</Text>
                            <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Programador'}</Text>
                            <Text style={styles.motivation}>{getMotivation()}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.avatarButton}
                            onPress={() => router.push('/(drawer)/profile')}
                        >
                            {userPhotoUri ? (
                                <Image
                                    source={{ uri: userPhotoUri }}
                                    style={styles.avatar}
                                    onError={() => setUserPhotoUri(null)}
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Ionicons name="person" size={24} color="#fff" />
                                </View>
                            )}

                        </TouchableOpacity>
                    </View>


                </LinearGradient>

                {/* Progresso Diário */}
                <Animatable.View
                    animation="fadeInUp"
                    duration={600}
                    style={styles.dailyProgressCard}
                >
                    <View style={styles.dailyProgressHeader}>
                        <Text style={styles.dailyProgressTitle}> você ainda está no Nível:</Text>
                        <Text style={styles.dailyProgressValue}>{level}</Text>
                    </View>
                    <Text style={styles.dailyProgressTip}>
                        {'Ganhe mais XP para subir de nível!'}
                    </Text>
                </Animatable.View>


                {/* Dica do Dia */}
                <Animatable.View
                    animation="fadeInUp"
                    duration={600}
                    delay={200}
                    style={styles.tipCard}
                >
                    <View style={styles.tipHeader}>
                        <MaterialIcons name="lightbulb" size={24} color="#f59e0b" />
                        <View>
                            <Text style={styles.tipTitle}>Dica do Dia</Text>
                            <Text style={styles.tipSubtitle}>Para melhorar seu aprendizado</Text>
                        </View>
                    </View>

                    <Text style={styles.tipText}>
                        {getDailyTip()}
                    </Text>
                </Animatable.View>

                {/* Próximos Passos */}
                <View style={styles.nextSteps}>
                    <Text style={styles.sectionTitle}>Próximos Passos</Text>
                    <View style={styles.stepsGrid}>
                        <TouchableOpacity
                            style={styles.stepCard}
                            onPress={() => router.push('/(drawer)/(tabs)/learn')}
                        >
                            <Ionicons name="book-outline" size={24} color="#667eea" />
                            <Text style={styles.stepTitle}>Revise Lições</Text>
                            <Text style={styles.stepDescription}>Continue de onde parou</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.stepCard}
                            onPress={() => router.push('/game')}
                        >
                            <Ionicons name="code-slash-outline" size={24} color="#10b981" />
                            <Text style={styles.stepTitle}>Pratique</Text>
                            <Text style={styles.stepDescription}>Exercícios práticos</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default Homescreen;