import { useTheme } from '@/context/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { createSettingsStyles } from '../../styles/settings';

const EditProfileModal = ({ visible, onClose, user }: { visible: boolean; onClose: () => void; user: any; }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const { colors } = useTheme();
    const styles = createSettingsStyles(colors);

    const handleSave = () => {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        onClose();
    };

    return (
        <Modal animationType="slide" transparent visible={visible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Editar Perfil</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.avatarSection}>
                        <Image source={user.avatar} style={styles.modalAvatar} />
                        <TouchableOpacity style={styles.changePhotoButton}>
                            <Ionicons name="camera" size={16} color="#fff" />
                            <Text style={styles.changePhotoText}>Alterar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nome Completo</Text>
                            <TextInput
                                style={styles.textInput}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.textInput}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>


                    </View>

                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditProfileModal;
