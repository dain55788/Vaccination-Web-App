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
  // ActivityIndicator
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { authApis, endpoints } from "../../utils/Apis";
import commonStyles, { COLORS, SPACING, FONT_SIZE, SHADOW, BORDER_RADIUS } from '../../styles/MyStyles';

import Constants from 'expo-constants';
import { Button, HelperText, TextInput, Divider } from 'react-native-paper';
const { CLIENT_ID, CLIENT_SECRET } = Constants.expoConfig.extra;
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "../../utils/MyContexts";

// Google Login
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithCredential,
// } from "firebase/auth";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/Firebase";

// WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const info = [{
    label: 'Username',
    icon: "account",
    secureTextEntry: false,
    field: "username"
  }, {
    label: 'Password',
    icon: "eye",
    secureTextEntry: true,
    field: "password"
  }];

  const [showPassword, setShowPassword] = useState(true);
  const [user, setUser] = useState({});
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();
  const dispatch = useContext(MyDispatchContext);
  const currentUser = useContext(MyUserContext);

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

  // // Firebase login authentication
  const onHandleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(() => console.log("Firebase login success"))
    .catch((err) => Alert.alert("Login error", err.message));
  };

  const handleLogin = async () => {
    setMsg('');

    if (validate() === true) {
      try {
        setLoading(true);
        let res = await Apis.post(endpoints['login'], {
          ...user,
          "client_id": CLIENT_ID,
          "client_secret": CLIENT_SECRET,
          'grant_type': 'password'
        });

        console.info(res.data.access_token)
        console.info('Successfully logged in!!');
        console.info('User data:', res.data);
        await AsyncStorage.setItem("token", res.data.access_token);
        if (dispatch) {
          let u = await authApis(res.data.access_token).get(endpoints['current-user']);
          dispatch({
            "type": "login",
            "payload": u.data
          });
          onHandleLogin(currentUser.email, user.password);
          nav.navigate('Landing');
        } else {
          setMsg('Fail to login. Please check your username or password.');
        }
      } catch (error) {
        console.error('Login error details:', error);
        setMsg('Fail to login. Please check your username or password.');
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
                  style={commonStyles.textInput}
                  key={i.field}
                  label={i.label}
                  secureTextEntry={i.field === "password" ? showPassword : i.secureTextEntry}
                  right={i.field === "password" ? (
                    <TextInput.Icon
                      icon={showPassword ? "eye" : "eye-off"}
                      onPress={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  ) : (
                    <TextInput.Icon icon={i.icon} />
                  )}
                  mode="outlined"
                  outlineColor={COLORS.border}
                  activeOutlineColor={COLORS.primary}
                  theme={{ roundness: BORDER_RADIUS.small }}
                />
              ))}

              {msg && <HelperText type="error" style={styles.errorText}>{msg}</HelperText>}

              <Button
                disabled={loading}
                loading={loading}
                onPress={handleLogin}
                mode="contained"
                style={commonStyles.loginButton}
                contentStyle={commonStyles.loginButtonContent}
                buttonColor={COLORS.primary}
              >
                Login
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