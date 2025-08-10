import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { mockCampagnes, mockStatistiquesCampagnes, formatNumber, formatCurrency, formatPercentage } from '../../mock-data';
import { FormModal } from '../../components/crud/FormModal';
import { ConfirmModal } from '../../components/crud/ConfirmModal';
import { FormField, SelectField } from '../../components/crud/FormField';

export default function Campagne(){
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    
    // États pour CRUD
    const [campagnes, setCampagnes] = useState(mockCampagnes);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCampagne, setSelectedCampagne] = useState<any>(null);
    const [formData, setFormData] = useState({
        nom: '',
        candidatNom: '',
        electionId: '',
        budget: '',
        dateDebut: '',
        dateFin: '',
        couleurTheme: '',
        equipe: ''
    });

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const electionOptions = [
        { label: 'Élection Présidentielle 2024', value: '1' },
        { label: 'Élections Municipales Paris', value: '2' },
        { label: 'Élections Européennes 2024', value: '3' }
    ];

    const couleurOptions = [
        { label: 'Rouge', value: '#FF6B6B' },
        { label: 'Bleu', value: '#4ECDC4' },
        { label: 'Vert', value: '#45B7D1' },
        { label: 'Orange', value: '#FFA07A' },
        { label: 'Violet', value: '#9B59B6' }
    ];

    const resetForm = () => {
        setFormData({
            nom: '',
            candidatNom: '',
            electionId: '',
            budget: '',
            dateDebut: '',
            dateFin: '',
            couleurTheme: '',
            equipe: ''
        });
    };

    const handleCreate = () => {
        router.push('/campagne-form');
    };

    const handleEdit = (campagne: any) => {
        setSelectedCampagne(campagne);
        setFormData({
            nom: campagne.nom,
            candidatNom: campagne.candidatNom,
            electionId: campagne.electionId,
            budget: campagne.budget.toString(),
            dateDebut: campagne.dateDebut.split('T')[0],
            dateFin: campagne.dateFin.split('T')[0],
            couleurTheme: campagne.couleurTheme,
            equipe: campagne.equipe.toString()
        });
        setShowEditModal(true);
    };

    const handleDelete = (campagne: any) => {
        setSelectedCampagne(campagne);
        setShowDeleteModal(true);
    };

    const handleSave = () => {
        if (!formData.nom || !formData.candidatNom || !formData.budget) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        const campagneData = {
            ...formData,
            id: selectedCampagne ? selectedCampagne.id : Date.now().toString(),
            candidatId: Date.now().toString(),
            dateDebut: formData.dateDebut + 'T00:00:00Z',
            dateFin: formData.dateFin + 'T23:59:59Z',
            budget: parseInt(formData.budget) || 0,
            budgetUtilise: selectedCampagne ? selectedCampagne.budgetUtilise : 0,
            statut: 'ACTIVE',
            equipe: parseInt(formData.equipe) || 0,
            evenements: selectedCampagne ? selectedCampagne.evenements : 0,
            objectifs: selectedCampagne ? selectedCampagne.objectifs : [
                { nom: 'Meetings publics', progres: 0, total: 10 },
                { nom: 'Spots TV/Radio', progres: 0, total: 20 },
                { nom: 'Réseaux sociaux', progres: 0, total: 50 }
            ]
        };

        if (selectedCampagne) {
            setCampagnes(prev => prev.map(c => c.id === selectedCampagne.id ? { ...selectedCampagne, ...campagneData } : c));
            setShowEditModal(false);
        } else {
            setCampagnes(prev => [...prev, campagneData]);
            setShowCreateModal(false);
        }
        
        resetForm();
        setSelectedCampagne(null);
    };

    const confirmDelete = () => {
        setCampagnes(prev => prev.filter(c => c.id !== selectedCampagne.id));
        setShowDeleteModal(false);
        setSelectedCampagne(null);
    };

    const CampagneCard = ({ campagne, index }: any) => {
        const cardAnim = useRef(new Animated.Value(0)).current;
        const progressAnim = useRef(new Animated.Value(0)).current;
        
        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 200,
                useNativeDriver: true,
            }).start();

            Animated.timing(progressAnim, {
                toValue: campagne.budgetUtilise / campagne.budget,
                duration: 1000,
                delay: (index * 200) + 300,
                useNativeDriver: false,
            }).start();
        }, []);

        const budgetPourcentage = (campagne.budgetUtilise / campagne.budget) * 100;

        return (
            <TouchableOpacity 
                onPress={() => router.push(`/campagne-detail?id=${campagne.id}`)}
            >
                <Animated.View style={[
                    styles.campagneCard,
                    { 
                        opacity: cardAnim,
                        transform: [{ translateY: slideAnim }],
                        borderLeftColor: campagne.couleurTheme
                    }
                ]}>
                <View style={styles.cardHeader}>
                    <View style={styles.campagneInfo}>
                        <Text style={styles.campagneTitle}>{campagne.nom}</Text>
                        <Text style={styles.candidatName}>{campagne.candidatNom}</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: campagne.couleurTheme }
                        ]}>
                            <Text style={styles.statusText}>{campagne.statut}</Text>
                        </View>
                    </View>
                    <View style={styles.cardActionsHeader}>
                        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(campagne)}>
                            <Ionicons name="pencil" size={16} color="#007AFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButtonHeader} onPress={() => handleDelete(campagne)}>
                            <Ionicons name="trash" size={16} color="#DC3545" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.budgetSection}>
                    <View style={styles.budgetHeader}>
                        <Text style={styles.budgetLabel}>Budget</Text>
                        <Text style={styles.budgetValue}>
                            {formatCurrency(campagne.budgetUtilise)} / {formatCurrency(campagne.budget)}
                        </Text>
                    </View>
                    <View style={styles.budgetProgressBar}>
                        <Animated.View 
                            style={[
                                styles.budgetProgressFill,
                                { 
                                    backgroundColor: campagne.couleurTheme,
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%']
                                    })
                                }
                            ]}
                        />
                    </View>
                    <Text style={styles.budgetPercentage}>
                        {formatPercentage(budgetPourcentage)} utilisé
                    </Text>
                </View>

                <View style={styles.objectifsSection}>
                    <Text style={styles.objectifsTitle}>Objectifs</Text>
                    {campagne.objectifs.map((objectif: any, idx: number) => (
                        <View key={idx} style={styles.objectifItem}>
                            <Text style={styles.objectifName}>{objectif.nom}</Text>
                            <Text style={styles.objectifProgress}>
                                {objectif.progres}/{objectif.total}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.campagneStats}>
                    <View style={styles.statItem}>
                        <Ionicons name="people" size={16} color={campagne.couleurTheme} />
                        <Text style={styles.statValue}>{campagne.equipe}</Text>
                        <Text style={styles.statLabel}>Équipe</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="calendar" size={16} color={campagne.couleurTheme} />
                        <Text style={styles.statValue}>{campagne.evenements}</Text>
                        <Text style={styles.statLabel}>Événements</Text>
                    </View>
                </View>
            </Animated.View>
            </TouchableOpacity>
        );
    };

    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="megaphone" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Campagnes</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
                    <Ionicons name="add" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.content}>
                <Animated.View style={[
                    styles.overviewSection,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
                    <View style={styles.overviewCards}>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewNumber}>
                                {mockStatistiquesCampagnes.totalCampagnes}
                            </Text>
                            <Text style={styles.overviewLabel}>Total</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={[styles.overviewNumber, { color: '#28A745' }]}>
                                {mockStatistiquesCampagnes.campagnesActives}
                            </Text>
                            <Text style={styles.overviewLabel}>Actives</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={[styles.overviewNumber, { color: '#FFC107' }]}>
                                {formatCurrency(mockStatistiquesCampagnes.budgetTotal / 1000000)}M
                            </Text>
                            <Text style={styles.overviewLabel}>Budget Total</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.campagnesSection,
                    { opacity: fadeAnim }
                ]}>
                    <Text style={styles.sectionTitle}>Campagnes Actives</Text>
                    {campagnes.map((campagne, index) => (
                        <CampagneCard 
                            key={campagne.id} 
                            campagne={campagne} 
                            index={index}
                        />
                    ))}
                </Animated.View>
            </View>
            
            {/* Modales CRUD */}
            <FormModal
                visible={showCreateModal}
                title="Nouvelle Campagne"
                onClose={() => { setShowCreateModal(false); resetForm(); }}
                onSave={handleSave}
                saveDisabled={!formData.nom || !formData.candidatNom || !formData.budget}
            >
                <FormField
                    label="Nom de la campagne"
                    value={formData.nom}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, nom: text }))}
                    placeholder="Ex: Campagne Présidentielle 2024"
                    required
                    icon="megaphone"
                />
                <FormField
                    label="Nom du candidat"
                    value={formData.candidatNom}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, candidatNom: text }))}
                    placeholder="Ex: Marie Dupont"
                    required
                    icon="person"
                />
                <SelectField
                    label="Élection liée"
                    value={formData.electionId}
                    options={electionOptions}
                    onSelect={(value) => setFormData(prev => ({ ...prev, electionId: value }))}
                    required
                    icon="ballot"
                />
                <FormField
                    label="Budget (€)"
                    value={formData.budget}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, budget: text }))}
                    placeholder="Ex: 15000000"
                    keyboardType="numeric"
                    required
                    icon="wallet"
                />
                <SelectField
                    label="Couleur thème"
                    value={formData.couleurTheme}
                    options={couleurOptions}
                    onSelect={(value) => setFormData(prev => ({ ...prev, couleurTheme: value }))}
                    icon="color-palette"
                />
                <FormField
                    label="Taille de l'équipe"
                    value={formData.equipe}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, equipe: text }))}
                    placeholder="Ex: 125"
                    keyboardType="numeric"
                    icon="people"
                />
                <FormField
                    label="Date de début"
                    value={formData.dateDebut}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, dateDebut: text }))}
                    placeholder="YYYY-MM-DD"
                    icon="calendar"
                />
                <FormField
                    label="Date de fin"
                    value={formData.dateFin}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, dateFin: text }))}
                    placeholder="YYYY-MM-DD"
                    icon="calendar"
                />
            </FormModal>

            <FormModal
                visible={showEditModal}
                title="Modifier la Campagne"
                onClose={() => { setShowEditModal(false); resetForm(); setSelectedCampagne(null); }}
                onSave={handleSave}
                isEdit
                saveDisabled={!formData.nom || !formData.candidatNom || !formData.budget}
            >
                <FormField
                    label="Nom de la campagne"
                    value={formData.nom}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, nom: text }))}
                    placeholder="Ex: Campagne Présidentielle 2024"
                    required
                    icon="megaphone"
                />
                <FormField
                    label="Nom du candidat"
                    value={formData.candidatNom}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, candidatNom: text }))}
                    placeholder="Ex: Marie Dupont"
                    required
                    icon="person"
                />
                <SelectField
                    label="Élection liée"
                    value={formData.electionId}
                    options={electionOptions}
                    onSelect={(value) => setFormData(prev => ({ ...prev, electionId: value }))}
                    required
                    icon="ballot"
                />
                <FormField
                    label="Budget (€)"
                    value={formData.budget}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, budget: text }))}
                    placeholder="Ex: 15000000"
                    keyboardType="numeric"
                    required
                    icon="wallet"
                />
                <SelectField
                    label="Couleur thème"
                    value={formData.couleurTheme}
                    options={couleurOptions}
                    onSelect={(value) => setFormData(prev => ({ ...prev, couleurTheme: value }))}
                    icon="color-palette"
                />
                <FormField
                    label="Taille de l'équipe"
                    value={formData.equipe}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, equipe: text }))}
                    placeholder="Ex: 125"
                    keyboardType="numeric"
                    icon="people"
                />
                <FormField
                    label="Date de début"
                    value={formData.dateDebut}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, dateDebut: text }))}
                    placeholder="YYYY-MM-DD"
                    icon="calendar"
                />
                <FormField
                    label="Date de fin"
                    value={formData.dateFin}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, dateFin: text }))}
                    placeholder="YYYY-MM-DD"
                    icon="calendar"
                />
            </FormModal>

            <ConfirmModal
                visible={showDeleteModal}
                title="Supprimer la campagne"
                message={`Êtes-vous sûr de vouloir supprimer la campagne "${selectedCampagne?.nom}" ? Cette action est irréversible.`}
                onConfirm={confirmDelete}
                onCancel={() => { setShowDeleteModal(false); setSelectedCampagne(null); }}
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
    overviewSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    overviewCards: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    overviewCard: {
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
    overviewNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    overviewLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    campagnesSection: {
        marginBottom: 20,
    },
    campagneCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
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
        marginBottom: 16,
    },
    campagneInfo: {
        flex: 1,
    },
    campagneTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    candidatName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '600',
    },
    moreButton: {
        padding: 4,
    },
    budgetSection: {
        marginBottom: 16,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    budgetLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    budgetValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '600',
    },
    budgetProgressBar: {
        height: 6,
        backgroundColor: '#E5E5E7',
        borderRadius: 3,
        marginBottom: 4,
    },
    budgetProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    budgetPercentage: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
    },
    objectifsSection: {
        marginBottom: 16,
    },
    objectifsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    objectifItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    objectifName: {
        fontSize: 14,
        color: '#666',
    },
    objectifProgress: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    campagneStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E7',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginTop: 4,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    cardActionsHeader: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#F0F8FF',
    },
    deleteButtonHeader: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#FFF5F5',
    },
});