import {
  Image,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Button, HelperText, TextInput } from "react-native-paper";
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW } from '../../styles/MyStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef, useEffect } from "react";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { updateProfile, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../../../config/Firebase';
import { doc, setDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {

  const [syringes, setSyringes] = useState([]);

  const createSyringe = () => ({
    id: Math.random().toString(),
    x: new Animated.Value(Math.random() * (width - 50)),
    y: new Animated.Value(-50),
  });

  useEffect(() => {
    const addSyringe = () => {
      setSyringes((prev) => [...prev, createSyringe()]);
    };

    addSyringe();

    const interval = setInterval(() => {
      addSyringe();
    }, 500 + Math.random() * 500);

    const cleanup = setInterval(() => {
      setSyringes((prev) => prev.filter((s) => s.y._value < height));
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(cleanup);
    };
  }, []);

  useEffect(() => {
    syringes.forEach((syringe) => {
      Animated.parallel([
        Animated.timing(syringe.y, {
          toValue: height + 50,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [syringes]);

  const info = [{
    label: 'First Name',
    icon: "information",
    secureTextEntry: false,
    field: "first_name",
    description: "First name"
  }, {
    label: 'Last Name',
    icon: "information",
    secureTextEntry: false,
    field: "last_name",
    description: "Last name"
  }, {
    label: 'Username',
    icon: "human",
    secureTextEntry: false,
    field: "username",
    description: "Enter your username"
  }, {
    label: 'Password',
    icon: "eye",
    secureTextEntry: true,
    field: "password",
    description: "Create password"
  }, {
    label: 'Confirm password',
    icon: "eye",
    secureTextEntry: true,
    field: "confirm",
    description: "Confirm your password"
  }, {
    label: 'Email',
    icon: "mail",
    secureTextEntry: false,
    field: "email",
    description: "Enter your email"
  }, {
    label: 'Phone Number',
    icon: "phone",
    secureTextEntry: false,
    field: "phone_number",
    description: "Enter your phone number"
  }, {
    label: 'Address (Optional)',
    icon: "home",
    secureTextEntry: false,
    field: "address",
    description: "Enter your address"
  }];

  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const nav = useNavigation();

  const onHandleSignup = async (auth, username, email, password) => {
    if (email !== '' && password !== '') {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: username });
        await setDoc(doc(database, 'users', cred.user.uid), {
          id: cred.user.uid,
          email: cred.user.email,
          name: username,
          about: 'Available',
          createdAt: Date.now(),
        });
        
        console.log(`Signup success: ${cred.user.email}`);
        Alert.alert('Success', 'Account created successfully!');
        
      } catch (err) {
        console.error('Firebase signup error:', err);
        Alert.alert('Signup error', err.message);
      }
    }
  };

  const setState = (value, field) => {
    setUser({ ...user, [field]: value });
  }

  const setStateDoB = (event, selectedDate) => {
    setDateOfBirth(selectedDate)
    setShowDatePicker(Platform.OS === 'ios');
    setState(formatDate(selectedDate), 'date_of_birth');
  }
  const setStateGender = (gender) => {
    setGender(gender)
    setState(gender, 'gender');
  }

  const picker = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert("Permissions denied!");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled)
        setState(result.assets[0], "avatar");
    }
  }

  const validate = () => {
    if (!user?.username || !user?.password) {
      setMsg("Please enter username and password!");
      return false;
    } else if (user.password !== user.confirm) {
      setMsg("Passwords do not match!");
      return false;
    } else if (user.password.length < 6) {
      setMsg("Password must be at least 6 characters!");
      return false;
    } else if (!user.email.includes('@') && !user.email.includes('.')) {
      setMsg("Check again your email format!");
      return false;
    } else if (!/^[0-9]+$/.test(user.phone_number)) {
      setMsg("Phone number only contains digit!");
      return false;
    } else if (user.phone_number.length < 10) {
      setMsg("Phone number invalid!");
      return false;
    } else if (user.avatar == null) {
      setMsg("Avatar required!");
      return false;
    } else {
      for (let i of info) {
        if ((user[i.field] === '' || user[i.field] === undefined) && i.field !== 'address') {
          setMsg(`${i.label} can not be empty!`);
          return false;
        }
      }
    }
    setMsg(null);
    return true;
  }

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };


  const handleRegister = async () => {
    console.info(user.username)
    console.info(user.avatar)
    if (validate() === true) {
      try {
        setLoading(true);
        let form = new FormData();
        for (let key in user) {
          if (key !== 'confirm') {
            if (key === 'avatar' && user?.avatar !== null) {
              form.append(key, {
                uri: user.avatar.uri,
                name: user.avatar.fileName,
                type: user.avatar.type
              });
            } else {
              form.append(key, user[key]);
            }
          }
        }
        
        let res = await Apis.post(endpoints['register'], form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (res.status === 201) {
          onHandleSignup(auth, user.username, user.email, user.password)
          nav.navigate("Login");
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={[commonStyles.safeArea, commonStyles.container]}>
      <StatusBar style="light" />
      <View style={styles.syringeAnimationContainer}>
        {syringes.map((syringe) => (
          <Animated.View
            key={syringe.id}
            style={[
              styles.syringe,
              {
                transform: [{ translateX: syringe.x }, { translateY: syringe.y }],
                pointerEvents: 'none',
              },
            ]}
          >
            <Text style={styles.syringeIcon}>💉</Text>
          </Animated.View>
        ))}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={commonStyles.keyboardAvoidingView}
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
                <Text style={styles.headerSubtitle}>
                  💉 Join VaxServe for easy vaccination management
                </Text>

              </View>
            </LinearGradient>

            <View style={styles.formCard}>
              {error ? <Text style={[commonStyles.errorText, styles.errorText]}>{error}</Text> : null}

              {info.map(i => <View key={i.field}>
                <Text style={commonStyles.formLabel}> {i.label}</Text>
                <TextInput key={i.field} style={commonStyles.input}
                  label={i.label}
                  secureTextEntry={i.field === "password" || i.field === "confirm" ? showPassword : i.secureTextEntry}
                  right={i.field === "password" || i.field === "confirm" ? (
                    <TextInput.Icon
                      icon={i.icon}
                      onPress={() => {
                        setShowPassword(!showPassword);
                      }} />
                  ) : (
                    <TextInput.Icon icon={i.icon} />
                  )}
                  value={user[i.description]} onChangeText={t => setState(t, i.field)} />
              </View>)}


              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.formLabel}>Gender</Text>
                <View style={styles.radioContainer}>
                  <TouchableOpacity
                    style={[styles.radioButton, gender === 'male' && styles.radioButtonSelected]}
                    onPress={() => setStateGender('male')}
                  >
                    <View style={gender === 'male' ? styles.radioInnerSelected : styles.radioInner} />
                    <Text style={styles.radioLabel}>Male</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.radioButton, gender === 'female' && styles.radioButtonSelected]}
                    onPress={() => setStateGender('female')}
                  >
                    <View style={gender === 'female' ? styles.radioInnerSelected : styles.radioInner} />
                    <Text style={styles.radioLabel}>Female</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.radioButton, gender === 'other' && styles.radioButtonSelected]}
                    onPress={() => setStateGender('other')}
                  >
                    <View style={gender === 'other' ? styles.radioInnerSelected : styles.radioInner} />
                    <Text style={styles.radioLabel}>Other</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.formLabel}>Date of Birth</Text>
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="default"
                  onChange={setStateDoB}
                  maximumDate={new Date()}
                />
              </View>

              <View style={commonStyles.profileImagePlaceholder}>
                <Text style={commonStyles.label}>Avatar</Text>
                <TouchableOpacity style={commonStyles.dateButton} onPress={picker}>
                  <Text style={commonStyles.dateButtonText}>Choose your avatar</Text>
                </TouchableOpacity>
                {user?.avatar && <Image style={[commonStyles.image, { marginTop: SPACING.medium, }]} source={{ uri: user.avatar.uri }} />}
              </View>

              <View style={commonStyles.divider} />

              <Button mode="contained" style={commonStyles.registerButton} disabled={loading} loading={loading}
                contentStyle={commonStyles.registerButtonText} buttonColor={COLORS.primary} onPress={handleRegister}>Create Account
              </Button>

              <HelperText type="error" style={commonStyles.errorText} visible={msg}>
                {msg}
              </HelperText>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => nav.navigate('Login')}
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
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingVertical: SPACING.huge,
    paddingHorizontal: SPACING.medium,
    marginBottom: -SPACING.large,
  },
  syringeAnimationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 2,
  },
  syringe: {
    position: 'absolute',
  },
  syringeIcon: {
    fontSize: 50,
    color: COLORS.white,
    opacity: 1,
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
    opacity: 1,
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
  halfWidth: {
    flex: 1,
    marginRight: SPACING.small,
  },
  input: {
    backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.small,
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.primary,
  },
  multilineInput: {
    height: 60,
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
  fontHuge: {
    fontSize: FONT_SIZE.huge,
  },
};

export default RegisterScreen; 