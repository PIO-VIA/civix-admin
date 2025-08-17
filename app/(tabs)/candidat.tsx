import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { mockCandidats } from '@/mock-data/candidats';
import { CandidatDTO } from '@/lib/models/CandidatDTO';

export default function Candidat() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

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

    const CandidatCard = ({ candidat, index }: { candidat: CandidatDTO, index: number }) => {
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
                onPress={() => router.push(`/candidat-detail?id=${candidat.externalIdCandidat}`)}
            >
                <Animated.View style={[
                    styles.candidatCard,
                    { opacity: cardAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <View style={styles.candidatHeader}>
                        <Image source={{ uri: candidat.photo }} style={styles.candidatPhoto} />
                        <View style={styles.candidatInfo}>
                            <Text style={styles.candidatName}>{candidat.username}</Text>
                            <Text style={styles.candidatEmail}>{candidat.email}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
                    </View>
                    <Text style={styles.candidatDescription} numberOfLines={2}>
                        {candidat.description}
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="people-outline" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Candidats</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push('/candidat-form')}
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
                        <Text style={styles.statNumber}>{mockCandidats.length}</Text>
                        <Text style={styles.statLabel}>Candidats Inscrits</Text>
                    </View>
                </Animated.View>

                <Animated.View style={styles.candidatsSection}>
                    {mockCandidats.map((candidat, index) => (
                        <CandidatCard
                            key={candidat.externalIdCandidat}
                            candidat={candidat}
                            index={index}
                        />
                    ))}
                </Animated.View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
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
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    candidatsSection: {
        marginBottom: 20,
    },
    candidatCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    candidatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    candidatPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: '#E9E9E9',
    },
    candidatInfo: {
        flex: 1,
    },
    candidatName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    candidatEmail: {
        fontSize: 14,
        color: '#666',
    },
    candidatDescription: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});