import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles, { COLORS, SPACING } from '../../styles/MyStyles';
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "../../utils/MyContexts";
import { useContext } from "react";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { Button, HelperText, TextInput } from "react-native-paper";

const HomeScreen = () => {
  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const [userUpcomingAppointments, setUserUpcomingAppointments] = useState([]);
  const appointmentEndpoint = endpoints['appointment-bycitizen'](user.id);
  const [searchQuery, setSearchQuery] = useState('');

  const vaccinationHistory = [
    {
      id: '1',
      type: 'COVID-19 (Pfizer)',
      date: '06/12/2023',
      location: 'Main Hospital - Downtown',
      dose: '1st Dose'
    },
    {
      id: '2',
      type: 'COVID-19 (Pfizer)',
      date: '07/03/2023',
      location: 'Main Hospital - Downtown',
      dose: '2nd Dose'
    },
    {
      id: '3',
      type: 'Influenza',
      date: '10/15/2023',
      location: 'Health Center - Westpark',
      dose: 'Annual'
    }
  ];

  const handleLogout = () => {
    try {
      AsyncStorage.removeItem('token');
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
    const fetchAppointments = async () => {
      try {
        const response = await Apis.get(appointmentEndpoint);
        const appointments = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredAppointments = appointments.filter(appointment => {
          const scheduledDate = new Date(appointment.scheduled_date);
          return scheduledDate > today;
        });

        setUserUpcomingAppointments(filteredAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = userUpcomingAppointments.filter(appointment => {
    const searchLower = searchQuery.toLowerCase();
    return (
      appointment.location?.toLowerCase().includes(searchLower) ||
      appointment.id.toString().includes(searchLower)
    );
  });

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar style="dark" />
      <View style={commonStyles.header}>
        <TouchableOpacity
          style={commonStyles.backButton}
          onPress={() => nav.goBack()}
        >
          <Text style={commonStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={{ color: COLORS.primary, fontWeight: '500' }}>Logout</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={commonStyles.scrollViewContent}>
        <View style={styles.welcomeSection}>
          <Text style={commonStyles.title}>Welcome {user.username + ' to VaxServe'}</Text>
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

        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Vaccination History</Text>

          {vaccinationHistory.map((record) => (
            <View key={record.id} style={commonStyles.card}>
              <View style={[commonStyles.row, commonStyles.spaceBetween]}>
                <Text style={commonStyles.cardTitle}>{record.type}</Text>
                <Text style={styles.cardDate}>{record.date}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={commonStyles.text}>Location: {record.location}</Text>
                <Text style={commonStyles.text}>Dose: {record.dose}</Text>
              </View>
              <TouchableOpacity style={[commonStyles.button, commonStyles.buttonOutline, styles.viewDetailsButton]}>
                <Text style={commonStyles.buttonOutlineText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={[commonStyles.button, commonStyles.buttonOutline, styles.addRecordButton]}>
            <Text style={commonStyles.buttonOutlineText}>+ Add External Vaccination Record</Text>
          </TouchableOpacity>
        </View>

        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Upcoming Appointments</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="🔎 Search appointments by location or ID"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <View key={appointment.id} style={commonStyles.card}>
                <View style={[commonStyles.row, commonStyles.spaceBetween]}>
                  <Text style={commonStyles.cardTitle}>{'COVID-19 (Booster)'}</Text>
                  <Text style={styles.cardDate}>{appointment.scheduled_date}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={commonStyles.text}>Appointment ID: {appointment.id}</Text>
                  <Text style={commonStyles.text}>Notes: {appointment.notes}</Text>
                  <Text style={commonStyles.text}>Location: {appointment.location}</Text>
                </View>
                <View style={commonStyles.appointmentActions}>
                  <TouchableOpacity style={[commonStyles.button, styles.rescheduleButton]}>
                    <Text style={commonStyles.buttonText}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[commonStyles.button, styles.cancelButton]}>
                    <Text style={commonStyles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={commonStyles.errorText}>No upcoming appointments</Text>
            </View>
          )}

          <TouchableOpacity
            style={commonStyles.button}
            onPress={() => nav.navigate('Appointment')}
          >
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
  rescheduleButton: {
    flex: 1,
    marginRight: SPACING.small,
  },
  cancelButton: {
    flex: 1,
    marginLeft: SPACING.small,
    backgroundColor: COLORS.danger,
  },
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