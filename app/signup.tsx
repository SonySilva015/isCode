import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FormData {
    name: string;
    email: string;
    course: string;
    agreeToTerms: boolean;
}

interface Props {
    navigation: any;
}

const LANGUAGE_COURSES = [
    { id: '1', name: 'Java', icon: 'coffee' },
    { id: '2', name: 'Python', icon: 'snake' },
    { id: '3', name: 'JavaScript', icon: 'javascript' },
    { id: '4', name: 'React Native', icon: 'react' },
    { id: '5', name: 'TypeScript', icon: 'code' },
    { id: '6', name: 'Node.js', icon: 'node-js' },
];

interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (v: string) => void;
    error?: string;
    focused?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    keyboardType?: 'default' | 'email-address';
    icon?: string;
}

const InputField: React.FC<InputFieldProps> = React.memo(({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    focused,
    onFocus,
    onBlur,
    keyboardType,
    icon,
}) => (
    <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        <View style={[
            styles.inputContainer,
            focused && styles.inputFocused,
            error && styles.inputError,
        ]}>
            {icon && (
                <MaterialIcons
                    name={icon as any}
                    size={20}
                    color={focused ? '#667eea' : '#94a3b8'}
                    style={styles.inputIcon}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                keyboardType={keyboardType}
            />
        </View>
        {error && (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={14} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
            </View>
        )}
    </View>
));

InputField.displayName = 'InputField';

const ElegantSignUpScreen: React.FC<Props> = ({ navigation }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        course: '',
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [focusedField, setFocusedField] = useState<string>('');
    const [showCourseOptions, setShowCourseOptions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.course) {
            newErrors.course = 'Selecione uma trilha de aprendizado';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'Você deve aceitar os termos e condições';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleInputChange = useCallback((field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (validateForm()) {
            Alert.alert('Atenção', 'Por favor, verifique os campos destacados.');
            return;
        }

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            Alert.alert(
                '🎉 Bem-vindo ao iscode!',
                `Olá ${formData.name}! Sua jornada em ${formData.course} começou.`,
                [{ text: 'Explorar Plataforma', onPress: () => router.push('/home') }]
            );
        } catch {
            Alert.alert('Erro', 'Não foi possível criar sua conta. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, [formData, validateForm]);

    const isFormValid = Boolean(
        formData.name.trim() &&
        formData.email.trim() &&
        formData.course &&
        formData.agreeToTerms
    );

    const renderCourseOption = useCallback((course: typeof LANGUAGE_COURSES[0]) => (
        <TouchableOpacity
            key={course.id}
            style={[
                styles.courseOption,
                formData.course === course.name && styles.courseOptionSelected,
            ]}
            onPress={() => {
                handleInputChange('course', course.name);
                setShowCourseOptions(false);
            }}
            activeOpacity={0.7}
        >
            <View style={styles.courseOptionContent}>
                <MaterialIcons
                    name={course.icon as any}
                    size={20}
                    color={formData.course === course.name ? '#667eea' : '#64748b'}
                />
                <Text style={[
                    styles.courseOptionText,
                    formData.course === course.name && styles.courseOptionTextSelected
                ]}>
                    {course.name}
                </Text>
            </View>
            {formData.course === course.name && (
                <MaterialIcons name="check" size={20} color="#667eea" />
            )}
        </TouchableOpacity>
    ), [formData.course, handleInputChange]);

    return (
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <LinearGradient colors={['#fff', '#f0f4ff']} style={styles.logo}>
                                    <Text style={styles.logoText}>{'</>'}</Text>
                                </LinearGradient>
                                <View>
                                    <Text style={styles.title}>iscode</Text>
                                    <Text style={styles.tagline}>Aprenda. Pratique. Crie.</Text>
                                </View>
                            </View>
                            <Text style={styles.subtitle}>
                                Sua jornada na programação começa aqui
                            </Text>
                        </View>

                        <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.form}>
                            <Text style={styles.formTitle}>Criar Conta</Text>

                            <InputField
                                label="Nome Completo"
                                placeholder="Como prefere ser chamado?"
                                value={formData.name}
                                onChangeText={(value) => handleInputChange('name', value)}
                                error={errors.name}
                                focused={focusedField === 'name'}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField('')}
                                icon="person"
                            />

                            <InputField
                                label="Email"
                                placeholder="seu@email.com"
                                value={formData.email}
                                onChangeText={(value) => handleInputChange('email', value)}
                                error={errors.email}
                                focused={focusedField === 'email'}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField('')}
                                keyboardType="email-address"
                                icon="email"
                            />

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Trilha de Aprendizado</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.coursePicker,
                                        focusedField === 'course' && styles.inputFocused,
                                        errors.course && styles.inputError,
                                    ]}
                                    onPress={() => setShowCourseOptions(!showCourseOptions)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.coursePickerContent}>
                                        {formData.course ? (
                                            <View style={styles.selectedCourse}>
                                                <MaterialIcons name="check-circle" size={20} color="#10b981" />
                                                <Text style={styles.coursePickerText}>{formData.course}</Text>
                                            </View>
                                        ) : (
                                            <Text style={styles.coursePickerPlaceholder}>Selecione sua trilha</Text>
                                        )}
                                        <MaterialIcons
                                            name={showCourseOptions ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                            size={24}
                                            color="#94a3b8"
                                        />
                                    </View>
                                </TouchableOpacity>
                                {errors.course && <Text style={styles.errorText}>{errors.course}</Text>}

                                {showCourseOptions && (
                                    <View style={styles.courseOptions}>
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            {LANGUAGE_COURSES.map(renderCourseOption)}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity
                                style={styles.termsContainer}
                                onPress={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.checkbox, formData.agreeToTerms && styles.checkboxChecked]}>
                                    {formData.agreeToTerms && (
                                        <MaterialIcons name="check" size={16} color="#fff" />
                                    )}
                                </View>
                                <Text style={styles.termsText}>
                                    Concordo com os{' '}
                                    <Text style={styles.termsLink}>Termos de Serviço</Text> e{' '}
                                    <Text style={styles.termsLink}>Política de Privacidade</Text>
                                </Text>
                            </TouchableOpacity>
                            {errors.agreeToTerms && <Text style={styles.errorText}>{errors.agreeToTerms}</Text>}

                            <TouchableOpacity
                                style={[styles.submitButton, (!isFormValid || isLoading) && styles.submitButtonDisabled]}
                                onPress={handleSubmit}
                                disabled={isFormValid || isLoading}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={isFormValid ? ['#667eea', '#764ba2'] : ['#cbd5e0', '#94a3b8']}
                                    style={styles.submitButtonGradient}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <MaterialIcons name="rocket-launch" size={20} color="#fff" />
                                            <Text style={styles.submitButtonText}>Começar Jornada</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>Já tem uma conta? </Text>
                                <TouchableOpacity onPress={() => router.back()}>
                                    <Text style={styles.loginLink}>Faça login</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    content: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 40,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#667eea',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    form: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
        marginLeft: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    inputFocused: {
        borderColor: '#667eea',
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginLeft: 4,
    },
    coursePicker: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        height: 52,
        justifyContent: 'center',
    },
    coursePickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    selectedCourse: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coursePickerText: {
        fontSize: 16,
        color: '#1e293b',
        marginLeft: 8,
    },
    coursePickerPlaceholder: {
        fontSize: 16,
        color: '#94a3b8',
    },
    courseOptions: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        maxHeight: 200,
    },
    courseOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    courseOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    courseOptionText: {
        fontSize: 16,
        color: '#475569',
        marginLeft: 12,
    },
    courseOptionTextSelected: {
        color: '#667eea',
        fontWeight: '600',
    },
    courseOptionSelected: {
        backgroundColor: '#f0f9ff',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f0f9ff',
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#94a3b8',
        marginRight: 12,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    checkboxChecked: {
        backgroundColor: '#667eea',
        borderColor: '#667eea',
    },
    termsText: {
        flex: 1,
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    termsLink: {
        color: '#667eea',
        fontWeight: '600',
    },
    submitButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
    },
    submitButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginText: {
        fontSize: 14,
        color: '#64748b',
    },
    loginLink: {
        fontSize: 14,
        color: '#667eea',
        fontWeight: '600',
    },
});

export default ElegantSignUpScreen;