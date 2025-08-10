import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, SelectField } from '../components/crud/FormField';
import { mockCampagnes, mockCandidats } from '../mock-data';

export default function CampagneDetail() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    candidatId: '',
    candidatNom: '',
    electionId: '',
    budget: 0,
    budgetUtilise: 0,
    dateDebut: '',
    dateFin: '',
    statut: 'PLANIFIEE',
    objectifs: [
      { nom: '', progres: 0, total: 0 }
    ],
    equipe: 0,
    evenements: 0,
    couleurTheme: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const campagne = mockCampagnes.find(c => c.id === id);
    if (campagne) {
      setFormData({
        ...campagne,
        description: ''
      });
    }
  }, [id]);

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

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    Alert.alert(
      'Succès',
      'Campagne modifiée avec succès!',
      [
        {
          text: 'OK',
          onPress: () => setIsEditing(false)
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la campagne',
      'Êtes-vous sûr de vouloir supprimer cette campagne? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Succès', 'Campagne supprimée avec succès!', [
              {
                text: 'OK',
                onPress: () => router.back()
              }
            ]);
          }
        }
      ]
    );
  };

  const updateFormData = (field: string, value: string | number) => {
    if (field.startsWith('objectif_')) {
      const [, index, property] = field.split('_');
      const newObjectifs = [...formData.objectifs];
      newObjectifs[parseInt(index)] = {
        ...newObjectifs[parseInt(index)],
        [property]: property === 'nom' ? value : parseInt(value as string) || 0
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#28A745';
      case 'PLANIFIEE': return '#007AFF';
      case 'TERMINEE': return '#6C757D';
      case 'SUSPENDUE': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'PLANIFIEE': return 'Planifiée';
      case 'TERMINEE': return 'Terminée';
      case 'SUSPENDUE': return 'Suspendue';
      default: return status;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const calculateBudgetProgress = () => {
    if (formData.budget === 0) return 0;
    return Math.round((formData.budgetUtilise / formData.budget) * 100);
  };

  if (!formData.id) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Campagne non trouvée</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Modifier Campagne' : 'Détail Campagne'}
        </Text>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Ionicons 
            name={isEditing ? "checkmark" : "pencil"} 
            size={24} 
            color="#007AFF" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!isEditing && (
          <View style={styles.overviewSection}>
            <View style={styles.campaignHeader}>
              <View style={[
                styles.themeColor,
                { backgroundColor: formData.couleurTheme || '#007AFF' }
              ]} />
              <View style={styles.campaignInfo}>
                <Text style={styles.campaignName}>{formData.nom}</Text>
                <Text style={styles.candidatName}>{formData.candidatNom}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(formData.statut) }
                ]}>
                  <Text style={styles.statusText}>{getStatusLabel(formData.statut)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatNumber(formData.budget)}€</Text>
                <Text style={styles.statLabel}>Budget</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#28A745' }]}>
                  {calculateBudgetProgress()}%
                </Text>
                <Text style={styles.statLabel}>Utilisé</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formData.equipe}</Text>
                <Text style={styles.statLabel}>Équipe</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formData.evenements}</Text>
                <Text style={styles.statLabel}>Événements</Text>
              </View>
            </View>

            <View style={styles.budgetProgress}>
              <Text style={styles.budgetTitle}>Progression du budget</Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${calculateBudgetProgress()}%` }
                  ]} 
                />
              </View>
              <Text style={styles.budgetText}>
                {formatNumber(formData.budgetUtilise)}€ sur {formatNumber(formData.budget)}€
              </Text>
            </View>

            <View style={styles.objectifsSection}>
              <Text style={styles.objectifsTitle}>Objectifs</Text>
              {formData.objectifs.map((objectif, index) => (
                <View key={index} style={styles.objectifItem}>
                  <View style={styles.objectifHeader}>
                    <Text style={styles.objectifName}>{objectif.nom}</Text>
                    <Text style={styles.objectifScore}>
                      {objectif.progres}/{objectif.total}
                    </Text>
                  </View>
                  <View style={styles.objectifProgressContainer}>
                    <View 
                      style={[
                        styles.objectifProgress, 
                        { width: `${(objectif.progres / objectif.total) * 100}%` }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          
          <FormField
            label="Nom de la campagne"
            value={formData.nom}
            onChangeText={(value) => updateFormData('nom', value)}
            editable={isEditing}
            required
            error={errors.nom}
            icon="flag"
          />

          {isEditing ? (
            <SelectField
              label="Candidat"
              value={formData.candidatId}
              options={candidats}
              onSelect={(value) => updateFormData('candidatId', value)}
              required
              error={errors.candidatId}
              icon="person"
            />
          ) : (
            <FormField
              label="Candidat"
              value={formData.candidatNom}
              onChangeText={() => {}}
              editable={false}
              icon="person"
            />
          )}

          {isEditing ? (
            <SelectField
              label="Élection"
              value={formData.electionId}
              options={elections}
              onSelect={(value) => updateFormData('electionId', value)}
              required
              error={errors.electionId}
              icon="ballot"
            />
          ) : (
            <FormField
              label="Élection"
              value={elections.find(e => e.value === formData.electionId)?.label || 'N/A'}
              onChangeText={() => {}}
              editable={false}
              icon="ballot"
            />
          )}

          {isEditing ? (
            <SelectField
              label="Statut"
              value={formData.statut}
              options={statuts}
              onSelect={(value) => updateFormData('statut', value)}
              icon="checkmark-circle"
            />
          ) : (
            <FormField
              label="Statut"
              value={getStatusLabel(formData.statut)}
              onChangeText={() => {}}
              editable={false}
              icon="checkmark-circle"
            />
          )}

          <FormField
            label="Description"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            multiline
            numberOfLines={3}
            editable={isEditing}
            icon="document-text"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget et ressources</Text>
          
          <FormField
            label="Budget (€)"
            value={isEditing ? formData.budget.toString() : formatNumber(formData.budget) + '€'}
            onChangeText={(value) => updateFormData('budget', parseInt(value) || 0)}
            keyboardType={isEditing ? "numeric" : "default"}
            editable={isEditing}
            required
            error={errors.budget}
            icon="wallet"
          />

          <FormField
            label="Budget utilisé (€)"
            value={isEditing ? formData.budgetUtilise.toString() : formatNumber(formData.budgetUtilise) + '€'}
            onChangeText={(value) => updateFormData('budgetUtilise', parseInt(value) || 0)}
            keyboardType={isEditing ? "numeric" : "default"}
            editable={isEditing}
            icon="card"
          />

          <FormField
            label="Nombre d'équipiers"
            value={formData.equipe.toString()}
            onChangeText={(value) => updateFormData('equipe', parseInt(value) || 0)}
            keyboardType={isEditing ? "numeric" : "default"}
            editable={isEditing}
            required
            error={errors.equipe}
            icon="people"
          />

          <FormField
            label="Nombre d'événements"
            value={formData.evenements.toString()}
            onChangeText={(value) => updateFormData('evenements', parseInt(value) || 0)}
            keyboardType={isEditing ? "numeric" : "default"}
            editable={isEditing}
            icon="calendar"
          />

          {isEditing ? (
            <SelectField
              label="Couleur thème"
              value={formData.couleurTheme}
              options={couleursTheme}
              onSelect={(value) => updateFormData('couleurTheme', value)}
              required
              error={errors.couleurTheme}
              icon="color-palette"
            />
          ) : (
            <FormField
              label="Couleur thème"
              value={couleursTheme.find(c => c.value === formData.couleurTheme)?.label || 'N/A'}
              onChangeText={() => {}}
              editable={false}
              icon="color-palette"
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Période</Text>
          
          <FormField
            label="Date de début"
            value={isEditing ? formData.dateDebut.split('T')[0] : formatDate(formData.dateDebut)}
            onChangeText={(value) => updateFormData('dateDebut', value)}
            editable={isEditing}
            required
            error={errors.dateDebut}
            icon="calendar"
          />

          <FormField
            label="Date de fin"
            value={isEditing ? formData.dateFin.split('T')[0] : formatDate(formData.dateFin)}
            onChangeText={(value) => updateFormData('dateFin', value)}
            editable={isEditing}
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
                editable={isEditing}
                icon="target"
              />

              <FormField
                label="Progrès"
                value={objectif.progres.toString()}
                onChangeText={(value) => updateFormData(`objectif_${index}_progres`, value)}
                keyboardType={isEditing ? "numeric" : "default"}
                editable={isEditing}
                icon="trending-up"
              />

              <FormField
                label="Objectif total"
                value={objectif.total.toString()}
                onChangeText={(value) => updateFormData(`objectif_${index}_total`, value)}
                keyboardType={isEditing ? "numeric" : "default"}
                editable={isEditing}
                icon="analytics"
              />
            </View>
          ))}
        </View>

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]} 
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={16} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  editButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  overviewSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  themeColor: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  candidatName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  budgetProgress: {
    marginBottom: 20,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E5E7',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#28A745',
    borderRadius: 4,
  },
  budgetText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  objectifsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    paddingTop: 16,
  },
  objectifsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  objectifItem: {
    marginBottom: 16,
  },
  objectifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  objectifName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  objectifScore: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  objectifProgressContainer: {
    height: 6,
    backgroundColor: '#E5E5E7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  objectifProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
});