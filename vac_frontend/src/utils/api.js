import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Base API URL configuration for different environments
let API_BASE_URL = 'http://127.0.0.1:8000/';

// For Android, we need to use the special IP for the emulator to access the host machine
if (Platform.OS === 'android') {
  API_BASE_URL = API_BASE_URL;
}
// For iOS simulator
else if (Platform.OS === 'ios') {
  API_BASE_URL = API_BASE_URL;
}
// Web or other platforms
else {
  API_BASE_URL = API_BASE_URL;
}

console.log('Using API URL for platform:', Platform.OS, API_BASE_URL);

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (without the base URL)
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - Fetch response promise
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    // Get auth token
    const token = await AsyncStorage.getItem('userToken');

    // Set up headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {}),
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Parse response
    const data = await response.json();

    // Handle unauthorized responses
    if (response.status === 401) {
      console.warn('Unauthorized request, token may be invalid');
      // Could implement auto-logout here if needed
    }

    return {
      data,
      status: response.status,
      ok: response.ok
    };
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Login user and store authentication data
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise} - Login response
 */
export const loginUser = async (username, password) => {
  try {
    // First check if server is reachable
    console.log(`Attempting login for user: ${username} to ${API_BASE_URL}login/`);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/o/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      console.log(`Login response status: ${response.status}`);

      const data = await response.json();

      if (response.ok) {
        // Store authentication data
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userId', String(data.user_id));
        await AsyncStorage.setItem('username', data.username);
        await AsyncStorage.setItem('userType', data.user_type);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user_data));

        console.log('User authenticated successfully');
      }

      return {
        data,
        status: response.status,
        ok: response.ok
      };
    } catch (fetchError) {
      // Clear the timeout if there was an error
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        throw new Error('Login request timed out. Server might be unreachable.');
      }

      // If we got a network request failed, provide a more helpful message
      if (fetchError.message.includes('Network request failed')) {
        throw new Error(
          'Network request failed. Please check:\n' +
          '• Django server is running\n' +
          '• You\'re using the correct IP/port\n' +
          '• No firewall/network issues'
        );
      }

      throw fetchError;
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user and clear authentication data
 */
export const logoutUser = async () => {
  try {
    // Clear all auth-related data
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('userType');
    await AsyncStorage.removeItem('userData');

    console.log('User logged out successfully');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Registration response
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    return {
      data,
      status: response.status,
      ok: response.ok
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
export const authApis = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}