import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { mockElections, mockResultats, formatNumber, formatPercentage, formatDate, getStatusColor } from '../../mock-data';
import { FormModal } from '../../components/crud/FormModal';
import { ConfirmModal } from '../../components/crud/ConfirmModal';
import { FormField, SelectField } from '../../components/crud/FormField';

export default function Election(){
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    
    // États pour CRUD
    const [elections, setElections] = useState(mockElections);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedElection, setSelectedElection] = useState<any>(null);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        typeElection: '',
        nombreElecteurs: ''
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
    }, []);

    const typeElectionOptions = [
        { label: 'Présidentielle', value: 'PRESIDENTIELLE' },
        { label: 'Municipale', value: 'MUNICIPALE' },
        { label: 'Européenne', value: 'EUROPEENNE' },
        { label: 'Régionale', value: 'REGIONALE' },
        { label: 'Départementale', value: 'DEPARTEMENTALE' }
    ];

    const resetForm = () => {
        setFormData({
            nom: '',
            description: '',
            dateDebut: '',
            dateFin: '',
            typeElection: '',
            nombreElecteurs: ''
        });
    };

    const handleCreate = () => {
        router.push('/election-form');
    };

    const handleEdit = (election: any) => {
        setSelectedElection(election);
        setFormData({
            nom: election.nom,
            description: election.description,
            dateDebut: election.dateDebut.split('T')[0],
            dateFin: election.dateFin.split('T')[0],
            typeElection: election.typeElection,
            nombreElecteurs: election.nombreElecteurs.toString()
        });
        setShowEditModal(true);
    };

    const handleDelete = (election: any) => {
        setSelectedElection(election);
        setShowDeleteModal(true);
    };

    const handleSave = () => {
        if (!formData.nom || !formData.description || !formData.dateDebut || !formData.dateFin) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        const electionData = {
            ...formData,
            id: selectedElection ? selectedElection.id : Date.now().toString(),
            dateDebut: formData.dateDebut + 'T08:00:00Z',
            dateFin: formData.dateFin + 'T20:00:00Z',
            nombreElecteurs: parseInt(formData.nombreElecteurs) || 0,
            statut: 'PROGRAMMEE',
            tauxParticipation: 0,
            resultat: null
        };

        if (selectedElection) {
            // Modifier
            setElections(prev => prev.map(e => e.id === selectedElection.id ? { ...selectedElection, ...electionData } : e));
            setShowEditModal(false);
        } else {
            // Créer
            setElections(prev => [...prev, electionData]);
            setShowCreateModal(false);
        }
        
        resetForm();
        setSelectedElection(null);
    };

    const confirmDelete = () => {
        setElections(prev => prev.filter(e => e.id !== selectedElection.id));
        setShowDeleteModal(false);
        setSelectedElection(null);
    };

    const ElectionCard = ({ election, index }: any) => {
        const cardAnim = useRef(new Animated.Value(0)).current;
        
        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 150,
                useNativeDriver: true,
            }).start();
        }, []);

        return (
            <TouchableOpacity 
                onPress={() => router.push(`/election-detail?id=${election.id}`)}
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
                        <Text style={styles.electionTitle}>{election.nom}</Text>
                        <Text style={styles.electionDescription}>{election.description}</Text>
                    </View>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(election.statut) }
                    ]}>
                        <Text style={styles.statusText}>{election.statut}</Text>
                    </View>
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
                            {formatNumber(election.nombreElecteurs)} électeurs
                        </Text>
                    </View>
                </View>

                {election.statut !== 'PROGRAMMEE' && (
                    <View style={styles.participationSection}>
                        <View style={styles.participationHeader}>
                            <Text style={styles.participationLabel}>Participation</Text>
                            <Text style={styles.participationValue}>
                                {formatPercentage(election.tauxParticipation)}
                            </Text>
                        </View>
                        <View style={styles.progressBar}>
                            <Animated.View 
                                style={[
                                    styles.progressFill,
                                    { 
                                        width: `${election.tauxParticipation}%`,
                                        opacity: cardAnim
                                    }
                                ]}
                            />
                        </View>
                    </View>
                )}

                <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(election)}>
                        <Ionicons name="pencil" size={16} color="#007AFF" />
                        <Text style={styles.actionText}>Modifier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDelete(election)}>
                        <Ionicons name="trash" size={16} color="#DC3545" />
                        <Text style={[styles.actionText, styles.deleteText]}>Supprimer</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
            </TouchableOpacity>
        );
    };

    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="ballot" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Élections</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
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
                            {elections.filter(e => e.statut === 'EN_COURS').length}
                        </Text>
                        <Text style={styles.statLabel}>En cours</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#FFC107' }]}>
                            {elections.filter(e => e.statut === 'PROGRAMMEE').length}
                        </Text>
                        <Text style={styles.statLabel}>Programmées</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.electionsSection,
                    { opacity: fadeAnim }
                ]}>
                    <Text style={styles.sectionTitle}>Élections Récentes</Text>
                    {elections.map((election, index) => (
                        <ElectionCard 
                            key={election.id} 
                            election={election} 
                            index={index}
                        />
                    ))}
                </Animated.View>
            </View>
            
            {/* Modales CRUD */}
            <FormModal
                visible={showCreateModal}
                title="Nouvelle Élection"
                onClose={() => { setShowCreateModal(false); resetForm(); }}
                onSave={handleSave}
                saveDisabled={!formData.nom || !formData.description}
            >
                <FormField
                    label="Nom de l'élection"
                    value={formData.nom}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, nom: text }))}
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
                <SelectField
                    label="Type d'élection"
                    value={formData.typeElection}
                    options={typeElectionOptions}
                    onSelect={(value) => setFormData(prev => ({ ...prev, typeElection: value }))}
                    required
                    icon="flag"
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
                <FormField
                    label="Nombre d'électeurs estimé"
                    value={formData.nombreElecteurs}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, nombreElecteurs: text }))}
                    placeholder="Ex: 47500000"
                    keyboardType="numeric"
                    icon="people"
                />
            </FormModal>

            <FormModal
                visible={showEditModal}
                title="Modifier l'Élection"
                onClose={() => { setShowEditModal(false); resetForm(); setSelectedElection(null); }}
                onSave={handleSave}
                isEdit
                saveDisabled={!formData.nom || !formData.description}
            >
                <FormField
                    label="Nom de l'élection"
                    value={formData.nom}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, nom: text }))}
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
                <SelectField
                    label="Type d'élection"
                    value={formData.typeElection}
                    options={typeElectionOptions}
                    onSelect={(value) => setFormData(prev => ({ ...prev, typeElection: value }))}
                    required
                    icon="flag"
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
                <FormField
                    label="Nombre d'électeurs estimé"
                    value={formData.nombreElecteurs}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, nombreElecteurs: text }))}
                    placeholder="Ex: 47500000"
                    keyboardType="numeric"
                    icon="people"
                />
            </FormModal>

            <ConfirmModal
                visible={showDeleteModal}
                title="Supprimer l'élection"
                message={`Êtes-vous sûr de vouloir supprimer l'élection "${selectedElection?.nom}" ? Cette action est irréversible.`}
                onConfirm={confirmDelete}
                onCancel={() => { setShowDeleteModal(false); setSelectedElection(null); }}
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
    participationSection: {
        marginBottom: 16,
    },
    participationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    participationLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    participationValue: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E5E5E7',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 3,
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