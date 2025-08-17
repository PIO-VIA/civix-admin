import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, SelectField } from '@/components/crud/FormField';

export default function ElecteurForm() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    adresse: {
      rue: '',
      ville: '',
      codePostal: '',
      departement: ''
    },
    profession: '',
    genre: '',
    bureauVote: '',
    statut: 'ACTIF'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const departements = [
    { label: 'Paris', value: 'Paris' },
    { label: 'Rhône', value: 'Rhône' },
    { label: 'Bouches-du-Rhône', value: 'Bouches-du-Rhône' },
    { label: 'Haute-Garonne', value: 'Haute-Garonne' },
    { label: 'Nord', value: 'Nord' },
    { label: 'Gironde', value: 'Gironde' }
  ];

  const genres = [
    { label: 'Homme', value: 'M' },
    { label: 'Femme', value: 'F' }
  ];

  const statuts = [
    { label: 'Actif', value: 'ACTIF' },
    { label: 'Inactif', value: 'INACTIF' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email invalide';
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    if (!formData.dateNaissance.trim()) newErrors.dateNaissance = 'La date de naissance est requise';
    if (!formData.adresse.rue.trim()) newErrors['adresse.rue'] = 'La rue est requise';
    if (!formData.adresse.ville.trim()) newErrors['adresse.ville'] = 'La ville est requise';
    if (!formData.adresse.codePostal.trim()) newErrors['adresse.codePostal'] = 'Le code postal est requis';
    if (!formData.adresse.departement) newErrors['adresse.departement'] = 'Le département est requis';
    if (!formData.profession.trim()) newErrors.profession = 'La profession est requise';
    if (!formData.genre) newErrors.genre = 'Le genre est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    Alert.alert(
      'Succès',
      'Électeur créé avec succès!',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvel Électeur</Text>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSubmit}
        >
          <Ionicons name="checkmark" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          <FormField
            label="Prénom"
            value={formData.prenom}
            onChangeText={(value) => updateFormData('prenom', value)}
            placeholder="Entrez le prénom"
            required
            error={errors.prenom}
            icon="person"
          />
          
          <FormField
            label="Nom"
            value={formData.nom}
            onChangeText={(value) => updateFormData('nom', value)}
            placeholder="Entrez le nom"
            required
            error={errors.nom}
            icon="person"
          />

          <SelectField
            label="Genre"
            value={formData.genre}
            options={genres}
            onSelect={(value) => updateFormData('genre', value)}
            required
            error={errors.genre}
            icon="male-female"
          />
          
          <FormField
            label="Date de naissance"
            value={formData.dateNaissance}
            onChangeText={(value) => updateFormData('dateNaissance', value)}
            placeholder="YYYY-MM-DD"
            required
            error={errors.dateNaissance}
            icon="calendar"
          />
          
          <FormField
            label="Profession"
            value={formData.profession}
            onChangeText={(value) => updateFormData('profession', value)}
            placeholder="Entrez la profession"
            required
            error={errors.profession}
            icon="briefcase"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          
          <FormField
            label="Email"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            placeholder="exemple@email.com"
            keyboardType="email-address"
            required
            error={errors.email}
            icon="mail"
          />
          
          <FormField
            label="Téléphone"
            value={formData.telephone}
            onChangeText={(value) => updateFormData('telephone', value)}
            placeholder="+33 6 12 34 56 78"
            keyboardType="phone-pad"
            required
            error={errors.telephone}
            icon="call"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse</Text>
          
          <FormField
            label="Rue"
            value={formData.adresse.rue}
            onChangeText={(value) => updateFormData('adresse.rue', value)}
            placeholder="Numéro et nom de rue"
            required
            error={errors['adresse.rue']}
            icon="home"
          />
          
          <FormField
            label="Ville"
            value={formData.adresse.ville}
            onChangeText={(value) => updateFormData('adresse.ville', value)}
            placeholder="Nom de la ville"
            required
            error={errors['adresse.ville']}
            icon="location"
          />
          
          <FormField
            label="Code postal"
            value={formData.adresse.codePostal}
            onChangeText={(value) => updateFormData('adresse.codePostal', value)}
            placeholder="75001"
            keyboardType="numeric"
            required
            error={errors['adresse.codePostal']}
            icon="pin"
          />

          <SelectField
            label="Département"
            value={formData.adresse.departement}
            options={departements}
            onSelect={(value) => updateFormData('adresse.departement', value)}
            required
            error={errors['adresse.departement']}
            icon="map"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de vote</Text>
          
          <FormField
            label="Bureau de vote"
            value={formData.bureauVote}
            onChangeText={(value) => updateFormData('bureauVote', value)}
            placeholder="Ex: Bureau 12 - Mairie du 1er"
            error={errors.bureauVote}
            icon="business"
          />

          <SelectField
            label="Statut"
            value={formData.statut}
            options={statuts}
            onSelect={(value) => updateFormData('statut', value)}
            icon="checkmark-circle"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.submitButton]} 
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Créer l\'électeur</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});