import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ElecteurDTO } from '@/lib/models/ElecteurDTO';
import { useElecteurs } from '@/hooks/useElecteurs';

export default function Electeur() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const { electeurs, loading, error, refreshElecteurs } = useElecteurs();

    // Debug: Log des données reçues
    useEffect(() => {
        console.log('📊 Page Electeur - État actuel:');
        console.log('  - Loading:', loading);
        console.log('  - Error:', error);
        console.log('  - Électeurs reçus:', electeurs?.length || 0);
        console.log('  - Électeurs data:', electeurs);
    }, [electeurs, loading, error]);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    useEffect(() => {
        if (error) {
            Alert.alert('Erreur', error);
        }
    }, [error]);

    const electeursAyantVote = electeurs.filter(e => e.avote).length;

    const ElecteurCard = ({ electeur, index }: { electeur: ElecteurDTO, index: number }) => {
        const cardAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }).start();
        }, [cardAnim, index]);

        return (
            <TouchableOpacity onPress={() => router.push(`/electeur-detail?id=${electeur.externalIdElecteur}`)}>
                <Animated.View style={[styles.electeurCard, { opacity: cardAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.electeurInfo}>
                        <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
                        <View style={styles.electeurTextContainer}>
                            <Text style={styles.electeurName}>{electeur.username}</Text>
                            <Text style={styles.electeurEmail}>{electeur.email}</Text>
                        </View>
                    </View>
                    <View style={[styles.voteStatus, { backgroundColor: electeur.avote ? '#28A745' : '#6C757D' }]}>
                        <Ionicons name={electeur.avote ? "checkmark-circle" : "time-outline"} size={16} color="white" />
                        <Text style={styles.voteStatusText}>{electeur.avote ? 'A voté' : 'En attente'}</Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="people-outline" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Électeurs</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={refreshElecteurs}>
                    <Ionicons name="refresh" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/electeur-form')}>
                    <Ionicons name="add" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Animated.View style={[styles.statsSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{electeurs.length}</Text>
                        <Text style={styles.statLabel}>Total Inscrits</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#28A745' }]}>{electeursAyantVote}</Text>
                        <Text style={styles.statLabel}>Ont Voté</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#6C757D' }]}>{electeurs.length - electeursAyantVote}</Text>
                        <Text style={styles.statLabel}>En Attente</Text>
                    </View>
                </Animated.View>

                <Animated.View style={styles.electeursSection}>
                    <Text style={styles.sectionTitle}>Liste des Électeurs</Text>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007AFF" />
                            <Text style={styles.loadingText}>Chargement des électeurs...</Text>
                        </View>
                    ) : electeurs.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={48} color="#666" />
                            <Text style={styles.emptyText}>Aucun électeur trouvé</Text>
                        </View>
                    ) : (
                        electeurs.map((electeur, index) => (
                            <ElecteurCard key={electeur.externalIdElecteur} electeur={electeur} index={index} />
                        ))
                    )}
                </Animated.View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    header: {
        flexDirection: 'row', alignItems: 'center', padding: 20,
        backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E5E7',
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#000', marginLeft: 12, flex: 1 },
    refreshButton: { padding: 8, marginRight: 8 },
    addButton: { padding: 8 },
    content: { padding: 16 },
    statsSection: {
        flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24,
    },
    statCard: {
        backgroundColor: 'white', borderRadius: 12, padding: 16, alignItems: 'center',
        flex: 1, marginHorizontal: 4,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    },
    statNumber: { fontSize: 24, fontWeight: 'bold', color: '#007AFF', marginBottom: 4 },
    statLabel: { fontSize: 12, color: '#666', textAlign: 'center' },
    electeursSection: { marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '600', color: '#000', marginBottom: 16 },
    electeurCard: {
        backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08, shadowRadius: 5, elevation: 3,
    },
    electeurInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    electeurTextContainer: { marginLeft: 12, flex: 1 },
    electeurName: { fontSize: 16, fontWeight: '600', color: '#000' },
    electeurEmail: { fontSize: 14, color: '#666' },
    voteStatus: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10,
        borderRadius: 12,
    },
    voteStatusText: { color: 'white', fontSize: 12, fontWeight: '600', marginLeft: 6 },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});