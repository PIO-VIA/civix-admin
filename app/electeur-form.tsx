import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField } from '@/components/crud/FormField';
import { mockElecteurs } from '@/mock-data/electeurs';
import { ElecteurDTO } from '@/lib/models/ElecteurDTO';

export default function ElecteurForm() {
    const { id } = useLocalSearchParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<Partial<ElecteurDTO>>({
        username: '',
        email: '',
        avote: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditMode) {
            const electeurToEdit = mockElecteurs.find(e => e.externalIdElecteur === id);
            if (electeurToEdit) {
                setFormData(electeurToEdit);
            } else {
                Alert.alert('Erreur', 'Électeur non trouvé.', [{ text: 'OK', onPress: () => router.back() }]);
            }
        }
    }, [id, isEditMode]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.username?.trim()) newErrors.username = 'Le nom d\'utilisateur est requis';
        if (!formData.email?.trim()) newErrors.email = 'L\'email est requis';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email invalide';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        const finalData: ElecteurDTO = {
            ...formData,
            externalIdElecteur: isEditMode ? (id as string) : Date.now().toString(),
            username: formData.username || '',
            email: formData.email || '',
        };

        console.log('Submitting data:', finalData);

        Alert.alert(
            'Succès',
            `Électeur ${isEditMode ? 'modifié' : 'créé'} avec succès!`,
            [{ text: 'OK', onPress: () => router.push('/(tabs)/electeur') }]
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
                <Text style={styles.headerTitle}>{isEditMode ? 'Modifier l\'Électeur' : 'Nouvel Électeur'}</Text>
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                    <Ionicons name="checkmark" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations de l\'Électeur</Text>
                    <FormField
                        label="Nom complet"
                        value={formData.username || ''}
                        onChangeText={(value) => updateFormData('username', value)}
                        placeholder="Ex: Jean Dupont"
                        required error={errors.username} icon="person-outline"
                    />
                    <FormField
                        label="Email"
                        value={formData.email || ''}
                        onChangeText={(value) => updateFormData('email', value)}
                        placeholder="jean.dupont@email.com"
                        keyboardType="email-address"
                        required error={errors.email} icon="mail-outline"
                    />
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>A voté</Text>
                        <Switch
                            value={formData.avote}
                            onValueChange={(value) => updateFormData('avote', value)}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>{isEditMode ? 'Sauvegarder les modifications' : 'Créer l\'électeur'}</Text>
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
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
});
