import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockElections } from '@/mock-data/elections';
import { ElectionDTO } from '@/lib/models/ElectionDTO';

// Helper functions
const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const getStatusColor = (status?: ElectionDTO.statut) => {
    switch (status) {
        case ElectionDTO.statut.EN_COURS:
            return '#28A745'; // Green
        case ElectionDTO.statut.PLANIFIEE:
            return '#FFC107'; // Yellow
        case ElectionDTO.statut.TERMINEE:
            return '#6c757d'; // Gray
        case ElectionDTO.statut.ANNULEE:
            return '#DC3545'; // Red
        default:
            return '#007AFF'; // Blue
    }
};

const formatNumber = (num?: number) => {
    if (num === undefined) return '0';
    return new Intl.NumberFormat('fr-FR').format(num);
};

export default function ElectionDetail() {
    const { id } = useLocalSearchParams();
    const [election, setElection] = useState<ElectionDTO | null>(null);

    useEffect(() => {
        const foundElection = mockElections.find(e => e.externalIdElection === id);
        if (foundElection) {
            setElection(foundElection);
        } else {
            Alert.alert("Erreur", "Élection non trouvée.", [{ text: "OK", onPress: () => router.back() }]);
        }
    }, [id]);

    const handleEdit = () => {
        router.push(`/election-form?id=${election?.externalIdElection}`);
    };

    const handleDelete = () => {
        Alert.alert(
            "Supprimer l'élection",
            `Êtes-vous sûr de vouloir supprimer l'élection "${election?.titre}" ? Cette action est irréversible.`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        // Here you would typically call an API to delete the election
                        // For now, we'll just navigate back
                        Alert.alert('Succès', 'Élection supprimée (simulation)', [
                            { text: 'OK', onPress: () => router.back() }
                        ]);
                    }
                }
            ]
        );
    };

    if (!election) {
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
                <Text style={styles.headerTitle} numberOfLines={1}>{election.titre}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Ionicons name="pencil" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.overviewSection}>
                    <View style={styles.electionHeader}>
                        <View style={styles.electionIcon}>
                            <Ionicons name="ballot" size={32} color="#007AFF" />
                        </View>
                        <View style={styles.electionInfo}>
                            <Text style={styles.electionName}>{election.titre}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(election.statut) }]}>
                                <Text style={styles.statusText}>{election.statut || 'N/A'}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.description}>{election.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations Clés</Text>
                    <InfoRow icon="people-outline" label="Électeurs inscrits" value={formatNumber(election.nombreElecteursInscrits)} />
                    <InfoRow icon="person-outline" label="Administrateur" value={election.administrateurNom || 'N/A'} />
                    <InfoRow icon="stats-chart-outline" label="Nombre de votes" value={formatNumber(election.nombreVotes)} />
                    <InfoRow icon="options-outline" label="Vote multiple" value={election.autoriserVoteMultiple ? `Oui (${election.nombreMaxVotesParElecteur} max)` : 'Non'} />
                    <InfoRow icon="eye-outline" label="Résultats visibles" value={election.resultatsVisibles ? 'Oui' : 'Non'} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dates importantes</Text>
                    <InfoRow icon="calendar-outline" label="Début du vote" value={formatDate(election.dateDebut)} />
                    <InfoRow icon="calendar-outline" label="Fin du vote" value={formatDate(election.dateFin)} />
                    <InfoRow icon="shield-checkmark-outline" label="Début de validité" value={formatDate(election.dateDebutValidite)} />
                    <InfoRow icon="shield-checkmark-outline" label="Fin de validité" value={formatDate(election.dateFinValidite)} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Métadonnées</Text>
                    <InfoRow icon="create-outline" label="Date de création" value={formatDate(election.dateCreation)} />
                    <InfoRow icon="refresh-outline" label="Dernière modification" value={formatDate(election.dateModification)} />
                </View>

                <View style={styles.dangerZone}>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color="#DC3545" />
                        <Text style={styles.deleteButtonText}>Supprimer l&apos;élection</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const InfoRow = ({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap, label: string, value: string }) => (
    <View style={styles.infoRow}>
        <Ionicons name={icon} size={20} color="#666" style={styles.infoIcon} />
        <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

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
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E7',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 8,
    },
    editButton: {
        padding: 8,
        marginRight: -8,
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
    },
    electionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
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
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E7',
    },
    infoIcon: {
        marginRight: 16,
        marginTop: 2,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    dangerZone: {
        marginTop: 16,
        marginBottom: 40,
    },
    deleteButton: {
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonText: {
        fontSize: 16,
        color: '#DC3545',
        fontWeight: '600',
        marginLeft: 8,
    },
});