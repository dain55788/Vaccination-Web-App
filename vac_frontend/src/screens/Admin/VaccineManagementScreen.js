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
import commonStyles, { COLORS, FONT_SIZE, SPACING } from '../../styles/MyStyles';
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "../../utils/MyContexts";
import { useContext } from "react";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { Button, HelperText, TextInput } from "react-native-paper";

const VaccineManagementScreen = () => {
  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const appointmentEndpoint = endpoints['appointment-bycitizen'](user.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [vaccine, setVaccine] = useState([]);
  const vaccineEndpoint = endpoints['vaccine'];
  const availabelVaccines = vaccine;

  useEffect(() => {
    const fetchVaccine = async () => {
      try {
        const response = await Apis.get(vaccineEndpoint);
        const vaccines = response.data.results;
        setVaccine(vaccines);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };

    fetchVaccine();
  }, []);

  const filteredVaccine = vaccine.filter(vaccine => {
    const searchLower = searchQuery.toLowerCase();
    return (
      vaccine.name?.toLowerCase().includes(searchLower) ||
      vaccine.id.toString().includes(searchLower)
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
        <Text style={commonStyles.headerTitle}>VaccineAdmin</Text>
        <TouchableOpacity onPress={
          () => {
            nav.navigate('CampaignManagement');
          }
        } style={styles.logoutButton}>
          <Text style={{ color: COLORS.primary, fontWeight: '500' }}>Campaign</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={commonStyles.scrollViewContent}>
        <View style={styles.welcomeSection}>
          <Text style={commonStyles.title}>Hi, {user.username}</Text>
          <Text style={commonStyles.subtitle}>Your vaccination management portal.</Text>
        </View>

        <Text style={commonStyles.cardTitle}>All Available Vaccines</Text>
        <TextInput
            style={commonStyles.input}
            placeholder="🔎 Search vaccines by name or ID"
            value={searchQuery}
            onChangeText={setSearchQuery}
        />
        {filteredVaccine.length > 0 ? (
          filteredVaccine.map((availableVaccine) => (
            <View style={commonStyles.card}>
              <View style={styles.vaccineItem}>
                <View style={styles.vaccineIconPlaceholder}>
                  <Text style={styles.vaccineIconText}>🦠</Text>
                </View>
                <View style={styles.vaccineDetails}>
                  <Text style={styles.vaccineName}>{availableVaccine.vaccine_name}</Text>
                  <Text style={styles.vaccineDescription}>Instruction: {availableVaccine.instruction}</Text>
                  <Text style={commonStyles.vaccineDoseQuantity}>Current Dose: {availableVaccine.dose_quantity}</Text>
                </View>
              </View>
              <View style={commonStyles.appointmentActions}>
                <TouchableOpacity style={[commonStyles.button, styles.rescheduleButton]}>
                  <Text style={commonStyles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[commonStyles.button, styles.cancelButton]}>
                  <Text style={commonStyles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={commonStyles.errorText}>No available vaccines, please create new vaccines!</Text>
          </View>
        )}
        <TouchableOpacity style={[commonStyles.button, styles.viewAllButton]}>
          <Text style={commonStyles.buttonText}>See more Vaccines</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  rescheduleButton: {
    flex: 1,
    marginRight: SPACING.small,
    marginTop: -10,
  },
  cancelButton: {
    flex: 1,
    marginLeft: SPACING.small,
    marginTop: -10,
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
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  vaccineDescription: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  viewAllButton: {
    marginTop: SPACING.small,
  },
};

export default VaccineManagementScreen; 