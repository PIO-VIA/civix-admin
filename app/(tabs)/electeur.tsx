import React from 'react';
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function Electeur(){
    return(
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="person" size={32} color="#007AFF" />
                <Text style={styles.headerTitle}>Électeurs</Text>
            </View>
            
            <View style={styles.content}>
                <Text style={styles.titleText}>Gestion des Électeurs</Text>
                <Text style={styles.descriptionText}>
                    Administrez les profils et données des électeurs
                </Text>
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
        padding: 20,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#007AFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
});