import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CampagneDetailDTO } from '@/lib/models/CampagneDetailDTO';
import { useCampagnes } from '@/hooks/useCampagnes';

export default function CampagneDetail() {
    const { id } = useLocalSearchParams();
    const [campagne, setCampagne] = useState<CampagneDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const { obtenirCampagne, supprimerCampagne } = useCampagnes();

    useEffect(() => {
        const loadCampagne = async () => {
            if (!id || typeof id !== 'string') {
                Alert.alert("Erreur", "ID de campagne invalide.", [{ text: "OK", onPress: () => router.back() }]);
                return;
            }

            try {
                setLoading(true);
                const campagneData = await obtenirCampagne(id);
                if (campagneData) {
                    setCampagne(campagneData);
                } else {
                    Alert.alert("Erreur", "Campagne non trouvée.", [{ text: "OK", onPress: () => router.back() }]);
                }
            } catch (error) {
                console.error('Erreur lors du chargement de la campagne:', error);
                Alert.alert("Erreur", "Impossible de charger la campagne.", [{ text: "OK", onPress: () => router.back() }]);
            } finally {
                setLoading(false);
            }
        };

        loadCampagne();
    }, [id, obtenirCampagne]);

    const handleEdit = () => {
        router.push(`/campagne-form?id=${campagne?.externalIdCampagne}`);
    };

    const handleDelete = async () => {
        if (!campagne?.externalIdCampagne) return;

        Alert.alert(
            "Supprimer la campagne",
            `Êtes-vous sûr de vouloir supprimer la campagne "${campagne?.description}" ? Cette action est irréversible.`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const success = await supprimerCampagne(campagne.externalIdCampagne);
                            if (success) {
                                Alert.alert('Succès', 'Campagne supprimée avec succès', [
                                    { text: 'OK', onPress: () => router.back() }
                                ]);
                            } else {
                                Alert.alert('Erreur', 'Impossible de supprimer la campagne');
                            }
                        } catch (error) {
                            console.error('Erreur lors de la suppression:', error);
                            Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Chargement de la campagne...</Text>
            </View>
        );
    }

    if (!campagne) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Ionicons name="alert-circle-outline" size={64} color="#CCC" />
                <Text style={styles.errorText}>Campagne non trouvée</Text>
                <TouchableOpacity style={styles.backToListButton} onPress={() => router.back()}>
                    <Text style={styles.backToListText}>Retour à la liste</Text>
                </TouchableOpacity>
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
                                <Text style={styles.candidatName}>{campagne.candidat?.username || 'Candidat inconnu'}</Text>
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
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    backToListButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backToListText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});