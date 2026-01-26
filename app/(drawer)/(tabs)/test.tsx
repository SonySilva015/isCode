import { useTheme } from '@/context/useTheme';
import { styles } from '@/styles/testes';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Configurações das linguagens suportadas
const LANGUAGES = [
    { id: 'python3', name: 'Python', icon: 'logo-python', versionIndex: '3' },
    { id: 'java', name: 'Java', icon: 'logo-java', versionIndex: '3' },
    { id: 'javascript', name: 'JavaScript', icon: 'logo-javascript', versionIndex: '3' },
    { id: 'cpp', name: 'C++', icon: 'code', versionIndex: '4' },
    { id: 'c', name: 'C', icon: 'code', versionIndex: '4' },
    { id: 'go', name: 'Go', icon: 'logo-google', versionIndex: '3' },
    { id: 'ruby', name: 'Ruby', icon: 'logo-ruby', versionIndex: '3' },
    { id: 'php', name: 'PHP', icon: 'logo-php', versionIndex: '3' },
];

export default function CodeRunner() {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor');
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);

    const [code, setCode] = useState('');
    const [stdin, setStdin] = useState('');
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState('');

    const selectLanguage = (language: any) => {
        setSelectedLanguage(language);
        setCode('');
        setStdin('');
        setOutput('');
        setShowLanguageModal(false);
    };

    const executeCode = async () => {
        if (!code.trim()) {
            Alert.alert('Aviso', 'Digite algum código para executar');
            return;
        }

        setLoading(true);
        setOutput('');
        setActiveTab('output');

        try {
            const response = await fetch('https://api.jdoodle.com/v1/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    script: code,
                    stdin: stdin,
                    language: selectedLanguage.id,
                    versionIndex: selectedLanguage.versionIndex
                })
            });

            const result = await response.json();

            if (result.error) {
                setOutput(`❌ Erro:\n${result.error}`);
            } else {
                setOutput(result.output || '(sem saída)');
            }

        } catch (error) {
            setOutput('❌ Erro: Não foi possível conectar ao servidor de execução\n Verifique sua conexão com a internet!\n' + error);
        } finally {
            setLoading(false);
        }
    };

    const clearCode = () => {
        setCode('');
        setStdin('');
        setOutput('');
        if (activeTab === 'output') setActiveTab('editor');

    };

    const renderEditorTab = () => (
        <KeyboardAvoidingView
            style={styles.editorContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.editorScroll}>
                {/* Editor de Código com botão de lixeira */}
                <View style={styles.codeSection}>
                    <View style={styles.codeHeader}>
                        <Text style={[styles.sectionLabel, { color: colors.text }]}>
                            Código
                        </Text>
                        <TouchableOpacity
                            style={styles.trashButton}
                            onPress={clearCode}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.text + '60'} />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={[
                            styles.codeInput,
                            {
                                backgroundColor: isDark ? '#1a1a1a' : '#1a1a1a',
                                color: isDark ? 'rgb(33, 180, 238)' : 'rgb(33, 180, 238)',
                                borderColor: colors.border
                            }
                        ]}
                        value={code}
                        onChangeText={setCode}
                        multiline
                        textAlignVertical="top"
                        placeholder={`Digite seu código ${selectedLanguage.name} aqui...`}
                        placeholderTextColor={'white'}
                    />
                </View>

                {/* Entrada */}
                <View style={styles.inputSection}>
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>
                        Entrada (stdin)
                    </Text>
                    <TextInput
                        style={[
                            styles.stdinInput,
                            {
                                backgroundColor: isDark ? '#1a1a1a' : '#1a1a1a',
                                color: isDark ? '#fff' : '#fff',
                                borderColor: colors.border
                            }
                        ]}
                        value={stdin}
                        onChangeText={setStdin}
                        multiline
                        textAlignVertical="top"
                        placeholder="Digite dados para entrada..."
                        placeholderTextColor={'white'}
                    />
                    <Text style={[styles.hintText, { color: colors.text + '60' }]}>
                        Cada linha corresponde a uma leitura de entrada
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

    const renderOutputTab = () => (
        <View style={styles.outputContent}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>
                        Executando código {selectedLanguage.name}...
                    </Text>
                </View>
            ) : output ? (
                <ScrollView style={styles.outputScroll}>
                    <View style={[
                        styles.outputWrapper,
                        {
                            backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
                            borderColor: output.startsWith('❌') ? '#ef4444' : colors.border
                        }
                    ]}>
                        <Text style={[
                            styles.outputText,
                            { color: isDark ? '#e5e7eb' : '#374151' }
                        ]}>
                            {output}
                        </Text>
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.emptyOutput}>
                    <Ionicons name="play-circle-outline" size={48} color={colors.text + '40'} />
                    <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
                        Execute o código para ver a saída aqui
                    </Text>
                </View>
            )}
        </View>
    );

    const renderLanguageModal = () => (
        <Modal
            visible={showLanguageModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowLanguageModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            Selecione a Linguagem
                        </Text>
                        <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={LANGUAGES}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.languageItem,
                                    {
                                        backgroundColor: selectedLanguage.id === item.id ? colors.primary + '20' : 'transparent'
                                    }
                                ]}
                                onPress={() => selectLanguage(item)}
                            >
                                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                                <Text style={[styles.languageItemText, { color: colors.text }]}>
                                    {item.name}
                                </Text>
                                {selectedLanguage.id === item.id && (
                                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        )}
                        style={styles.languageList}
                    />
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            {/* Header compacto */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <View style={styles.headerLeft}>
                    <Ionicons name="code-slash" size={24} color={colors.primary} />
                    <Text style={[styles.title, { color: colors.text }]}>
                        Code Runner
                    </Text>
                </View>

                {/* Seletor de Linguagem no Header */}
                <TouchableOpacity
                    style={[
                        styles.languageSelector,
                        { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }
                    ]}
                    onPress={() => setShowLanguageModal(true)}
                >
                    <Ionicons name={selectedLanguage.icon as any} size={18} color={colors.primary} />
                    <Text style={[styles.languageText, { color: colors.primary }]}>
                        {selectedLanguage.name}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === 'editor' && [styles.activeTab, { borderBottomColor: colors.primary }]
                    ]}
                    onPress={() => setActiveTab('editor')}
                >
                    <Ionicons
                        name="code"
                        size={18}
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
                        activeTab === 'output' && [styles.activeTab, { borderBottomColor: colors.primary }]
                    ]}
                    onPress={() => setActiveTab('output')}
                >
                    <Ionicons
                        name="terminal"
                        size={18}
                        color={activeTab === 'output' ? colors.primary : colors.text + '80'}
                    />
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'output' ? colors.primary : colors.text + '80' }
                    ]}>
                        Output
                        {output && !loading && (
                            <Text style={styles.tabBadge}>
                                {output.startsWith('❌') ? ' ❌' : '✅'}
                            </Text>
                        )}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Conteúdo */}
            <View style={styles.content}>
                {activeTab === 'editor' && renderEditorTab()}
                {activeTab === 'output' && renderOutputTab()}
            </View>

            {/* Botão de Execução */}
            <View style={[styles.footer, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={[
                        styles.executeButton,
                        {
                            backgroundColor: loading ? colors.text + '40' : colors.primary,
                            opacity: loading ? 0.8 : 1
                        }
                    ]}
                    onPress={executeCode}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <>
                            <Ionicons name="play" size={18} color="#FFFFFF" />
                            <Text style={styles.executeButtonText}>
                                Executar {selectedLanguage.name}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Modal de Seleção de Linguagem */}
            {renderLanguageModal()}
        </View>
    );
}

