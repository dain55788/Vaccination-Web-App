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
  ScrollView,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { authApis, endpoints } from "../utils/Apis";
import commonStyles, { COLORS, SPACING, FONT_SIZE, SHADOW, BORDER_RADIUS } from '../styles/MyStyles';

import Constants from 'expo-constants';
import { Button, HelperText, TextInput, Divider } from 'react-native-paper';
const { CLIENT_ID, CLIENT_SECRET } = Constants.expoConfig.extra;
import { MyDispatchContext } from "../utils/MyContexts";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();
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
    setUser({...user, [field]: value});
  }

  const validate = () => {
    if (!user?.username || !user?.password) {
      setMsg("Vui lòng nhập tên đăng nhập và mật khẩu !");
      return false;
    }

    setMsg(null);
    return true;
  }

  const handleLogin = async () => {
    setMsg('');

    if (validate() === true) {
      try {
        setLoading(true);
        let res = await Apis.post(endpoints['login'], {
          ...user,
          "client_id": "HxQDtnxYJjTkdRcsicafPK9QqclTYaU8l1CxOQLQ",
          "client_secret": '2C5lN4AsEqeCxo1CvSDafff0gNeEqf8FzM2pzfLbp1GOpcqIYAzeTS6Cq0yfHTArHr2QTjHRWgu607PocsfdgUmMOXPePq6P3fsBEGDwGcAnP9YtZIzZ6a3Uwzj00GgE',
          'grant_type': 'password'
        });

        console.log('API Response:', res.data);
        
        await AsyncStorage.setItem("token", res.data.access_token);
        let u = await authApis(res.data.access_token).get(endpoints['current-user']);
        dispatch({
          "type": "login",
          "payload": u.data
        })
      } catch (error) {
          console.error('Login error details:', error);
      } finally {
          setLoading(false);
      }
    }
  }
  
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
                disabled={loading} 
                loading={loading} 
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
};

export default LoginScreen; 