import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockElecteurs } from '@/mock-data/electeurs';
import { ElecteurDTO } from '@/lib/models/ElecteurDTO';

export default function ElecteurDetail() {
    const { id } = useLocalSearchParams();
    const [electeur, setElecteur] = useState<ElecteurDTO | null>(null);

    useEffect(() => {
        const foundElecteur = mockElecteurs.find(e => e.externalIdElecteur === id);
        if (foundElecteur) {
            setElecteur(foundElecteur);
        } else {
            Alert.alert("Erreur", "Électeur non trouvé.", [{ text: "OK", onPress: () => router.back() }]);
        }
    }, [id]);

    const handleEdit = () => {
        router.push(`/electeur-form?id=${electeur?.externalIdElecteur}`);
    };

    const handleDelete = () => {
        Alert.alert(
            "Supprimer l'électeur",
            `Êtes-vous sûr de vouloir supprimer "${electeur?.username}" ? Cette action est irréversible.`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Succès', 'Électeur supprimé (simulation)', [
                            { text: 'OK', onPress: () => router.back() }
                        ]);
                    }
                }
            ]
        );
    };

    if (!electeur) {
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
                <Text style={styles.headerTitle} numberOfLines={1}>{electeur.username}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Ionicons name="pencil" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.profileSection}>
                    <View style={styles.profileHeader}>
                        <View style={[
                            styles.avatar,
                            { backgroundColor: electeur.avote ? '#E8F5E8' : '#F5F5F5' }
                        ]}>
                            <Text style={[
                                styles.avatarText,
                                { color: electeur.avote ? '#28A745' : '#6C757D' }
                            ]}>
                                {electeur.username?.charAt(0)}
                            </Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>
                                {electeur.username}
                            </Text>
                            <Text style={styles.profileEmail}>{electeur.email}</Text>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: electeur.avote ? '#28A745' : '#6C757D' }
                            ]}>
                                <Text style={styles.statusText}>{electeur.avote ? 'A voté' : 'En attente'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informations de l'Électeur</Text>
                    <InfoRow icon="person-outline" label="Nom d'utilisateur" value={electeur.username || 'N/A'} />
                    <InfoRow icon="mail-outline" label="Email" value={electeur.email || 'N/A'} />
                    <InfoRow icon="finger-print-outline" label="Empreinte Digitale" value={electeur.empreinteDigitale || 'N/A'} />
                </View>

                <View style={styles.dangerZone}>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color="#DC3545" />
                        <Text style={styles.deleteButtonText}>Supprimer l'électeur</Text>
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
    profileSection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
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
    profileEmail: {
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