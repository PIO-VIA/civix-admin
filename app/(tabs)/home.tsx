import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { mockDashboardData, formatNumber, formatPercentage } from '../../mock-data';

export default function Home(){
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
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const { statistiquesGenerales, alertes, activitesRecentes } = mockDashboardData;

    const StatCard = ({ title, value, icon, color, subtitle }: any) => (
        <Animated.View style={[
            styles.statCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
            <View style={styles.statHeader}>
                <Ionicons name={icon} size={24} color={color} />
                <Text style={styles.statTitle}>{title}</Text>
            </View>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </Animated.View>
    );

    const AlertItem = ({ alert, index }: any) => (
        <Animated.View style={[
            styles.alertItem,
            { 
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }]
            }
        ]}>
            <View style={styles.alertHeader}>
                <Ionicons 
                    name={alert.type === 'ERROR' ? 'alert-circle' : 
                          alert.type === 'WARNING' ? 'warning' : 'information-circle'} 
                    size={20} 
                    color={alert.type === 'ERROR' ? '#DC3545' : 
                           alert.type === 'WARNING' ? '#FFC107' : '#007AFF'} 
                />
                <Text style={styles.alertTitle}>{alert.titre}</Text>
            </View>
            <Text style={styles.alertMessage}>{alert.message}</Text>
        </Animated.View>
    );

    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="speedometer" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Tableau de Bord Admin</Text>
            </View>
            
            <View style={styles.content}>
                <Animated.View style={[
                    styles.welcomeSection,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <Text style={styles.welcomeText}>Bienvenue sur CiviX</Text>
                    <Text style={styles.descriptionText}>
                        Interface d'administration électorale
                    </Text>
                </Animated.View>

                {/* Statistiques principales */}
                <View style={styles.statsContainer}>
                    <StatCard
                        title="Élections"
                        value={statistiquesGenerales.totalElections}
                        subtitle={`${statistiquesGenerales.electionsActives} actives`}
                        icon="ballot"
                        color="#007AFF"
                    />
                    <StatCard
                        title="Électeurs"
                        value={formatNumber(statistiquesGenerales.totalElecteurs)}
                        subtitle="Inscrits"
                        icon="people"
                        color="#28A745"
                    />
                    <StatCard
                        title="Participation"
                        value={formatPercentage(statistiquesGenerales.tauxParticipation)}
                        subtitle="Taux moyen"
                        icon="trending-up"
                        color="#FF6B6B"
                    />
                    <StatCard
                        title="Candidats"
                        value={statistiquesGenerales.totalCandidats}
                        subtitle={`${statistiquesGenerales.totalCampagnes} campagnes`}
                        icon="person-circle"
                        color="#FFA07A"
                    />
                </View>

                {/* Section Alertes */}
                <Animated.View style={[
                    styles.section,
                    { opacity: fadeAnim }
                ]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="notifications" size={24} color="#007AFF" />
                        <Text style={styles.sectionTitle}>Alertes Récentes</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {alertes.filter(a => !a.lu).length}
                            </Text>
                        </View>
                    </View>
                    {alertes.slice(0, 3).map((alert, index) => (
                        <AlertItem key={alert.id} alert={alert} index={index} />
                    ))}
                </Animated.View>

                {/* Activités récentes */}
                <Animated.View style={[
                    styles.section,
                    { opacity: fadeAnim }
                ]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="time" size={24} color="#007AFF" />
                        <Text style={styles.sectionTitle}>Activités Récentes</Text>
                    </View>
                    {activitesRecentes.slice(0, 4).map((activite, index) => (
                        <Animated.View 
                            key={activite.id}
                            style={[
                                styles.activityItem,
                                { 
                                    opacity: fadeAnim,
                                    transform: [{ translateX: slideAnim }]
                                }
                            ]}
                        >
                            <View style={styles.activityDot} />
                            <View style={styles.activityContent}>
                                <Text style={styles.activityAction}>{activite.action}</Text>
                                <Text style={styles.activityUser}>{activite.utilisateur}</Text>
                                <Text style={styles.activityDetails}>{activite.details}</Text>
                            </View>
                        </Animated.View>
                    ))}
                </Animated.View>

                {/* Actions rapides */}
                <Animated.View style={[
                    styles.section,
                    { opacity: fadeAnim }
                ]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="flash" size={24} color="#007AFF" />
                        <Text style={styles.sectionTitle}>Actions Rapides</Text>
                    </View>
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="add-circle" size={24} color="#007AFF" />
                            <Text style={styles.actionText}>Nouvelle Élection</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="person-add" size={24} color="#28A745" />
                            <Text style={styles.actionText}>Ajouter Candidat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="bar-chart" size={24} color="#FF6B6B" />
                            <Text style={styles.actionText}>Voir Résultats</Text>
                        </TouchableOpacity>
                    </View>
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
    },
    content: {
        padding: 16,
    },
    welcomeSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        width: '48%',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statTitle: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        fontWeight: '500',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statSubtitle: {
        fontSize: 12,
        color: '#999',
    },
    section: {
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
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginLeft: 8,
        flex: 1,
    },
    badge: {
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    alertItem: {
        borderLeftWidth: 3,
        borderLeftColor: '#007AFF',
        paddingLeft: 12,
        paddingVertical: 8,
        marginBottom: 12,
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginLeft: 8,
    },
    alertMessage: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#007AFF',
        marginTop: 6,
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityAction: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    activityUser: {
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 2,
    },
    activityDetails: {
        fontSize: 12,
        color: '#666',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionButton: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#F8F9FA',
        minWidth: 80,
    },
    actionText: {
        fontSize: 12,
        color: '#000',
        marginTop: 4,
        textAlign: 'center',
        fontWeight: '500',
    },
});