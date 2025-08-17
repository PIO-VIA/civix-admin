import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField } from '@/components/crud/FormField';
import { ElecteurDTO } from '@/lib/models/ElecteurDTO';
import { CreateElecteurAdminRequest } from '@/lib/models/CreateElecteurAdminRequest';
import { UpdateElecteurRequest } from '@/lib/models/UpdateElecteurRequest';
import { useElecteurs } from '@/hooks/useElecteurs';

export default function ElecteurForm() {
    const { id } = useLocalSearchParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<Partial<ElecteurDTO>>({
        username: '',
        email: '',
        avote: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const { obtenirElecteur, creerElecteur, modifierElecteur } = useElecteurs();

    useEffect(() => {
        if (isEditMode && id && typeof id === 'string') {
            const loadElecteur = async () => {
                try {
                    setLoading(true);
                    const electeurToEdit = await obtenirElecteur(id);
                    if (electeurToEdit) {
                        setFormData(electeurToEdit);
                    } else {
                        Alert.alert('Erreur', 'Électeur non trouvé.', [{ text: 'OK', onPress: () => router.back() }]);
                    }
                } catch (error) {
                    console.error('Erreur lors du chargement de l\'électeur:', error);
                    Alert.alert('Erreur', 'Impossible de charger l\'électeur.', [{ text: 'OK', onPress: () => router.back() }]);
                } finally {
                    setLoading(false);
                }
            };
            
            loadElecteur();
        }
    }, [id, isEditMode, obtenirElecteur]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.username?.trim()) newErrors.username = 'Le nom d\'utilisateur est requis';
        if (!formData.email?.trim()) newErrors.email = 'L\'email est requis';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email invalide';

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
                const updateData: UpdateElecteurRequest = {
                    username: formData.username || '',
                    email: formData.email || '',
                    avote: formData.avote || false,
                };

                console.log('🔄 Modification électeur, données:', updateData);
                const result = await modifierElecteur(id, updateData);
                if (result) {
                    Alert.alert(
                        'Succès',
                        'Électeur modifié avec succès!',
                        [{ text: 'OK', onPress: () => router.push('/(tabs)/electeur') }]
                    );
                } else {
                    Alert.alert('Erreur', 'Impossible de modifier l\'électeur');
                }
            } else {
                // Mode création
                const createData: CreateElecteurAdminRequest = {
                    username: formData.username || '',
                    email: formData.email || '',
                    avote: formData.avote || false,
                };

                console.log('➕ Création électeur, données:', createData);
                const result = await creerElecteur(createData);
                if (result) {
                    Alert.alert(
                        'Succès',
                        'Électeur créé avec succès!',
                        [{ text: 'OK', onPress: () => router.push('/(tabs)/electeur') }]
                    );
                } else {
                    Alert.alert('Erreur', 'Impossible de créer l\'électeur');
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
                <Text style={styles.loadingText}>Chargement de l'électeur...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? 'Modifier l\'Électeur' : 'Nouvel Électeur'}</Text>
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
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
});
