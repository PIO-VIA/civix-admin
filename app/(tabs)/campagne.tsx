import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { mockCampagnes, mockStatistiquesCampagnes, formatNumber, formatCurrency, formatPercentage } from '../../mock-data';

export default function Campagne(){
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const CampagneCard = ({ campagne, index }: any) => {
        const cardAnim = useRef(new Animated.Value(0)).current;
        const progressAnim = useRef(new Animated.Value(0)).current;
        
        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 200,
                useNativeDriver: true,
            }).start();

            Animated.timing(progressAnim, {
                toValue: campagne.budgetUtilise / campagne.budget,
                duration: 1000,
                delay: (index * 200) + 300,
                useNativeDriver: false,
            }).start();
        }, []);

        const budgetPourcentage = (campagne.budgetUtilise / campagne.budget) * 100;

        return (
            <Animated.View style={[
                styles.campagneCard,
                { 
                    opacity: cardAnim,
                    transform: [{ translateY: slideAnim }],
                    borderLeftColor: campagne.couleurTheme
                }
            ]}>
                <View style={styles.cardHeader}>
                    <View style={styles.campagneInfo}>
                        <Text style={styles.campagneTitle}>{campagne.nom}</Text>
                        <Text style={styles.candidatName}>{campagne.candidatNom}</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: campagne.couleurTheme }
                        ]}>
                            <Text style={styles.statusText}>{campagne.statut}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.moreButton}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={styles.budgetSection}>
                    <View style={styles.budgetHeader}>
                        <Text style={styles.budgetLabel}>Budget</Text>
                        <Text style={styles.budgetValue}>
                            {formatCurrency(campagne.budgetUtilise)} / {formatCurrency(campagne.budget)}
                        </Text>
                    </View>
                    <View style={styles.budgetProgressBar}>
                        <Animated.View 
                            style={[
                                styles.budgetProgressFill,
                                { 
                                    backgroundColor: campagne.couleurTheme,
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%']
                                    })
                                }
                            ]}
                        />
                    </View>
                    <Text style={styles.budgetPercentage}>
                        {formatPercentage(budgetPourcentage)} utilisé
                    </Text>
                </View>

                <View style={styles.objectifsSection}>
                    <Text style={styles.objectifsTitle}>Objectifs</Text>
                    {campagne.objectifs.map((objectif: any, idx: number) => (
                        <View key={idx} style={styles.objectifItem}>
                            <Text style={styles.objectifName}>{objectif.nom}</Text>
                            <Text style={styles.objectifProgress}>
                                {objectif.progres}/{objectif.total}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.campagneStats}>
                    <View style={styles.statItem}>
                        <Ionicons name="people" size={16} color={campagne.couleurTheme} />
                        <Text style={styles.statValue}>{campagne.equipe}</Text>
                        <Text style={styles.statLabel}>Équipe</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="calendar" size={16} color={campagne.couleurTheme} />
                        <Text style={styles.statValue}>{campagne.evenements}</Text>
                        <Text style={styles.statLabel}>Événements</Text>
                    </View>
                </View>
            </Animated.View>
        );
    };

    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="megaphone" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Campagnes</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#007AFF" />
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
                                {mockStatistiquesCampagnes.totalCampagnes}
                            </Text>
                            <Text style={styles.overviewLabel}>Total</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={[styles.overviewNumber, { color: '#28A745' }]}>
                                {mockStatistiquesCampagnes.campagnesActives}
                            </Text>
                            <Text style={styles.overviewLabel}>Actives</Text>
                        </View>
                        <View style={styles.overviewCard}>
                            <Text style={[styles.overviewNumber, { color: '#FFC107' }]}>
                                {formatCurrency(mockStatistiquesCampagnes.budgetTotal / 1000000)}M
                            </Text>
                            <Text style={styles.overviewLabel}>Budget Total</Text>
                        </View>
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.campagnesSection,
                    { opacity: fadeAnim }
                ]}>
                    <Text style={styles.sectionTitle}>Campagnes Actives</Text>
                    {mockCampagnes.map((campagne, index) => (
                        <CampagneCard 
                            key={campagne.id} 
                            campagne={campagne} 
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
    campagnesSection: {
        marginBottom: 20,
    },
    campagneCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
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
        marginBottom: 16,
    },
    campagneInfo: {
        flex: 1,
    },
    campagneTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    candidatName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '600',
    },
    moreButton: {
        padding: 4,
    },
    budgetSection: {
        marginBottom: 16,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    budgetLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    budgetValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '600',
    },
    budgetProgressBar: {
        height: 6,
        backgroundColor: '#E5E5E7',
        borderRadius: 3,
        marginBottom: 4,
    },
    budgetProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    budgetPercentage: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
    },
    objectifsSection: {
        marginBottom: 16,
    },
    objectifsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    objectifItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    objectifName: {
        fontSize: 14,
        color: '#666',
    },
    objectifProgress: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    campagneStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E7',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginTop: 4,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
});