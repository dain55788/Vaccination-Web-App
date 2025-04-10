import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  const handleRegister = async () => {
    // Reset error
    setError('');
    
    // Basic validation for compulsory fields
    if (!firstName || !lastName || !email || !phoneNumber || !gender || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    // Create request body
    const userData = {
      first_name: firstName,
      last_name: lastName,
      username: username || email.split('@')[0], // Use part of email as username if not provided
      email: email,
      phone_number: phoneNumber,
      password: password,
      gender: gender.toLowerCase(),
      date_of_birth: formatDate(dateOfBirth),
    };
    
    // Add optional fields if provided
    if (address) userData.address = address;
    
    try {
      // Make API request to Django backend
      const apiUrl = Platform.OS === 'android' 
        ? 'http://10.0.2.2:8000/api/register/' 
        : 'http://127.0.0.1:8000/api/register/';
        
      console.log('Sending registration request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      // In case of network error, check response status
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration error response:', errorData);
        setError(errorData.detail || `Error: ${response.status}`);
        return;
      }
      
      const data = await response.json();
      console.log('Registration successful:', data);
      
      // Registration successful
      Alert.alert(
        'Success',
        'Account created successfully!',
        [{ text: 'Login Now', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again later.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join VaxServe for easy vaccination management</Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                
                <View style={styles.row}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>First Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="First name"
                      value={firstName}
                      onChangeText={setFirstName}
                    />
                  </View>
                  
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>Last Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Last name"
                      value={lastName}
                      onChangeText={setLastName}
                    />
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Choose a username (optional)"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Gender *</Text>
                  <View style={styles.radioContainer}>
                    <TouchableOpacity 
                      style={[styles.radioButton, gender === 'Male' && styles.radioButtonSelected]} 
                      onPress={() => setGender('Male')}
                    >
                      <Text style={styles.radioText}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.radioButton, gender === 'Female' && styles.radioButtonSelected]} 
                      onPress={() => setGender('Female')}
                    >
                      <Text style={styles.radioText}>Female</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Date of Birth *</Text>
                  <TouchableOpacity 
                    style={styles.datePickerButton} 
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text>{formatDate(dateOfBirth)}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dateOfBirth}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Address (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your address"
                    value={address}
                    onChangeText={setAddress}
                    multiline
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
                
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                  <Text style={styles.registerButtonText}>Create Account</Text>
                </TouchableOpacity>
              </View>
              
              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2a6df4',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
  form: {
    marginBottom: 30,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  datePickerButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  radioButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#e6effd',
    borderColor: '#2a6df4',
  },
  radioText: {
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#2a6df4',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#555',
  },
  loginText: {
    color: '#2a6df4',
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 