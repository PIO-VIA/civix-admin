import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Animated, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { HealthStatusDTO } from '@/lib/models';
import { useHealthChecks } from '@/hooks/useHealthChecks';

export default function HealthCheckScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const { healthCheckData, loading, error, refreshHealthCheck } = useHealthChecks();

    useEffect(() => {
        if (healthCheckData) {
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
        }
    }, [healthCheckData, fadeAnim, slideAnim]);

    useEffect(() => {
        if (error) {
            Alert.alert('Erreur', error);
        }
    }, [error]);

    const getStatusColor = (healthy?: boolean) => {
        if (healthy === undefined) return '#6C757D';
        return healthy ? '#28A745' : '#DC3545';
    };

    const getStatusIcon = (healthy?: boolean): any => {
        if (healthy === undefined) return 'help-circle';
        return healthy ? 'checkmark-circle' : 'close-circle';
    };

    const HealthServiceCard = ({ serviceName, service, index }: { serviceName: string, service: HealthStatusDTO, index: number }) => {
        const cardAnim = useRef(new Animated.Value(0)).current;
        const pulseAnim = useRef(new Animated.Value(1)).current;

        useEffect(() => {
            Animated.timing(cardAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }).start();

            if (!service.healthy) {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
                    ])
                ).start();
            }
        }, [cardAnim, index, pulseAnim, service.healthy]);

        const getResponseTimeColor = (time?: number) => {
            if (time === undefined) return '#6C757D';
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
                        { scale: !service.healthy ? pulseAnim : 1 }
                    ]
                }
            ]}>
                <View style={styles.serviceHeader}>
                    <View style={styles.serviceInfo}>
                        <View style={styles.serviceTitleRow}>
                            <Ionicons
                                name={getStatusIcon(service.healthy)}
                                size={20}
                                color={getStatusColor(service.healthy)}
                            />
                            <Text style={styles.serviceName}>{serviceName}</Text>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(service.healthy) }
                            ]}>
                                <Text style={styles.statusText}>{service.healthy ? 'HEALTHY' : 'UNHEALTHY'}</Text>
                            </View>
                        </View>
                        <Text style={styles.serviceDescription}>{service.message}</Text>
                    </View>
                </View>

                <View style={styles.serviceMetrics}>
                    <View style={styles.metricItem}>
                        <Text style={[
                            styles.metricValue,
                            { color: getResponseTimeColor(service.responseTime) }
                        ]}>
                            {service.responseTime}ms
                        </Text>
                        <Text style={styles.metricLabel}>Temps de réponse</Text>
                    </View>
                </View>
            </Animated.View>
        );
    };

    if (loading && !healthCheckData) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Chargement du Health Check...</Text>
            </View>
        );
    }

    if (!healthCheckData) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Ionicons name="cloud-offline-outline" size={48} color="#666" />
                <Text style={styles.errorTitle}>Impossible de charger les données</Text>
                <Text style={styles.errorSubtitle}>Vérifiez votre connexion ou réessayez plus tard.</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refreshHealthCheck}>
                    <Text style={styles.retryButtonText}>Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const services = Object.entries(healthCheckData.services || {});
    const healthyServices = services.filter(([, service]) => service.healthy).length;
    const unhealthyServices = services.length - healthyServices;
    const averageResponseTime = services.reduce((acc, [, service]) => acc + (service.responseTime || 0), 0) / (services.length || 1);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Ionicons name="pulse" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Health Checks</Text>
                <TouchableOpacity style={styles.refreshAllButton} onPress={refreshHealthCheck} disabled={loading}>
                    {loading ? <ActivityIndicator size="small" color="#007AFF" /> : <Ionicons name="refresh" size={24} color="#007AFF" />}
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Animated.View style={[
                    styles.systemOverview,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}>
                    <View style={[
                        styles.systemStatusCard,
                        { borderLeftColor: getStatusColor(healthCheckData.status === 'HEALTHY') }
                    ]}>
                        <View style={styles.systemStatusHeader}>
                            <Ionicons
                                name={getStatusIcon(healthCheckData.status === 'HEALTHY')}
                                size={32}
                                color={getStatusColor(healthCheckData.status === 'HEALTHY')}
                            />
                            <View style={styles.systemStatusInfo}>
                                <Text style={styles.systemStatusTitle}>{healthCheckData.application}</Text>
                                <Text style={[
                                    styles.systemStatusValue,
                                    { color: getStatusColor(healthCheckData.status === 'HEALTHY') }
                                ]}>
                                    {healthCheckData.status}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.systemStatusDetails}>
                            {healthyServices}/{services.length} services opérationnels
                        </Text>
                        <Text style={styles.systemStatusDetails}>
                            Uptime: {healthCheckData.uptime}
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
                        <Text style={[styles.statNumber, { color: '#DC3545' }]}>{unhealthyServices}</Text>
                        <Text style={styles.statLabel}>En panne</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{Math.round(averageResponseTime)}</Text>
                        <Text style={styles.statLabel}>Moy. ms</Text>
                    </View>
                </Animated.View>

                <Animated.View style={[
                    styles.servicesSection,
                    { opacity: fadeAnim }
                ]}>
                    <Text style={styles.sectionTitle}>Services Surveillés</Text>
                    {services
                        .sort(([, a], [, b]) => {
                            const aHealthy = a.healthy ? 1 : 0;
                            const bHealthy = b.healthy ? 1 : 0;
                            return aHealthy - bHealthy;
                        })
                        .map(([serviceName, service], index) => (
                            <HealthServiceCard
                                key={serviceName}
                                serviceName={serviceName}
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    errorSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
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
    serviceMetrics: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: '#E5E5E7',
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
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
});