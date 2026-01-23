import { useTheme } from '@/context/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const LOGIC_PROBLEMSETS = [
    {
        id: 1,
        title: 'Fundamentos Python',
        description: 'Variáveis, operadores e condicionais',
        difficulty: 'Iniciante',
        problems: 4,
        color: '#3B82F6',
        icon: 'code-working'
    },
    {
        id: 2,
        title: 'Estruturas de Controle',
        description: 'Loops, listas e dicionários',
        difficulty: 'Intermediário',
        problems: 3,
        color: '#10B981',
        icon: 'git-branch'
    },
    {
        id: 3,
        title: 'Funções & Algoritmos',
        description: 'Funções, recursão e algoritmos básicos',
        difficulty: 'Avançado',
        problems: 3,
        color: '#8B5CF6',
        icon: 'cog'
    },
];

const ProblemsetsScreen = () => {
    const { mode, colors } = useTheme();

    return (
        <LinearGradient
            colors={[
                colors.gradient.primary,
                colors.gradient.second,
                mode === 'dark' ? colors.background : colors.gradient.second,
            ]}
            style={styles.container}
        >
            <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Python Practice
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text + '80' }]}>
                        Aprenda Python resolvendo problemas reais
                    </Text>
                </View>

                <View style={styles.problemsetsContainer}>
                    {LOGIC_PROBLEMSETS.map((problemset) => (
                        <TouchableOpacity
                            key={problemset.id}
                            style={[
                                styles.problemsetCard,
                                { backgroundColor: colors.card }
                            ]}
                            onPress={() => router.push(`/problemset/${problemset.id}`)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardHeader}>
                                <View style={[
                                    styles.iconContainer,
                                    { backgroundColor: problemset.color + '20' }
                                ]}>
                                    <Ionicons
                                        name={problemset.icon as any}
                                        size={24}
                                        color={problemset.color}
                                    />
                                </View>
                                <View style={styles.cardInfo}>
                                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                                        {problemset.title}
                                    </Text>
                                    <Text style={[styles.cardDescription, { color: colors.text + '80' }]}>
                                        {problemset.description}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.cardFooter}>
                                <View style={[
                                    styles.difficultyBadge,
                                    { backgroundColor: problemset.color + '15' }
                                ]}>
                                    <Text style={[
                                        styles.difficultyText,
                                        { color: problemset.color }
                                    ]}>
                                        {problemset.difficulty}
                                    </Text>
                                </View>
                                <View style={styles.problemsInfo}>
                                    <Ionicons name="document-text" size={14} color={colors.text + '60'} />
                                    <Text style={[styles.problemsText, { color: colors.text + '60' }]}>
                                        {problemset.problems} problemas
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                    <Ionicons name="information-circle" size={24} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoTitle, { color: colors.text }]}>
                            Como funciona
                        </Text>
                        <Text style={[styles.infoText, { color: colors.text + '80' }]}>
                            1. Escolha um problemset{'\n'}
                            2. Escreva código Python no editor{'\n'}
                            3. Execute e veja os resultados{'\n'}
                            4. Compare com a solução
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
    },
    problemsetsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    problemsetCard: {
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    difficultyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
    },
    problemsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    problemsText: {
        fontSize: 12,
    },
    infoCard: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 16,
        gap: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 22,
    },
});

export default ProblemsetsScreen;