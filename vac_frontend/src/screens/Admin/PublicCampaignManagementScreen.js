import React, { useState, useEffect } from 'react';
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
import {
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { Button, HelperText, TextInput } from "react-native-paper";
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../styles/MyStyles';
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const CampaignManagement = () => {
  const [campaign, setCampaign] = useState({});
  const [scMsg, setScMsg] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loc, setLocation] = useState('');
  // const successOpacity = useSharedValue(0);

  const info = [{
    label: 'Campaign Name',
    icon: "information",
    secureTextEntry: false,
    field: "campaign_name",
    description: "Name of the campaign"
  }, {
    label: 'Description',
    icon: "information",
    secureTextEntry: false,
    field: "description",
    description: "Description of the campaign"
  }, {
    label: 'Target Population',
    icon: "human",
    secureTextEntry: false,
    field: "target_population",
    description: "Target population for the campaign"
  }];

  const setState = (value, field) => {
    setCampaign({ ...campaign, [field]: value });
  }

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const setStateStartDate = (event, selectedDate) => {
    setStartDate(selectedDate)
    setShowDatePicker(Platform.OS === 'ios');
    setState(formatDate(selectedDate), 'start_date');
  }

  const setStateEndDate = (event, selectedDate) => {
    setEndDate(selectedDate)
    setShowDatePicker(Platform.OS === 'ios');
    setState(formatDate(selectedDate), 'end_date');
  }

  const locations = [
    "Headquarters - 97 Vo Van Tan",
    "Branch 1 - 123 Nguyen Van Cu",
    "Branch 2 - 456 Le Loi",
    "Branch 3 - 789 Tran Hung Dao",
    "Branch 4 - 321 Nguyen Thi Minh Khai",
    "Branch 5 - 654 Pham Ngu Lao",
  ];

  const validate = () => {
    setErrMsg('')
    if (!campaign?.campaign_name) {
      setErrMsg("Please enter name for this campaign!");
      return false;
    } else if (campaign?.description.length < 20) {
      setErrMsg("Description cannot be this short!");
      return false;
    } else if (campaign?.image == null) {
      setErrMsg("Image for the campaign required!");
      return false
    } else if (!loc) {
      setErrMsg("Please choose location the campaign!");
      return false;
    } else if (startDate >= endDate) {
      setErrMsg('End date must be after start date!');
      return false;
    }
    setErrMsg(null);
    return true;
  }

  const picker = async () => {
    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert("Permissions denied!");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled)
        setState(result.assets[0], 'image');
    }
  }

  const handleSubmitCampaign = async () => {
    if (validate() === true) {
      
      try {
        setLoading(true);
        let form = new FormData();
        for (let key in campaign) {
          if (key === 'image' && campaign?.image !== null) {
            form.append("image", {
              uri: campaign.image.uri,
              name: campaign.image.fileName,
              type: campaign.image.type
            });
          } else {
            form.append(key, campaign[key]);
          }
        }
        if (loc) form.append('location', loc);
        form.append('status', 'planned');
        console.info(form);
        // console.info(campaign.image);
        let res = await Apis.post(endpoints['campaign'], form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.status === 201) {
          setScMsg("Campaign created successfully!");
          // successOpacity.value = withTiming(1, { duration: 800 });
          // submitButtonScale.value = withSequence(
          //   withTiming(1.2, { duration: 200 }),
          //   withDelay(1000, withTiming(1, { duration: 200 }))
          // );
          Alert.alert('Success', 'Heading you back to Upcoming Campaigns!');
          setTimeout(() => {
            nav.navigate('Landing');
          }, 1500);
        }
      } catch (ex) {
        Alert.alert('Error', 'Failed to create campaign. Please try again.');
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
                <Text style={styles.headerTitle}>Create Campaign</Text>
                <Text style={styles.headerSubtitle}>
                  💉 Create new vaccination campaign with VaxServe
                </Text>
              </View>
            </LinearGradient>
            <View style={commonStyles.imageContainer}>
              <Image
                source={require('../../assets/images/StarPlatinum.jpg')}
                style={commonStyles.image}
                resizeMode="cover"
              />
            </View>
            <View style={commonStyles.formCard}>
              {info.map((i) => (
                <View key={i.field}>
                  <Text style={commonStyles.label}>{i.label}</Text>
                  <TextInput
                    style={[commonStyles.input, i.field === 'description' && styles.notesInput]}
                    label={i.label}
                    secureTextEntry={i.secureTextEntry}
                    right={<TextInput.Icon icon={i.icon} />}
                    value={campaign[i.field]}
                    onChangeText={(t) => setState(t, i.field)}
                    multiline={i.field === 'description'}
                    numberOfLines={i.field === 'description' ? 4 : 1}
                    keyboardType={i.field === 'target_population' ? 'numeric' : 'default'}
                  />
                </View>
              ))}

              <View style={commonStyles.divider} />

              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Start Date * </Text>
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={setStateStartDate}
                  minimumDate={(() => {
                    const minDate = new Date();
                    minDate.setDate(minDate.getDate() + 5);
                    return minDate;
                  })()}
                  maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                />
              </View>

              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>End Date *</Text>
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={setStateEndDate}
                  minimumDate={(() => {
                    const minDate = new Date();
                    minDate.setDate(minDate.getDate() + 5);
                    return minDate;
                  })()}
                  maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                />
              </View>

              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Location *</Text>
                <View style={styles.optionsContainer}>
                  {locations.map((location, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        commonStyles.optionButton,
                        loc === location && commonStyles.selectedOption,
                      ]}
                      onPress={() => setLocation(location)}
                    >
                      <Text
                        style={[
                          commonStyles.vaccineText,
                          loc === location && commonStyles.selectedOptionText,
                        ]}
                      >
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Campaign Image</Text>
                <TouchableOpacity style={commonStyles.dateButton} onPress={picker}>
                  <Text style={commonStyles.dateButtonText}>Choose Campaign Image</Text>
                </TouchableOpacity>
                {campaign?.image &&
                  <Image
                    style={[commonStyles.imageContainer, commonStyles.image, { marginTop: SPACING.medium }]}
                    source={{ uri: campaign.image.uri }}
                  />}
              </View>

              <View style={styles.divider} />

              <HelperText type="error" style={commonStyles.errorText} visible={!!errMsg}>
                {errMsg}
              </HelperText>

              <HelperText type="success" style={commonStyles.successText} visible={!!scMsg}>
                {scMsg}
              </HelperText>

              <TouchableOpacity
                style={[commonStyles.registerButton, loading && commonStyles.buttonDisabled]}
                disabled={loading}
                onPress={handleSubmitCampaign}
              >
                <Text style={commonStyles.registerButtonText}>
                  {loading ? 'Creating...' : 'Create Campaign'}
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
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.small,
  },
};

export default CampaignManagement;