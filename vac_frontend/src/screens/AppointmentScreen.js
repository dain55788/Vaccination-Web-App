import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const AppointmentScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [vaccineType, setVaccineType] = useState('');
  const [notes, setNotes] = useState('');

  const locations = [
    "Main Hospital - Downtown",
    "Community Clinic - Eastside",
    "Health Center - Westpark",
    "Medical Plaza - Northpoint",
    "Wellness Center - Southlake"
  ];

  const vaccineTypes = [
    "COVID-19",
    "Influenza (Flu)",
    "Tdap (Tetanus, Diphtheria, Pertussis)",
    "MMR (Measles, Mumps, Rubella)",
    "Hepatitis B",
    "HPV (Human Papillomavirus)",
    "Pneumococcal"
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"
  ];

  const handleSubmit = () => {
    // Validate fields
    if (!fullName || !email || !phone || !date || !time || !location || !vaccineType) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    // In a real app, you would submit this data to your backend
    Alert.alert(
      "Appointment Scheduled",
      `Thank you, ${fullName}. Your appointment for ${vaccineType} vaccination has been scheduled for ${date} at ${time}.`,
      [
        { 
          text: "OK", 
          onPress: () => navigation.navigate('Home') 
        }
      ]
    );
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
        <Text style={styles.headerTitle}>Schedule Appointment</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
          
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date *</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="MM/DD/YYYY"
              // In a full app, use a proper date picker component
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Preferred Time *</Text>
            <View style={styles.optionsContainer}>
              {timeSlots.slice(0, 4).map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    time === slot && styles.selectedOption
                  ]}
                  onPress={() => setTime(slot)}
                >
                  <Text style={[
                    styles.optionText,
                    time === slot && styles.selectedOptionText
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.optionsContainer}>
              {timeSlots.slice(4, 8).map((slot, index) => (
                <TouchableOpacity
                  key={index + 4}
                  style={[
                    styles.optionButton,
                    time === slot && styles.selectedOption
                  ]}
                  onPress={() => setTime(slot)}
                >
                  <Text style={[
                    styles.optionText,
                    time === slot && styles.selectedOptionText
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.optionsContainer}>
              {timeSlots.slice(8).map((slot, index) => (
                <TouchableOpacity
                  key={index + 8}
                  style={[
                    styles.optionButton,
                    time === slot && styles.selectedOption
                  ]}
                  onPress={() => setTime(slot)}
                >
                  <Text style={[
                    styles.optionText,
                    time === slot && styles.selectedOptionText
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.optionsContainer}>
              {locations.slice(0, 3).map((loc, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.locationButton,
                    location === loc && styles.selectedOption
                  ]}
                  onPress={() => setLocation(loc)}
                >
                  <Text style={[
                    styles.locationText,
                    location === loc && styles.selectedOptionText
                  ]}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.optionsContainer}>
              {locations.slice(3).map((loc, index) => (
                <TouchableOpacity
                  key={index + 3}
                  style={[
                    styles.locationButton,
                    location === loc && styles.selectedOption
                  ]}
                  onPress={() => setLocation(loc)}
                >
                  <Text style={[
                    styles.locationText,
                    location === loc && styles.selectedOptionText
                  ]}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Vaccine Type *</Text>
            <View style={styles.vaccineContainer}>
              {vaccineTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.vaccineButton,
                    vaccineType === type && styles.selectedOption
                  ]}
                  onPress={() => setVaccineType(type)}
                >
                  <Text style={[
                    styles.vaccineText,
                    vaccineType === type && styles.selectedOptionText
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any health concerns or special requests"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Schedule Appointment</Text>
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
  placeholder: {
    width: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
    marginTop: 10,
    color: '#333',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  optionText: {
    color: '#555',
    fontSize: 14,
  },
  selectedOption: {
    backgroundColor: '#2a6df4',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  locationButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
    flex: 1,
  },
  locationText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
  vaccineContainer: {
    marginTop: 5,
  },
  vaccineButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 8,
  },
  vaccineText: {
    color: '#555',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2a6df4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AppointmentScreen; 