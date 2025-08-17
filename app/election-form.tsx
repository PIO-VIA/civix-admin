import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField } from '../components/crud/FormField';
import { mockElections } from '../mock-data/elections';
import { ElectionDTO } from '../lib/models/ElectionDTO';

export default function ElectionForm() {
    const { id } = useLocalSearchParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<Partial<ElectionDTO>>({
        titre: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        nombreElecteursInscrits: 0,
        autoriserVoteMultiple: false,
        nombreMaxVotesParElecteur: 1,
        resultatsVisibles: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditMode) {
            const electionToEdit = mockElections.find(e => e.externalIdElection === id);
            if (electionToEdit) {
                setFormData({
                    ...electionToEdit,
                    dateDebut: electionToEdit.dateDebut?.split('T')[0],
                    dateFin: electionToEdit.dateFin?.split('T')[0],
                });
            } else {
                Alert.alert('Erreur', 'Élection non trouvée.', [{ text: 'OK', onPress: () => router.back() }]);
            }
        }
    }, [id, isEditMode]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.titre?.trim()) newErrors.titre = 'Le titre est requis';
        if (!formData.description?.trim()) newErrors.description = 'La description est requise';
        if (!formData.dateDebut) newErrors.dateDebut = 'La date de début est requise';
        if (!formData.dateFin) newErrors.dateFin = 'La date de fin est requise';

        if (formData.dateDebut && formData.dateFin && formData.dateFin < formData.dateDebut) {
            newErrors.dateFin = 'La date de fin doit être après la date de début';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        const finalData: ElectionDTO = {
            ...formData,
            externalIdElection: isEditMode ? (id as string) : Date.now().toString(),
            titre: formData.titre || '',
            description: formData.description || '',
            dateDebut: `${formData.dateDebut}T08:00:00Z`,
            dateFin: `${formData.dateFin}T20:00:00Z`,
            statut: formData.statut || ElectionDTO.statut.PLANIFIEE,
            dateCreation: isEditMode ? formData.dateCreation : new Date().toISOString(),
            dateModification: new Date().toISOString(),
        };

        // In a real app, you would call an API here.
        // For now, we simulate the update.
        console.log('Submitting data:', finalData);

        Alert.alert(
            'Succès',
            `Élection ${isEditMode ? 'modifiée' : 'créée'} avec succès!`,
            [{ text: 'OK', onPress: () => router.push('/(tabs)/election') }]
        );
    };

    const updateFormData = (field: keyof ElectionDTO, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? 'Modifier l\'Élection' : 'Nouvelle Élection'}</Text>
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                    <Ionicons name="checkmark" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations Générales</Text>
                    <FormField
                        label="Titre de l\'élection"
                        value={formData.titre || ''}
                        onChangeText={(value) => updateFormData('titre', value)}
                        placeholder="Ex: Élection Présidentielle 2024"
                        required error={errors.titre} icon="ballot-outline"
                    />
                    <FormField
                        label="Description"
                        value={formData.description || ''}
                        onChangeText={(value) => updateFormData('description', value)}
                        placeholder="Description détaillée de l\'élection"
                        multiline required error={errors.description} icon="document-text-outline"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Période de Vote</Text>
                    <FormField
                        label="Date de début"
                        value={formData.dateDebut || ''}
                        onChangeText={(value) => updateFormData('dateDebut', value)}
                        placeholder="YYYY-MM-DD" required error={errors.dateDebut} icon="calendar-outline"
                    />
                    <FormField
                        label="Date de fin"
                        value={formData.dateFin || ''}
                        onChangeText={(value) => updateFormData('dateFin', value)}
                        placeholder="YYYY-MM-DD" required error={errors.dateFin} icon="calendar-outline"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Paramètres</Text>
                    <FormField
                        label="Nombre d\'électeurs inscrits"
                        value={formData.nombreElecteursInscrits?.toString() || '0'}
                        onChangeText={(value) => updateFormData('nombreElecteursInscrits', parseInt(value) || 0)}
                        keyboardType="numeric" icon="people-outline"
                    />
                    <View style={styles.switchRow}>
                        <Ionicons name="eye-outline" size={24} color="#666" />
                        <Text style={styles.switchLabel}>Résultats visibles par les électeurs</Text>
                        <Switch
                            value={formData.resultatsVisibles}
                            onValueChange={(value) => updateFormData('resultatsVisibles', value)}
                        />
                    </View>
                    <View style={styles.switchRow}>
                        <Ionicons name="repeat-outline" size={24} color="#666" />
                        <Text style={styles.switchLabel}>Autoriser les votes multiples</Text>
                        <Switch
                            value={formData.autoriserVoteMultiple}
                            onValueChange={(value) => updateFormData('autoriserVoteMultiple', value)}
                        />
                    </View>
                    {formData.autoriserVoteMultiple && (
                        <FormField
                            label="Nombre maximum de votes par électeur"
                            value={formData.nombreMaxVotesParElecteur?.toString() || '1'}
                            onChangeText={(value) => updateFormData('nombreMaxVotesParElecteur', parseInt(value) || 1)}
                            keyboardType="numeric" icon="list-outline"
                        />
                    )}
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>{isEditMode ? 'Sauvegarder les modifications' : 'Créer l\'élection'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 12, paddingHorizontal: 16, backgroundColor: 'white',
        borderBottomWidth: 1, borderBottomColor: '#E5E5E7',
    },
    backButton: { padding: 8, marginLeft: -8 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#000', flex: 1, textAlign: 'center', marginHorizontal: 8 },
    saveButton: { padding: 8, marginRight: -8 },
    content: { flex: 1, padding: 16 },
    section: {
        backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 20 },
    switchRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5E7',
    },
    switchLabel: { fontSize: 16, color: '#333', flex: 1, marginLeft: 16 },
    submitButton: {
        backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginVertical: 24,
    },
    submitButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
});
