import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { mockCandidats, mockStatistiquesCandidat, formatNumber, formatPercentage, getStatusColor } from '../../mock-data';

export default function Candidat(){
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
    }, []);

    const CandidatCard = ({ candidat, index }: any) => {
        const cardAnim = useRef(new Animated.Value(0)).current;
        const voteAnim = useRef(new Animated.Value(0)).current;
        
        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 600,
                delay: index * 150,
                useNativeDriver: true,
            }).start();

            if (candidat.votes > 0) {
                Animated.timing(voteAnim, {
                    toValue: candidat.pourcentage,
                    duration: 1200,
                    delay: (index * 150) + 400,
                    useNativeDriver: false,
                }).start();
            }
        }, []);

        return (
            <TouchableOpacity 
                onPress={() => router.push(`/candidat-detail?id=${candidat.id}`)}
            >
                <Animated.View style={[
                    styles.candidatCard,
                    { 
                        opacity: cardAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>
                <View style={styles.candidatHeader}>
                    <View style={styles.candidatPhoto}>
                        <Ionicons name="person" size={32} color="#007AFF" />
                    </View>
                    <View style={styles.candidatInfo}>
                        <Text style={styles.candidatName}>{candidat.nom} {candidat.prenom}</Text>
                        <Text style={styles.candidatParti}>{candidat.parti}</Text>
                        <Text style={styles.candidatProfession}>{candidat.profession}</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(candidat.statut) }
                        ]}>
                            <Text style={styles.statusText}>{candidat.statut}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.moreButton}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.candidatMeta}>
                    <View style={styles.metaItem}>
                        <Ionicons name="calendar" size={16} color="#666" />
                        <Text style={styles.metaText}>{candidat.age} ans</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="mail" size={16} color="#666" />
                        <Text style={styles.metaText}>{candidat.email}</Text>
                    </View>
                </View>

                {candidat.votes > 0 && (
                    <View style={styles.resultatsSection}>
                        <View style={styles.resultatsHeader}>
                            <Text style={styles.resultatsTitle}>Résultats</Text>
                            <Text style={styles.resultatsPercentage}>
                                {formatPercentage(candidat.pourcentage)}
                            </Text>
                        </View>
                        <View style={styles.votesProgressBar}>
                            <Animated.View 
                                style={[
                                    styles.votesProgressFill,
                                    { 
                                        width: voteAnim.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: ['0%', '100%'],
                                            extrapolate: 'clamp'
                                        })
                                    }
                                ]}
                            />
                        </View>
                        <Text style={styles.votesCount}>
                            {formatNumber(candidat.votes)} votes
                        </Text>
                    </View>
                )}

                <View style={styles.campagneInfo}>
                    <View style={styles.campagneStats}>
                        <View style={styles.statItem}>
                            <Ionicons name="wallet" size={16} color="#007AFF" />
                            <Text style={styles.statValue}>
                                {candidat.campagne.budget / 1000000}M€
                            </Text>
                            <Text style={styles.statLabel}>Budget</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="megaphone" size={16} color="#28A745" />
                            <Text style={styles.statValue}>{candidat.campagne.meetings}</Text>
                            <Text style={styles.statLabel}>Meetings</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="people" size={16} color="#FFA07A" />
                            <Text style={styles.statValue}>{candidat.campagne.equipe}</Text>
                            <Text style={styles.statLabel}>Équipe</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>Voir profil complet</Text>
                    <Ionicons name="chevron-forward" size={16} color="#007AFF" />
                </TouchableOpacity>
            </Animated.View>
            </TouchableOpacity>
        );
    };

    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="people" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Candidats</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => router.push('/candidat-form')}
                >
                    <Ionicons name="person-add" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.content}>
                <Animated.View style={[
                    styles.statsSection,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {mockStatistiquesCandidat.totalCandidats}
                        </Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#28A745' }]}>
                            {mockStatistiquesCandidat.candidatsValides}
                        </Text>
                        <Text style={styles.statLabel}>Validés</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#FFC107' }]}>
                            {mockStatistiquesCandidat.candidatsEnAttente}
                        </Text>
                        <Text style={styles.statLabel}>En attente</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#DC3545' }]}>
                            {mockStatistiquesCandidat.candidatsRejects}
                        </Text>
                        <Text style={styles.statLabel}>Rejetés</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.candidatsSection,
                    { opacity: fadeAnim }
                ]}>
                    <Text style={styles.sectionTitle}>Candidats Inscrits</Text>
                    {mockCandidats.map((candidat, index) => (
                        <CandidatCard 
                            key={candidat.id} 
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
    },
    candidatsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    candidatCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    candidatHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    candidatPhoto: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    candidatInfo: {
        flex: 1,
    },
    candidatName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    candidatParti: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
        marginBottom: 2,
    },
    candidatProfession: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 11,
        color: 'white',
        fontWeight: '600',
    },
    moreButton: {
        padding: 4,
    },
    candidatMeta: {
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    metaText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 6,
    },
    resultatsSection: {
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
    },
    resultatsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    resultatsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    resultatsPercentage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    votesProgressBar: {
        height: 6,
        backgroundColor: '#E5E5E7',
        borderRadius: 3,
        marginBottom: 6,
        overflow: 'hidden',
    },
    votesProgressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 3,
    },
    votesCount: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
    },
    campagneInfo: {
        marginBottom: 12,
    },
    campagneStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E7',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginTop: 4,
        marginBottom: 2,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    viewButtonText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
        marginRight: 4,
    },
});