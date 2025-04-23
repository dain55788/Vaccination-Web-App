import React, { useState } from 'react';
import { 
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
  Alert,
  ImageBackground
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW } from '../styles/MyStyles';
import { LinearGradient } from 'expo-linear-gradient';

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
    <SafeAreaView style={[commonStyles.safeArea, styles.container]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <LinearGradient
              colors={[COLORS.primary, '#1a4dc7']} 
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Create Account</Text>
                <Text style={styles.headerSubtitle}>Join VaxServe for easy vaccination management</Text>
              </View>
            </LinearGradient>

            <View style={styles.formCard}>
              {error ? <Text style={[commonStyles.errorText, styles.errorText]}>{error}</Text> : null}
              
              <View style={commonStyles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>First Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="First name"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholderTextColor={COLORS.text.muted}
                  />
                </View>
                
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Last Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Last name"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholderTextColor={COLORS.text.muted}
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
                  placeholderTextColor={COLORS.text.muted}
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
                  placeholderTextColor={COLORS.text.muted}
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
                  placeholderTextColor={COLORS.text.muted}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender *</Text>
                <View style={styles.radioContainer}>
                  <TouchableOpacity 
                    style={[styles.radioButton, gender === 'Male' && styles.radioButtonSelected]} 
                    onPress={() => setGender('Male')}
                  >
                    <View style={gender === 'Male' ? styles.radioInnerSelected : styles.radioInner} />
                    <Text style={styles.radioLabel}>Male</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.radioButton, gender === 'Female' && styles.radioButtonSelected]} 
                    onPress={() => setGender('Female')}
                  >
                    <View style={gender === 'Female' ? styles.radioInnerSelected : styles.radioInner} />
                    <Text style={styles.radioLabel}>Female</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.radioButton, gender === 'Other' && styles.radioButtonSelected]} 
                    onPress={() => setGender('Other')}
                  >
                    <View style={gender === 'Other' ? styles.radioInnerSelected : styles.radioInner} />
                    <Text style={styles.radioLabel}>Other</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Date of Birth *</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>{formatDate(dateOfBirth)}</Text>
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
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Enter your address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={COLORS.text.muted}
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor={COLORS.text.muted}
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
                  placeholderTextColor={COLORS.text.muted}
                />
              </View>
              
              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Create Account</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginText}>
                  Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    backgroundColor: COLORS.background.secondary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingVertical: SPACING.large,
    paddingHorizontal: SPACING.medium,
    marginBottom: -SPACING.large,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.huge,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.small,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    margin: SPACING.medium,
    marginTop: SPACING.extraLarge,
    padding: SPACING.large,
    ...SHADOW.medium,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: SPACING.medium,
    fontSize: FONT_SIZE.medium,
  },
  inputContainer: {
    marginBottom: SPACING.medium,
  },
  halfWidth: {
    flex: 1,
    marginRight: SPACING.small,
  },
  label: {
    fontSize: FONT_SIZE.regular,
    color: COLORS.text.primary,
    fontWeight: '500',
    marginBottom: SPACING.small,
  },
  input: {
    backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.medium,
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.primary,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.small,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.small,
    ...SHADOW.light,
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightGray,
  },
  radioInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginRight: SPACING.small,
  },
  radioInnerSelected: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: SPACING.small,
  },
  radioLabel: {
    fontSize: FONT_SIZE.regular,
    color: COLORS.text.primary,
  },
  dateButton: {
    backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.medium,
  },
  dateButtonText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.medium,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.medium,
    ...SHADOW.medium,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: SPACING.medium,
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.medium,
  },
  loginTextBold: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
};

export default RegisterScreen; 