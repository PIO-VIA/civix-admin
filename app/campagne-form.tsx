import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, SelectField } from '../components/crud/FormField';
import { mockCandidats, mockElecteurs } from '../mock-data';

export default function CampagneForm() {
  const [formData, setFormData] = useState({
    nom: '',
    candidatId: '',
    electionId: '',
    budget: '',
    dateDebut: '',
    dateFin: '',
    objectifs: [
      { nom: 'Meetings publics', progres: 0, total: 0 },
      { nom: 'Spots TV/Radio', progres: 0, total: 0 },
      { nom: 'Réseaux sociaux', progres: 0, total: 0 }
    ],
    equipe: '',
    couleurTheme: '',
    description: '',
    statut: 'PLANIFIEE'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const candidats = mockCandidats.map(candidat => ({
    label: `${candidat.prenom} ${candidat.nom} (${candidat.parti})`,
    value: candidat.id
  }));

  const elections = [
    { label: 'Élection Présidentielle 2024', value: '1' },
    { label: 'Élections Législatives 2024', value: '2' },
    { label: 'Élections Municipales 2026', value: '3' }
  ];

  const statuts = [
    { label: 'Planifiée', value: 'PLANIFIEE' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Terminée', value: 'TERMINEE' },
    { label: 'Suspendue', value: 'SUSPENDUE' }
  ];

  const couleursTheme = [
    { label: 'Rouge', value: '#FF6B6B' },
    { label: 'Bleu', value: '#4ECDC4' },
    { label: 'Vert', value: '#45B7D1' },
    { label: 'Orange', value: '#FFA726' },
    { label: 'Violet', value: '#AB47BC' },
    { label: 'Rose', value: '#EC407A' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom de la campagne est requis';
    if (!formData.candidatId) newErrors.candidatId = 'Le candidat est requis';
    if (!formData.electionId) newErrors.electionId = 'L\'élection est requise';
    if (!formData.budget.trim()) newErrors.budget = 'Le budget est requis';
    else if (isNaN(Number(formData.budget))) newErrors.budget = 'Le budget doit être un nombre';
    if (!formData.dateDebut.trim()) newErrors.dateDebut = 'La date de début est requise';
    if (!formData.dateFin.trim()) newErrors.dateFin = 'La date de fin est requise';
    if (!formData.equipe.trim()) newErrors.equipe = 'Le nombre d\'équipiers est requis';
    else if (isNaN(Number(formData.equipe))) newErrors.equipe = 'Le nombre d\'équipiers doit être un nombre';
    if (!formData.couleurTheme) newErrors.couleurTheme = 'La couleur thème est requise';

    // Validation des dates
    if (formData.dateDebut && formData.dateFin) {
      const debut = new Date(formData.dateDebut);
      const fin = new Date(formData.dateFin);
      if (fin <= debut) {
        newErrors.dateFin = 'La date de fin doit être postérieure à la date de début';
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
      'Campagne créée avec succès!',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
    if (field.startsWith('objectif_')) {
      const [, index, property] = field.split('_');
      const newObjectifs = [...formData.objectifs];
      newObjectifs[parseInt(index)] = {
        ...newObjectifs[parseInt(index)],
        [property]: property === 'nom' ? value : parseInt(value) || 0
      };
      setFormData(prev => ({
        ...prev,
        objectifs: newObjectifs
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
        <Text style={styles.headerTitle}>Nouvelle Campagne</Text>
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
            label="Nom de la campagne"
            value={formData.nom}
            onChangeText={(value) => updateFormData('nom', value)}
            placeholder="Ex: Campagne Présidentielle 2024"
            required
            error={errors.nom}
            icon="flag"
          />

          <SelectField
            label="Candidat"
            value={formData.candidatId}
            options={candidats}
            onSelect={(value) => updateFormData('candidatId', value)}
            required
            error={errors.candidatId}
            icon="person"
          />

          <SelectField
            label="Élection"
            value={formData.electionId}
            options={elections}
            onSelect={(value) => updateFormData('electionId', value)}
            required
            error={errors.electionId}
            icon="ballot"
          />

          <SelectField
            label="Statut"
            value={formData.statut}
            options={statuts}
            onSelect={(value) => updateFormData('statut', value)}
            icon="checkmark-circle"
          />

          <FormField
            label="Description"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            placeholder="Description de la campagne"
            multiline
            numberOfLines={3}
            error={errors.description}
            icon="document-text"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget et ressources</Text>
          
          <FormField
            label="Budget (€)"
            value={formData.budget}
            onChangeText={(value) => updateFormData('budget', value)}
            placeholder="15000000"
            keyboardType="numeric"
            required
            error={errors.budget}
            icon="wallet"
          />

          <FormField
            label="Nombre d'équipiers"
            value={formData.equipe}
            onChangeText={(value) => updateFormData('equipe', value)}
            placeholder="125"
            keyboardType="numeric"
            required
            error={errors.equipe}
            icon="people"
          />

          <SelectField
            label="Couleur thème"
            value={formData.couleurTheme}
            options={couleursTheme}
            onSelect={(value) => updateFormData('couleurTheme', value)}
            required
            error={errors.couleurTheme}
            icon="color-palette"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Période</Text>
          
          <FormField
            label="Date de début"
            value={formData.dateDebut}
            onChangeText={(value) => updateFormData('dateDebut', value)}
            placeholder="YYYY-MM-DD"
            required
            error={errors.dateDebut}
            icon="calendar"
          />

          <FormField
            label="Date de fin"
            value={formData.dateFin}
            onChangeText={(value) => updateFormData('dateFin', value)}
            placeholder="YYYY-MM-DD"
            required
            error={errors.dateFin}
            icon="calendar"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objectifs</Text>
          
          {formData.objectifs.map((objectif, index) => (
            <View key={index} style={styles.objectifContainer}>
              <Text style={styles.objectifTitle}>Objectif {index + 1}</Text>
              
              <FormField
                label="Nom de l'objectif"
                value={objectif.nom}
                onChangeText={(value) => updateFormData(`objectif_${index}_nom`, value)}
                placeholder="Ex: Meetings publics"
                icon="target"
              />

              <FormField
                label="Objectif total"
                value={objectif.total.toString()}
                onChangeText={(value) => updateFormData(`objectif_${index}_total`, value)}
                placeholder="50"
                keyboardType="numeric"
                icon="analytics"
              />
            </View>
          ))}
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
            <Text style={styles.submitButtonText}>Créer la campagne</Text>
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
  objectifContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  objectifTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
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