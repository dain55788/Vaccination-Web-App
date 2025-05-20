import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles, { COLORS, SPACING } from '../../styles/MyStyles';
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "../../utils/MyContexts";
import { useContext } from "react";
import Apis, { endpoints } from "../../utils/Apis";
import { TextInput } from "react-native-paper";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const HomeScreen = () => {
  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const [userUpcomingAppointments, setUserUpcomingAppointments] = useState([]);
  const appointmentEndpoint = endpoints['appointment-bycitizen'](user.id);
  const [searchQuery, setSearchQuery] = useState('');
  const appointmentVaccineEndpoint = endpoints['appointmentvaccine'];
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const vaccineEndpoint = endpoints['vaccine'];
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loadingDownload, setLoadingDownload] = useState(false);

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

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailsModalVisible(true);
  };

  const detailFields = [
    {
      label: 'Vaccine Name',
      icon: 'information',
      field: 'type',
      description: 'Vaccine Name'
    },
    {
      label: 'Dose Quantity',
      icon: 'information',
      field: 'dose',
      description: 'Dose information'
    },
    {
      label: 'Location',
      icon: 'map-marker',
      field: 'location',
      description: 'Vaccination location'
    },
    {
      label: 'Date',
      icon: 'calendar',
      field: 'date',
      description: 'Scheduled date'
    },
    {
      label: 'Doctor Notes',
      icon: 'note-text',
      field: 'notes',
      description: 'Additional notes'
    },
    {
      label: 'Cost',
      icon: 'currency-usd',
      field: 'cost',
      description: 'Cost of vaccination'
    }
  ];

  const generateCertificateHTML = (record) => {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica', sans-serif;
              margin: 30px;
              background-color: #f9f9f9;
              position: relative;
            }
            .certificate {
              max-width: 600px;
              margin: 0 auto;
              border: 2px solid #007bff;
              border-radius: 10px;
              padding: 30px;
              background: linear-gradient(to bottom, #ffffff, #f0f8ff);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              position: relative;
              overflow: hidden;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 60px;
              color: rgba(0, 123, 255, 0.1);
              font-family: 'Georgia', serif;
              pointer-events: none;
              z-index: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              position: relative;
              z-index: 1;
            }
            .logo-placeholder {
              width: 80px;
              height: 80px;
              background-color: #e0e0e0;
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
              color: #007bff;
            }
            h1 {
              font-family: 'Georgia', serif;
              color: #007bff;
              font-size: 28px;
              margin-bottom: 10px;
            }
            .header p {
              font-size: 14px;
              color: #333;
              margin: 5px 0;
            }
            h2 {
              font-family: 'Georgia', serif;
              font-size: 20px;
              color: #005566;
              border-bottom: 2px solid #007bff;
              padding-bottom: 5px;
              margin: 20px 0 10px;
            }
            .field {
              display: flex;
              align-items: center;
              margin: 12px 0;
              font-size: 14px;
            }
            .field-icon {
              font-size: 18px;
              margin-right: 10px;
              color: #007bff;
            }
            .label {
              font-weight: bold;
              color: #333;
              width: 120px;
            }
            .value {
              flex: 1;
              color: #555;
            }
            .hr-decor {
              border: none;
              border-top: 1px dashed #007bff;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #666;
              font-style: italic;
              position: relative;
              z-index: 1;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="watermark">VaxServe Certified</div>
            <div class="header">
              <div class="logo-placeholder">🩺</div>
              <h1>Vaccination Certificate</h1>
              <p>Issued to: <strong>${user.username}</strong></p>
              <p>Certificate ID: <strong>${record.id}</strong></p>
              <p>Issued on: <strong>${new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}</strong></p>
            </div>
            <hr class="hr-decor" />
            <h2>Vaccination Details</h2>
            <div class="field">
              <span class="field-icon">💉</span>
              <span class="label">Vaccine Name:</span>
              <span class="value">${record.type}</span>
            </div>
            <div class="field">
              <span class="field-icon">💊</span>
              <span class="label">Dose:</span>
              <span class="value">${record.dose}</span>
            </div>
            <div class="field">
              <span class="field-icon">📍</span>
              <span class="label">Location:</span>
              <span class="value">${record.location}</span>
            </div>
            <div class="field">
              <span class="field-icon">📅</span>
              <span class="label">Date:</span>
              <span class="value">${record.date}</span>
            </div>
            <div class="field">
              <span class="field-icon">📝</span>
              <span class="label">Notes:</span>
              <span class="value">${record.notes}</span>
            </div>
            <div class="field">
              <span class="field-icon">💵</span>
              <span class="label">Cost:</span>
              <span class="value">${record.cost}</span>
            </div>
            <hr class="hr-decor" />
            <div class="footer">
              This certificate verifies that the above individual has received the specified vaccination as recorded in the VaxServe system.
            </div>
          </div>
        </body>
      </html>
`;
  };

  const handleDownloadCertificate = async () => {
    if (!selectedRecord) return;
    setLoadingDownload(true);
    try {
      const htmlContent = generateCertificateHTML(selectedRecord);

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      const filename = `Vaccination_Certificate_${selectedRecord.id}.pdf`;
      const newUri = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share or Save Vaccination Certificate',
        });
      } else {
        alert(`PDF saved to ${newUri}`);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setLoadingDownload(false);
    }
  };

  useEffect(() => {
    const fetchAppointmentsAndVaccines = async () => {
      try {
        const appointmentResponse = await Apis.get(appointmentEndpoint);
        const appointments = appointmentResponse.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredAppointments = appointments.filter(appointment => {
          const scheduledDate = new Date(appointment.scheduled_date);
          return scheduledDate > today;
        });
        setUserUpcomingAppointments(filteredAppointments);

        const vaccineResponse = await Apis.get(appointmentVaccineEndpoint);
        const appointmentVaccines = vaccineResponse.data.results || vaccineResponse.data;

        const vaccinesResponse = await Apis.get(vaccineEndpoint);
        const vaccines = vaccinesResponse.data.results || vaccinesResponse.data;

        const completedVaccines = appointmentVaccines.filter(
          vaccine => vaccine.status.toLowerCase() === 'completed'
        );

        const history = completedVaccines
          .map(vaccine => {
            const matchingAppointment = appointments.find(
              appointment => appointment.id === vaccine.appointment
            );

            const matchingVaccine = vaccines.find(
              v => v.id === vaccine.vaccine_info.id
            );

            if (matchingAppointment && matchingVaccine) {
              return {
                id: vaccine.id.toString(),
                type: matchingVaccine.vaccine_name,
                date: matchingAppointment.scheduled_date,
                appointment: matchingAppointment.id,
                location: matchingAppointment.location,
                dose:
                  vaccine.dose_quantity_used && vaccine.vaccine_info?.dose_quantity
                    ? `${vaccine.dose_quantity_used}`
                    : vaccine.dose_quantity_used,
                notes: vaccine.notes,
                cost: vaccine.cost ? `$${vaccine.cost.toFixed(2)}` : 'Unknown Cost'
              };
            }
            return null;
          })
          .filter(item => item !== null);

        setVaccinationHistory(history);
      } catch (error) {
        console.error('Error fetching appointments or vaccines:', error);
      }
    };

    fetchAppointmentsAndVaccines();
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

          {vaccinationHistory.length > 0 ? (
            vaccinationHistory.map((record) => (
              <View key={record.id} style={commonStyles.card}>
                <View style={[commonStyles.row, commonStyles.spaceBetween]}>
                  <Text style={commonStyles.cardTitle}>{record.type}</Text>
                  <Text style={styles.cardDate}>{record.date}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={commonStyles.text}>Appointment ID: {record.appointment}</Text>
                  <Text style={commonStyles.text}>Location: {record.location}</Text>
                  <Text style={commonStyles.vaccineDoseQuantity}>Dose: {record.dose}</Text>
                </View>
                <TouchableOpacity style={[commonStyles.button, commonStyles.buttonOutline, styles.viewDetailsButton]}
                  onPress={() => handleViewDetails(record)} >
                  <Text style={commonStyles.buttonOutlineText}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={commonStyles.errorText}>No vaccination history available</Text>
            </View>
          )}

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDetailsModalVisible}
        onRequestClose={() => setIsDetailsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={commonStyles.modalContainer}
          >
            <ScrollView contentContainerStyle={{ paddingBottom: SPACING.large }}>
              <View style={commonStyles.modalContent}>
                <Text style={[commonStyles.cardTitle, { marginBottom: SPACING.large }]}>
                  Vaccination Record Details
                </Text>
                {selectedRecord && detailFields.map(field => (
                  <View key={field.field}>
                    <TextInput
                      style={commonStyles.input}
                      label={field.label}
                      value={selectedRecord[field.field]}
                      right={<TextInput.Icon icon={field.icon} />}
                      disabled={true}
                      multiline={field.field === 'notes'}
                    />
                  </View>
                ))}

                <View style={commonStyles.appointmentActions}>
                  <TouchableOpacity
                    style={[commonStyles.button, styles.rescheduleButton]}
                    onPress={handleDownloadCertificate}
                    disabled={loadingDownload}
                  >
                    <Text style={commonStyles.buttonText}>Take PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[commonStyles.button, styles.cancelButton]}
                    onPress={() => setIsDetailsModalVisible(false)}
                  >
                    <Text style={commonStyles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
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