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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../utils/api';

const LoginScreen = ({ navigation }) => {
  const [userIdentifier, setUserIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);

  const handleLogin = async () => {
    // Reset error
    setError('');
    setServerStatus(null);
    
    // Basic validation
    if (!userIdentifier || !password) {
      setError('Please enter both username/email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting login with credentials...');
      // Use the API utility for login
      const result = await loginUser(userIdentifier, password);
      
      console.log('Login result:', result);
      
      if (result.ok) {
        console.log('Login successful, navigating to Home');
        // Login successful - navigation is handled after storing auth data
        navigation.replace('Home');
      } else {
        // Login failed
        const errorMessage = result.data?.error || 
                          (result.data?.non_field_errors ? result.data.non_field_errors.join(', ') : null) ||
                          `Login failed (${result.status}). Please try again.`;
        console.log('Setting error message:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Login error details:', error);
      setError(error.message || 'Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const testApiConnection = async () => {
    try {
      setServerStatus('Testing connection...');
      
      // Simple fetch to test if the server is reachable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(Platform.OS === 'android' 
                                  ? 'http://127.0.0.1:8000' 
                                  : 'http://127.0.0.1:8000', {
        signal: controller.signal
      }).catch(e => {
        throw e;
      });
      
      clearTimeout(timeoutId);
      
      setServerStatus(`✅ Server reachable (status: ${response.status})`);
    } catch (error) {
      console.log('Connection test error:', error);
      if (error.name === 'AbortError') {
        setServerStatus('❌ Connection timeout. Server unreachable.');
      } else {
        setServerStatus(`❌ Connection failed: ${error.message}`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome To VaxServe</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {serverStatus ? <Text style={styles.serverStatus}>{serverStatus}</Text> : null}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Username or Email"
                value={userIdentifier}
                onChangeText={setUserIdentifier}
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.testButton}
              onPress={testApiConnection}
            >
              <Text style={styles.testButtonText}>Test Server Connection</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.registerTextBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#2a6df4',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0c0f8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#555',
  },
  registerTextBold: {
    fontWeight: 'bold',
    color: '#2a6df4',
  },
  serverStatus: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  testButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  testButtonText: {
    color: '#333',
    fontSize: 14,
  },
});

export default LoginScreen; 