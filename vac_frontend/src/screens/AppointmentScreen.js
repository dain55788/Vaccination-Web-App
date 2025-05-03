import React, { useContext, useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { 
  useSharedValue, 
  withSpring, 
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW } from '../styles/MyStyles';
import { useNavigation } from "@react-navigation/native";
import { Button, HelperText, TextInput } from "react-native-paper";
import Apis, { authApis, endpoints } from "../utils/Apis";
import DateTimePicker from '@react-native-community/datetimepicker';
import { MyDispatchContext } from "../utils/MyContexts";

const AppointmentScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const submitButtonScale = useSharedValue(1);
  const successOpacity = useSharedValue(0);

  const [appointment, setAppointment] = useState({});
  const [msg, setMsg] = useState(null);
  const [vaccineType, setVaccineType] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useContext(MyDispatchContext);
  
  const setState = (value, field) => {
    setAppointment({ ...appointment, [field]: value });
  }

  const setStateDoB = (event, selectedDate) => {
    setDateOfBirth(selectedDate)
    setShowDatePicker(Platform.OS === 'ios');
    setState(formatDate(selectedDate), 'date_of_birth');
  }

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const nav = useNavigation();
  
  const info = [{
    label: 'Full Name',
    icon: "information",
    secureTextEntry: false,
    field: "full_name",
    description: "Full name"
  }, {
    label: 'Email',
    icon: "mail",
    secureTextEntry: false,
    field: "email",
    description: "Email address"
  }, {
    label: 'Phone Number',
    icon: "phone",
    secureTextEntry: false,
    field: "phone_number",
    description: "Phone number"
  }];

  const validate = () => {
    if (!appointment?.full_name) {
      setMsg("Please enter your username!");
      return false;
    } else if (!appointment.email.includes('@') && !appointment.email.includes('.')) {
      setMsg("Check again your email format!");
      return false;
    } else if (appointment.phone_number.length < 10) {
      setMsg("Phone Number Invalid!");
      return false;
    } else {
      for (let i of info) {
        if ((appointment[i.field] === '' || appointment[i.field] === undefined)) {
          setMsg(`${i.label} can not be empty!`);
          return false;
        }
      }
    }
    setMsg(null);
    return true;
  }

  const loadVaccineTypes = async () => {
    try {
        setLoading(true);
        console.info(endpoints['vaccine'])
        let res = await Apis.get(endpoints['lessons'](courseId));

        setLessons(res.data);
    } catch {

    } finally {
        setLoading(false);
    }
    
  }

  useEffect(() => {
    formOpacity.value = withTiming(1, { duration: 800 });
    formTranslateY.value = withSpring(0, { damping: 15 });
  }, []);

  const locations = [
    "Headquarters - 92 Vo Van Tan",
    "Branch 1 - 123 Nguyen Van Cu",
    "Branch 2 - 456 Le Loi",
    "Branch 3 - 789 Tran Hung Dao",
    "Branch 4 - 321 Nguyen Thi Minh Khai",
    "Branch 5 - 654 Pham Ngu Lao",
  ];

  const vaccineTypes = [
    "COVID-19",
    "Influenza (Flu)",
    "Tdap (Tetanus, Diphtheria, Pertussis)",
    "MMR (Measles, Mumps, Rubella)",
    "Hepatitis B",
    "HPV (Human Papillomavirus)",
    "Pneumococcal"
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
  ];

  const handleSubmit = async () => {
    if (!fullName || !email || !phone || !date || !time || !location || !vaccineType) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    submitButtonScale.value = withSequence(
      withSpring(0.95),
      withSpring(1)
    );

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      successOpacity.value = withSequence(
        withTiming(1, { duration: 500 }),
        withDelay(2000, withTiming(0, { duration: 500 }))
      );

      setTimeout(() => {
        nav.goBack();
      }, 3000);

    } catch (error) {
      Alert.alert('Error', 'Failed to create appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[commonStyles.safeArea, styles.container]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                <Text style={styles.headerTitle}>Make Appointment</Text>
                <Text style={styles.headerSubtitle}>
                  💉 Schedule new vaccination with VaxServe for your safety
                </Text>
              </View>
            </LinearGradient>

            <View style={styles.formCard}>

              {info.map(i => <View key={i.field}>
                <Text style={commonStyles.label}> {i.label}</Text>
                <TextInput key={i.field} style={commonStyles.input}
                  label={i.label}
                  secureTextEntry={i.secureTextEntry}
                  right={<TextInput.Icon icon={i.icon} />}
                  value={appointment[i.description]} onChangeText={t => setState(t, i.field)} />
              </View>)}

              <View style={commonStyles.divider} />

              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Date</Text>
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="default"
                  onChange={setStateDoB}
                  maximumDate={new Date()}
                />
              </View>

              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Preferred Time *</Text>
                <View style={styles.optionsContainer}>
                  {timeSlots.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        commonStyles.optionButton,
                        time === slot && commonStyles.vaccineSelectedOption
                      ]}
                      onPress={() => setTime(slot)}
                    >
                      <Text
                        style={[
                          commonStyles.optionText,
                          time === slot && commonStyles.selectedOptionText,
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={commonStyles.formContainer}>
                <Text style={commonStyles.label}>Locations *</Text>
                <View style={commonStyles.optionsContainer}>
                  {locations.map((location, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.vaccineButton,
                        locations === location && commonStyles.vaccineSelectedOption
                      ]}
                      onPress={() => setLocation(location)}
                    >
                      <Text style={[
                        commonStyles.vaccineText,
                        locations === location && commonStyles.selectedOptionText
                      ]}>
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={commonStyles.formContainer}>
                <Text style={commonStyles.label}>Vaccine Type *</Text>
                <View style={commonStyles.optionsContainer}>
                  {vaccineTypes.map((vaccine, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.vaccineButton,
                        vaccineType === vaccine && commonStyles.vaccineSelectedOption
                      ]}
                      onPress={() => setVaccineType(vaccine)}
                    >
                      <Text style={[
                        styles.vaccineText,
                        vaccineType === vaccine && commonStyles.selectedOptionText
                      ]}>
                        {vaccine}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Special Notes (Optional)</Text>
                <TextInput
                  style={[commonStyles.input, styles.notesInput]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any additional information we should know"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.divider} />

              <TouchableOpacity style={commonStyles.registerButton} onPress={handleSubmit}>
                <Text style={commonStyles.registerButtonText}>Schedule Appointment</Text>
              </TouchableOpacity>
              <HelperText type="error" style={styles.fontHuge} visible={msg}>
                  {msg}
              </HelperText>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  formCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    margin: SPACING.medium,
    marginTop: SPACING.extraLarge,
    padding: SPACING.large,
    ...SHADOW.medium,
  },
  header: {
    paddingVertical: SPACING.huge,
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
    opacity: 1,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.small,
  },
  optionText: {
    fontSize: FONT_SIZE.small,
    color: COLORS.text.primary,
  },
  locationButton: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.small,
    marginRight: SPACING.small,
    marginBottom: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
  },
  vaccineButton: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.small,
    marginBottom: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.small,
  },
};

export default AppointmentScreen;