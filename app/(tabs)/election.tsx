import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert, Image, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ConfirmModal } from '@/components/crud/ConfirmModal';
import { ElectionDTO } from '@/lib/models/ElectionDTO';
import { useElections } from '@/hooks/useElections';

// Helper functions
const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getStatusColor = (status: ElectionDTO.statut | undefined) => {
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

const formatNumber = (num: number | undefined) => {
    if (num === undefined) return '0';
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
};

type ModalType = 'delete' | null;

export default function Election() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const { elections, loading, supprimerElection } = useElections();
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedElection, setSelectedElection] = useState<ElectionDTO | null>(null);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const openModal = (type: ModalType, election: ElectionDTO | null = null) => {
        setModalType(type);
        if (election) {
            setSelectedElection(election);
        }
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedElection(null);
    };

    const confirmDelete = async () => {
        if (selectedElection) {
            console.log('🗑️ Suppression élection depuis la liste, ID:', selectedElection.externalIdElection);
            const success = await supprimerElection(selectedElection.externalIdElection || '');
            if (success) {
                Alert.alert('Succès', 'Élection supprimée avec succès!');
            } else {
                Alert.alert('Erreur', 'Impossible de supprimer l\'élection');
            }
            closeModal();
        }
    };

    const ElectionCard = ({ election, index }: { election: ElectionDTO, index: number }) => {
        const cardAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 150,
                useNativeDriver: true,
            }).start();
        }, [cardAnim, index]);

        return (
            <TouchableOpacity
                onPress={() => router.push(`/election-detail?id=${election.externalIdElection}`)}
            >
                <Animated.View style={[
                    styles.electionCard,
                    {
                        opacity: cardAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                    <Image source={{ uri: election.photo }} style={styles.electionPhoto} />
                    <View style={styles.cardOverlay} />
                    <View style={styles.cardHeader}>
                        <View style={styles.electionInfo}>
                            <Text style={styles.electionTitle}>{election.titre}</Text>
                            <Text style={styles.electionDescription}>{election.description}</Text>
                        </View>
                        {election.statut &&
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(election.statut) }
                            ]}>
                                <Text style={styles.statusText}>{election.statut}</Text>
                            </View>
                        }
                    </View>

                    <View style={styles.cardActions}>
                        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => openModal('delete', election)}>
                            <Ionicons name="trash" size={16} color="#FFF" />
                            <Text style={[styles.actionText, styles.deleteText]}>Supprimer</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Chargement des élections...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="ballot" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Élections</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/election-form')}>
                    <Ionicons name="add" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Animated.View style={[
                    styles.statsSection,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{elections.length}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#28A745' }]}>
                            {elections.filter(e => e.statut === ElectionDTO.statut.EN_COURS).length}
                        </Text>
                        <Text style={styles.statLabel}>En cours</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#FFC107' }]}>
                            {elections.filter(e => e.statut === ElectionDTO.statut.PLANIFIEE).length}
                        </Text>
                        <Text style={styles.statLabel}>Planifiées</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.electionsSection,
                    { opacity: fadeAnim }
                ]}>
                    <Text style={styles.sectionTitle}>Élections Récentes</Text>
                    {elections.map((election, index) => (
                        <ElectionCard
                            key={election.externalIdElection}
                            election={election}
                            index={index}
                        />
                    ))}
                </Animated.View>
            </View>

            <ConfirmModal
                visible={modalType === 'delete'}
                title="Supprimer l'élection"
                message={`Êtes-vous sûr de vouloir supprimer l'élection "${selectedElection?.titre}" ? Cette action est irréversible.`}
                onConfirm={confirmDelete}
                onCancel={closeModal}
                confirmText="Supprimer"
                type="danger"
            />
        </ScrollView>
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
        padding: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E7',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 12,
        flex: 1,
    },
    addButton: {
        padding: 8,
    },
    content: {
        padding: 16,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        minWidth: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    electionsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    electionCard: {
        height: 180,
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        justifyContent: 'space-between',
        backgroundColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
        padding: 16,
    },
    electionPhoto: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    electionInfo: {
        flex: 1,
        marginRight: 12,
    },
    electionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        marginBottom: 4,
    },
    electionDescription: {
        fontSize: 14,
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        lineHeight: 20,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '600',
    },
    cardActions: {
        flexDirection: 'row',
        gap: 8,
        alignSelf: 'flex-end',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    deleteButton: {
        backgroundColor: 'rgba(220, 53, 69, 0.5)',
    },
    actionText: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '500',
        marginLeft: 4,
    },
    deleteText: {
        color: '#FFF',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
});