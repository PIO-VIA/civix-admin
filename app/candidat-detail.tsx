import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockCandidats } from '@/mock-data/candidats';
import { CandidatDTO } from '@/lib/models/CandidatDTO';

export default function CandidatDetail() {
    const { id } = useLocalSearchParams();
    const [candidat, setCandidat] = useState<CandidatDTO | null>(null);

    useEffect(() => {
        const foundCandidat = mockCandidats.find(c => c.externalIdCandidat === id);
        if (foundCandidat) {
            setCandidat(foundCandidat);
        } else {
            Alert.alert("Erreur", "Candidat non trouvé.", [{ text: "OK", onPress: () => router.back() }]);
        }
    }, [id]);

    const handleEdit = () => {
        router.push(`/candidat-form?id=${candidat?.externalIdCandidat}`);
    };

    const handleDelete = () => {
        Alert.alert(
            "Supprimer le candidat",
            `Êtes-vous sûr de vouloir supprimer "${candidat?.username}" ? Cette action est irréversible.`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Succès', 'Candidat supprimé (simulation)', [
                            { text: 'OK', onPress: () => router.back() }
                        ]);
                    }
                }
            ]
        );
    };

    if (!candidat) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{candidat.username}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Ionicons name="pencil" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    <Image source={{ uri: candidat.photo }} style={styles.profilePhoto} />
                    <Text style={styles.profileName}>{candidat.username}</Text>
                    <Text style={styles.profileEmail}>{candidat.email}</Text>
                    <Text style={styles.profileDescription}>{candidat.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Campagnes Associées</Text>
                    {candidat.campagnes && candidat.campagnes.length > 0 ? (
                        candidat.campagnes.map(campagne => (
                            <TouchableOpacity key={campagne.externalIdCampagne} style={styles.campagneCard}>
                                <Image source={{ uri: campagne.photo }} style={styles.campagnePhoto} />
                                <View style={styles.campagneInfo}>
                                    <Text style={styles.campagneDescription}>{campagne.description}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noCampagneText}>Aucune campagne associée à ce candidat.</Text>
                    )}
                </View>

                <View style={styles.dangerZone}>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color="#DC3545" />
                        <Text style={styles.deleteButtonText}>Supprimer le candidat</Text>
                    </TouchableOpacity>
                </View>
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
    editButton: { padding: 8, marginRight: -8 },
    content: { flex: 1, padding: 16 },
    profileSection: {
        backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16,
        alignItems: 'center',
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#007AFF',
    },
    profileName: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 4 },
    profileEmail: { fontSize: 16, color: '#666', marginBottom: 12 },
    profileDescription: { fontSize: 15, color: '#333', textAlign: 'center', lineHeight: 22 },
    section: {
        backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 16 },
    campagneCard: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: '#E5E5E7',
    },
    campagnePhoto: { width: 80, height: 40, borderRadius: 6, marginRight: 12, backgroundColor: '#E9E9E9' },
    campagneInfo: { flex: 1 },
    campagneDescription: { fontSize: 15, fontWeight: '500', color: '#333' },
    noCampagneText: { fontSize: 14, color: '#666', textAlign: 'center', paddingVertical: 16 },
    dangerZone: { marginTop: 16, marginBottom: 40 },
    deleteButton: {
        backgroundColor: '#FFF5F5', borderRadius: 12, padding: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    },
    deleteButtonText: { fontSize: 16, color: '#DC3545', fontWeight: '600', marginLeft: 8 },
});