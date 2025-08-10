import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, SelectField } from '../components/crud/FormField';
import { mockElections, mockResultats } from '../mock-data';

export default function ElectionDetail() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    statut: 'PROGRAMMEE',
    typeElection: '',
    nombreElecteurs: 0,
    tauxParticipation: 0,
    resultat: {
      totalVotes: 0,
      votesBlancs: 0,
      votesNuls: 0
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const election = mockElections.find(e => e.id === id);
    if (election) {
      setFormData({
        ...election,
        resultat: election.resultat || { totalVotes: 0, votesBlancs: 0, votesNuls: 0 }
      });
    }
  }, [id]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = 'Le nom de l\'élection est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.typeElection) newErrors.typeElection = 'Le type d\'élection est requis';
    if (!formData.dateDebut.trim()) newErrors.dateDebut = 'La date de début est requise';
    if (!formData.dateFin.trim()) newErrors.dateFin = 'La date de fin est requise';

    // Validation des dates
    if (formData.dateDebut && formData.dateFin) {
      const dateDebut = new Date(formData.dateDebut);
      const dateFin = new Date(formData.dateFin);
      
      if (dateFin <= dateDebut) {
        newErrors.dateFin = 'La date de fin doit être postérieure à celle de début';
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
      'Élection modifiée avec succès!',
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
      'Supprimer l\'élection',
      'Êtes-vous sûr de vouloir supprimer cette élection? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Succès', 'Élection supprimée avec succès!', [
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
    if (field.startsWith('resultat.')) {
      const resultField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        resultat: {
          ...prev.resultat,
          [resultField]: typeof value === 'string' ? parseInt(value) || 0 : value
        }
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
      case 'EN_COURS': return '#28A745';
      case 'PROGRAMMEE': return '#007AFF';
      case 'TERMINEE': return '#6C757D';
      case 'ANNULEE': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'EN_COURS': return 'En cours';
      case 'PROGRAMMEE': return 'Programmée';
      case 'TERMINEE': return 'Terminée';
      case 'ANNULEE': return 'Annulée';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    const typeObj = typesElection.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateVotesValides = () => {
    return formData.resultat.totalVotes - formData.resultat.votesBlancs - formData.resultat.votesNuls;
  };

  // Récupérer les résultats pour cette élection
  const resultatsElection = mockResultats.filter(r => r.electionId === formData.id);

  if (!formData.id) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Élection non trouvée</Text>
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
          {isEditing ? 'Modifier Élection' : 'Détail Élection'}
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
            <View style={styles.electionHeader}>
              <View style={styles.electionIcon}>
                <Ionicons name="ballot" size={32} color="#007AFF" />
              </View>
              <View style={styles.electionInfo}>
                <Text style={styles.electionName}>{formData.nom}</Text>
                <Text style={styles.electionType}>{getTypeLabel(formData.typeElection)}</Text>
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
                <Text style={styles.statValue}>{formatNumber(formData.nombreElecteurs)}</Text>
                <Text style={styles.statLabel}>Électeurs inscrits</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#28A745' }]}>
                  {formData.tauxParticipation}%
                </Text>
                <Text style={styles.statLabel}>Participation</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatNumber(formData.resultat.totalVotes)}</Text>
                <Text style={styles.statLabel}>Votes exprimés</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatNumber(calculateVotesValides())}</Text>
                <Text style={styles.statLabel}>Votes valides</Text>
              </View>
            </View>

            {formData.statut === 'TERMINEE' && resultatsElection.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.resultsTitle}>Résultats</Text>
                {resultatsElection.map((resultat, index) => (
                  <View key={resultat.candidatId} style={styles.resultItem}>
                    <View style={styles.candidatInfo}>
                      <Text style={styles.candidatNom}>{resultat.nom}</Text>
                      <Text style={styles.candidatScore}>
                        {formatNumber(resultat.votes)} votes ({resultat.pourcentage}%)
                      </Text>
                    </View>
                    <View style={styles.progressContainer}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { 
                            width: `${resultat.pourcentage}%`,
                            backgroundColor: index === 0 ? '#28A745' : index === 1 ? '#FFC107' : '#DC3545'
                          }
                        ]} 
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          
          <FormField
            label="Nom de l'élection"
            value={formData.nom}
            onChangeText={(value) => updateFormData('nom', value)}
            editable={isEditing}
            required
            error={errors.nom}
            icon="ballot"
          />

          {isEditing ? (
            <SelectField
              label="Type d'élection"
              value={formData.typeElection}
              options={typesElection}
              onSelect={(value) => updateFormData('typeElection', value)}
              required
              error={errors.typeElection}
              icon="library"
            />
          ) : (
            <FormField
              label="Type d'élection"
              value={getTypeLabel(formData.typeElection)}
              onChangeText={() => {}}
              editable={false}
              icon="library"
            />
          )}

          <FormField
            label="Description"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            multiline
            numberOfLines={3}
            editable={isEditing}
            required
            error={errors.description}
            icon="document-text"
          />

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
            label="Nombre d'électeurs inscrits"
            value={isEditing ? formData.nombreElecteurs.toString() : formatNumber(formData.nombreElecteurs)}
            onChangeText={(value) => updateFormData('nombreElecteurs', parseInt(value) || 0)}
            keyboardType={isEditing ? "numeric" : "default"}
            editable={isEditing}
            icon="people"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Période de vote</Text>
          
          <FormField
            label="Date et heure de début"
            value={isEditing ? formData.dateDebut.split('T')[0] : formatDate(formData.dateDebut)}
            onChangeText={(value) => updateFormData('dateDebut', value)}
            editable={isEditing}
            required
            error={errors.dateDebut}
            icon="calendar"
          />

          <FormField
            label="Date et heure de fin"
            value={isEditing ? formData.dateFin.split('T')[0] : formatDate(formData.dateFin)}
            onChangeText={(value) => updateFormData('dateFin', value)}
            editable={isEditing}
            required
            error={errors.dateFin}
            icon="calendar"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques de participation</Text>
          
          <FormField
            label="Taux de participation (%)"
            value={formData.tauxParticipation.toString()}
            onChangeText={(value) => updateFormData('tauxParticipation', parseFloat(value) || 0)}
            keyboardType={isEditing ? "numeric" : "default"}
            editable={isEditing}
            icon="analytics"
          />
        </View>

        {(formData.statut === 'TERMINEE' || formData.statut === 'EN_COURS') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Résultats du vote</Text>
            
            <FormField
              label="Total des votes"
              value={isEditing ? formData.resultat.totalVotes.toString() : formatNumber(formData.resultat.totalVotes)}
              onChangeText={(value) => updateFormData('resultat.totalVotes', value)}
              keyboardType={isEditing ? "numeric" : "default"}
              editable={isEditing}
              icon="archive"
            />

            <FormField
              label="Votes blancs"
              value={isEditing ? formData.resultat.votesBlancs.toString() : formatNumber(formData.resultat.votesBlancs)}
              onChangeText={(value) => updateFormData('resultat.votesBlancs', value)}
              keyboardType={isEditing ? "numeric" : "default"}
              editable={isEditing}
              icon="remove-circle"
            />

            <FormField
              label="Votes nuls"
              value={isEditing ? formData.resultat.votesNuls.toString() : formatNumber(formData.resultat.votesNuls)}
              onChangeText={(value) => updateFormData('resultat.votesNuls', value)}
              keyboardType={isEditing ? "numeric" : "default"}
              editable={isEditing}
              icon="close-circle"
            />

            {!isEditing && (
              <View style={styles.validVotesCard}>
                <Text style={styles.validVotesLabel}>Votes valides</Text>
                <Text style={styles.validVotesValue}>
                  {formatNumber(calculateVotesValides())}
                </Text>
              </View>
            )}
          </View>
        )}

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
  electionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  electionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  electionInfo: {
    flex: 1,
  },
  electionName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  electionType: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
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
  resultsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    paddingTop: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  resultItem: {
    marginBottom: 16,
  },
  candidatInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  candidatNom: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  candidatScore: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E5E5E7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
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
  validVotesCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  validVotesLabel: {
    fontSize: 14,
    color: '#28A745',
    fontWeight: '500',
    marginBottom: 4,
  },
  validVotesValue: {
    fontSize: 20,
    color: '#28A745',
    fontWeight: 'bold',
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