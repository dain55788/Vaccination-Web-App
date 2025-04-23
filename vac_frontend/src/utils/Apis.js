import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

let API_BASE_URL = 'http://127.0.0.1:8000/';

if (Platform.OS === 'android') {
  API_BASE_URL = API_BASE_URL;
}
else if (Platform.OS === 'ios') {
  API_BASE_URL = API_BASE_URL;
}
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
    const token = await AsyncStorage.getItem('userToken');

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (response.status === 401) {
      console.warn('Unauthorized request, token may be invalid');
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
    console.log(`Attempting login for user: ${username} to ${API_BASE_URL}login/`);

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

      clearTimeout(timeoutId);

      console.log(`Login response status: ${response.status}`);

      const data = await response.json();

      if (response.ok) {
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
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        throw new Error('Login request timed out. Server might be unreachable.');
      }

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

export const logoutUser = async () => {
  try {
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