import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, MultiSelectField, SelectField } from '@/components/crud/FormField';
import { mockElections } from '@/mock-data/elections';
import { mockElecteurs } from '@/mock-data/electeurs';
import { ElectionDTO } from '@/lib/models/ElectionDTO';
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
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [datePickerField, setDatePickerField] = useState<keyof Partial<ElectionDTO> | null>(null);

    const electeurOptions = mockElecteurs.map(e => ({
        label: e.username || 'Sans nom',
        value: e.externalIdElecteur || '',
    }));

    const statutOptions = Object.values(ElectionDTO.statut).map(s => ({
        label: s,
        value: s,
    }));

    useEffect(() => {
        if (isEditMode) {
            const electionToEdit = mockElections.find(e => e.externalIdElection === id);
            if (electionToEdit) {
                setFormData({
                    ...electionToEdit,
                    dateDebut: electionToEdit.dateDebut ? electionToEdit.dateDebut.split('T')[0] : '',
                    dateFin: electionToEdit.dateFin ? electionToEdit.dateFin.split('T')[0] : '',
                });
            } else {
                Alert.alert('Erreur', 'Élection non trouvée.', [{ text: 'OK', onPress: () => router.back() }]);
            }
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
            dateDebut: formData.dateDebut + 'T08:00:00Z',
            dateFin: formData.dateFin + 'T20:00:00Z',
            dateCreation: isEditMode ? formData.dateCreation : new Date().toISOString(),
            dateModification: new Date().toISOString(),
        };

        console.log('Submitting data:', finalData);

        Alert.alert(
            'Succès',
            `Élection ${isEditMode ? 'modifiée' : 'créée'} avec succès!`,
            [{ text: 'OK', onPress: () => router.push('/(tabs)/election') }]
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
                <Text style={styles.headerTitle}>{isEditMode ? 'Modifier l\'Élection' : 'Nouvelle Élection'}</Text>
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                    <Ionicons name="checkmark" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations sur l\'Élection</Text>
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
                    <MultiSelectField
                        label="Électeurs"
                        selectedValues={formData.electeursAutorises || []}
                        options={electeurOptions}
                        onSelectionChange={(values) => updateFormData('electeursAutorises', values)}
                        required
                        error={errors.electeursAutorises}
                        icon="people-outline"
                    />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>{isEditMode ? 'Sauvegarder les modifications' : 'Créer l\'élection'}</Text>
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
});