// src/screens/ProfileScreen.js
import { colors } from '@/styles/colors';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { styles } from '../../styles/profile';

const ProfileScreen = () => {
    const [activeTab, setActiveTab] = useState('sobre');
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedName, setEditedName] = useState('Sony da Silva');

    const user = {
        name: editedName,
        level: 'Pro',
        points: 25005520,
        joined: '2024',
        email: 'sony@email.com',
        rank: '#15',
        streak: 7
    };

    const dados = [
        { name: 'Lógica de Programação', earned: true, icon: 'brain', color: '#FF6B6B' },
        { name: 'Desafios de Lógica', earned: true, icon: 'puzzle-piece', color: '#4ECDC4' },
        { name: 'Estruturas de Controle', earned: false, icon: 'sitemap', color: '#45B7D1' },
        { name: 'Algoritmos Avançados', earned: false, icon: 'rocket', color: '#96CEB4' },


    ];

    const stats = [
        { label: 'Exercícios', value: '15', icon: 'list-alt', progress: 60 },
        { label: 'Tempo de Estudo', value: '8h 30m', icon: 'clock', progress: 45 },
        { label: 'Precisão', value: '75%', icon: 'bullseye', progress: 75 },
        { label: 'Sequência Atual', value: '7 dias', icon: 'fire', progress: 70 },
    ];



    const handleSaveProfile = () => {
        setEditModalVisible(false);

    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header com Gradient */}
                <LinearGradient
                    colors={[colors.primary, colors.second]}
                    style={styles.gradientHeader}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={require('../../assets/images/eu.jpg')}
                                style={styles.avatar}
                            />
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={() => setEditModalVisible(true)}
                            >
                                <Ionicons name="camera" size={16} color="#fff" />
                            </TouchableOpacity>

                        </View>

                        <Text style={styles.userName}>{user.name}</Text>

                        <View style={styles.userStats}>
                            <Text>Java / Python</Text>
                        </View>
                    </View>
                </LinearGradient>



                {/* Tabs de Navegação */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'sobre' && styles.tabActive]}
                        onPress={() => setActiveTab('sobre')}
                    >
                        <Text style={[styles.tabText, activeTab === 'sobre' && styles.tabTextActive]}>
                            Sobre
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'conquistas' && styles.tabActive]}
                        onPress={() => setActiveTab('conquistas')}
                    >
                        <Text style={[styles.tabText, activeTab === 'conquistas' && styles.tabTextActive]}>
                            Conquistas
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'estatisticas' && styles.tabActive]}
                        onPress={() => setActiveTab('estatisticas')}
                    >
                        <Text style={[styles.tabText, activeTab === 'estatisticas' && styles.tabTextActive]}>
                            Estatísticas
                        </Text>
                    </TouchableOpacity>
                </View>




                {activeTab === 'sobre' && (
                    <View style={styles.tabContent}>
                        <View style={styles.infoCard}>
                            <View style={styles.infoItem}>
                                <Ionicons name="mail-outline" size={20} color="#6366F1" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text style={styles.infoValue}>{user.email}</Text>
                                </View>
                            </View>
                            <View style={styles.infoItem}>
                                <Ionicons name="calendar-outline" size={20} color="#6366F1" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Membro desde</Text>
                                    <Text style={styles.infoValue}>{user.joined}</Text>
                                </View>
                            </View>
                            <View style={styles.infoItem}>
                                <Ionicons name="trophy-outline" size={20} color="#6366F1" />
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Nível</Text>
                                    <Text style={styles.infoValue}>{user.level}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}



                {activeTab === 'conquistas' && (
                    <View style={styles.tabContent}>
                        <Text style={styles.sectionTitle}>Conquistas</Text>
                        <View style={styles.dadosgrid}>
                            {dados.map((d, index) => (
                                <View key={index} style={styles.dadosCard}>
                                    <View style={[
                                        styles.dadosIcon,
                                        { backgroundColor: d.earned ? d.color : '#E5E7EB' }
                                    ]}>
                                        <FontAwesome5
                                            name={d.icon}
                                            size={20}
                                            color={d.earned ? '#fff' : '#9CA3AF'}
                                        />
                                    </View>
                                    <Text style={styles.dadosName}>{d.name}</Text>
                                    <Text style={styles.dadosStat}>
                                        {d.earned ? 'Conquistado' : 'Bloqueado'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {activeTab === 'estatisticas' && (
                    <View style={styles.tabContent}>
                        <Text style={styles.sectionTitle}>Estatísticas Detalhadas</Text>
                        <View style={styles.statsGrid}>
                            {stats.map((stat, index) => (
                                <View key={index} style={styles.statCard}>
                                    <View style={styles.statHeader}>
                                        <FontAwesome5 name={stat.icon} size={16} color="#6366F1" />
                                        <Text style={styles.statLabel}>{stat.label}</Text>
                                    </View>
                                    <Text style={styles.statValue}>{stat.value}</Text>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                { width: `${stat.progress}%` }
                                            ]}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}


            </ScrollView>

            {/* Modal de Edição de Perfil */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar Perfil</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalAvatar}>
                            <Image
                                source={require('../../assets/images/eu.jpg')}
                                style={styles.modalAvatarImage}
                            />
                            <TouchableOpacity style={styles.modalAvatarEdit}>
                                <Ionicons name="camera" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Nome</Text>
                            <TextInput
                                style={styles.formInput}
                                value={editedName}
                                onChangeText={setEditedName}
                                placeholder="Digite seu nome"
                            />
                        </View>



                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveProfile}
                        >
                            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProfileScreen;