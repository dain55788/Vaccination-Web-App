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
  Image,
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
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW } from '../../styles/MyStyles';
import { useNavigation } from "@react-navigation/native";
import { Button, HelperText, TextInput } from "react-native-paper";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import DateTimePicker from '@react-native-community/datetimepicker';
import { MyDispatchContext, MyUserContext } from '../../utils/MyContexts';

const AppointmentScreen = () => {
  const [time, setTime] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const submitButtonScale = useSharedValue(1);
  const successOpacity = useSharedValue(0);
  const user = useContext(MyUserContext);

  const [appointment, setAppointment] = useState({});
  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loc, setLocation] = useState('');
  const [scMsg, setScMsg] = useState(null);

  const setState = (value, field) => {
    setAppointment({ ...appointment, [field]: value });
  }

  const setStateDoB = (event, selectedDate) => {
    setDateOfBirth(selectedDate);
    setShowDatePicker(Platform.OS === 'ios');
    setState(formatDate(selectedDate), 'scheduled_date');
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
      setErrMsg("Please enter your username!");
      return false;
    } else if (!appointment.email.includes('@') && !appointment.email.includes('.')) {
      setErrMsg("Check again your email format!");
      return false;
    } else if (appointment.phone_number.length < 10) {
      setErrMsg("Phone Number Invalid!");
      return false;
    } else if (!loc) {
      setErrMsg("Please choose location for vaccination!");
      return false;
    }
    setErrMsg(null);
    return true;
  }

  useEffect(() => {
    formOpacity.value = withTiming(1, { duration: 800 });
    formTranslateY.value = withSpring(0, { damping: 15 });
  }, []);

  useEffect(() => {
    if (user) {
      setAppointment({
        ...appointment,
        full_name: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        phone_number: user.phone_number
      });
    }
  }, [user]);

  const locations = [
    "Headquarters - 97 Vo Van Tan",
    "Branch 1 - 123 Nguyen Van Cu",
    "Branch 2 - 456 Le Loi",
    "Branch 3 - 789 Tran Hung Dao",
    "Branch 4 - 321 Nguyen Thi Minh Khai",
    "Branch 5 - 654 Pham Ngu Lao",
  ];

  function extractScheduledDates(apiResponse) {
    if (Array.isArray(apiResponse)) {
      const scheduledDates = apiResponse.map(item => item.scheduled_date);
      return scheduledDates;
    } else {
      console.error('API response is not an array');
      return [];
    }
  }

  function isDateAlreadyRegistered(apiResponse, chosenDate) {
    const scheduledDates = extractScheduledDates(apiResponse.data);

    const dateAlreadyRegistered = scheduledDates.includes(chosenDate);

    return dateAlreadyRegistered;
  }

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
  ];

  const handleSubmitAppointment = async () => {
    if (validate() === true) {
      try {
        setLoading(true);
        let form = new FormData();
        if (dateOfBirth) form.append('scheduled_date', formatDate(dateOfBirth));
        if (loc) form.append('location', loc);
        if (notes) form.append('notes', notes);
        let resAppointment = await Apis.get(endpoints['appointment-bycitizen'](user.id));

        if (resAppointment.status === 200) {
          let dateAlreadyRegistered = false;

          dateAlreadyRegistered = isDateAlreadyRegistered(resAppointment, formatDate(dateOfBirth));

          if (dateAlreadyRegistered) {
            setErrMsg("You have registered this date, please select another date");
            Alert.alert('Error', 'Please select another date that suites you!');
            setLoading(false);
            return;
          }
        }
        form.append('citizen', user.id);
        console.info(form);
        let res = await Apis.post(endpoints['appointment'], form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.info("id appointment created:", res.data.id);
        let resav = await Apis.post(endpoints['appointmentvaccine'], {
          "appointment": res.data.id,
          "doctor": 6, //cần id bác sĩ trời ơi
          "dose_quantity_used": 1,
          "status": "scheduled",
          "notes": "",
          "cost": 0
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 201) {
          setScMsg("Appointment created successfully!");
          successOpacity.value = withTiming(1, { duration: 800 });
          submitButtonScale.value = withSequence(
            withTiming(1.2, { duration: 200 }),
            withDelay(1000, withTiming(1, { duration: 200 }))
          );
          Alert.alert('Success', 'Heading you back to the Home screen!');
          setTimeout(() => {
            nav.navigate('Home');
          }, 3000);
        }
      } catch (ex) {
        Alert.alert('Error', 'Failed to create appointment. Please try again.');
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={[commonStyles.safeArea, commonStyles.container]}>
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
            <View style={commonStyles.imageContainer}>
              <Image
                source={require('../../assets/images/appointmentImage.jpg')}
                style={commonStyles.image}
                resizeMode="cover"
              />
            </View>
            <View style={commonStyles.formCard}>

              {info.map(i => <View key={i.field}>
                <Text style={commonStyles.label}> {i.label}</Text>
                <TextInput
                  key={i.field}
                  style={commonStyles.input}
                  label={i.label}
                  secureTextEntry={i.secureTextEntry}
                  right={<TextInput.Icon icon={i.icon} />}
                  value={appointment[i.field]} onChangeText={t => setState(t, i.field)} />
              </View>)}

              <View style={commonStyles.divider} />

              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Date *</Text>
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="default"
                  onChange={setStateDoB}
                  minimumDate={(() => {
                    const minDate = new Date();
                    minDate.setDate(minDate.getDate() + 2);
                    return minDate;
                  })()}
                  maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
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
                        time === slot && commonStyles.selectedOption
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

                <View style={commonStyles.inputContainer}>
                  <Text style={commonStyles.label}>Locations *</Text>
                  <View style={commonStyles.optionsContainer}>
                    {locations.map((location, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          commonStyles.optionButton,
                          loc === location && commonStyles.selectedOption
                        ]}
                        onPress={() => setLocation(location)}
                      >
                        <Text style={[
                          commonStyles.vaccineText,
                          loc === location && commonStyles.selectedOptionText,
                        ]}>
                          {location}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
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

              <HelperText type="error" style={commonStyles.errorText} visible={!!errMsg}>
                {errMsg}
              </HelperText>

              <HelperText type="success" style={commonStyles.successText} visible={!!scMsg}>
                {scMsg}
              </HelperText>

              <TouchableOpacity style={commonStyles.registerButton} disabled={loading} loading={loading} onPress={handleSubmitAppointment}>
                <Text style={commonStyles.registerButtonText}>Schedule Appointment</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
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