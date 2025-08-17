import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, Image, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CampagneDTO } from '@/lib/models/CampagneDTO';
import { useCampagnes } from '@/hooks/useCampagnes';

export default function Campagne() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const { campagnes, statistiques, loading, error, refreshCampagnes } = useCampagnes();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    useEffect(() => {
        if (error) {
            Alert.alert("Erreur", error);
        }
    }, [error]);

    const CampagneCard = ({ campagne, index }: { campagne: CampagneDTO, index: number }) => {
        const cardAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 600,
                delay: index * 150,
                useNativeDriver: true,
            }).start();
        }, [cardAnim, index]);

        return (
            <TouchableOpacity
                onPress={() => router.push(`/campagne-detail?id=${campagne.externalIdCampagne}`)}
            >
                <Animated.View style={[
                    styles.campagneCard,
                    { opacity: cardAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <Image source={{ uri: campagne.photo }} style={styles.campagnePhoto} />
                    <View style={styles.cardOverlay} />
                    <View style={styles.cardContent}>
                        <Text style={styles.campagneDescription}>{campagne.description}</Text>
                        <View style={styles.candidatInfo}>
                            <Ionicons name="person-circle-outline" size={16} color="#FFF" />
                            <Text style={styles.candidatName}>{campagne.candidat?.username}</Text>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="megaphone-outline" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Campagnes</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/campagne-form')}
                >
                    <Ionicons name="add" size={28} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Animated.View style={[
                    styles.statsSection,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {loading ? '...' : statistiques?.nombreCampagnes || campagnes.length}
                        </Text>
                        <Text style={styles.statLabel}>Campagnes en cours</Text>
                    </View>
                </Animated.View>

                <Animated.View style={styles.campagnesSection}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007AFF" />
                            <Text style={styles.loadingText}>Chargement des campagnes...</Text>
                        </View>
                    ) : campagnes.length > 0 ? (
                        campagnes.map((campagne, index) => (
                            <CampagneCard
                                key={campagne.externalIdCampagne}
                                campagne={campagne}
                                index={index}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="megaphone-outline" size={64} color="#CCC" />
                            <Text style={styles.emptyText}>Aucune campagne disponible</Text>
                            <TouchableOpacity 
                                style={styles.emptyButton}
                                onPress={() => router.push('/campagne-form')}
                            >
                                <Text style={styles.emptyButtonText}>Créer une campagne</Text>
                            </TouchableOpacity>
                        </View>
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
    addButton: { padding: 8 },
    content: { padding: 16 },
    statsSection: { marginBottom: 24 },
    statCard: {
        backgroundColor: 'white', borderRadius: 12, padding: 20, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    },
    statNumber: { fontSize: 28, fontWeight: 'bold', color: '#007AFF' },
    statLabel: { fontSize: 14, color: '#666', marginTop: 4 },
    campagnesSection: { marginBottom: 20 },
    campagneCard: {
        height: 150, borderRadius: 12, marginBottom: 16, overflow: 'hidden',
        justifyContent: 'flex-end', backgroundColor: '#000',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 5, elevation: 4,
    },
    campagnePhoto: {
        ...StyleSheet.absoluteFillObject,
        width: '100%', height: '100%',
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    cardContent: { padding: 16 },
    campagneDescription: {
        fontSize: 20, fontWeight: 'bold', color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        marginBottom: 8,
    },
    candidatInfo: { flexDirection: 'row', alignItems: 'center' },
    candidatName: {
        fontSize: 14, fontWeight: '600', color: '#FFF',
        marginLeft: 8,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: 'white',
        borderRadius: 12,
        marginVertical: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    emptyButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});