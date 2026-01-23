import { useTheme } from '@/context/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const JDOODLE_CLIENT_ID = 'e15929da8ce1927a94b045e04237d737';
const JDOODLE_CLIENT_SECRET = '336bddc03b8afa5a2bc1b0b3a4be3b37194ef8c46e54a191d1063a9df6898719';

// Exemplo de um problema
const SAMPLE_PROBLEM = {
    id: 1,
    title: "Soma de Dois Números",
    difficulty: "Fácil",
    description: `Escreva um programa que receba dois números inteiros como entrada e retorne a soma deles.

## Entrada
A entrada consiste de dois números inteiros, um por linha.

## Saída
A saída deve conter a soma dos dois números.

## Exemplo
### Entrada
\`\`\`
5
3
\`\`\`

### Saída
\`\`\`
8
\`\`\``,
    testCases: [
        {
            id: 1,
            input: "5\n3",
            expectedOutput: "8",
            isHidden: false
        },
        {
            id: 2,
            input: "10\n20",
            expectedOutput: "30",
            isHidden: false
        },
        {
            id: 3,
            input: "-5\n8",
            expectedOutput: "3",
            isHidden: false
        },
        {
            id: 4,
            input: "100\n-100",
            expectedOutput: "0",
            isHidden: true
        }
    ],
    starterCode: `# Complete a função soma abaixo
def soma(a, b):
    # Seu código aqui
    pass

# O código abaixo lê a entrada e chama sua função
# Não modifique abaixo desta linha
if __name__ == "__main__":
    a = int(input())
    b = int(input())
    resultado = soma(a, b)
    print(resultado)`
};

type TestCase = {
    id: number;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
};

type TestResult = {
    testCase: TestCase;
    passed: boolean;
    actualOutput?: string;
    error?: string;
    executionTime?: number;
};

type CustomTestResult = {
    input: string;
    output: string;
    executionTime: number;
    error?: string;
};

