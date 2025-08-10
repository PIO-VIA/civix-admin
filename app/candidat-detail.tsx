import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, SelectField } from '../components/crud/FormField';
import { mockCandidats } from '../mock-data';

export default function CandidatDetail() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    prenom: '',
    parti: '',
    age: 0,
    profession: '',
    email: '',
    telephone: '',
    programme: '',
    dateNaissance: '',
    lieuNaissance: '',
    biographie: '',
    reseauxSociaux: {
      twitter: '',
      facebook: '',
      instagram: ''
    },
    statut: 'EN_ATTENTE',
    votes: 0,
    pourcentage: 0,
    soutiens: 0,
    campagne: {
      budget: 0,
      meetings: 0,
      equipe: 0
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const candidat = mockCandidats.find(c => c.id === id);
    if (candidat) {
      setFormData(candidat);
    }
  }, [id]);

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

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    Alert.alert(
      'Succès',
      'Candidat modifié avec succès!',
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
      'Supprimer le candidat',
      'Êtes-vous sûr de vouloir supprimer ce candidat? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Succès', 'Candidat supprimé avec succès!', [
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALIDE': return '#28A745';
      case 'EN_ATTENTE': return '#FFC107';
      case 'REJETE': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'VALIDE': return 'Validé';
      case 'EN_ATTENTE': return 'En attente';
      case 'REJETE': return 'Rejeté';
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

  if (!formData.id) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Candidat non trouvé</Text>
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
          {isEditing ? 'Modifier Candidat' : 'Détail Candidat'}
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
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {formData.prenom.charAt(0)}{formData.nom.charAt(0)}
                  </Text>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {formData.prenom} {formData.nom}
                </Text>
                <Text style={styles.profileParti}>{formData.parti}</Text>
                <Text style={styles.profileProfession}>{formData.profession}</Text>
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
                <Text style={styles.statValue}>{formatNumber(formData.votes)}</Text>
                <Text style={styles.statLabel}>Votes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#28A745' }]}>{formData.pourcentage}%</Text>
                <Text style={styles.statLabel}>Score</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatNumber(formData.soutiens)}</Text>
                <Text style={styles.statLabel}>Soutiens</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formData.age} ans</Text>
                <Text style={styles.statLabel}>Âge</Text>
              </View>
            </View>

            <View style={styles.campaignStats}>
              <Text style={styles.campaignTitle}>Campagne</Text>
              <View style={styles.campaignRow}>
                <View style={styles.campaignItem}>
                  <Ionicons name="wallet" size={20} color="#007AFF" />
                  <Text style={styles.campaignValue}>{formatNumber(formData.campagne.budget)}€</Text>
                  <Text style={styles.campaignLabel}>Budget</Text>
                </View>
                <View style={styles.campaignItem}>
                  <Ionicons name="people" size={20} color="#28A745" />
                  <Text style={styles.campaignValue}>{formData.campagne.meetings}</Text>
                  <Text style={styles.campaignLabel}>Meetings</Text>
                </View>
                <View style={styles.campaignItem}>
                  <Ionicons name="person" size={20} color="#FFC107" />
                  <Text style={styles.campaignValue}>{formData.campagne.equipe}</Text>
                  <Text style={styles.campaignLabel}>Équipe</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          <FormField
            label="Prénom"
            value={formData.prenom}
            onChangeText={(value) => updateFormData('prenom', value)}
            editable={isEditing}
            required
            error={errors.prenom}
            icon="person"
          />
          
          <FormField
            label="Nom"
            value={formData.nom}
            onChangeText={(value) => updateFormData('nom', value)}
            editable={isEditing}
            required
            error={errors.nom}
            icon="person"
          />
          
          <FormField
            label="Date de naissance"
            value={isEditing ? formData.dateNaissance : formatDate(formData.dateNaissance)}
            onChangeText={(value) => updateFormData('dateNaissance', value)}
            editable={isEditing}
            required
            error={errors.dateNaissance}
            icon="calendar"
          />
          
          <FormField
            label="Lieu de naissance"
            value={formData.lieuNaissance}
            onChangeText={(value) => updateFormData('lieuNaissance', value)}
            editable={isEditing}
            required
            error={errors.lieuNaissance}
            icon="location"
          />
          
          <FormField
            label="Profession"
            value={formData.profession}
            onChangeText={(value) => updateFormData('profession', value)}
            editable={isEditing}
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
            keyboardType="email-address"
            editable={isEditing}
            required
            error={errors.email}
            icon="mail"
          />
          
          <FormField
            label="Téléphone"
            value={formData.telephone}
            onChangeText={(value) => updateFormData('telephone', value)}
            keyboardType="phone-pad"
            editable={isEditing}
            required
            error={errors.telephone}
            icon="call"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations politiques</Text>
          
          {isEditing ? (
            <SelectField
              label="Parti politique"
              value={formData.parti}
              options={partis}
              onSelect={(value) => updateFormData('parti', value)}
              required
              error={errors.parti}
              icon="flag"
            />
          ) : (
            <FormField
              label="Parti politique"
              value={formData.parti}
              onChangeText={() => {}}
              editable={false}
              icon="flag"
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
            label="Programme électoral"
            value={formData.programme}
            onChangeText={(value) => updateFormData('programme', value)}
            multiline
            numberOfLines={3}
            editable={isEditing}
            required
            error={errors.programme}
            icon="document-text"
          />
          
          <FormField
            label="Biographie"
            value={formData.biographie}
            onChangeText={(value) => updateFormData('biographie', value)}
            multiline
            numberOfLines={4}
            editable={isEditing}
            required
            error={errors.biographie}
            icon="book"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Réseaux sociaux</Text>
          
          <FormField
            label="Twitter"
            value={formData.reseauxSociaux.twitter}
            onChangeText={(value) => updateFormData('reseauxSociaux.twitter', value)}
            editable={isEditing}
            icon="logo-twitter"
          />
          
          <FormField
            label="Facebook"
            value={formData.reseauxSociaux.facebook}
            onChangeText={(value) => updateFormData('reseauxSociaux.facebook', value)}
            editable={isEditing}
            icon="logo-facebook"
          />
          
          <FormField
            label="Instagram"
            value={formData.reseauxSociaux.instagram}
            onChangeText={(value) => updateFormData('reseauxSociaux.instagram', value)}
            editable={isEditing}
            icon="logo-instagram"
          />
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
  profileSection: {
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  profileParti: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  profileProfession: {
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
  campaignStats: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    paddingTop: 16,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  campaignRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  campaignItem: {
    alignItems: 'center',
    flex: 1,
  },
  campaignValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
    marginBottom: 2,
  },
  campaignLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
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