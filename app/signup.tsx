import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { db } from '../db';
import { users } from '../db/schemas';

interface FormData {
    name: string;
    email: string;
    age: string;
    avatarUri: string | null;
    agreeToTerms: boolean;
}

interface Props {
    navigation: any;
}

interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (v: string) => void;
    error?: string;
    focused?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    keyboardType?: 'default' | 'email-address' | 'numeric';
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
                autoCapitalize="none"
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

// Chave para armazenar a URI da foto no AsyncStorage
const USER_PHOTO_KEY = 'user_photo_uri';

const ElegantSignUpScreen: React.FC<Props> = ({ navigation }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        age: '',
        avatarUri: null,
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [focusedField, setFocusedField] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Validação por passo
    const validateStep = useCallback((step: number): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                if (!formData.name.trim()) {
                    newErrors.name = 'Nome é obrigatório';
                } else if (formData.name.trim().length < 3) {
                    newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
                }
                break;

            case 2:
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!formData.email) {
                    newErrors.email = 'Email é obrigatório';
                } else if (!emailRegex.test(formData.email)) {
                    newErrors.email = 'Email inválido';
                }
                break;

            case 3:
                if (!formData.age) {
                    newErrors.age = 'Idade é obrigatória';
                } else {
                    const ageNum = parseInt(formData.age);
                    if (isNaN(ageNum)) {
                        newErrors.age = 'Idade deve ser um número';
                    } else if (ageNum < 13) {
                        newErrors.age = 'Você deve ter pelo menos 13 anos';
                    } else if (ageNum > 120) {
                        newErrors.age = 'Idade inválida';
                    }
                }
                break;

            case 4:
                // Avatar não é mais obrigatório - usará o default se não escolher
                break;

            case 5:
                if (!formData.agreeToTerms) {
                    newErrors.agreeToTerms = 'Você deve aceitar os termos e condições';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleInputChange = useCallback((field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    }, []);

    const handleNextStep = useCallback(() => {
        if (validateStep(currentStep)) {
            if (currentStep < 5) {
                setCurrentStep(prev => prev + 1);
            }
        }
    }, [currentStep, validateStep]);

    const handlePrevStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    // Função para escolher foto da galeria
    const pickImage = useCallback(async () => {
        try {
            setUploadingImage(true);

            // Solicitar permissão
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
                return;
            }

            // Abrir seletor de imagem
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const imageUri = result.assets[0].uri;
                handleInputChange('avatarUri', imageUri);

                // Salvar a URI no AsyncStorage
                await AsyncStorage.setItem(USER_PHOTO_KEY, imageUri);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        } finally {
            setUploadingImage(false);
        }
    }, [handleInputChange]);

    // Função para tirar foto com a câmera
    const takePhoto = useCallback(async () => {
        try {
            setUploadingImage(true);

            // Solicitar permissão
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (permissionResult.granted === false) {
                Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua câmera.');
                return;
            }

            // Abrir câmera
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const imageUri = result.assets[0].uri;
                handleInputChange('avatarUri', imageUri);

                // Salvar a URI no AsyncStorage
                await AsyncStorage.setItem(USER_PHOTO_KEY, imageUri);
            }
        } catch (error) {
            console.error('Erro ao tirar foto:', error);
            Alert.alert('Erro', 'Não foi possível tirar a foto.');
        } finally {
            setUploadingImage(false);
        }
    }, [handleInputChange]);

    // Função para remover foto selecionada
    const removePhoto = useCallback(async () => {
        Alert.alert(
            'Remover foto',
            'Deseja remover a foto selecionada?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        handleInputChange('avatarUri', null);
                        await AsyncStorage.removeItem(USER_PHOTO_KEY);
                    }
                }
            ]
        );
    }, [handleInputChange]);

    const handleSubmit = useCallback(async () => {
        // Validar todos os passos antes de submeter
        const stepsValid = [1, 2, 3, 4, 5].every(step => {
            const isValid = validateStep(step);
            return isValid;
        });

        if (!stepsValid) {
            Alert.alert('Atenção', 'Por favor, verifique todos os campos.');
            return;
        }

        setIsLoading(true);

        try {
            // Usar 'default_avatar' se não houver foto selecionada
            // ou 'custom_photo' se tiver (você pode adaptar conforme sua lógica)
            let picture = 'default_avatar';

            if (formData.avatarUri) {
                // Se o usuário escolheu uma foto, usamos um identificador diferente
                // Você pode salvar a URI separadamente ou usar outro sistema
                picture = 'custom_photo';

                // Salvar a URI separadamente para uso futuro
                await AsyncStorage.setItem(`user_photo_${formData.email}`, formData.avatarUri);
            }

            // Inserir usuário no banco de dados
            const userData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                age: parseInt(formData.age),
                picture: picture,
                plan: 'free',
            };

            console.log('Tentando inserir usuário:', userData);

            await db.insert(users).values(userData);

            await new Promise(resolve => setTimeout(resolve, 1000));

            Alert.alert(
                'Conta criada com sucesso! 🎉',

                'Sua jornada na programação começa agora.',
                [{
                    text: 'Explorar Cursos',
                    onPress: () => router.push('/(drawer)/courses')
                }]
            );
        } catch (error: any) {
            console.error('Erro ao criar conta:', error);

            // Verificar se é erro de email duplicado
            if (error.message?.includes('UNIQUE') || error.message?.includes('duplicate') || error.message?.includes('unique')) {
                Alert.alert('Email já cadastrado', 'Este email já está cadastrado. Tente fazer login.');
            } else {
                Alert.alert('Erro', 'Não foi possível criar sua conta. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [formData, validateStep]);

    const isCurrentStepValid = useCallback(() => {
        switch (currentStep) {
            case 1:
                return formData.name.trim().length >= 2;
            case 2:
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(formData.email);
            case 3:
                const ageNum = parseInt(formData.age);
                return !isNaN(ageNum) && ageNum >= 13 && ageNum <= 120;
            case 4:
                // Avatar não é obrigatório
                return true;
            case 5:
                return formData.agreeToTerms;
            default:
                return false;
        }
    }, [currentStep, formData]);

    const renderStepContent = useCallback(() => {
        switch (currentStep) {
            case 1:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.stepHeader}>
                            <MaterialIcons name="person-add" size={32} color="#667eea" />
                            <Text style={styles.stepTitle}>Identificação</Text>
                            <Text style={styles.stepDescription}>
                                Como prefere ser chamado durante sua jornada?
                            </Text>
                        </View>

                        <InputField
                            label="Nome Completo"
                            placeholder="Digite seu nome completo"
                            value={formData.name}
                            onChangeText={(value) => handleInputChange('name', value)}
                            error={errors.name}
                            focused={focusedField === 'name'}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField('')}
                            icon="person"
                        />
                    </View>
                );

            case 2:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.stepHeader}>
                            <MaterialIcons name="email" size={32} color="#667eea" />
                            <Text style={styles.stepTitle}>Contato</Text>
                            <Text style={styles.stepDescription}>
                                Para onde enviaremos as novidades e conteúdos exclusivos?
                            </Text>
                        </View>

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
                    </View>
                );

            case 3:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.stepHeader}>
                            <MaterialIcons name="cake" size={32} color="#667eea" />
                            <Text style={styles.stepTitle}>Idade</Text>
                            <Text style={styles.stepDescription}>
                                Para personalizar sua experiência de aprendizado
                            </Text>
                        </View>

                        <InputField
                            label="Sua Idade"
                            placeholder="Digite sua idade"
                            value={formData.age}
                            onChangeText={(value) => handleInputChange('age', value)}
                            error={errors.age}
                            focused={focusedField === 'age'}
                            onFocus={() => setFocusedField('age')}
                            onBlur={() => setFocusedField('')}
                            keyboardType="numeric"
                            icon="calendar-today"
                        />

                        <View style={styles.ageNote}>
                            <MaterialIcons name="info" size={16} color="#64748b" />
                            <Text style={styles.ageNoteText}>
                                É necessário ter pelo menos 13 anos para criar uma conta
                            </Text>
                        </View>
                    </View>
                );

            case 4:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.stepHeader}>
                            <MaterialIcons name="photo-camera" size={32} color="#667eea" />
                            <Text style={styles.stepTitle}>Foto do Perfil</Text>
                            <Text style={styles.stepDescription}>
                                Adicione uma foto ou use o avatar padrão
                            </Text>
                        </View>

                        <View style={styles.avatarContainer}>
                            {/* Foto atual */}
                            <View style={styles.avatarPreviewContainer}>
                                <Text style={styles.label}>Foto do perfil:</Text>
                                <View style={styles.avatarPreviewWrapper}>
                                    {formData.avatarUri ? (
                                        <View style={styles.avatarWithActions}>
                                            <Image
                                                source={{ uri: formData.avatarUri }}
                                                style={styles.selectedAvatarImage}
                                            />
                                            <TouchableOpacity
                                                style={styles.removePhotoButton}
                                                onPress={removePhoto}
                                            >
                                                <MaterialIcons name="close" size={20} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={styles.defaultAvatar}>
                                            <MaterialIcons name="person" size={40} color="#667eea" />
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Botões de ação */}
                            <View style={styles.photoActions}>
                                <TouchableOpacity
                                    style={styles.photoActionButton}
                                    onPress={pickImage}
                                    disabled={uploadingImage}
                                >
                                    <LinearGradient
                                        colors={['#667eea', '#764ba2']}
                                        style={styles.photoActionGradient}
                                    >
                                        {uploadingImage ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <>
                                                <MaterialIcons name="photo-library" size={20} color="#fff" />
                                                <Text style={styles.photoActionText}>Galeria</Text>
                                            </>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.photoActionButton}
                                    onPress={takePhoto}
                                    disabled={uploadingImage}
                                >
                                    <LinearGradient
                                        colors={['#10b981', '#059669']}
                                        style={styles.photoActionGradient}
                                    >
                                        {uploadingImage ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <>
                                                <MaterialIcons name="camera-alt" size={20} color="#fff" />
                                                <Text style={styles.photoActionText}>Câmera</Text>
                                            </>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.avatarNote}>
                                <MaterialIcons name="info" size={16} color="#64748b" />
                                <Text style={styles.avatarNoteText}>
                                    A foto é opcional. Se não escolher, usaremos um avatar padrão.
                                </Text>
                            </View>
                        </View>
                    </View>
                );

            case 5:
                return (
                    <View style={styles.stepContent}>
                        <View style={styles.stepHeader}>
                            <MaterialIcons name="verified" size={32} color="#667eea" />
                            <Text style={styles.stepTitle}>Termos e Condições</Text>
                            <Text style={styles.stepDescription}>
                                Último passo para começar sua jornada
                            </Text>
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

                        <View style={styles.reviewContainer}>
                            <Text style={styles.reviewTitle}>Resumo do Cadastro:</Text>

                            <View style={styles.reviewAvatarContainer}>
                                {formData.avatarUri ? (
                                    <Image
                                        source={{ uri: formData.avatarUri }}
                                        style={styles.reviewAvatarImage}
                                    />
                                ) : (
                                    <View style={styles.reviewDefaultAvatar}>
                                        <MaterialIcons name="person" size={32} color="#667eea" />
                                    </View>
                                )}
                            </View>

                            <View style={styles.reviewItem}>
                                <MaterialIcons name="person" size={16} color="#64748b" />
                                <Text style={styles.reviewText}>Nome: {formData.name}</Text>
                            </View>
                            <View style={styles.reviewItem}>
                                <MaterialIcons name="email" size={16} color="#64748b" />
                                <Text style={styles.reviewText}>Email: {formData.email}</Text>
                            </View>
                            <View style={styles.reviewItem}>
                                <MaterialIcons name="cake" size={16} color="#64748b" />
                                <Text style={styles.reviewText}>Idade: {formData.age} anos</Text>
                            </View>
                            <View style={styles.reviewItem}>
                                <MaterialIcons name="badge" size={16} color="#64748b" />
                                <Text style={styles.reviewText}>Plano: Free</Text>
                            </View>
                            <View style={styles.reviewItem}>
                                <MaterialIcons name="photo" size={16} color="#64748b" />
                                <Text style={styles.reviewText}>
                                    Foto: {formData.avatarUri ? 'Personalizada' : 'Padrão'}
                                </Text>
                            </View>
                        </View>
                    </View>
                );

            default:
                return null;
        }
    }, [currentStep, formData, errors, focusedField, uploadingImage,
        handleInputChange, pickImage, takePhoto, removePhoto]);

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

                            {/* Indicador de Progresso */}
                            <View style={styles.progressContainer}>
                                <Text style={styles.progressText}>
                                    Passo {currentStep} de 5
                                </Text>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${(currentStep / 5) * 100}%` }
                                        ]}
                                    />
                                </View>
                                <View style={styles.stepsIndicator}>
                                    {[1, 2, 3, 4, 5].map((step) => (
                                        <View
                                            key={step}
                                            style={[
                                                styles.stepDot,
                                                currentStep >= step && styles.stepDotActive,
                                                currentStep === step && styles.stepDotCurrent
                                            ]}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>

                        <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.form}>
                            <View style={styles.formHeader}>
                                <TouchableOpacity
                                    onPress={handlePrevStep}
                                    disabled={currentStep === 1}
                                    style={[styles.backButton, currentStep === 1 && styles.backButtonDisabled]}
                                >
                                    <MaterialIcons
                                        name="arrow-back"
                                        size={24}
                                        color={currentStep === 1 ? '#cbd5e0' : '#64748b'}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.formTitle}>
                                    {currentStep === 5 ? 'Revisão Final' : 'Criar Conta'}
                                </Text>
                                <View style={{ width: 40 }} />
                            </View>

                            {renderStepContent()}

                            <View style={styles.buttonsContainer}>
                                {currentStep < 5 ? (
                                    <TouchableOpacity
                                        style={[styles.nextButton, !isCurrentStepValid() && styles.nextButtonDisabled]}
                                        onPress={handleNextStep}
                                        disabled={!isCurrentStepValid()}
                                        activeOpacity={0.9}
                                    >
                                        <LinearGradient
                                            colors={isCurrentStepValid() ? ['#667eea', '#764ba2'] : ['#cbd5e0', '#94a3b8']}
                                            style={styles.nextButtonGradient}
                                        >
                                            <Text style={styles.nextButtonText}>Continuar</Text>
                                            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.submitButton, !isCurrentStepValid() && styles.submitButtonDisabled]}
                                        onPress={handleSubmit}
                                        disabled={!isCurrentStepValid() || isLoading}
                                        activeOpacity={0.9}
                                    >
                                        <LinearGradient
                                            colors={isCurrentStepValid() ? ['#10b981', '#059669'] : ['#cbd5e0', '#94a3b8']}
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
                                )}
                            </View>

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
        marginBottom: 20,
        marginTop: 40,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    progressText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 8,
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    stepsIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    stepDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    stepDotActive: {
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    stepDotCurrent: {
        backgroundColor: '#fff',
        transform: [{ scale: 1.2 }],
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
    formHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonDisabled: {
        opacity: 0.5,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1e293b',
        textAlign: 'center',
        flex: 1,
    },
    stepContent: {
        marginBottom: 24,
    },
    stepHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
        marginTop: 12,
        marginBottom: 8,
    },
    stepDescription: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 20,
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
    ageNote: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        padding: 12,
        backgroundColor: '#f0f9ff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    ageNoteText: {
        fontSize: 12,
        color: '#64748b',
        marginLeft: 8,
        flex: 1,
    },
    avatarContainer: {
        marginBottom: 24,
    },
    avatarPreviewContainer: {
        marginBottom: 24,
    },
    avatarPreviewWrapper: {
        alignItems: 'center',
        marginTop: 12,
    },
    selectedAvatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#667eea',
    },
    defaultAvatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#e2e8f0',
    },
    avatarWithActions: {
        position: 'relative',
    },
    removePhotoButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    photoActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    photoActionButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    photoActionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
    },
    photoActionText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    avatarNote: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fef3c7',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fcd34d',
    },
    avatarNoteText: {
        fontSize: 12,
        color: '#92400e',
        marginLeft: 8,
        flex: 1,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
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
    reviewContainer: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    reviewAvatarContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    reviewAvatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#667eea',
    },
    reviewDefaultAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#e2e8f0',
    },
    reviewTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
        textAlign: 'center',
    },
    reviewItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewText: {
        fontSize: 14,
        color: '#475569',
        marginLeft: 8,
    },
    buttonsContainer: {
        marginTop: 8,
    },
    nextButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    nextButtonDisabled: {
        opacity: 0.7,
    },
    nextButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    submitButton: {
        borderRadius: 12,
        overflow: 'hidden',
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
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
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