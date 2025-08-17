import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, SelectField } from '@/components/crud/FormField';
import { mockCampagnes } from '@/mock-data/campagnes';
import { mockCandidats } from '@/mock-data/candidats';
import { CampagneDTO } from '@/lib/models/CampagneDTO';

export default function CampagneForm() {
    const { id } = useLocalSearchParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<{ description: string; photo: string; candidatId: string | undefined }> ({
        description: '',
        photo: '',
        candidatId: undefined,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const candidatOptions = mockCandidats.map(c => ({
        label: c.username || 'Sans nom',
        value: c.externalIdCandidat || '',
    }));

    useEffect(() => {
        if (isEditMode) {
            const campagneToEdit = mockCampagnes.find(c => c.externalIdCampagne === id);
            if (campagneToEdit) {
                setFormData({
                    description: campagneToEdit.description || '',
                    photo: campagneToEdit.photo || '',
                    candidatId: campagneToEdit.candidat?.externalIdCandidat,
                });
            } else {
                Alert.alert('Erreur', 'Campagne non trouvée.', [{ text: 'OK', onPress: () => router.back() }]);
            }
        }
    }, [id, isEditMode]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.description.trim()) newErrors.description = 'La description est requise';
        if (!formData.candidatId) newErrors.candidatId = 'Un candidat doit être sélectionné';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        const selectedCandidat = mockCandidats.find(c => c.externalIdCandidat === formData.candidatId);

        const finalData: CampagneDTO = {
            externalIdCampagne: isEditMode ? (id as string) : Date.now().toString(),
            description: formData.description,
            photo: formData.photo || 'https://via.placeholder.com/300x100',
            candidat: selectedCandidat ? {
                externalIdCandidat: selectedCandidat.externalIdCandidat,
                username: selectedCandidat.username,
            } : undefined,
        };

        console.log('Submitting data:', finalData);

        Alert.alert(
            'Succès',
            `Campagne ${isEditMode ? 'modifiée' : 'créée'} avec succès!`,
            [{ text: 'OK', onPress: () => router.push('/(tabs)/campagne') }]
        );
    };

    const updateFormData = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? 'Modifier la Campagne' : 'Nouvelle Campagne'}</Text>
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                    <Ionicons name="checkmark" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations sur la Campagne</Text>
                    <FormField
                        label="Description"
                        value={formData.description}
                        onChangeText={(value) => updateFormData('description', value)}
                        placeholder="Ex: Campagne de sensibilisation..."
                        required error={errors.description} icon="document-text-outline"
                    />
                    <FormField
                        label="URL de la photo de couverture"
                        value={formData.photo}
                        onChangeText={(value) => updateFormData('photo', value)}
                        placeholder="https://example.com/photo.jpg"
                        icon="image-outline"
                    />
                    <SelectField
                        label="Candidat Associé"
                        value={formData.candidatId}
                        options={candidatOptions}
                        onSelect={(value) => updateFormData('candidatId', value)}
                        required error={errors.candidatId} icon="person-outline"
                    />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>{isEditMode ? 'Sauvegarder les modifications' : 'Créer la campagne'}</Text>
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
    submitButton: {
        backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginVertical: 24,
    },
    submitButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
});