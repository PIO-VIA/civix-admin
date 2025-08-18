import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CandidatDetailDTO } from '@/lib/models/CandidatDetailDTO';
import { useCandidats } from '@/hooks/useCandidats';

export default function CandidatDetail() {
    const { id } = useLocalSearchParams();
    const [candidat, setCandidat] = useState<CandidatDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const { obtenirCandidat, supprimerCandidat } = useCandidats();

    useEffect(() => {
        const loadCandidat = async () => {
            if (!id || typeof id !== 'string') {
                Alert.alert("Erreur", "ID de candidat invalide.", [{ text: "OK", onPress: () => router.back() }]);
                return;
            }

            try {
                setLoading(true);
                const candidatData = await obtenirCandidat(id);
                console.log('📊 Données candidat récupérées:', JSON.stringify(candidatData, null, 2));
                if (candidatData) {
                    setCandidat(candidatData);
                } else {
                    Alert.alert("Erreur", "Candidat non trouvé.", [{ text: "OK", onPress: () => router.back() }]);
                }
            } catch (error) {
                console.error('Erreur lors du chargement du candidat:', error);
                Alert.alert("Erreur", "Impossible de charger le candidat.", [{ text: "OK", onPress: () => router.back() }]);
            } finally {
                setLoading(false);
            }
        };

        loadCandidat();
    }, [id, obtenirCandidat]);

    const handleEdit = () => {
        const candidatInfo = candidat?.candidat || candidat;
        router.push(`/candidat-form?id=${candidatInfo?.externalIdCandidat}`);
    };

    const handleDelete = async () => {
        const candidatInfo = candidat?.candidat || candidat;
        if (!candidatInfo?.externalIdCandidat) return;

        Alert.alert(
            "Supprimer le candidat",
            `Êtes-vous sûr de vouloir supprimer "${candidatInfo?.username}" ? Cette action est irréversible.`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const candidatInfo = candidat?.candidat || candidat;
                            const success = await supprimerCandidat(candidatInfo.externalIdCandidat);
                            if (success) {
                                Alert.alert('Succès', 'Candidat supprimé avec succès', [
                                    { text: 'OK', onPress: () => router.back() }
                                ]);
                            } else {
                                Alert.alert('Erreur', 'Impossible de supprimer le candidat');
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
                <Text style={styles.loadingText}>Chargement du candidat...</Text>
            </View>
        );
    }

    if (!candidat) {
        console.log('❌ Aucun candidat à afficher');
        return (
            <View style={[styles.container, styles.centered]}>
                <Ionicons name="alert-circle-outline" size={64} color="#CCC" />
                <Text style={styles.errorText}>Candidat non trouvé</Text>
                <TouchableOpacity style={styles.backToListButton} onPress={() => router.back()}>
                    <Text style={styles.backToListText}>Retour à la liste</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Gestion flexible des données - soit candidat.candidat soit directement candidat
    const candidatInfo = candidat.candidat || candidat;
    const campagnes = candidat.campagnes || [];
    const nombreVotes = candidat.nombreVotes || 0;

    console.log('✅ Affichage du candidat:', {
        candidat: candidatInfo?.username,
        campagnes: campagnes?.length,
        nombreVotes: nombreVotes
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{candidatInfo?.username || 'Candidat'}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Ionicons name="pencil" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    {candidatInfo?.photo ? (
                        <Image source={{ uri: candidatInfo.photo }} style={styles.profilePhoto} />
                    ) : (
                        <View style={[styles.profilePhoto, styles.defaultAvatar]}>
                            <Ionicons name="person" size={50} color="#666" />
                        </View>
                    )}
                    <Text style={styles.profileName}>{candidatInfo?.username || 'Nom non disponible'}</Text>
                    {candidatInfo?.email && (
                        <Text style={styles.profileEmail}>{candidatInfo.email}</Text>
                    )}
                    {candidatInfo?.description && (
                        <Text style={styles.profileDescription}>{candidatInfo.description}</Text>
                    )}
                    {nombreVotes > 0 && (
                        <View style={styles.statsSection}>
                            <View style={styles.statItem}>
                                <Ionicons name="thumbs-up" size={20} color="#007AFF" />
                                <Text style={styles.statText}>{nombreVotes} votes reçus</Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Campagnes Associées ({campagnes?.length || 0})</Text>
                    {campagnes && campagnes.length > 0 ? (
                        campagnes.map((campagne, index) => (
                            <TouchableOpacity 
                                key={campagne.externalIdCampagne || index} 
                                style={styles.campagneCard}
                                onPress={() => router.push(`/campagne-detail?id=${campagne.externalIdCampagne}`)}
                            >
                                {campagne.photo ? (
                                    <Image source={{ uri: campagne.photo }} style={styles.campagnePhoto} />
                                ) : (
                                    <View style={[styles.campagnePhoto, styles.defaultCampagnePhoto]}>
                                        <Ionicons name="megaphone" size={20} color="#666" />
                                    </View>
                                )}
                                <View style={styles.campagneInfo}>
                                    <Text style={styles.campagneDescription} numberOfLines={2}>
                                        {campagne.description || 'Description non disponible'}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyCampagnesContainer}>
                            <Ionicons name="megaphone-outline" size={48} color="#CCC" />
                            <Text style={styles.noCampagneText}>Aucune campagne associée à ce candidat.</Text>
                        </View>
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
    defaultAvatar: { 
        backgroundColor: '#F0F0F0', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    statsSection: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E7',
        width: '100%',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statText: {
        fontSize: 14,
        color: '#007AFF',
        marginLeft: 8,
        fontWeight: '500',
    },
    section: {
        backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 16 },
    campagneCard: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: '#E5E5E7',
    },
    campagnePhoto: { width: 80, height: 40, borderRadius: 6, marginRight: 12, backgroundColor: '#E9E9E9' },
    defaultCampagnePhoto: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    campagneInfo: { flex: 1 },
    campagneDescription: { fontSize: 15, fontWeight: '500', color: '#333', lineHeight: 20 },
    emptyCampagnesContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    noCampagneText: { 
        fontSize: 14, 
        color: '#666', 
        textAlign: 'center', 
        marginTop: 12,
        lineHeight: 20
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
});