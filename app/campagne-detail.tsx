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
        router.push(`/campagne-form?id=${campagne?.campagne?.externalIdCampagne}`);
    };

    const handleDelete = async () => {
        if (!campagne?.campagne?.externalIdCampagne) return;

        Alert.alert(
            "Supprimer la campagne",
            `Êtes-vous sûr de vouloir supprimer la campagne "${campagne?.campagne?.description}" ? Cette action est irréversible.`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const success = await supprimerCampagne(campagne.campagne.externalIdCampagne);
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
                <Text style={styles.headerTitle} numberOfLines={1}>{campagne.campagne?.description}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Ionicons name="pencil" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: campagne.campagne?.photo }} style={styles.bannerImage} />
                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description de la campagne</Text>
                        <Text style={styles.descriptionText}>{campagne.campagne?.description}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Candidat Associé</Text>
                        <TouchableOpacity 
                            style={styles.candidatCard} 
                            onPress={() => router.push(`/candidat-detail?id=${campagne.candidat?.externalIdCandidat}`)}
                        >
                            {campagne.candidat?.photo ? (
                                <Image source={{ uri: campagne.candidat.photo }} style={styles.candidatAvatar} />
                            ) : (
                                <Ionicons name="person-circle-outline" size={60} color="#007AFF" />
                            )}
                            <View style={styles.candidatInfo}>
                                <Text style={styles.candidatName}>{campagne.candidat?.username || 'Candidat inconnu'}</Text>
                                <Text style={styles.candidatEmail}>{campagne.candidat?.email}</Text>
                                {campagne.candidat?.description && (
                                    <Text style={styles.candidatDescription} numberOfLines={2}>{campagne.candidat.description}</Text>
                                )}
                                <Text style={styles.candidatLink}>Voir le profil complet</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
                        </TouchableOpacity>
                    </View>

                    {campagne.autresCampagnesCandidat && campagne.autresCampagnesCandidat.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Autres campagnes du candidat ({campagne.nombreCampagnesCandidat})</Text>
                            {campagne.autresCampagnesCandidat.slice(0, 3).map((autreCampagne, index) => (
                                <TouchableOpacity 
                                    key={index}
                                    style={styles.autreCampagneCard}
                                    onPress={() => router.push(`/campagne-detail?id=${autreCampagne.externalIdCampagne}`)}
                                >
                                    <Image source={{ uri: autreCampagne.photo }} style={styles.autreCampagneImage} />
                                    <View style={styles.autreCampagneInfo}>
                                        <Text style={styles.autreCampagneTitle} numberOfLines={2}>{autreCampagne.description}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                                </TouchableOpacity>
                            ))}
                            {campagne.nombreCampagnesCandidat && campagne.nombreCampagnesCandidat > 3 && (
                                <TouchableOpacity 
                                    style={styles.voirPlusButton}
                                    onPress={() => router.push(`/candidat-detail?id=${campagne.candidat?.externalIdCandidat}`)}
                                >
                                    <Text style={styles.voirPlusText}>Voir toutes les campagnes ({campagne.nombreCampagnesCandidat})</Text>
                                    <Ionicons name="arrow-forward" size={16} color="#007AFF" />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

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
    candidatEmail: { fontSize: 14, color: '#666', marginTop: 2 },
    candidatDescription: { fontSize: 14, color: '#333', marginTop: 4, lineHeight: 18 },
    candidatLink: { fontSize: 14, color: '#007AFF', marginTop: 6 },
    candidatAvatar: { 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        backgroundColor: '#f0f0f0' 
    },
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
    autreCampagneCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E5E7',
    },
    autreCampagneImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    autreCampagneInfo: {
        flex: 1,
        marginLeft: 12,
    },
    autreCampagneTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
        lineHeight: 18,
    },
    voirPlusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    voirPlusText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
        marginRight: 4,
    },
});