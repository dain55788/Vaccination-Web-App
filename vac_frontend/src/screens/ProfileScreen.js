import React, { useState } from 'react';
import { 
  StyleSheet, 
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

const ProfileScreen = ({ navigation }) => {
  // Mock user data - in a real app, this would come from an API or local storage
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '01/15/1985',
    address: '123 Main St, Anytown, US 12345',
    emergencyContact: 'Jane Doe - (555) 987-6543'
  });

  // Vaccination history
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

  // Upcoming appointments
  const upcomingAppointments = [
    {
      id: '1',
      type: 'COVID-19 (Booster)',
      date: '01/10/2024',
      time: '10:30 AM',
      location: 'Community Clinic - Eastside'
    }
  ];

  // Settings
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
    // In a real app, navigate to edit profile screen
    Alert.alert('Edit Profile', 'This would navigate to an edit profile screen');
  };

  const handleLogout = () => {
    // In a real app, clear auth tokens, etc.
    navigation.navigate('Landing');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
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

        {/* Vaccination History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vaccination History</Text>
          
          {vaccinationHistory.map((record) => (
            <View key={record.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{record.type}</Text>
                <Text style={styles.cardDate}>{record.date}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardText}>Location: {record.location}</Text>
                <Text style={styles.cardText}>Dose: {record.dose}</Text>
              </View>
              <TouchableOpacity style={styles.viewDetailsButton}>
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addRecordButton}>
            <Text style={styles.addRecordText}>+ Add External Vaccination Record</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Appointments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{appointment.type}</Text>
                  <Text style={styles.cardDate}>{appointment.date}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardText}>Time: {appointment.time}</Text>
                  <Text style={styles.cardText}>Location: {appointment.location}</Text>
                </View>
                <View style={styles.appointmentActions}>
                  <TouchableOpacity style={styles.rescheduleButton}>
                    <Text style={styles.rescheduleText}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancel</Text>
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
            style={styles.scheduleButton}
            onPress={() => navigation.navigate('Appointment')}
          >
            <Text style={styles.scheduleButtonText}>Schedule New Appointment</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch 
              value={settings.notifications}
              onValueChange={() => handleToggleSetting('notifications')}
              trackColor={{ false: "#767577", true: "#2a6df4" }}
              thumbColor={"#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Email Updates</Text>
            <Switch 
              value={settings.emailUpdates}
              onValueChange={() => handleToggleSetting('emailUpdates')}
              trackColor={{ false: "#767577", true: "#2a6df4" }}
              thumbColor={"#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Text Reminders</Text>
            <Switch 
              value={settings.textReminders}
              onValueChange={() => handleToggleSetting('textReminders')}
              trackColor={{ false: "#767577", true: "#2a6df4" }}
              thumbColor={"#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch 
              value={settings.darkMode}
              onValueChange={() => handleToggleSetting('darkMode')}
              trackColor={{ false: "#767577", true: "#2a6df4" }}
              thumbColor={"#f4f3f4"}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2a6df4',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    fontSize: 16,
    color: '#2a6df4',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2a6df4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    width: '35%',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    width: '65%',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a6df4',
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },
  cardBody: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#2a6df4',
    fontWeight: '500',
  },
  addRecordButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  addRecordText: {
    fontSize: 16,
    color: '#2a6df4',
    fontWeight: '500',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  rescheduleButton: {
    marginRight: 15,
  },
  rescheduleText: {
    fontSize: 14,
    color: '#2a6df4',
    fontWeight: '500',
  },
  cancelButton: {},
  cancelText: {
    fontSize: 14,
    color: '#ff3b30',
    fontWeight: '500',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
  },
  scheduleButton: {
    backgroundColor: '#2a6df4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  scheduleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen; 