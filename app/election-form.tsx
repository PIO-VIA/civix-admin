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
import { useCandidats } from '@/hooks/useCandidats';
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
        candidatsParticipants: [],
        statut: ElectionDTO.statut.PLANIFIEE,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [datePickerField, setDatePickerField] = useState<keyof Partial<ElectionDTO> | null>(null);

    const { obtenirElection, creerElection, modifierElection, error: electionHookError, loading: electionHookLoading } = useElections();
    const { electeurs, loading: electeursLoading } = useElecteurs();
    const { candidats, loading: candidatsLoading } = useCandidats();

    const electeurOptions = electeurs.map(e => ({
        label: e.username || 'Sans nom',
        value: e.externalIdElecteur || '',
    }));

    const candidatOptions = candidats.map(c => ({
        label: c.username || c.email || 'Sans nom',
        value: c.externalIdCandidat || '',
    }));

    useEffect(() => {
        if (electionHookError) {
            Alert.alert('Erreur', electionHookError);
        }
    }, [electionHookError]);

    useEffect(() => {
        if (isEditMode && id && typeof id === 'string') {
            const loadElection = async () => {
                const electionToEdit = await obtenirElection(id);
                if (electionToEdit) {
                    setFormData({
                        ...electionToEdit,
                        dateDebut: electionToEdit.dateDebut ? electionToEdit.dateDebut.split('T')[0] : '',
                        dateFin: electionToEdit.dateFin ? electionToEdit.dateFin.split('T')[0] : '',
                        candidatsParticipants: electionToEdit.candidatsParticipants || [],
                    });
                } else {
                    Alert.alert('Erreur', 'Élection non trouvée.', [{ text: 'OK', onPress: () => router.back() }]);
                }
            };
            
            loadElection();
        }
    }, [id, isEditMode]);

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
        if (!formData.candidatsParticipants?.length) {
            newErrors.candidatsParticipants = 'Veuillez sélectionner au moins un candidat';
        }

        if (formData.dateDebut && formData.dateFin) {
            const dateDebut = new Date(formData.dateDebut);
            const dateFin = new Date(formData.dateFin);
            if (dateFin <= dateDebut) {
                newErrors.dateFin = 'La date de fin doit être postérieure à la date de début';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        setIsSubmitting(true);

        let result = null;
        try {
            if (isEditMode && id && typeof id === 'string') {
                const updateData: UpdateElectionRequest = {
                    titre: formData.titre || '',
                    description: formData.description || '',
                    dateDebut: formData.dateDebut,
                    dateFin: formData.dateFin,
                    photo: formData.photo || '',
                    electeursAutorises: formData.electeursAutorises || [],
                    candidatsParticipants: formData.candidatsParticipants || [],
                    statut: formData.statut || ElectionDTO.statut.PLANIFIEE,
                };
                result = await modifierElection(id, updateData);
            } else {
                const createData: CreateElectionRequest = {
                    titre: formData.titre || '',
                    description: formData.description || '',
                    dateDebut: formData.dateDebut,
                    dateFin: formData.dateFin,
                    photo: formData.photo || 'https://via.placeholder.com/300x200',
                    electeursAutorises: formData.electeursAutorises || [],
                    candidatsParticipants: formData.candidatsParticipants || [],
                };
                result = await creerElection(createData);
            }

            if (result) {
                Alert.alert(
                    'Succès',
                    `Élection ${isEditMode ? 'modifiée' : 'créée'} avec succès!`, 
                    [{ text: 'OK', onPress: () => router.push('/(tabs)/election') }]
                );
            }
            // Si result est null, l'alerte d'erreur sera déclenchée par le useEffect
        } catch (error) {
            // Le hook gère déjà l'état d'erreur, mais on log au cas où
            console.error('❌ Erreur inattendue lors de la soumission:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateFormData = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (electionHookLoading && isEditMode && !formData.titre) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Chargement de l élection...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? 'Modifier l Élection' : 'Nouvelle Élection'}</Text>
                <TouchableOpacity 
                    style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]} 
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#007AFF" />
                    ) : (
                        <Ionicons name="checkmark" size={28} color="#007AFF" />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
                bounces={true}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{"Informations sur l Élection"}</Text>
                    <FormField
                        label="Titre de l élection"
                        value={formData.titre || ''}
                        onChangeText={(value) => updateFormData('titre', value)}
                        placeholder="Ex: Élection Présidentielle 2024"
                        required error={errors.titre} icon="document-outline"
                    />
                    <FormField
                        label="Description"
                        value={formData.description || ''}
                        onChangeText={(value) => updateFormData('description', value)}
                        placeholder="Description de l élection"
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
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        <Ionicons name="camera" size={24} color="#007AFF" />
                        <Text style={styles.imagePickerText}>Choisir une photo (optionnel)</Text>
                    </TouchableOpacity>
                    {formData.photo ? (
                        <Image source={{ uri: formData.photo }} style={styles.previewImage} />
                    ) : null}
                    {isEditMode && (
                        <SelectField
                            label="Statut"
                            selectedValue={formData.statut || ''}
                            onSelect={(value) => updateFormData('statut', value)}
                            options={Object.values(ElectionDTO.statut).map(s => ({ label: s, value: s }))}
                            required
                            error={errors.statut}
                            icon="flag-outline"
                        />
                    )}
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

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Candidats Participants</Text>
                    {candidatsLoading ? (
                        <View style={styles.loadingElecteurs}>
                            <ActivityIndicator size="small" color="#007AFF" />
                            <Text style={styles.loadingElecteursText}>Chargement des candidats...</Text>
                        </View>
                    ) : candidatOptions.length === 0 ? (
                        <View style={styles.noCandidatesContainer}>
                            <Ionicons name="person-outline" size={48} color="#999" />
                            <Text style={styles.noCandidatesText}>Aucun candidat disponible</Text>
                            <Text style={styles.noCandidatesSubtext}>
                                Vous devez d abord créer des candidats avant de pouvoir créer une élection.
                            </Text>
                            <TouchableOpacity 
                                style={styles.createCandidateButton}
                                onPress={() => router.push('/candidat-form')}
                            >
                                <Ionicons name="add" size={20} color="#007AFF" />
                                <Text style={styles.createCandidateText}>Créer un candidat</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <MultiSelectField
                            label="Candidats"
                            selectedValues={formData.candidatsParticipants || []}
                            options={candidatOptions}
                            onSelectionChange={(values) => updateFormData('candidatsParticipants', values)}
                            required
                            error={errors.candidatsParticipants}
                            icon="person-outline"
                        />
                    )}
                </View>

                <TouchableOpacity 
                    style={[
                        styles.submitButton, 
                        (isSubmitting || candidatOptions.length === 0) && styles.submitButtonDisabled
                    ]} 
                    onPress={handleSubmit}
                    disabled={isSubmitting || candidatOptions.length === 0}
                >
                    {isSubmitting ? (
                        <View style={styles.submitButtonContent}>
                            <ActivityIndicator size="small" color="white" />
                            <Text style={[styles.submitButtonText, { marginLeft: 8 }]}>
                                {isEditMode ? 'Sauvegarde...' : 'Création...'}
                            </Text>
                        </View>
                    ) : candidatOptions.length === 0 ? (
                        <Text style={styles.submitButtonText}>
                            Créez d abord des candidats
                        </Text>
                    ) : (
                        <Text style={styles.submitButtonText}>
                            {isEditMode ? 'Sauvegarder les modifications' : 'Créer l élection'}
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
    content: { flex: 1 },
    scrollContent: { 
        flexGrow: 1, 
        padding: 16,
        paddingBottom: 100,
    },
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
    noCandidatesContainer: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E5E7',
        borderStyle: 'dashed',
    },
    noCandidatesText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 12,
        marginBottom: 8,
    },
    noCandidatesSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    createCandidateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    createCandidateText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
        marginLeft: 8,
    },
});