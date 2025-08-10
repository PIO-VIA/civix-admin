import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function Setting() {
  const router = useRouter();
  const settingsOptions = [
    {
      title: 'Profil utilisateur',
      icon: 'person-outline',
      onPress: () => console.log('Profil utilisateur'),
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => console.log('Notifications'),
    },
    
    {
      title: 'à propos',
      icon: 'information-circle-outline',
      onPress: () => console.log('à propos'),
    },
    {
      title: 'Déconnexion',
      icon: 'log-out-outline',
      onPress: () => router.push("/login"),
      danger: true,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={32} color="#007AFF" />
        <Text style={styles.headerTitle}>Param�tres</Text>
      </View>

      <View style={styles.section}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionItem,
              option.danger && styles.dangerItem,
            ]}
            onPress={option.onPress}
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              color={option.danger ? '#FF3B30' : '#007AFF'}
              style={styles.optionIcon}
            />
            <Text
              style={[
                styles.optionText,
                option.danger && styles.dangerText,
              ]}
            >
              {option.title}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#C7C7CC"
            />
          </TouchableOpacity>
        ))}
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
  section: {
    marginTop: 20,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E7',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#FF3B30',
  },
});