export default function ProblemSolver() {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState<'problem' | 'editor' | 'results'>('problem');
    const [code, setCode] = useState(SAMPLE_PROBLEM.starterCode);
    const [stdin, setStdin] = useState('5\n3'); // Stdin para testes personalizados
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [customTestHistory, setCustomTestHistory] = useState<CustomTestResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false); // Para teste personalizado
    const [submitted, setSubmitted] = useState(false);

    const executeCode = async (inputCode: string, inputStdin: string) => {
        const startTime = Date.now();

        try {
            const response = await fetch('https://api.jdoodle.com/v1/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: JDOODLE_CLIENT_ID,
                    clientSecret: JDOODLE_CLIENT_SECRET,
                    script: inputCode,
                    stdin: inputStdin,
                    language: 'python3',
                    versionIndex: '3'
                })
            });

            const result = await response.json();
            const endTime = Date.now();

            return {
                output: result.output || '',
                error: result.error,
                executionTime: endTime - startTime
            };

        } catch (error) {
            return {
                output: '',
                error: 'Erro de conexão com o servidor',
                executionTime: Date.now() - startTime
            };
        }
    };

    const runCustomTest = async () => {
        if (!code.trim()) {
            Alert.alert('Erro', 'Escreva algum código antes de testar');
            return;
        }

        if (!stdin.trim()) {
            Alert.alert('Aviso', 'Digite uma entrada para testar ou use os exemplos abaixo');
            return;
        }

        setTesting(true);

        const result = await executeCode(code, stdin);

        const testResult: CustomTestResult = {
            input: stdin,
            output: result.output,
            executionTime: result.executionTime,
            error: result.error
        };

        // Adiciona ao histórico (mantém apenas os últimos 5)
        setCustomTestHistory(prev => [testResult, ...prev.slice(0, 4)]);

        setTesting(false);

        // Mostra resultado imediatamente
        Alert.alert(
            result.error ? '❌ Erro no Teste' : '✅ Resultado do Teste',
            result.error
                ? `${result.error}`
                : `Saída:\n${result.output || "(vazia)"}\n\n⏱️ Tempo: ${result.executionTime}ms`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Muda para aba de resultados se não houver erro
                        if (!result.error) {
                            setActiveTab('results');
                        }
                    }
                }
            ]
        );
    };

    const runAllTests = async () => {
        if (!code.trim()) {
            Alert.alert('Erro', 'Escreva algum código antes de submeter');
            return;
        }

        setLoading(true);
        setTestResults([]);
        setSubmitted(true);

        const results: TestResult[] = [];
        let allPassed = true;

        for (const testCase of SAMPLE_PROBLEM.testCases) {
            const executionResult = await executeCode(code, testCase.input);

            let passed = false;
            let actualOutput = '';

            if (executionResult.error) {
                // Em caso de erro de execução
                results.push({
                    testCase,
                    passed: false,
                    error: executionResult.error,
                    executionTime: executionResult.executionTime
                });
                allPassed = false;
            } else {
                // Compara saída
                actualOutput = executionResult.output.trim();
                const expectedOutput = testCase.expectedOutput.trim();
                passed = actualOutput === expectedOutput;

                if (!passed) {
                    allPassed = false;
                }

                results.push({
                    testCase,
                    passed,
                    actualOutput,
                    executionTime: executionResult.executionTime
                });
            }

            // Atualizar resultados parcialmente para feedback em tempo real
            setTestResults([...results]);
        }

        setLoading(false);

        // Mostra resultado geral
        if (allPassed) {
            Alert.alert(
                '🎉 Parabéns!',
                `Todos os ${SAMPLE_PROBLEM.testCases.length} testes passaram!`,
                [{
                    text: 'OK',
                    onPress: () => setActiveTab('results')
                }]
            );
        } else {
            const passedCount = results.filter(r => r.passed).length;
            Alert.alert(
                '⚠️ Testes Completos',
                `${passedCount} de ${SAMPLE_PROBLEM.testCases.length} testes passaram.`,
                [{
                    text: 'Ver Detalhes',
                    onPress: () => setActiveTab('results')
                }]
            );
        }
    };

    const resetCode = () => {
        Alert.alert(
            'Resetar Código',
            'Deseja resetar para o código inicial? Isso também limpará seus testes.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Resetar',
                    style: 'destructive',
                    onPress: () => {
                        setCode(SAMPLE_PROBLEM.starterCode);
                        setStdin('5\n3');
                        setTestResults([]);
                        setCustomTestHistory([]);
                        setSubmitted(false);
                    }
                }
            ]
        );
    };

    const loadExampleInput = (exampleIndex: number) => {
        const example = SAMPLE_PROBLEM.testCases[exampleIndex];
        if (example && !example.isHidden) {
            setStdin(example.input);
        }
    };

    const getPassedCount = () => {
        return testResults.filter(r => r.passed).length;
    };

    const getTotalTests = () => {
        return SAMPLE_PROBLEM.testCases.length;
    };

    const renderProblemTab = () => (
        <ScrollView style={styles.scrollContent}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.description, { color: colors.text }]}>
                    {SAMPLE_PROBLEM.description}
                </Text>

                <View style={styles.testCasesPreview}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Exemplos de Entrada/Saída
                    </Text>
                    {SAMPLE_PROBLEM.testCases
                        .filter(tc => !tc.isHidden)
                        .slice(0, 2) // Mostra apenas 2 exemplos
                        .map((testCase, index) => (
                            <TouchableOpacity
                                key={testCase.id}
                                style={[
                                    styles.testCasePreview,
                                    {
                                        backgroundColor: colors.background,
                                        borderColor: colors.border
                                    }
                                ]}
                                onPress={() => {
                                    setStdin(testCase.input);
                                    setActiveTab('editor');
                                }}
                            >
                                <View style={styles.testCaseHeader}>
                                    <Text style={[styles.testCaseTitle, { color: colors.text }]}>
                                        Exemplo {index + 1}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setStdin(testCase.input);
                                            setActiveTab('editor');
                                        }}
                                    >
                                        <Ionicons name="play" size={16} color={colors.primary} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={[styles.testCaseLabel, { color: colors.text + '80' }]}>
                                    Entrada:
                                </Text>
                                <View style={[styles.codeBlock, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }]}>
                                    <Text style={[styles.codeText, { color: isDark ? '#e5e7eb' : '#374151' }]}>
                                        {testCase.input}
                                    </Text>
                                </View>

                                <Text style={[styles.testCaseLabel, { color: colors.text + '80' }]}>
                                    Saída Esperada:
                                </Text>
                                <View style={[styles.codeBlock, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }]}>
                                    <Text style={[styles.codeText, { color: isDark ? '#e5e7eb' : '#374151' }]}>
                                        {testCase.expectedOutput}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                </View>
            </View>
        </ScrollView>
    );

    const renderEditorTab = () => (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.editorContainer}>
                {/* Editor de Código */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.editorHeader}>
                        <Text style={[styles.editorTitle, { color: colors.text }]}>
                            Python 3
                        </Text>
                        <TouchableOpacity onPress={resetCode}>
                            <Ionicons name="refresh" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={[
                            styles.editor,
                            {
                                backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
                                color: isDark ? '#ffffff' : '#000000',
                            }
                        ]}
                        value={code}
                        onChangeText={setCode}
                        multiline
                        textAlignVertical="top"
                        placeholder="Escreva seu código Python aqui..."
                        placeholderTextColor={colors.text + '60'}
                    />
                </View>

                {/* Área de Teste Personalizado */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.testHeader}>
                        <Text style={[styles.testTitle, { color: colors.text }]}>
                            Teste Rápido
                        </Text>
                        <Text style={[styles.testHint, { color: colors.text + '60' }]}>
                            Teste com entradas personalizadas antes de submeter
                        </Text>
                    </View>

                    {/* Exemplos Rápidos */}
                    <View style={styles.quickExamples}>
                        <Text style={[styles.examplesLabel, { color: colors.text + '80' }]}>
                            Exemplos rápidos:
                        </Text>
                        <View style={styles.examplesContainer}>
                            {SAMPLE_PROBLEM.testCases
                                .filter(tc => !tc.isHidden)
                                .map((testCase, index) => (
                                    <TouchableOpacity
                                        key={testCase.id}
                                        style={[
                                            styles.exampleButton,
                                            {
                                                backgroundColor: stdin === testCase.input
                                                    ? colors.primary + '20'
                                                    : colors.background,
                                                borderColor: colors.border
                                            }
                                        ]}
                                        onPress={() => setStdin(testCase.input)}
                                    >
                                        <Text style={[
                                            styles.exampleButtonText,
                                            {
                                                color: stdin === testCase.input
                                                    ? colors.primary
                                                    : colors.text + '80'
                                            }
                                        ]}>
                                            Ex {index + 1}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                        </View>
                    </View>

                    {/* Input para Teste */}
                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                        Entrada (stdin):
                    </Text>
                    <TextInput
                        style={[
                            styles.stdinInput,
                            {
                                backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
                                color: isDark ? '#ffffff' : '#000000',
                                borderColor: colors.border
                            }
                        ]}
                        value={stdin}
                        onChangeText={setStdin}
                        multiline
                        textAlignVertical="top"
                        placeholder="Digite a entrada para testar seu código..."
                        placeholderTextColor={colors.text + '60'}
                    />
                    <Text style={[styles.inputHint, { color: colors.text + '60' }]}>
                        Cada linha corresponde a um input()
                    </Text>

                    {/* Histórico de Testes */}
                    {customTestHistory.length > 0 && (
                        <View style={styles.historyContainer}>
                            <Text style={[styles.historyTitle, { color: colors.text }]}>
                                Testes Recentes
                            </Text>
                            {customTestHistory.map((test, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.historyItem,
                                        {
                                            backgroundColor: colors.background,
                                            borderColor: colors.border
                                        }
                                    ]}
                                >
                                    <View style={styles.historyHeader}>
                                        <Text style={[styles.historyInput, { color: colors.text }]}>
                                            Entrada: {test.input.length > 30 ? test.input.substring(0, 30) + '...' : test.input}
                                        </Text>
                                        <Text style={[styles.historyTime, { color: colors.text + '60' }]}>
                                            {test.executionTime}ms
                                        </Text>
                                    </View>
                                    {test.error ? (
                                        <Text style={[styles.historyError, { color: '#ef4444' }]}>
                                            ❌ {test.error}
                                        </Text>
                                    ) : (
                                        <Text style={[styles.historyOutput, { color: '#10b981' }]}>
                                            ✅ Saída: {test.output || '(vazia)'}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

    const renderResultsTab = () => (
        <ScrollView style={styles.scrollContent}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                {!submitted ? (
                    <View style={styles.emptyResults}>
                        <Ionicons name="stats-chart-outline" size={48} color={colors.text + '40'} />
                        <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
                            Execute os testes para ver os resultados
                        </Text>
                        <TouchableOpacity
                            style={[styles.runFirstButton, { backgroundColor: colors.primary }]}
                            onPress={runAllTests}
                        >
                            <Text style={styles.runFirstButtonText}>
                                Executar Testes
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={styles.resultsHeader}>
                            <View style={styles.scoreContainer}>
                                <Text style={[styles.scoreLabel, { color: colors.text + '80' }]}>
                                    Resultado
                                </Text>
                                <Text style={[
                                    styles.scoreValue,
                                    {
                                        color: getPassedCount() === getTotalTests() ? '#10b981' :
                                            getPassedCount() > 0 ? '#f59e0b' : '#ef4444'
                                    }
                                ]}>
                                    {getPassedCount()}/{getTotalTests()} testes passaram
                                </Text>
                                <Text style={[styles.scorePercentage, { color: colors.text + '60' }]}>
                                    ({Math.round((getPassedCount() / getTotalTests()) * 100)}%)
                                </Text>
                            </View>

                            <View style={styles.statsGrid}>
                                <View style={[
                                    styles.statBox,
                                    { backgroundColor: '#10b98110', borderColor: '#10b98130' }
                                ]}>
                                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                                    <Text style={[styles.statBoxValue, { color: colors.text }]}>
                                        {getPassedCount()}
                                    </Text>
                                    <Text style={[styles.statBoxLabel, { color: colors.text + '80' }]}>
                                        Passaram
                                    </Text>
                                </View>

                                <View style={[
                                    styles.statBox,
                                    { backgroundColor: '#ef444410', borderColor: '#ef444430' }
                                ]}>
                                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                                    <Text style={[styles.statBoxValue, { color: colors.text }]}>
                                        {getTotalTests() - getPassedCount()}
                                    </Text>
                                    <Text style={[styles.statBoxLabel, { color: colors.text + '80' }]}>
                                        Falharam
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Detalhes dos Testes
                        </Text>

                        {testResults.map((result, index) => (
                            <View
                                key={result.testCase.id}
                                style={[
                                    styles.testResultCard,
                                    {
                                        backgroundColor: result.passed ? '#10b98110' : '#ef444410',
                                        borderColor: result.passed ? '#10b98130' : '#ef444430'
                                    }
                                ]}
                            >
                                <View style={styles.testResultHeader}>
                                    <View style={styles.testResultTitle}>
                                        <Ionicons
                                            name={result.passed ? "checkmark-circle" : "close-circle"}
                                            size={20}
                                            color={result.passed ? "#10b981" : "#ef4444"}
                                        />
                                        <Text style={[
                                            styles.testCaseTitle,
                                            { color: colors.text }
                                        ]}>
                                            Teste {index + 1}
                                            {result.testCase.isHidden ? ' (Oculto)' : ''}
                                        </Text>
                                    </View>
                                    <View style={styles.testResultStats}>
                                        <Text style={[
                                            styles.statusText,
                                            { color: result.passed ? '#10b981' : '#ef4444' }
                                        ]}>
                                            {result.passed ? 'PASSOU' : 'FALHOU'}
                                        </Text>
                                        {result.executionTime && (
                                            <Text style={[styles.timeText, { color: colors.text + '80' }]}>
                                                {result.executionTime}ms
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {!result.testCase.isHidden && (
                                    <>
                                        <View style={styles.ioContainer}>
                                            <View style={styles.ioSection}>
                                                <Text style={[styles.ioLabel, { color: colors.text + '80' }]}>
                                                    Entrada
                                                </Text>
                                                <View style={[styles.codeBlock, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }]}>
                                                    <Text style={[styles.codeText, { color: isDark ? '#e5e7eb' : '#374151' }]}>
                                                        {result.testCase.input}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.ioSection}>
                                                <Text style={[styles.ioLabel, { color: colors.text + '80' }]}>
                                                    Saída Esperada
                                                </Text>
                                                <View style={[styles.codeBlock, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6' }]}>
                                                    <Text style={[styles.codeText, { color: isDark ? '#e5e7eb' : '#374151' }]}>
                                                        {result.testCase.expectedOutput}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        {!result.passed && result.actualOutput !== undefined && (
                                            <View style={styles.ioSection}>
                                                <Text style={[styles.ioLabel, { color: colors.text + '80' }]}>
                                                    Sua Saída
                                                </Text>
                                                <View style={[styles.codeBlock, { backgroundColor: '#fef2f2' }]}>
                                                    <Text style={[styles.codeText, { color: '#dc2626' }]}>
                                                        {result.actualOutput}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}

                                        {result.error && (
                                            <View style={styles.errorContainer}>
                                                <Text style={[styles.errorLabel, { color: colors.text + '80' }]}>
                                                    Erro
                                                </Text>
                                                <View style={[styles.codeBlock, { backgroundColor: '#fef2f2' }]}>
                                                    <Text style={[styles.codeText, { color: '#dc2626' }]}>
                                                        {result.error}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </>
                                )}

                                {result.testCase.isHidden && !result.passed && !result.error && (
                                    <Text style={[styles.hiddenTestText, { color: colors.text + '60' }]}>
                                        Este teste é oculto. Verifique sua lógica.
                                    </Text>
                                )}
                            </View>
                        ))}
                    </>
                )}
            </View>
        </ScrollView>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.problemInfo}>
                    <Text style={[styles.problemTitle, { color: colors.text }]}>
                        {SAMPLE_PROBLEM.title}
                    </Text>
                    <View style={[
                        styles.difficultyBadge,
                        {
                            backgroundColor:
                                SAMPLE_PROBLEM.difficulty === 'Fácil' ? '#10b981' :
                                    SAMPLE_PROBLEM.difficulty === 'Médio' ? '#f59e0b' :
                                        '#ef4444'
                        }
                    ]}>
                        <Text style={styles.difficultyText}>
                            {SAMPLE_PROBLEM.difficulty}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={resetCode}>
                    <Ionicons name="refresh" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'problem' && [styles.activeTab, { borderBottomColor: colors.primary }]
                    ]}
                    onPress={() => setActiveTab('problem')}
                >
                    <Ionicons
                        name="document-text"
                        size={20}
                        color={activeTab === 'problem' ? colors.primary : colors.text + '80'}
                    />
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'problem' ? colors.primary : colors.text + '80' }
                    ]}>
                        Problema
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'editor' && [styles.activeTab, { borderBottomColor: colors.primary }]
                    ]}
                    onPress={() => setActiveTab('editor')}
                >
                    <Ionicons
                        name="code"
                        size={20}
                        color={activeTab === 'editor' ? colors.primary : colors.text + '80'}
                    />
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'editor' ? colors.primary : colors.text + '80' }
                    ]}>
                        Editor
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'results' && [styles.activeTab, { borderBottomColor: colors.primary }]
                    ]}
                    onPress={() => setActiveTab('results')}
                >
                    <Ionicons
                        name="stats-chart"
                        size={20}
                        color={activeTab === 'results' ? colors.primary : colors.text + '80'}
                    />
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'results' ? colors.primary : colors.text + '80' }
                    ]}>
                        Resultados
                        {submitted && (
                            <Text style={styles.resultsBadge}>
                                {` ${getPassedCount()}/${getTotalTests()}`}
                            </Text>
                        )}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Conteúdo das Tabs */}
            <View style={styles.content}>
                {activeTab === 'problem' && renderProblemTab()}
                {activeTab === 'editor' && renderEditorTab()}
                {activeTab === 'results' && renderResultsTab()}
            </View>

            {/* Footer com botões de ação */}
            <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[
                        styles.secondaryButton,
                        {
                            borderColor: colors.border,
                            opacity: testing ? 0.7 : 1
                        }
                    ]}
                    onPress={runCustomTest}
                    disabled={testing || loading}
                >
                    {testing ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <Ionicons name="play" size={20} color={colors.primary} />
                    )}
                    <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
                        {testing ? 'Testando...' : 'Testar Código'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.primaryButton,
                        {
                            backgroundColor: loading ? colors.text + '40' : colors.primary,
                            opacity: (loading || testing) ? 0.8 : 1
                        }
                    ]}
                    onPress={runAllTests}
                    disabled={loading || testing}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                            <Text style={styles.primaryButtonText}>
                                Submeter Todos os Testes
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    problemInfo: {
        alignItems: 'center'
    },
    problemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4
    },
    difficultyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12
    },
    difficultyText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600'
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8
    },
    activeTab: {
        borderBottomWidth: 2
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600'
    },
    resultsBadge: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    content: {
        flex: 1
    },
    scrollContent: {
        flex: 1,
        padding: 16
    },
    editorContainer: {
        flex: 1,
        padding: 16
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
    },
    description: {
        fontSize: 14,
        lineHeight: 22
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 12
    },
    testCasesPreview: {
        marginTop: 20
    },
    testCasePreview: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1
    },
    testCaseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    testCaseTitle: {
        fontSize: 14,
        fontWeight: '600'
    },
    testCaseLabel: {
        fontSize: 12,
        marginTop: 8,
        marginBottom: 4
    },
    codeBlock: {
        padding: 12,
        borderRadius: 6,
        marginBottom: 8
    },
    codeText: {
        fontFamily: 'monospace',
        fontSize: 12
    },
    editorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    editorTitle: {
        fontSize: 16,
        fontWeight: '600'
    },
    testHeader: {
        marginBottom: 16
    },
    testTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4
    },
    testHint: {
        fontSize: 12
    },
    quickExamples: {
        marginBottom: 16
    },
    examplesLabel: {
        fontSize: 12,
        marginBottom: 8
    },
    examplesContainer: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap'
    },
    exampleButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1
    },
    exampleButtonText: {
        fontSize: 12,
        fontWeight: '500'
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8
    },
    stdinInput: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        minHeight: 80,
        fontSize: 14,
        fontFamily: 'monospace',
        textAlignVertical: 'top'
    },
    inputHint: {
        fontSize: 11,
        marginTop: 4,
        fontStyle: 'italic'
    },
    historyContainer: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb'
    },
    historyTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12
    },
    historyItem: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 8
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    historyInput: {
        fontSize: 12,
        flex: 1,
        marginRight: 8
    },
    historyTime: {
        fontSize: 11
    },
    historyOutput: {
        fontSize: 12
    },
    historyError: {
        fontSize: 12
    },
    emptyResults: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40
    },
    emptyText: {
        fontSize: 14,
        marginTop: 12,
        marginBottom: 24,
        textAlign: 'center'
    },
    runFirstButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8
    },
    runFirstButtonText: {
        color: '#fff',
        fontWeight: '600'
    },
    resultsHeader: {
        marginBottom: 24
    },
    scoreContainer: {
        alignItems: 'center',
        marginBottom: 24
    },
    scoreLabel: {
        fontSize: 14,
        marginBottom: 4
    },
    scoreValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2
    },
    scorePercentage: {
        fontSize: 14
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 16
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1
    },
    statBoxValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 2
    },
    statBoxLabel: {
        fontSize: 12
    },
    testResultCard: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12
    },
    testResultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    testResultTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    testResultStats: {
        alignItems: 'flex-end',
        gap: 4
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600'
    },
    timeText: {
        fontSize: 11
    },
    ioContainer: {
        gap: 12
    },
    ioSection: {
        marginBottom: 8
    },
    ioLabel: {
        fontSize: 12,
        marginBottom: 4
    },
    errorContainer: {
        marginTop: 8
    },
    errorLabel: {
        fontSize: 12,
        marginBottom: 4
    },
    hiddenTestText: {
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 8
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        borderTopWidth: 1
    },
    primaryButton: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 8,
        gap: 8
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        gap: 8
    },
    secondaryButtonText: {
        fontWeight: '600',
        fontSize: 14
    }
});