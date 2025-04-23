import React, { useContext, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  Image,
  ImageBackground
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { loginUser, authApis, endpoints } from "../utils/Apis";
import commonStyles, { COLORS, SPACING, FONT_SIZE, SHADOW, BORDER_RADIUS } from '../styles/MyStyles';

import Constants from 'expo-constants';
import { Button, HelperText, TextInput, Divider } from 'react-native-paper';
const { CLIENT_ID, CLIENT_SECRET } = Constants.expoConfig.extra;
import { MyDispatchContext } from "../utils/MyContexts";

const LoginScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const dispatch = useContext(MyDispatchContext);

  const info = [{
    label: 'Tên đăng nhập',
    icon: "account",
    secureTextEntry: false,
    field: "username"
  }, {
    label: 'Mật khẩu',
    icon: "eye",
    secureTextEntry: true,
    field: "password"
  }];

  const setState = (value, field) => {
    setUser({ ...user, [field]: value });
  }
  
  const validate = () => {
    if (!user?.username || !user?.password) {
      setMsg("Vui lòng nhập tên đăng nhập và mật khẩu !");
      return false;
    }

    setMsg(null);
    return true;
  }

  const setMsg = (message) => {
    setError(message);
  }

  const handleLogin = async () => {
    setMsg('');


    if (validate() === true) {
      try {
        setIsLoading(true);
        let res = await Apis.post(endpoints['login'], {
          ...user,
          "client_id": "Je29bz1Ewro4XUQkTPunuEB9qjIgD0Z90VWZxf34",
          "client_secret": '56vLL47QDw1YXz03iwHSsiRo9yt7EcdRmEwE78ROi1lIjXoLTB60YQnPgu3ecKczSFGBc2bebaJo7a2sEzi33x1yc6LueOnRBHOzEpzHRpHN2pdAIxrbtQn2ZwFqSJR2',
          'grant_type': 'password'
        });
        
        await AsyncStorage.setItem('token', res.data.access_token);
        let u = await authApis(res.data.access_token).get(endpoints['current-user']);
        dispatch({
          "type": "login",
          "payload": u.data
        })
      } catch (error) {
        console.error('Login error details:', error);
        // setMsg(error.message || 'Network error. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const testApiConnection = async () => {
    try {
      setServerStatus('Testing connection...');

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
    <SafeAreaView style={[commonStyles.safeArea, styles.container]}>
      <StatusBar style="light" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoText}>VS</Text>
                </View>
              </View>
              
              <Text style={styles.welcomeTitle}>Welcome to VaxServe</Text>
              <Text style={styles.welcomeSubtitle}>Sign in to manage your vaccination records</Text>
            </View>

            <View style={styles.formCard}>
              {error && (
                <HelperText type="error" visible={error} style={styles.errorText}>
                  {error}
                </HelperText>
              )}

              {info.map(i => (
                <TextInput 
                  value={user[i.field]}
                  onChangeText={t => setState(t, i.field)} 
                  style={styles.textInput} 
                  key={i.field} 
                  label={i.label}
                  secureTextEntry={i.secureTextEntry} 
                  right={<TextInput.Icon icon={i.icon} />}
                  mode="outlined"
                  outlineColor={COLORS.border}
                  activeOutlineColor={COLORS.primary}
                  theme={{ roundness: BORDER_RADIUS.small }}
                />
              ))}
              
              <Button 
                disabled={isLoading} 
                loading={isLoading} 
                onPress={handleLogin} 
                mode="contained"
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
                buttonColor={COLORS.primary}
              >
                Đăng nhập
              </Button>
              
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Create Account</Text>
                </TouchableOpacity>
              </View>
              
              <Divider style={styles.divider} />
              
              {serverStatus && (
                <Text style={styles.serverStatus}>{serverStatus}</Text>
              )}
              
              <Button 
                onPress={testApiConnection}
                mode="outlined"
                style={styles.testButton}
              >
                Test Server Connection
              </Button>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    backgroundColor: COLORS.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    padding: SPACING.large,
    marginBottom: SPACING.medium,
  },
  logoContainer: {
    marginBottom: SPACING.large,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.medium,
  },
  logoText: {
    fontSize: FONT_SIZE.enormous,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.huge,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.small,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    padding: SPACING.large,
    paddingTop: SPACING.extraLarge,
    flex: 1,
    ...SHADOW.medium,
  },
  textInput: {
    marginBottom: SPACING.medium,
    backgroundColor: COLORS.background.primary,
  },
  errorText: {
    fontSize: FONT_SIZE.medium,
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: SPACING.medium,
    marginBottom: SPACING.medium,
    borderRadius: BORDER_RADIUS.small,
  },
  loginButtonContent: {
    paddingVertical: SPACING.small,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SPACING.medium,
  },
  registerText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZE.medium,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: SPACING.large,
  },
  testButton: {
    marginTop: SPACING.medium,
  },
  serverStatus: {
    textAlign: 'center',
    marginTop: SPACING.medium,
    color: COLORS.text.secondary,
  }
};

export default LoginScreen; 