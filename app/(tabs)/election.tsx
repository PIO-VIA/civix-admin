import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { mockElections } from '@/mock-data/elections';
import { FormModal } from '@/components/crud/FormModal';
import { ConfirmModal } from '@/components/crud/ConfirmModal';
import { FormField } from '@/components/crud/FormField';
import { ElectionDTO } from '@/lib/models/ElectionDTO';

// Helper functions
const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getStatusColor = (status: ElectionDTO.statut | undefined) => {
    switch (status) {
        case ElectionDTO.statut.EN_COURS:
            return '#28A745'; // Green
        case ElectionDTO.statut.PLANIFIEE:
            return '#FFC107'; // Yellow
        case ElectionDTO.statut.TERMINEE:
            return '#6c757d'; // Gray
        case ElectionDTO.statut.ANNULEE:
            return '#DC3545'; // Red
        default:
            return '#007AFF'; // Blue
    }
};

const formatNumber = (num: number | undefined) => {
    if (num === undefined) return '0';
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
};

type ModalType = 'create' | 'edit' | 'delete' | null;

export default function Election() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const [elections, setElections] = useState<ElectionDTO[]>(mockElections);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedElection, setSelectedElection] = useState<ElectionDTO | null>(null);
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        dateDebut: '',
        dateFin: '',
    });

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const resetForm = () => {
        setFormData({
            titre: '',
            description: '',
            dateDebut: '',
            dateFin: '',
        });
        setSelectedElection(null);
    };

    const openModal = (type: ModalType, election: ElectionDTO | null = null) => {
        setModalType(type);
        if (election) {
            setSelectedElection(election);
            setFormData({
                titre: election.titre || '',
                description: election.description || '',
                dateDebut: election.dateDebut ? election.dateDebut.split('T')[0] : '',
                dateFin: election.dateFin ? election.dateFin.split('T')[0] : '',
            });
        } else {
            resetForm();
        }
    };

    const closeModal = () => {
        setModalType(null);
        resetForm();
    };

    const handleSave = () => {
        if (!formData.titre || !formData.description || !formData.dateDebut || !formData.dateFin) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        const electionData: Partial<ElectionDTO> = {
            ...formData,
            dateDebut: formData.dateDebut + 'T08:00:00Z',
            dateFin: formData.dateFin + 'T20:00:00Z',
            dateModification: new Date().toISOString(),
        };

        if (modalType === 'edit' && selectedElection) {
            setElections(prev => prev.map(e =>
                e.externalIdElection === selectedElection.externalIdElection ? { ...e, ...electionData } : e
            ));
        } else {
            const newElection: ElectionDTO = {
                ...electionData,
                externalIdElection: Date.now().toString(),
                statut: ElectionDTO.statut.PLANIFIEE,
                dateCreation: new Date().toISOString(),
            };
            setElections(prev => [...prev, newElection]);
        }

        closeModal();
    };

    const confirmDelete = () => {
        if (selectedElection) {
            setElections(prev => prev.filter(e => e.externalIdElection !== selectedElection.externalIdElection));
            closeModal();
        }
    };

    const ElectionCard = ({ election, index }: { election: ElectionDTO, index: number }) => {
        const cardAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 150,
                useNativeDriver: true,
            }).start();
        }, [cardAnim, index]);

        return (
            <TouchableOpacity
                onPress={() => router.push(`/election-detail?id=${election.externalIdElection}`)}
            >
                <Animated.View style={[
                    styles.electionCard,
                    {
                        opacity: cardAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.electionInfo}>
                            <Text style={styles.electionTitle}>{election.titre}</Text>
                            <Text style={styles.electionDescription}>{election.description}</Text>
                        </View>
                        {election.statut &&
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(election.statut) }
                            ]}>
                                <Text style={styles.statusText}>{election.statut}</Text>
                            </View>
                        }
                    </View>

                    <View style={styles.electionMeta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar" size={16} color="#666" />
                            <Text style={styles.metaText}>
                                {formatDate(election.dateDebut)}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="people" size={16} color="#666" />
                            <Text style={styles.metaText}>
                                {formatNumber(election.nombreElecteursInscrits)} électeurs inscrits
                            </Text>
                        </View>
                    </View>

                    <View style={styles.cardActions}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => openModal('edit', election)}>
                            <Ionicons name="pencil" size={16} color="#007AFF" />
                            <Text style={styles.actionText}>Modifier</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => openModal('delete', election)}>
                            <Ionicons name="trash" size={16} color="#DC3545" />
                            <Text style={[styles.actionText, styles.deleteText]}>Supprimer</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="ballot" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Élections</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => openModal('create')}>
                    <Ionicons name="add" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Animated.View style={[
                    styles.statsSection,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{elections.length}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#28A745' }]}>
                            {elections.filter(e => e.statut === ElectionDTO.statut.EN_COURS).length}
                        </Text>
                        <Text style={styles.statLabel}>En cours</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#FFC107' }]}>
                            {elections.filter(e => e.statut === ElectionDTO.statut.PLANIFIEE).length}
                        </Text>
                        <Text style={styles.statLabel}>Planifiées</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.electionsSection,
                    { opacity: fadeAnim }
                ]}>
                    <Text style={styles.sectionTitle}>Élections Récentes</Text>
                    {elections.map((election, index) => (
                        <ElectionCard
                            key={election.externalIdElection}
                            election={election}
                            index={index}
                        />
                    ))}
                </Animated.View>
            </View>

            <FormModal
                visible={modalType === 'create' || modalType === 'edit'}
                title={modalType === 'edit' ? "Modifier l&apos;Élection" : "Nouvelle Élection"}
                onClose={closeModal}
                onSave={handleSave}
                isEdit={modalType === 'edit'}
                saveDisabled={!formData.titre || !formData.description}
            >
                <FormField
                    label="Titre de l'élection"
                    value={formData.titre}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, titre: text }))}
                    placeholder="Ex: Élection Présidentielle 2024"
                    required
                    icon="ballot"
                />
                <FormField
                    label="Description"
                    value={formData.description}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                    placeholder="Description de l'élection"
                    multiline
                    numberOfLines={3}
                    required
                    icon="document-text"
                />
                <FormField
                    label="Date de début"
                    value={formData.dateDebut}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, dateDebut: text }))}
                    placeholder="YYYY-MM-DD"
                    required
                    icon="calendar"
                />
                <FormField
                    label="Date de fin"
                    value={formData.dateFin}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, dateFin: text }))}
                    placeholder="YYYY-MM-DD"
                    required
                    icon="calendar"
                />
            </FormModal>

            <ConfirmModal
                visible={modalType === 'delete'}
                title="Supprimer l'élection"
                message={`Êtes-vous sûr de vouloir supprimer l'élection "${selectedElection?.titre}" ? Cette action est irréversible.`}
                onConfirm={confirmDelete}
                onCancel={closeModal}
                confirmText="Supprimer"
                type="danger"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E7',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 12,
        flex: 1,
    },
    addButton: {
        padding: 8,
    },
    content: {
        padding: 16,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        minWidth: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    electionsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    electionCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    electionInfo: {
        flex: 1,
        marginRight: 12,
    },
    electionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    electionDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '600',
    },
    electionMeta: {
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metaText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: '#F0F8FF',
    },
    deleteButton: {
        backgroundColor: '#FFF5F5',
    },
    actionText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
        marginLeft: 4,
    },
    deleteText: {
        color: '#DC3545',
    },
});