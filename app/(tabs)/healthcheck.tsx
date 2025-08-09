import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { 
    mockHealthChecks, 
    mockSystemHealth, 
    mockHealthHistory,
    getHealthStatusColor, 
    getHealthStatusIcon,
    formatUptime,
    calculateAverageResponseTime
} from '../../mock-data';

export default function HealthCheck(){
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

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

    const HealthServiceCard = ({ service, index }: any) => {
        const cardAnim = useRef(new Animated.Value(0)).current;
        const pulseAnim = useRef(new Animated.Value(1)).current;
        
        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }).start();

            // Animation de pulsation pour les services en erreur
            if (service.statut === 'UNHEALTHY') {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
                    ])
                ).start();
            }
        }, []);

        const getResponseTimeColor = (time: number) => {
            if (time < 100) return '#28A745';
            if (time < 300) return '#FFC107';
            return '#DC3545';
        };

        return (
            <Animated.View style={[
                styles.serviceCard,
                { 
                    opacity: cardAnim,
                    transform: [
                        { translateY: slideAnim },
                        { scale: service.statut === 'UNHEALTHY' ? pulseAnim : 1 }
                    ]
                }
            ]}>
                <View style={styles.serviceHeader}>
                    <View style={styles.serviceInfo}>
                        <View style={styles.serviceTitleRow}>
                            <Ionicons 
                                name={getHealthStatusIcon(service.statut) as any}
                                size={20} 
                                color={getHealthStatusColor(service.statut)} 
                            />
                            <Text style={styles.serviceName}>{service.nom}</Text>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getHealthStatusColor(service.statut) }
                            ]}>
                                <Text style={styles.statusText}>{service.statut}</Text>
                            </View>
                        </View>
                        <Text style={styles.serviceDescription}>{service.description}</Text>
                        {service.endpoint && (
                            <Text style={styles.serviceEndpoint}>{service.endpoint}</Text>
                        )}
                    </View>
                </View>

                <View style={styles.serviceMetrics}>
                    <View style={styles.metricItem}>
                        <Text style={[
                            styles.metricValue,
                            { color: getResponseTimeColor(service.tempsReponse) }
                        ]}>
                            {service.tempsReponse}ms
                        </Text>
                        <Text style={styles.metricLabel}>Temps de réponse</Text>
                    </View>
                    <View style={styles.metricDivider} />
                    <View style={styles.metricItem}>
                        <Text style={styles.metricValue}>
                            {Math.round((Date.now() - new Date(service.derniereVerification).getTime()) / 1000)}s
                        </Text>
                        <Text style={styles.metricLabel}>Dernière vérif.</Text>
                    </View>
                </View>

                {service.details && (
                    <View style={styles.serviceDetails}>
                        {service.details.cpu && (
                            <View style={styles.detailRow}>
                                <Ionicons name="hardware-chip" size={14} color="#666" />
                                <Text style={styles.detailLabel}>CPU:</Text>
                                <View style={styles.progressBar}>
                                    <Animated.View 
                                        style={[
                                            styles.progressFill,
                                            { 
                                                width: `${service.details.cpu}%`,
                                                backgroundColor: service.details.cpu > 80 ? '#DC3545' : 
                                                               service.details.cpu > 60 ? '#FFC107' : '#28A745'
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.detailValue}>{service.details.cpu}%</Text>
                            </View>
                        )}
                        {service.details.memoire && (
                            <View style={styles.detailRow}>
                                <Ionicons name="albums" size={14} color="#666" />
                                <Text style={styles.detailLabel}>RAM:</Text>
                                <View style={styles.progressBar}>
                                    <Animated.View 
                                        style={[
                                            styles.progressFill,
                                            { 
                                                width: `${service.details.memoire}%`,
                                                backgroundColor: service.details.memoire > 80 ? '#DC3545' : 
                                                               service.details.memoire > 60 ? '#FFC107' : '#28A745'
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.detailValue}>{service.details.memoire}%</Text>
                            </View>
                        )}
                        {service.details.connexions && (
                            <View style={styles.detailRow}>
                                <Ionicons name="link" size={14} color="#666" />
                                <Text style={styles.detailLabel}>Connexions:</Text>
                                <Text style={[styles.detailValue, { flex: 1, textAlign: 'right' }]}>
                                    {service.details.connexions}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <TouchableOpacity style={styles.refreshButton}>
                    <Ionicons name="refresh" size={16} color="#007AFF" />
                    <Text style={styles.refreshButtonText}>Actualiser</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const healthyServices = mockHealthChecks.filter(s => s.statut === 'HEALTHY').length;
    const degradedServices = mockHealthChecks.filter(s => s.statut === 'DEGRADED').length;
    const unhealthyServices = mockHealthChecks.filter(s => s.statut === 'UNHEALTHY').length;

    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="pulse" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Health Checks</Text>
                <TouchableOpacity style={styles.refreshAllButton}>
                    <Ionicons name="refresh" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.content}>
                <Animated.View style={[
                    styles.systemOverview,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <View style={[
                        styles.systemStatusCard,
                        { borderLeftColor: getHealthStatusColor(mockSystemHealth.statusGlobal) }
                    ]}>
                        <View style={styles.systemStatusHeader}>
                            <Ionicons 
                                name={getHealthStatusIcon(mockSystemHealth.statusGlobal) as any}
                                size={32} 
                                color={getHealthStatusColor(mockSystemHealth.statusGlobal)} 
                            />
                            <View style={styles.systemStatusInfo}>
                                <Text style={styles.systemStatusTitle}>Système Global</Text>
                                <Text style={[
                                    styles.systemStatusValue,
                                    { color: getHealthStatusColor(mockSystemHealth.statusGlobal) }
                                ]}>
                                    {mockSystemHealth.statusGlobal} - {mockSystemHealth.score}%
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.systemStatusDetails}>
                            {mockSystemHealth.servicesActifs}/{mockSystemHealth.servicesTotal} services opérationnels
                        </Text>
                        <Text style={styles.systemStatusDetails}>
                            Temps de réponse moyen: {mockSystemHealth.tempsReponseTotal}ms
                        </Text>
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.statsSection,
                    { opacity: fadeAnim }
                ]}>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#28A745' }]}>{healthyServices}</Text>
                        <Text style={styles.statLabel}>Sains</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#FFC107' }]}>{degradedServices}</Text>
                        <Text style={styles.statLabel}>Dégradés</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statNumber, { color: '#DC3545' }]}>{unhealthyServices}</Text>
                        <Text style={styles.statLabel}>En panne</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{calculateAverageResponseTime(mockHealthChecks)}</Text>
                        <Text style={styles.statLabel}>Moy. ms</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.servicesSection,
                    { opacity: fadeAnim }
                ]}>
                    <Text style={styles.sectionTitle}>Services Surveillés</Text>
                    {mockHealthChecks
                        .sort((a, b) => {
                            // Trier par statut (les problèmes en premier)
                            const statusOrder = { 'UNHEALTHY': 0, 'DEGRADED': 1, 'HEALTHY': 2 };
                            return statusOrder[a.statut] - statusOrder[b.statut];
                        })
                        .map((service, index) => (
                            <HealthServiceCard 
                                key={service.id} 
                                service={service} 
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
    refreshAllButton: {
        padding: 8,
    },
    content: {
        padding: 16,
    },
    systemOverview: {
        marginBottom: 20,
    },
    systemStatusCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    systemStatusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    systemStatusInfo: {
        marginLeft: 12,
        flex: 1,
    },
    systemStatusTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    systemStatusValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    systemStatusDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
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
    servicesSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    serviceCard: {
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
    serviceHeader: {
        marginBottom: 16,
    },
    serviceInfo: {
        flex: 1,
    },
    serviceTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginLeft: 8,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 11,
        color: 'white',
        fontWeight: '600',
    },
    serviceDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        lineHeight: 20,
    },
    serviceEndpoint: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'monospace',
    },
    serviceMetrics: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E5E7',
        marginBottom: 12,
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
    },
    metricDivider: {
        width: 1,
        backgroundColor: '#E5E5E7',
        marginHorizontal: 16,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    metricLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    serviceDetails: {
        marginBottom: 12,
        padding: 12,
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 12,
        color: '#666',
        marginLeft: 6,
        marginRight: 8,
        minWidth: 40,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#E5E5E7',
        borderRadius: 3,
        marginRight: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    detailValue: {
        fontSize: 12,
        color: '#000',
        fontWeight: '600',
        minWidth: 30,
        textAlign: 'right',
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    refreshButtonText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
        marginLeft: 4,
    },
});