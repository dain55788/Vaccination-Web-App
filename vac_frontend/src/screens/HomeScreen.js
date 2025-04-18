import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../utils/api';

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Load user data when component mounts
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        const storedUsername = await AsyncStorage.getItem('username');
        
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
        
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Use the API utility for logout
      await logoutUser();
      navigation.replace('Landing');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VaxServe</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome {username ? username : 'to VaxServe'}</Text>
          <Text style={styles.welcomeSubtitle}>Your vaccination management portal</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Vaccination Status</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>COVID-19:</Text>
            <Text style={[styles.statusValue, styles.completed]}>Complete (2/2)</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Flu Shot:</Text>
            <Text style={[styles.statusValue, styles.pending]}>Due in 2 months</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Hepatitis B:</Text>
            <Text style={[styles.statusValue, styles.incomplete]}>Not Started</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Appointments</Text>
          <View style={styles.appointment}>
            <View style={styles.appointmentDate}>
              <Text style={styles.appointmentMonth}>OCT</Text>
              <Text style={styles.appointmentDay}>15</Text>
            </View>
            <View style={styles.appointmentDetails}>
              <Text style={styles.appointmentTitle}>Flu Vaccination</Text>
              <Text style={styles.appointmentLocation}>City Health Center</Text>
              <Text style={styles.appointmentTime}>10:30 AM - 11:00 AM</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.scheduleButton}>
            <Text style={styles.scheduleButtonText}>Schedule New Appointment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Available Vaccines</Text>
          <View style={styles.vaccineItem}>
            <View style={styles.vaccineIconPlaceholder}>
              <Text style={styles.vaccineIconText}>💉</Text>
            </View>
            <View style={styles.vaccineDetails}>
              <Text style={styles.vaccineName}>COVID-19 Booster</Text>
              <Text style={styles.vaccineDescription}>Updated booster for all variants</Text>
            </View>
          </View>
          <View style={styles.vaccineItem}>
            <View style={styles.vaccineIconPlaceholder}>
              <Text style={styles.vaccineIconText}>💉</Text>
            </View>
            <View style={styles.vaccineDetails}>
              <Text style={styles.vaccineName}>Seasonal Flu</Text>
              <Text style={styles.vaccineDescription}>Annual protection against influenza</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All Vaccines</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a6df4',
  },
  logoutButton: {
    padding: 5,
  },
  logoutText: {
    color: '#2a6df4',
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 25,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusLabel: {
    fontSize: 16,
    color: '#333',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  completed: {
    color: '#28a745',
  },
  pending: {
    color: '#ffc107',
  },
  incomplete: {
    color: '#dc3545',
  },
  appointment: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  appointmentDate: {
    width: 60,
    height: 60,
    backgroundColor: '#2a6df4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  appointmentMonth: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  appointmentDay: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  appointmentDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  scheduleButton: {
    backgroundColor: '#2a6df4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  scheduleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  vaccineItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  vaccineIconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#e1e4e8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  vaccineIconText: {
    fontSize: 20,
  },
  vaccineDetails: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  vaccineDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  viewAllButton: {
    borderWidth: 1,
    borderColor: '#2a6df4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  viewAllButtonText: {
    color: '#2a6df4',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen; 