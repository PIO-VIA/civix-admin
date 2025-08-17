import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockCampagnes } from '@/mock-data/campagnes';
import { CampagneDTO } from '@/lib/models/CampagneDTO';

export default function CampagneDetail() {
    const { id } = useLocalSearchParams();
    const [campagne, setCampagne] = useState<CampagneDTO | null>(null);

    useEffect(() => {
        const foundCampagne = mockCampagnes.find(c => c.externalIdCampagne === id);
        if (foundCampagne) {
            setCampagne(foundCampagne);
        } else {
            Alert.alert("Erreur", "Campagne non trouvée.", [{ text: "OK", onPress: () => router.back() }]);
        }
    }, [id]);

    const handleEdit = () => {
        router.push(`/campagne-form?id=${campagne?.externalIdCampagne}`);
    };

    const handleDelete = () => {
        Alert.alert(
            "Supprimer la campagne",
            `Êtes-vous sûr de vouloir supprimer la campagne "${campagne?.description}" ? Cette action est irréversible.`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Succès', 'Campagne supprimée (simulation)', [
                            { text: 'OK', onPress: () => router.back() }
                        ]);
                    }
                }
            ]
        );
    };

    if (!campagne) {
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
                <Text style={styles.headerTitle} numberOfLines={1}>{campagne.description}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Ionicons name="pencil" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: campagne.photo }} style={styles.bannerImage} />
                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>{campagne.description}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Candidat Associé</Text>
                        <TouchableOpacity 
                            style={styles.candidatCard} 
                            onPress={() => router.push(`/candidat-detail?id=${campagne.candidat?.externalIdCandidat}`)}
                        >
                            <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
                            <View style={styles.candidatInfo}>
                                <Text style={styles.candidatName}>{campagne.candidat?.username}</Text>
                                <Text style={styles.candidatLink}>Voir le profil</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dangerZone}>
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={20} color="#DC3545" />
                            <Text style={styles.deleteButtonText}>Supprimer la campagne</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 12, paddingHorizontal: 16, backgroundColor: 'white',
        borderBottomWidth: 1, borderBottomColor: '#E5E5E7',
    },
    backButton: { padding: 8, marginLeft: -8 },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#000', flex: 1, textAlign: 'center', marginHorizontal: 8 },
    editButton: { padding: 8, marginRight: -8 },
    scrollContainer: { flex: 1 },
    bannerImage: { width: '100%', height: 200 },
    content: { padding: 16 },
    section: {
        backgroundColor: '#F2F2F7', borderRadius: 12, padding: 20, marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 12 },
    descriptionText: { fontSize: 16, color: '#333', lineHeight: 24 },
    candidatCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
        padding: 16, borderRadius: 10, 
    },
    candidatInfo: { flex: 1, marginLeft: 16 },
    candidatName: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    candidatLink: { fontSize: 14, color: '#007AFF', marginTop: 4 },
    dangerZone: { marginTop: 16, marginBottom: 40 },
    deleteButton: {
        backgroundColor: '#FFF5F5', borderRadius: 12, padding: 16,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    },
    deleteButtonText: { fontSize: 16, color: '#DC3545', fontWeight: '600', marginLeft: 8 },
});