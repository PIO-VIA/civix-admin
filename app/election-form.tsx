import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, SelectField } from '../components/crud/FormField';

export default function ElectionForm() {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    heureDebut: '08:00',
    heureFin: '20:00',
    typeElection: '',
    nombreElecteurs: '',
    statut: 'PROGRAMMEE'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const typesElection = [
    { label: 'Présidentielle', value: 'PRESIDENTIELLE' },
    { label: 'Législatives', value: 'LEGISLATIVES' },
    { label: 'Municipales', value: 'MUNICIPALE' },
    { label: 'Départementales', value: 'DEPARTEMENTALE' },
    { label: 'Régionales', value: 'REGIONALE' },
    { label: 'Européennes', value: 'EUROPEENNE' },
    { label: 'Sénatoriales', value: 'SENATORIALE' },
    { label: 'Référendum', value: 'REFERENDUM' }
  ];

  const statuts = [
    { label: 'Programmée', value: 'PROGRAMMEE' },
    { label: 'En cours', value: 'EN_COURS' },
    { label: 'Terminée', value: 'TERMINEE' },
    { label: 'Annulée', value: 'ANNULEE' }
  ];

  const heures = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return { label: `${hour}:00`, value: `${hour}:00` };
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom de l\'élection est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.typeElection) newErrors.typeElection = 'Le type d\'élection est requis';
    if (!formData.dateDebut.trim()) newErrors.dateDebut = 'La date de début est requise';
    if (!formData.dateFin.trim()) newErrors.dateFin = 'La date de fin est requise';
    if (!formData.nombreElecteurs.trim()) newErrors.nombreElecteurs = 'Le nombre d\'électeurs est requis';
    else if (isNaN(Number(formData.nombreElecteurs)) || Number(formData.nombreElecteurs) <= 0) {
      newErrors.nombreElecteurs = 'Le nombre d\'électeurs doit être un nombre positif';
    }

    // Validation des dates
    if (formData.dateDebut && formData.dateFin) {
      const dateDebut = new Date(`${formData.dateDebut}T${formData.heureDebut}`);
      const dateFin = new Date(`${formData.dateFin}T${formData.heureFin}`);
      
      if (dateFin <= dateDebut) {
        newErrors.dateFin = 'La date/heure de fin doit être postérieure à celle de début';
      }
    }

    // Validation de l'heure si même date
    if (formData.dateDebut === formData.dateFin) {
      if (formData.heureFin <= formData.heureDebut) {
        newErrors.heureFin = 'L\'heure de fin doit être postérieure à celle de début';
      }
    }

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
      'Élection créée avec succès!',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
        <Text style={styles.headerTitle}>Nouvelle Élection</Text>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSubmit}
        >
          <Ionicons name="checkmark" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          
          <FormField
            label="Nom de l'élection"
            value={formData.nom}
            onChangeText={(value) => updateFormData('nom', value)}
            placeholder="Ex: Élection Présidentielle 2024"
            required
            error={errors.nom}
            icon="ballot"
          />

          <SelectField
            label="Type d'élection"
            value={formData.typeElection}
            options={typesElection}
            onSelect={(value) => updateFormData('typeElection', value)}
            required
            error={errors.typeElection}
            icon="library"
          />

          <FormField
            label="Description"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            placeholder="Description détaillée de l'élection"
            multiline
            numberOfLines={3}
            required
            error={errors.description}
            icon="document-text"
          />

          <SelectField
            label="Statut"
            value={formData.statut}
            options={statuts}
            onSelect={(value) => updateFormData('statut', value)}
            icon="checkmark-circle"
          />

          <FormField
            label="Nombre d'électeurs inscrits"
            value={formData.nombreElecteurs}
            onChangeText={(value) => updateFormData('nombreElecteurs', value)}
            placeholder="47500000"
            keyboardType="numeric"
            required
            error={errors.nombreElecteurs}
            icon="people"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date de début</Text>
          
          <FormField
            label="Date de début"
            value={formData.dateDebut}
            onChangeText={(value) => updateFormData('dateDebut', value)}
            placeholder="YYYY-MM-DD"
            required
            error={errors.dateDebut}
            icon="calendar"
          />

          <SelectField
            label="Heure de début"
            value={formData.heureDebut}
            options={heures}
            onSelect={(value) => updateFormData('heureDebut', value)}
            icon="time"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date de fin</Text>
          
          <FormField
            label="Date de fin"
            value={formData.dateFin}
            onChangeText={(value) => updateFormData('dateFin', value)}
            placeholder="YYYY-MM-DD"
            required
            error={errors.dateFin}
            icon="calendar"
          />

          <SelectField
            label="Heure de fin"
            value={formData.heureFin}
            options={heures}
            onSelect={(value) => updateFormData('heureFin', value)}
            error={errors.heureFin}
            icon="time"
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#007AFF" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Information importante</Text>
              <Text style={styles.infoText}>
                Une fois l'élection créée, vous pourrez y associer des candidats et gérer les résultats. 
                Assurez-vous que les dates et heures sont correctes car elles déterminent la période de vote.
              </Text>
            </View>
          </View>
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
            <Text style={styles.submitButtonText}>Créer l'élection</Text>
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
  infoSection: {
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
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