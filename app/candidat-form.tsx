import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, SelectField } from '../components/crud/FormField';

export default function CandidatForm() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    lieuNaissance: '',
    profession: '',
    parti: '',
    programme: '',
    biographie: '',
    reseauxSociaux: {
      twitter: '',
      facebook: '',
      instagram: ''
    },
    statut: 'EN_ATTENTE'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const partis = [
    { label: 'Parti de la République', value: 'Parti de la République' },
    { label: 'Mouvement Démocrate', value: 'Mouvement Démocrate' },
    { label: 'Les Verts', value: 'Les Verts' },
    { label: 'Rassemblement National', value: 'Rassemblement National' },
    { label: 'Parti Socialiste', value: 'Parti Socialiste' },
    { label: 'Les Républicains', value: 'Les Républicains' },
    { label: 'France Insoumise', value: 'France Insoumise' },
    { label: 'Indépendant', value: 'Indépendant' }
  ];

  const statuts = [
    { label: 'En attente', value: 'EN_ATTENTE' },
    { label: 'Validé', value: 'VALIDE' },
    { label: 'Rejeté', value: 'REJETE' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email invalide';
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis';
    if (!formData.dateNaissance.trim()) newErrors.dateNaissance = 'La date de naissance est requise';
    if (!formData.lieuNaissance.trim()) newErrors.lieuNaissance = 'Le lieu de naissance est requis';
    if (!formData.profession.trim()) newErrors.profession = 'La profession est requise';
    if (!formData.parti) newErrors.parti = 'Le parti est requis';
    if (!formData.programme.trim()) newErrors.programme = 'Le programme est requis';
    if (!formData.biographie.trim()) newErrors.biographie = 'La biographie est requise';

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
      'Candidat créé avec succès!',
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
        <Text style={styles.headerTitle}>Nouveau Candidat</Text>
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
            label="Lieu de naissance"
            value={formData.lieuNaissance}
            onChangeText={(value) => updateFormData('lieuNaissance', value)}
            placeholder="Ville, Pays"
            required
            error={errors.lieuNaissance}
            icon="location"
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
            placeholder="+33 1 23 45 67 89"
            keyboardType="phone-pad"
            required
            error={errors.telephone}
            icon="call"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations politiques</Text>
          
          <SelectField
            label="Parti politique"
            value={formData.parti}
            options={partis}
            onSelect={(value) => updateFormData('parti', value)}
            required
            error={errors.parti}
            icon="flag"
          />

          <SelectField
            label="Statut"
            value={formData.statut}
            options={statuts}
            onSelect={(value) => updateFormData('statut', value)}
            icon="checkmark-circle"
          />
          
          <FormField
            label="Programme électoral"
            value={formData.programme}
            onChangeText={(value) => updateFormData('programme', value)}
            placeholder="Résumé du programme électoral"
            multiline
            numberOfLines={3}
            required
            error={errors.programme}
            icon="document-text"
          />
          
          <FormField
            label="Biographie"
            value={formData.biographie}
            onChangeText={(value) => updateFormData('biographie', value)}
            placeholder="Parcours et expériences du candidat"
            multiline
            numberOfLines={4}
            required
            error={errors.biographie}
            icon="book"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Réseaux sociaux (optionnel)</Text>
          
          <FormField
            label="Twitter"
            value={formData.reseauxSociaux.twitter}
            onChangeText={(value) => updateFormData('reseauxSociaux.twitter', value)}
            placeholder="@nom_utilisateur"
            icon="logo-twitter"
          />
          
          <FormField
            label="Facebook"
            value={formData.reseauxSociaux.facebook}
            onChangeText={(value) => updateFormData('reseauxSociaux.facebook', value)}
            placeholder="nom.utilisateur"
            icon="logo-facebook"
          />
          
          <FormField
            label="Instagram"
            value={formData.reseauxSociaux.instagram}
            onChangeText={(value) => updateFormData('reseauxSociaux.instagram', value)}
            placeholder="nom_utilisateur"
            icon="logo-instagram"
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
            <Text style={styles.submitButtonText}>Créer le candidat</Text>
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