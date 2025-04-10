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
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const LoginScreen = ({ navigation }) => {
  const [userIdentifier, setUserIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Reset error
    setError('');
    
    // Basic validation
    if (!userIdentifier || !password) {
      setError('Please enter both username/email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Make API request to Django backend
      const apiUrl = Platform.OS === 'ios'
        ? 'http://10.0.2.2:8000/api/login/' 
        : 'http://127.0.0.1:8000/api/login/';
      
      console.log('Sending login request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          user_identifier: userIdentifier, // Backend will check if this is email or username
          password: password,
        }),
      });
      
      // In case of network error, check response status
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error response:', errorData);
        setError(errorData.detail || `Error: ${response.status}`);
        setIsLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('Login successful:', data);
      
      // Store auth token securely (would use AsyncStorage or SecureStore in a real app)
      // For demo purposes, we'll just navigate to the home screen
      setIsLoading(false);
      navigation.replace('Home');
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again later.');
      setIsLoading(false);
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
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Welcome back to VaxServe</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username or Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username or email"
                  value={userIdentifier}
                  onChangeText={setUserIdentifier}
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#2a6df4',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#2a6df4',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#a0c0f8',
  },
  loginButtonText: {
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
  signupText: {
    color: '#2a6df4',
    fontWeight: 'bold',
  },
});

export default LoginScreen; 