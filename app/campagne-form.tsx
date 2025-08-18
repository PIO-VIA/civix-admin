import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, SelectField } from '@/components/crud/FormField';
import { CampagneDTO } from '@/lib/models/CampagneDTO';
import { CreateCampagneRequest } from '@/lib/models/CreateCampagneRequest';
import { UpdateCampagneRequest } from '@/lib/models/UpdateCampagneRequest';
import { useCandidats } from '@/hooks/useCandidats';
import { useCampagnes } from '@/hooks/useCampagnes';
import * as ImagePicker from 'expo-image-picker';

export default function CampagneForm() {
    const { id } = useLocalSearchParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<{ description: string; photo: string; candidatId: string | undefined }> ({
        description: '',
        photo: '',
        candidatId: undefined,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const { candidats, loading: candidatsLoading } = useCandidats();
    const { obtenirCampagne, creerCampagne, modifierCampagne } = useCampagnes();

    const candidatOptions = candidats.map(c => ({
        label: c.username || 'Sans nom',
        value: c.externalIdCandidat || '',
    }));

    useEffect(() => {
        if (isEditMode && id && typeof id === 'string') {
            const loadCampagne = async () => {
                try {
                    setLoading(true);
                    const campagneToEdit = await obtenirCampagne(id);
                    if (campagneToEdit) {
                        // Gestion flexible des données - soit campagne.campagne soit directement campagne
                        const campagneInfo = campagneToEdit.campagne || campagneToEdit;
                        const candidatInfo = campagneToEdit.candidat;
                        
                        console.log('📝 Données chargées pour édition:', {
                            campagne: campagneInfo,
                            candidat: candidatInfo
                        });
                        
                        setFormData({
                            description: campagneInfo.description || '',
                            photo: campagneInfo.photo || '',
                            candidatId: candidatInfo?.externalIdCandidat,
                        });
                    } else {
                        Alert.alert('Erreur', 'Campagne non trouvée.', [{ text: 'OK', onPress: () => router.back() }]);
                    }
                } catch (error) {
                    console.error('Erreur lors du chargement de la campagne:', error);
                    Alert.alert('Erreur', 'Impossible de charger la campagne.', [{ text: 'OK', onPress: () => router.back() }]);
                } finally {
                    setLoading(false);
                }
            };
            
            loadCampagne();
        }
    }, [id, isEditMode, obtenirCampagne]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({ ...prev, photo: result.assets[0].uri }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.description.trim()) newErrors.description = 'La description est requise';
        if (!formData.candidatId) newErrors.candidatId = 'Un candidat doit être sélectionné';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        try {
            setLoading(true);

            if (isEditMode && id && typeof id === 'string') {
                // Mode modification
                const updateData: UpdateCampagneRequest = {
                    description: formData.description,
                    photo: formData.photo || 'https://via.placeholder.com/300x100',
                    candidatId: formData.candidatId || '',
                };

                const result = await modifierCampagne(id, updateData);
                if (result) {
                    Alert.alert(
                        'Succès',
                        'Campagne modifiée avec succès!',
                        [{ text: 'OK', onPress: () => router.push('/(tabs)/campagne') }]
                    );
                } else {
                    Alert.alert('Erreur', 'Impossible de modifier la campagne');
                }
            } else {
                // Mode création
                const createData: CreateCampagneRequest = {
                    description: formData.description,
                    photo: formData.photo || 'https://via.placeholder.com/300x100',
                    candidatId: formData.candidatId || '',
                };

                const result = await creerCampagne(createData);
                if (result) {
                    Alert.alert(
                        'Succès',
                        'Campagne créée avec succès!',
                        [{ text: 'OK', onPress: () => router.push('/(tabs)/campagne') }]
                    );
                } else {
                    Alert.alert('Erreur', 'Impossible de créer la campagne');
                }
            }
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>
                    {isEditMode ? 'Chargement de la campagne...' : 'Chargement...'}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? 'Modifier la Campagne' : 'Nouvelle Campagne'}</Text>
                <TouchableOpacity 
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#007AFF" />
                    ) : (
                        <Ionicons name="checkmark" size={28} color="#007AFF" />
                    )}
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
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        <Ionicons name="camera" size={24} color="#007AFF" />
                        <Text style={styles.imagePickerText}>Choisir une photo</Text>
                    </TouchableOpacity>
                    {formData.photo ? (
                        <Image source={{ uri: formData.photo }} style={styles.previewImage} />
                    ) : null}
                    {candidatsLoading ? (
                        <View style={styles.loadingCandidats}>
                            <ActivityIndicator size="small" color="#007AFF" />
                            <Text style={styles.loadingCandidatsText}>Chargement des candidats...</Text>
                        </View>
                    ) : (
                        <SelectField
                            label="Candidat Associé"
                            value={formData.candidatId}
                            options={candidatOptions}
                            onSelect={(value) => updateFormData('candidatId', value)}
                            required error={errors.candidatId} icon="person-outline"
                        />
                    )}
                </View>

                <TouchableOpacity 
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <View style={styles.submitButtonContent}>
                            <ActivityIndicator size="small" color="white" />
                            <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>
                                {isEditMode ? 'Sauvegarde...' : 'Création...'}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.submitButtonText}>
                            {isEditMode ? 'Sauvegarder les modifications' : 'Créer la campagne'}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    centered: { justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 12, paddingHorizontal: 16, backgroundColor: 'white',
        borderBottomWidth: 1, borderBottomColor: '#E5E5E7',
    },
    backButton: { padding: 8, marginLeft: -8 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#000', flex: 1, textAlign: 'center', marginHorizontal: 8 },
    saveButton: { padding: 8, marginRight: -8 },
    saveButtonDisabled: { opacity: 0.5 },
    content: { flex: 1, padding: 16 },
    section: {
        backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 20 },
    submitButton: {
        backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginVertical: 24,
    },
    submitButtonDisabled: {
        backgroundColor: '#6C757D', opacity: 0.7,
    },
    submitButtonContent: {
        flexDirection: 'row', alignItems: 'center',
    },
    submitButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
    imagePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    imagePickerText: {
        marginLeft: 8,
        color: '#007AFF',
        fontWeight: '500',
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
    loadingCandidats: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        marginBottom: 16,
    },
    loadingCandidatsText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
});