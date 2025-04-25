import React, { useEffect, useState } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles, { COLORS, SPACING } from '../styles/MyStyles';
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "../utils/MyContexts";
import { useContext } from "react";

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const nav = useNavigation();
  const user = useContext(MyUserContext); 
  const dispatch = useContext(MyDispatchContext);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      dispatch({ type: 'logout' });
      nav.reset({
        index: 0,
        routes: [{ name: 'Landing' }],
      });
      console.info('Successfully log user out!!');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  useEffect(() => {
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

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar style="dark" />
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>VaxServe</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={{ color: COLORS.primary, fontWeight: '500' }}>Logout</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={commonStyles.scrollViewContent}>
        <View style={styles.welcomeSection}>
          <Text style={commonStyles.title}>Welcome {username ? username : 'to VaxServe'}</Text>
          <Text style={commonStyles.subtitle}>Your vaccination management portal</Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Your Vaccination Status</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>COVID-19:</Text>
            <Text style={[styles.statusValue, commonStyles.completed]}>Complete (2/2)</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Flu Shot:</Text>
            <Text style={[styles.statusValue, commonStyles.pending]}>Due in 2 months</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Hepatitis B:</Text>
            <Text style={[styles.statusValue, commonStyles.incomplete]}>Not Started</Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Upcoming Appointments</Text>
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
          <TouchableOpacity style={commonStyles.button}>
            <Text style={commonStyles.buttonText}>Schedule New Appointment</Text>
          </TouchableOpacity>
        </View>

        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Available Vaccines</Text>
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
          <TouchableOpacity style={[commonStyles.button, styles.viewAllButton]}>
            <Text style={commonStyles.buttonText}>View All Vaccines</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  logoutButton: {
    padding: 5,
  },
  welcomeSection: {
    marginBottom: SPACING.extraLarge,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.small,
    paddingBottom: SPACING.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  statusLabel: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  appointment: {
    flexDirection: 'row',
    marginBottom: SPACING.medium,
  },
  appointmentDate: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.small,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    marginRight: SPACING.medium,
  },
  appointmentMonth: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  appointmentDay: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  appointmentLocation: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 2,
  },
  vaccineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.medium,
  },
  vaccineIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.medium,
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
    color: COLORS.text.primary,
  },
  vaccineDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  viewAllButton: {
    marginTop: SPACING.small,
  },
};

export default HomeScreen; 