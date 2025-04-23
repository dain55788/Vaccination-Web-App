import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image,
  TextInput,
  Switch,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW } from '../styles/MyStyles';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '01/15/1985',
    address: '123 Main St, Anytown, US 12345',
    emergencyContact: 'Jane Doe - (555) 987-6543'
  });

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

  const upcomingAppointments = [
    {
      id: '1',
      type: 'COVID-19 (Booster)',
      date: '01/10/2024',
      time: '10:30 AM',
      location: 'Community Clinic - Eastside'
    }
  ];

  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    textReminders: true,
    darkMode: false
  });

  const handleToggleSetting = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'This would navigate to an edit profile screen');
  };

  const handleLogout = () => {
    navigation.navigate('Landing');
  };
  
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar style="dark" />
      
      <View style={[commonStyles.header, styles.header]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={commonStyles.scrollViewContent}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitials}>JD</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{userData.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userData.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{userData.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>{userData.dateOfBirth}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{userData.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Emergency Contact:</Text>
            <Text style={styles.infoValue}>{userData.emergencyContact}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vaccination History</Text>
          
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <View key={appointment.id} style={commonStyles.card}>
                <View style={[commonStyles.row, commonStyles.spaceBetween]}>
                  <Text style={commonStyles.cardTitle}>{appointment.type}</Text>
                  <Text style={styles.cardDate}>{appointment.date}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={commonStyles.text}>Time: {appointment.time}</Text>
                  <Text style={commonStyles.text}>Location: {appointment.location}</Text>
                </View>
                <View style={styles.appointmentActions}>
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
              <Text style={styles.emptyStateText}>No upcoming appointments</Text>
            </View>
          )}

          <TouchableOpacity 
            style={commonStyles.button}
            onPress={() => navigation.navigate('Appointment')}
          >
            <Text style={commonStyles.buttonText}>Schedule New Appointment</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={commonStyles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleToggleSetting('notifications')}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Email Updates</Text>
              <Switch
                value={settings.emailUpdates}
                onValueChange={() => handleToggleSetting('emailUpdates')}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Text Reminders</Text>
              <Switch
                value={settings.textReminders}
                onValueChange={() => handleToggleSetting('textReminders')}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Switch
                value={settings.darkMode}
                onValueChange={() => handleToggleSetting('darkMode')}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Additional styles specific to ProfileScreen
const styles = {
  header: {
    justifyContent: 'space-between',
  },
  backButton: {
    padding: SPACING.small,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.medium,
  },
  editButton: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.medium,
    fontWeight: '500',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  profileImageContainer: {
    marginBottom: SPACING.medium,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: FONT_SIZE.enormous,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  profileName: {
    fontSize: FONT_SIZE.huge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.medium,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.small,
    width: '100%',
    paddingHorizontal: SPACING.medium,
  },
  infoLabel: {
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
    color: COLORS.text.secondary,
    width: 140,
  },
  infoValue: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.primary,
    flex: 1,
  },
  section: {
    marginBottom: SPACING.large,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.medium,
  },
  cardDate: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.secondary,
  },
  cardBody: {
    marginVertical: SPACING.small,
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
    marginTop: SPACING.small,
  },
  addRecordButton: {
    marginTop: SPACING.medium,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.medium,
  },
  rescheduleButton: {
    flex: 1,
    marginRight: SPACING.small,
  },
  cancelButton: {
    flex: 1,
    marginLeft: SPACING.small,
    backgroundColor: COLORS.danger,
  },
  emptyState: {
    padding: SPACING.large,
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    ...SHADOW.light,
  },
  emptyStateText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.secondary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingLabel: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.primary,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
  },
  footer: {
    height: 20,
  },
};

export default ProfileScreen; 