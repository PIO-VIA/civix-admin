import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { mockElecteurs, mockStatistiquesElecteurs, formatNumber, formatPercentage, formatDate, getStatusColor } from '../../mock-data';

export default function Electeur(){
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(60)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 900,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const ElecteurCard = ({ electeur, index }: any) => {
        const cardAnim = useRef(new Animated.Value(0)).current;
        
        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }).start();
        }, []);

        const getInitials = (prenom: string, nom: string) => {
            return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
        };

        return (
            <Animated.View style={[
                styles.electeurCard,
                { 
                    opacity: cardAnim,
                    transform: [{ translateX: slideAnim }]
                }
            ]}>
                <View style={styles.electeurHeader}>
                    <View style={[
                        styles.electeurAvatar,
                        { backgroundColor: electeur.statut === 'ACTIF' ? '#E8F5E8' : '#F5F5F5' }
                    ]}>
                        <Text style={[
                            styles.electeurInitials,
                            { color: electeur.statut === 'ACTIF' ? '#28A745' : '#666' }
                        ]}>
                            {getInitials(electeur.prenom, electeur.nom)}
                        </Text>
                    </View>
                    <View style={styles.electeurInfo}>
                        <Text style={styles.electeurName}>
                            {electeur.prenom} {electeur.nom}
                        </Text>
                        <Text style={styles.electeurProfession}>{electeur.profession}</Text>
                        <Text style={styles.electeurVille}>
                            {electeur.adresse.ville}, {electeur.adresse.departement}
                        </Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: getStatusColor(electeur.statut) }
                        ]}>
                            <Text style={styles.statusText}>{electeur.statut}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.contactButton}>
                        <Ionicons name="mail" size={20} color="#007AFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.electeurMeta}>
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name="call" size={14} color="#666" />
                            <Text style={styles.metaText}>{electeur.telephone}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="location" size={14} color="#666" />
                            <Text style={styles.metaText}>{electeur.bureauVote}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.electeurStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{electeur.nombreVotes}</Text>
                        <Text style={styles.statLabel}>Votes</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {electeur.dernierVote ? formatDate(electeur.dernierVote).split(' ')[0] : 'Jamais'}
                        </Text>
                        <Text style={styles.statLabel}>Dernier vote</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={[
                            styles.statValue,
                            { color: electeur.genre === 'F' ? '#FF6B9D' : '#4A90E2' }
                        ]}>
                            {electeur.genre === 'F' ? 'F' : 'H'}
                        </Text>
                        <Text style={styles.statLabel}>Genre</Text>
                    </View>
                </View>
            </Animated.View>
        );
    };

    const StatCircle = ({ percentage, label, color }: any) => {
        const circleAnim = useRef(new Animated.Value(0)).current;
        
        useEffect(() => {
            Animated.timing(circleAnim, {
                toValue: percentage,
                duration: 1500,
                delay: 500,
                useNativeDriver: false,
            }).start();
        }, []);

        return (
            <View style={styles.statCircleContainer}>
                <View style={styles.statCircle}>
                    <Animated.View 
                        style={[
                            styles.statCircleFill,
                            { 
                                backgroundColor: color,
                                height: circleAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%'],
                                    extrapolate: 'clamp'
                                })
                            }
                        ]}
                    />
                    <Text style={styles.statCircleText}>{percentage}%</Text>
                </View>
                <Text style={styles.statCircleLabel}>{label}</Text>
            </View>
        );
    };

    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="people" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Électeurs</Text>
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.content}>
                <Animated.View style={[
                    styles.overviewSection,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
                    <View style={styles.overviewCards}>
                        <View style={styles.overviewCard}>
                            <Text style={styles.overviewNumber}>
                                {formatNumber(mockStatistiquesElecteurs.totalElecteurs / 1000000)}M
                            </Text>
                            <Text style={styles.overviewLabel}>Total Inscrits</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={[styles.overviewNumber, { color: '#28A745' }]}>
                                {formatPercentage(mockStatistiquesElecteurs.participationMoyenne)}
                            </Text>
                            <Text style={styles.overviewLabel}>Participation</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={[styles.overviewNumber, { color: '#FFC107' }]}>
                                {formatNumber(mockStatistiquesElecteurs.nouveauxElecteurs / 1000)}K
                            </Text>
                            <Text style={styles.overviewLabel}>Nouveaux</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.demographicSection,
                    { opacity: fadeAnim }
                ]}>
                    <Text style={styles.sectionTitle}>Répartition Démographique</Text>
                    <View style={styles.demographicCharts}>
                        <StatCircle 
                            percentage={mockStatistiquesElecteurs.repartitionGenre.femmes}
                            label="Femmes"
                            color="#FF6B9D"
                        />
                        <StatCircle 
                            percentage={mockStatistiquesElecteurs.repartitionGenre.hommes}
                            label="Hommes"
                            color="#4A90E2"
                        />
                        <StatCircle 
                            percentage={mockStatistiquesElecteurs.tauxInscription}
                            label="Inscription"
                            color="#28A745"
                        />
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.electeursSection,
                    { opacity: fadeAnim }
                ]}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Électeurs Récents</Text>
                        <TouchableOpacity style={styles.viewAllButton}>
                            <Text style={styles.viewAllText}>Voir tout</Text>
                            <Ionicons name="chevron-forward" size={16} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                    {mockElecteurs.map((electeur, index) => (
                        <ElecteurCard 
                            key={electeur.id} 
                            electeur={electeur} 
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
    searchButton: {
        padding: 8,
    },
    content: {
        padding: 16,
    },
    overviewSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    overviewCards: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    overviewCard: {
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
    overviewNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    overviewLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    demographicSection: {
        marginBottom: 24,
    },
    demographicCharts: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statCircleContainer: {
        alignItems: 'center',
    },
    statCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    statCircleFill: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    statCircleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        zIndex: 1,
    },
    statCircleLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    electeursSection: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewAllText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
        marginRight: 4,
    },
    electeurCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    electeurHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    electeurAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    electeurInitials: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    electeurInfo: {
        flex: 1,
    },
    electeurName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    electeurProfession: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    electeurVille: {
        fontSize: 13,
        color: '#999',
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
    contactButton: {
        padding: 6,
    },
    electeurMeta: {
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
        flex: 1,
    },
    electeurStats: {
        flexDirection: 'row',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E7',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E5E5E7',
        marginHorizontal: 8,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },
});