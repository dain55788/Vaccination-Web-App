import React, { useContext, useState, useEffect } from 'react';import { 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../styles/MyStyles';
import { useNavigation } from "@react-navigation/native";
import Apis, { authApis, endpoints } from "../utils/Apis";
import { MyDispatchContext } from "../utils/MyContexts";

const AppointmentScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [vaccineType, setVaccineType] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const submitButtonScale = useSharedValue(1);
  const successOpacity = useSharedValue(0);

  const [user, setUser] = useState({});
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useContext(MyDispatchContext);
  
  const nav = useNavigation();
  
  
  useEffect(() => {
    formOpacity.value = withTiming(1, { duration: 800 });
    formTranslateY.value = withSpring(0, { damping: 15 });
  }, []);

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }],
    };
  });

  const submitButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: submitButtonScale.value }],
    };
  });

  const successAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: successOpacity.value,
    };
  });

  const locations = [
    "Main Hospital - Downtown",
    "Community Clinic - Eastside",
    "Health Center - Westpark",
    "Medical Plaza - Northpoint",
    "Wellness Center - Southlake"
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
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"
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
    <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar style="dark" />
      
      <View style={commonStyles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => nav.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Schedule Appointment</Text>
        <View style={styles.placeholder}></View>
      </View>

      <ScrollView contentContainerStyle={commonStyles.scrollViewContent}>
        <Animated.View style={[styles.formContainer, styles.formAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={commonStyles.formContainer}>
            <Text style={commonStyles.label}>Full Name *</Text>
            <TextInput
              style={commonStyles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
            />
          </View>
          
          <View style={commonStyles.formContainer}>
            <Text style={commonStyles.label}>Email *</Text>
            <TextInput
              style={commonStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              keyboardType="email-address"
            />
          </View>
          
          <View style={commonStyles.formContainer}>
            <Text style={commonStyles.label}>Phone Number *</Text>
            <TextInput
              style={commonStyles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
          
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          
          <View style={commonStyles.formContainer}>
            <Text style={commonStyles.label}>Date *</Text>
            <TextInput
              style={commonStyles.input}
              value={date}
              onChangeText={setDate}
              placeholder="MM/DD/YYYY"
            />
          </View>
          
          <View style={commonStyles.formContainer}>
            <Text style={commonStyles.label}>Preferred Time *</Text>
            <View style={styles.optionsContainer}>
              {timeSlots.slice(0, 4).map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    time === slot && styles.selectedOption
                  ]}
                  onPress={() => setTime(slot)}
                >
                  <Text style={[
                    styles.optionText,
                    time === slot && styles.selectedOptionText
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.optionsContainer}>
              {timeSlots.slice(4, 8).map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    time === slot && styles.selectedOption
                  ]}
                  onPress={() => setTime(slot)}
                >
                  <Text style={[
                    styles.optionText,
                    time === slot && styles.selectedOptionText
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={commonStyles.formContainer}>
            <Text style={commonStyles.label}>Location *</Text>
            <View style={styles.optionsContainer}>
              {locations.slice(0, 3).map((loc, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.locationButton,
                    location === loc && styles.selectedOption
                  ]}
                  onPress={() => setLocation(loc)}
                >
                  <Text style={[
                    styles.locationText,
                    location === loc && styles.selectedOptionText
                  ]}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.optionsContainer}>
              {locations.slice(3).map((loc, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.locationButton,
                    location === loc && styles.selectedOption
                  ]}
                  onPress={() => setLocation(loc)}
                >
                  <Text style={[
                    styles.locationText,
                    location === loc && styles.selectedOptionText
                  ]}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={commonStyles.formContainer}>
            <Text style={commonStyles.label}>Vaccine Type *</Text>
            <View style={styles.vaccineOptionsContainer}>
              {vaccineTypes.map((vaccine, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.vaccineButton,
                    vaccineType === vaccine && styles.selectedOption
                  ]}
                  onPress={() => setVaccineType(vaccine)}
                >
                  <Text style={[
                    styles.vaccineText,
                    vaccineType === vaccine && styles.selectedOptionText
                  ]}>
                    {vaccine}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={commonStyles.formContainer}>
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
          
          <Animated.View style={submitButtonAnimatedStyle}>
            <TouchableOpacity
              style={[commonStyles.button, isSubmitting && commonStyles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={commonStyles.buttonText}>
                {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={[styles.successMessage, successAnimatedStyle]}>
            <Text style={styles.successText}>Appointment scheduled successfully!</Text>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  backButton: {
    paddingHorizontal: SPACING.small,
  },
  backButtonText: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '500',
    color: COLORS.primary,
  },
  placeholder: {
    width: 70,
  },
  formContainer: {
    paddingHorizontal: SPACING.small,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.medium,
    marginBottom: SPACING.medium,
    paddingHorizontal: SPACING.small,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.small,
  },
  optionButton: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.small,
    marginRight: SPACING.small,
    marginBottom: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONT_SIZE.small,
    color: COLORS.text.primary,
  },
  selectedOptionText: {
    color: COLORS.white,
    fontWeight: '500',
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
  locationText: {
    fontSize: FONT_SIZE.tiny,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  vaccineOptionsContainer: {
    flexDirection: 'column',
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
  vaccineText: {
    fontSize: FONT_SIZE.small,
    color: COLORS.text.primary,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.small,
  },
  successMessage: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
    marginTop: SPACING.medium,
    marginHorizontal: SPACING.small,
  },
  successText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.medium,
  }
};

export default AppointmentScreen;