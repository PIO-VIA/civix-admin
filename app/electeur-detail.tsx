import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField, SelectField } from '../components/crud/FormField';
import { mockElecteurs } from '../mock-data';

export default function ElecteurDetail() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
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
    statut: 'ACTIF',
    nombreVotes: 0,
    dernierVote: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const electeur = mockElecteurs.find(e => e.id === id);
    if (electeur) {
      setFormData(electeur);
    }
  }, [id]);

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

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    Alert.alert(
      'Succès',
      'Électeur modifié avec succès!',
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
      'Supprimer l\'électeur',
      'Êtes-vous sûr de vouloir supprimer cet électeur? Cette action est irréversible.',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Succès', 'Électeur supprimé avec succès!', [
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
    return status === 'ACTIF' ? '#28A745' : '#DC3545';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (!formData.id) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Électeur non trouvé</Text>
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
          {isEditing ? 'Modifier Électeur' : 'Détail Électeur'}
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
              <View style={[
                styles.avatar,
                { backgroundColor: formData.statut === 'ACTIF' ? '#E8F5E8' : '#F5F5F5' }
              ]}>
                <Text style={[
                  styles.avatarText,
                  { color: getStatusColor(formData.statut) }
                ]}>
                  {formData.prenom.charAt(0)}{formData.nom.charAt(0)}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {formData.prenom} {formData.nom}
                </Text>
                <Text style={styles.profileProfession}>{formData.profession}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(formData.statut) }
                ]}>
                  <Text style={styles.statusText}>{formData.statut}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formData.nombreVotes}</Text>
                <Text style={styles.statLabel}>Votes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formData.dernierVote ? formatDate(formData.dernierVote) : 'Jamais'}
                </Text>
                <Text style={styles.statLabel}>Dernier vote</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[
                  styles.statValue,
                  { color: formData.genre === 'F' ? '#FF6B9D' : '#4A90E2' }
                ]}>
                  {formData.genre === 'F' ? 'F' : 'H'}
                </Text>
                <Text style={styles.statLabel}>Genre</Text>
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

          {isEditing ? (
            <SelectField
              label="Genre"
              value={formData.genre}
              options={genres}
              onSelect={(value) => updateFormData('genre', value)}
              required
              error={errors.genre}
              icon="male-female"
            />
          ) : (
            <FormField
              label="Genre"
              value={formData.genre === 'F' ? 'Femme' : 'Homme'}
              onChangeText={() => {}}
              editable={false}
              icon="male-female"
            />
          )}
          
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
          <Text style={styles.sectionTitle}>Adresse</Text>
          
          <FormField
            label="Rue"
            value={formData.adresse.rue}
            onChangeText={(value) => updateFormData('adresse.rue', value)}
            editable={isEditing}
            required
            error={errors['adresse.rue']}
            icon="home"
          />
          
          <FormField
            label="Ville"
            value={formData.adresse.ville}
            onChangeText={(value) => updateFormData('adresse.ville', value)}
            editable={isEditing}
            required
            error={errors['adresse.ville']}
            icon="location"
          />
          
          <FormField
            label="Code postal"
            value={formData.adresse.codePostal}
            onChangeText={(value) => updateFormData('adresse.codePostal', value)}
            keyboardType="numeric"
            editable={isEditing}
            required
            error={errors['adresse.codePostal']}
            icon="pin"
          />

          {isEditing ? (
            <SelectField
              label="Département"
              value={formData.adresse.departement}
              options={departements}
              onSelect={(value) => updateFormData('adresse.departement', value)}
              required
              error={errors['adresse.departement']}
              icon="map"
            />
          ) : (
            <FormField
              label="Département"
              value={formData.adresse.departement}
              onChangeText={() => {}}
              editable={false}
              icon="map"
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de vote</Text>
          
          <FormField
            label="Bureau de vote"
            value={formData.bureauVote}
            onChangeText={(value) => updateFormData('bureauVote', value)}
            editable={isEditing}
            error={errors.bureauVote}
            icon="business"
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
              value={formData.statut}
              onChangeText={() => {}}
              editable={false}
              icon="checkmark-circle"
            />
          )}
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
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
  statsRow: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E7',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
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