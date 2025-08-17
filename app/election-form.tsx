import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Platform, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, MultiSelectField, SelectField } from '@/components/crud/FormField';
import { ElectionDTO } from '@/lib/models/ElectionDTO';
import { CreateElectionRequest } from '@/lib/models/CreateElectionRequest';
import { UpdateElectionRequest } from '@/lib/models/UpdateElectionRequest';
import { useElections } from '@/hooks/useElections';
import { useElecteurs } from '@/hooks/useElecteurs';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function ElectionForm() {
    const { id } = useLocalSearchParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<Partial<ElectionDTO>>({
        titre: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        photo: '',
        electeursAutorises: [],
        statut: ElectionDTO.statut.PLANIFIEE,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [datePickerField, setDatePickerField] = useState<keyof Partial<ElectionDTO> | null>(null);

    const { obtenirElection, creerElection, modifierElection } = useElections();
    const { electeurs, loading: electeursLoading } = useElecteurs();

    const electeurOptions = electeurs.map(e => ({
        label: e.username || 'Sans nom',
        value: e.externalIdElecteur || '',
    }));

    const statutOptions = Object.values(ElectionDTO.statut).map(s => ({
        label: s,
        value: s,
    }));

    useEffect(() => {
        if (isEditMode && id && typeof id === 'string') {
            const loadElection = async () => {
                try {
                    setLoading(true);
                    const electionToEdit = await obtenirElection(id);
                    if (electionToEdit) {
                        setFormData({
                            ...electionToEdit,
                            dateDebut: electionToEdit.dateDebut ? electionToEdit.dateDebut.split('T')[0] : '',
                            dateFin: electionToEdit.dateFin ? electionToEdit.dateFin.split('T')[0] : '',
                        });
                    } else {
                        Alert.alert('Erreur', 'Élection non trouvée.', [{ text: 'OK', onPress: () => router.back() }]);
                    }
                } catch (error) {
                    console.error('Erreur lors du chargement de l\'élection:', error);
                    Alert.alert('Erreur', 'Impossible de charger l\'élection.', [{ text: 'OK', onPress: () => router.back() }]);
                } finally {
                    setLoading(false);
                }
            };
            
            loadElection();
        }
    }, [id, isEditMode, obtenirElection]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({ ...prev, photo: result.assets[0].uri }));
        }
    };

    const showDatePicker = (field: keyof Partial<ElectionDTO>) => {
        setDatePickerField(field);
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
        setDatePickerField(null);
    };

    const handleConfirmDate = (date: Date) => {
        if (datePickerField) {
            updateFormData(datePickerField, date.toISOString().split('T')[0]);
        }
        hideDatePicker();
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.titre?.trim()) newErrors.titre = 'Le titre est requis';
        if (!formData.description?.trim()) newErrors.description = 'La description est requise';
        if (!formData.dateDebut?.trim()) newErrors.dateDebut = 'La date de début est requise';
        if (!formData.dateFin?.trim()) newErrors.dateFin = 'La date de fin est requise';
        if (!formData.electeursAutorises?.length) newErrors.electeursAutorises = 'Veuillez sélectionner au moins un électeur';
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
                const updateData: UpdateElectionRequest = {
                    titre: formData.titre || '',
                    description: formData.description || '',
                    dateDebut: formData.dateDebut + 'T08:00:00Z',
                    dateFin: formData.dateFin + 'T20:00:00Z',
                    photo: formData.photo || '',
                    electeursAutorises: formData.electeursAutorises || [],
                    statut: formData.statut || ElectionDTO.statut.PLANIFIEE,
                };

                console.log('🔄 Modification élection, données:', updateData);
                const result = await modifierElection(id, updateData);
                if (result) {
                    Alert.alert(
                        'Succès',
                        'Élection modifiée avec succès!',
                        [{ text: 'OK', onPress: () => router.push('/(tabs)/election') }]
                    );
                } else {
                    Alert.alert('Erreur', 'Impossible de modifier l\'élection');
                }
            } else {
                // Mode création
                const createData: CreateElectionRequest = {
                    titre: formData.titre || '',
                    description: formData.description || '',
                    dateDebut: formData.dateDebut + 'T08:00:00Z',
                    dateFin: formData.dateFin + 'T20:00:00Z',
                    photo: formData.photo || '',
                    electeursAutorises: formData.electeursAutorises || [],
                    statut: formData.statut || ElectionDTO.statut.PLANIFIEE,
                };

                console.log('➕ Création élection, données:', createData);
                const result = await creerElection(createData);
                if (result) {
                    Alert.alert(
                        'Succès',
                        'Élection créée avec succès!',
                        [{ text: 'OK', onPress: () => router.push('/(tabs)/election') }]
                    );
                } else {
                    Alert.alert('Erreur', 'Impossible de créer l\'élection');
                }
            }
        } catch (error) {
            console.error('❌ Erreur lors de la soumission:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    const updateFormData = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (loading && isEditMode) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Chargement de l'élection...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? 'Modifier l\'Élection' : 'Nouvelle Élection'}</Text>
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
                    <Text style={styles.sectionTitle}>{"Informations sur l'Élection"}</Text>
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
                        placeholder="Description de l\'élection"
                        multiline required error={errors.description} icon="document-text-outline"
                    />
                    <FormField
                        label="Date de début"
                        value={formData.dateDebut || ''}
                        onPress={() => showDatePicker('dateDebut')}
                        placeholder="YYYY-MM-DD"
                        required error={errors.dateDebut} icon="calendar-outline"
                        editable={false}
                    />
                    <FormField
                        label="Date de fin"
                        value={formData.dateFin || ''}
                        onPress={() => showDatePicker('dateFin')}
                        placeholder="YYYY-MM-DD"
                        required error={errors.dateFin} icon="calendar-outline"
                        editable={false}
                    />
                    <SelectField
                        label="Statut"
                        value={formData.statut || ''}
                        options={statutOptions}
                        onSelect={(value) => updateFormData('statut', value)}
                        required
                        icon="flag-outline"
                    />
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        <Ionicons name="camera" size={24} color="#007AFF" />
                        <Text style={styles.imagePickerText}>Choisir une photo</Text>
                    </TouchableOpacity>
                    {formData.photo ? (
                        <Image source={{ uri: formData.photo }} style={styles.previewImage} />
                    ) : null}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Électeurs Autorisés</Text>
                    {electeursLoading ? (
                        <View style={styles.loadingElecteurs}>
                            <ActivityIndicator size="small" color="#007AFF" />
                            <Text style={styles.loadingElecteursText}>Chargement des électeurs...</Text>
                        </View>
                    ) : (
                        <MultiSelectField
                            label="Électeurs"
                            selectedValues={formData.electeursAutorises || []}
                            options={electeurOptions}
                            onSelectionChange={(values) => updateFormData('electeursAutorises', values)}
                            required
                            error={errors.electeursAutorises}
                            icon="people-outline"
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
                            {isEditMode ? 'Sauvegarder les modifications' : 'Créer l\'élection'}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
            />
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
    loadingElecteurs: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        marginBottom: 16,
    },
    loadingElecteursText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
});