import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { mockElections, mockResultats, formatNumber, formatPercentage, formatDate, getStatusColor } from '../../mock-data';

export default function Election(){
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

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
    }, []);

    const ElectionCard = ({ election, index }: any) => {
        const cardAnim = useRef(new Animated.Value(0)).current;
        
        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 150,
                useNativeDriver: true,
            }).start();
        }, []);

        return (
            <Animated.View style={[
                styles.electionCard,
                { 
                    opacity: cardAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}>
                <View style={styles.cardHeader}>
                    <View style={styles.electionInfo}>
                        <Text style={styles.electionTitle}>{election.nom}</Text>
                        <Text style={styles.electionDescription}>{election.description}</Text>
                    </View>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(election.statut) }
                    ]}>
                        <Text style={styles.statusText}>{election.statut}</Text>
                    </View>
                </View>

                <View style={styles.electionMeta}>
                    <View style={styles.metaItem}>
                        <Ionicons name="calendar" size={16} color="#666" />
                        <Text style={styles.metaText}>
                            {formatDate(election.dateDebut)}
                        </Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="people" size={16} color="#666" />
                        <Text style={styles.metaText}>
                            {formatNumber(election.nombreElecteurs)} électeurs
                        </Text>
                    </View>
                </View>

                {election.statut !== 'PROGRAMMEE' && (
                    <View style={styles.participationSection}>
                        <View style={styles.participationHeader}>
                            <Text style={styles.participationLabel}>Participation</Text>
                            <Text style={styles.participationValue}>
                                {formatPercentage(election.tauxParticipation)}
                            </Text>
                        </View>
                        <View style={styles.progressBar}>
                            <Animated.View 
                                style={[
                                    styles.progressFill,
                                    { 
                                        width: `${election.tauxParticipation}%`,
                                        opacity: cardAnim
                                    }
                                ]}
                            />
                        </View>
                    </View>
                )}

                <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>Voir détails</Text>
                    <Ionicons name="chevron-forward" size={16} color="#007AFF" />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="ballot" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Élections</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.content}>
                <Animated.View style={[
                    styles.statsSection,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{mockElections.length}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#28A745' }]}>
                            {mockElections.filter(e => e.statut === 'EN_COURS').length}
                        </Text>
                        <Text style={styles.statLabel}>En cours</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#FFC107' }]}>
                            {mockElections.filter(e => e.statut === 'PROGRAMMEE').length}
                        </Text>
                        <Text style={styles.statLabel}>Programmées</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.electionsSection,
                    { opacity: fadeAnim }
                ]}>
                    <Text style={styles.sectionTitle}>Élections Récentes</Text>
                    {mockElections.map((election, index) => (
                        <ElectionCard 
                            key={election.id} 
                            election={election} 
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    electionInfo: {
        flex: 1,
        marginRight: 12,
    },
    electionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    electionDescription: {
        fontSize: 14,
        color: '#666',
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
    electionMeta: {
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metaText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    participationSection: {
        marginBottom: 16,
    },
    participationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    participationLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    participationValue: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E5E5E7',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 3,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    viewButtonText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
        marginRight: 4,
    },
});