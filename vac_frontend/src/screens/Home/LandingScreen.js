import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, ScrollView, SafeAreaView, Modal, Image, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW } from '../../styles/MyStyles';
import { CommonActions, useNavigation } from "@react-navigation/native";
import { MyUserContext, MyDispatchContext } from '../../utils/MyContexts';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import Constants from 'expo-constants';
const { GEMINI_API_KEY } = Constants.expoConfig.extra;
import { Button, HelperText, TextInput } from "react-native-paper";
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import CustomMarker from './CustomMarker'

const LandingScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const [chatVisible, setChatVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatOptionsVisible, setChatOptionsVisible] = useState(false);
  const initialLocation = {
    latitude: 10.7765588,
    longitude: 106.6904755,
  }

  const [myFirstLocation, setMyFirstLocation] = useState(initialLocation)
  const [mySecondLocation, setMySecondLocation] = useState(initialLocation)
  const [myThirdLocation, setMyThirdLocation] = useState(initialLocation)
  const [myFourthLocation, setMyFourthLocation] = useState(initialLocation)
  const [myFifthLocation, setFifthMyLocation] = useState(initialLocation)

  const [pin, setPin] = useState({})

  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null)
  const local = {
    latitude: "10.6754047",
    longitude: "106.6880892"
  }

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.warn('Permission to access location was denied')
        return
      }
      let location = await Location.getCurrentPositionAsync({})
      setMyFirstLocation(location.coords)
    }
    catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    setPin(local)
    _getLocation()
  }, [])

  const handleAppointmentNavigation = () => {
    if (user === null) {
      Alert.alert(
        'Please sign in to continue',
        'You need to log in to make an appointment.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign In',
            onPress: () => nav.navigate('Login'),
          },
        ],
        { cancelable: true }
      );
    } else {
      nav.navigate('Appointment');
    }
  };

  const handleChatNavigation = () => {
    if (user === null) {
      Alert.alert(
        'Please sign in to continue',
        'You need to log in to chat with our expert.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign In',
            onPress: () => nav.navigate('Login'),
          },
        ],
        { cancelable: true }
      );
    } else {
      nav.navigate('Chats');
    }
  };

  const handleChatButtonClick = async () => {
    if (!msg.trim()) return;

    const userMessage = { text: msg, sender: 'user' };
    setMessages(prevMessages => [userMessage, ...prevMessages]);
    setMsg('');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: msg },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      const content = data.candidates?.[0]?.content;
      const reply = content?.parts?.[0]?.text || 'No response';

      const geminiMessage = { text: reply, sender: 'gemini' };
      setMessages(prevMessages => [geminiMessage, ...prevMessages]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { text: 'Error occurred', sender: 'gemini' };
      setMessages(prevMessages => [errorMessage, ...prevMessages]);
    }
  };

  const handleChatOptionSelect = (option) => {
    setChatOptionsVisible(false);
    if (option === 'ai') {
      setChatVisible(true);
    } else if (option === 'experts') {
      handleChatNavigation();
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[commonStyles.message, item.sender === 'user' ? commonStyles.userMessage : commonStyles.geminiMessage]}>
      <Text style={[commonStyles.messageText, item.sender === 'user' ? commonStyles.userMessageText : commonStyles.geminiMessageText]}>
        {item.text}
      </Text>
    </View>
  );

  const [locationsDisplay, setLocationsDisplay] = useState('0+');
  const [patientsDisplay, setPatientsDisplay] = useState('0K+');
  const [vaccinesDisplay, setVaccinesDisplay] = useState('0+');

  const locationsCount = useSharedValue(0);
  const patientsCount = useSharedValue(0);
  const vaccinesCount = useSharedValue(0);

  useEffect(() => {
    const updateLocations = (value) => {
      setLocationsDisplay(`${Math.floor(value)}+`);
    };
    const updatePatients = (value) => {
      setPatientsDisplay(`${Math.floor(value / 1000)}K+`);
    };
    const updateVaccines = (value) => {
      setVaccinesDisplay(`${Math.floor(value)}+`);
    };

    locationsCount.value = withTiming(500, {
      duration: 5500,
      easing: Easing.out(Easing.exp),
    }, (finished) => {
      if (finished) {
        runOnJS(updateLocations)(500);
      }
    });

    patientsCount.value = withTiming(50000, {
      duration: 4500,
      easing: Easing.out(Easing.exp),
    }, (finished) => {
      if (finished) {
        runOnJS(updatePatients)(50000);
      }
    });

    vaccinesCount.value = withTiming(15, {
      duration: 3500,
      easing: Easing.out(Easing.exp),
    }, (finished) => {
      if (finished) {
        runOnJS(updateVaccines)(15);
      }
    });

    const updateDuringAnimation = () => {
      updateLocations(locationsCount.value);
      updatePatients(patientsCount.value);
      updateVaccines(vaccinesCount.value);
    };

    const interval = setInterval(() => {
      updateDuringAnimation();
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.navbar}>
        <Text style={styles.navLogo}>VaxServe</Text>
        <View style={styles.navLinksContainer}>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuModalContainer}>
          <View style={styles.menuModal}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Text style={commonStyles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                nav.navigate('Services');
              }}
            >
              <Text style={styles.menuItemText}>Services</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                nav.navigate('About');
              }}
            >
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                nav.navigate('Contact');
              }}>
              <Text style={styles.menuItemText}>Contact</Text>
            </TouchableOpacity>
            {user && (user.is_staff === true) ? (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    nav.navigate('AppointmentStatus');
                  }}
                >
                  <Text style={styles.menuItemText}>Track Appointment Status</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    nav.navigate('UserVaccinationHistory');
                  }}
                >
                  <Text style={styles.menuItemText}>Track User Vaccination History</Text>
                </TouchableOpacity>
              </>
            ) : user && (user.is_superuser === true) ? (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    nav.navigate('AdminDashboard');
                  }}
                >
                  <Text style={styles.menuItemText}>Admin Dashboard & Statistics</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    nav.navigate('CampaignManagement');
                  }}
                >
                  <Text style={styles.menuItemText}>Manage Public Campaign</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    nav.navigate('VaccineManagement');
                  }}
                >
                  <Text style={styles.menuItemText}>Manage Vaccine & Vaccine Category</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  handleAppointmentNavigation();
                }}>
                <Text style={styles.menuItemText}>Make Appointment</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                nav.navigate('UpcomingCampaigns');
              }}>

              <Text style={styles.menuItemText}>Upcoming Campaigns</Text>
            </TouchableOpacity>
            {user === null ? (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    nav.navigate('Login');
                  }}
                >
                  <Text style={styles.menuItemText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    nav.navigate('Register');
                  }}
                >
                  <Text style={styles.menuItemText}>Create Account</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    nav.navigate('Profile');
                  }}
                >
                  <Text style={styles.menuItemText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    nav.navigate('Home');
                  }}
                >
                  <Text style={styles.menuItemText}>Home</Text>
                </TouchableOpacity>
              </>
            )
            }
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={chatOptionsVisible}
        onRequestClose={() => setChatOptionsVisible(false)}
      >
        <View style={commonStyles.chatOptionsModalContainer}>
          <View style={commonStyles.chatOptionsModal}>
            <View style={commonStyles.chatOptionsHeader}>
              <Text style={commonStyles.chatOptionsTitle}>Choose Chat Option</Text>
              <TouchableOpacity onPress={() => setChatOptionsVisible(false)}>
                <Text style={commonStyles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={commonStyles.chatOptionButton}
              onPress={() => handleChatOptionSelect('ai')}
            >
              <MaterialCommunityIcons name="robot" size={32} color={COLORS.primary} />
              <View style={commonStyles.chatOptionContent}>
                <Text style={commonStyles.chatOptionTitle}>Chat With VaxServe AI</Text>
                <Text style={commonStyles.chatOptionDescription}>Get instant answers about vaccines and services</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={commonStyles.chatOptionButton}
              onPress={() => handleChatOptionSelect('experts')}
            >
              <MaterialCommunityIcons name="account-group" size={32} color={COLORS.secondary} />
              <View style={commonStyles.chatOptionContent}>
                <Text style={commonStyles.chatOptionTitle}>Chat With Our Experts</Text>
                <Text style={commonStyles.chatOptionDescription}>Connect with healthcare professionals</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={chatVisible}
        onRequestClose={() => setChatVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={commonStyles.chatModalContainer}>
            <View style={commonStyles.chatModal}>
              <View style={commonStyles.chatHeader}>
                <MaterialCommunityIcons name="robot" size={32} color={COLORS.primary} style={styles.aiIcon} />
                <Text style={commonStyles.chatTitle}>VaxServe AI Chat Assistant</Text>
                <TouchableOpacity onPress={() => setChatVisible(false)}>
                  <Text style={commonStyles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              {messages.length === 0 && msg === '' && (
                <View style={commonStyles.helpLabelContainer}>
                  <Text style={commonStyles.helpLabel}>What can we help with?</Text>
                </View>
              )}
              <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={commonStyles.messagesContainer}
                inverted
              />
              <View style={commonStyles.inputView}>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Ask anything about VaxServe..."
                  value={msg}
                  onChangeText={setMsg}
                  multiline={true}
                  numberOfLines={3}
                  placeholderTextColor={COLORS.text.secondary}
                />
                <TouchableOpacity style={commonStyles.sendButton} onPress={handleChatButtonClick}>
                  <Text style={commonStyles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View style={commonStyles.scrollContainer}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>VaxServe</Text>
            <Text style={styles.subtitle}>Fast, Safe, Reliable Vaccination</Text>
          </View>

          <View style={commonStyles.imageContainer}>
            <Image
              source={require('../../assets/images/VaxServe.png')}
              style={commonStyles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.overviewContainer}>
            <Text style={commonStyles.sectionTitle}>What is VaxServe?</Text>
            <Text style={commonStyles.text}>
              VaxServe is a comprehensive vaccination service platform designed to make healthcare accessible to everyone.
              We provide vaccination services, appointment scheduling, and digital health records to ensure you stay protected
              against preventable diseases. Our team of healthcare professionals is dedicated to ensuring your safety and comfort
              throughout the vaccination process.
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{locationsDisplay}</Text>
                <Text style={styles.statLabel}>Locations</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{patientsDisplay}</Text>
                <Text style={styles.statLabel}>Patients</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{vaccinesDisplay}</Text>
                <Text style={styles.statLabel}>Vaccines</Text>
              </View>
            </View>
          </View>

          <View style={commonStyles.imageContainer}>
            <Image
              source={require('../../assets/images/VaxServe3.jpg')}
              style={commonStyles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.featuresContainer}>
            <Text style={commonStyles.sectionTitle}>Our Services</Text>

            <View style={styles.feature}>
              <Text style={styles.featureTitle}>✓ Easy Scheduling</Text>
              <Text style={commonStyles.text}>Book your vaccination appointment with just a few taps</Text>
            </View>

            <View style={styles.feature}>
              <Text style={styles.featureTitle}>✓ Multiple Vaccines</Text>
              <Text style={commonStyles.text}>COVID-19, Flu, HPV, and many other essential vaccines</Text>
            </View>

            <View style={styles.feature}>
              <Text style={styles.featureTitle}>✓ Digital Records</Text>
              <Text style={commonStyles.text}>Access your vaccination history anytime, anywhere</Text>
            </View>

            <View style={styles.feature}>
              <Text style={styles.featureTitle}>✓ Expert Care</Text>
              <Text style={commonStyles.text}>Administered by certified healthcare professionals</Text>
            </View>

            <TouchableOpacity
              style={commonStyles.button}
              onPress={() => nav.navigate('Services')}
            >
              <Text style={commonStyles.buttonText}>View All Services</Text>
            </TouchableOpacity>
          </View>
          {user && user.is_superuser !== true && user.is_staff !== true && (
            <View style={styles.ctaContainer}>
              <Text style={styles.ctaTitle}>Ready to Get Vaccinated?</Text>
              <Text style={styles.ctaText}>
                Protect yourself and your loved ones from preventable diseases. Schedule your vaccination appointment today!
              </Text>
              <View style={styles.ctaButtons}>
                <TouchableOpacity
                  style={commonStyles.button}
                  onPress={handleAppointmentNavigation}
                >
                  <Text style={commonStyles.buttonText}>Schedule Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[commonStyles.button, commonStyles.buttonOutline, styles.ctaSecondaryButton]}
                  onPress={() => nav.navigate('Contact')}
                >
                  <Text style={commonStyles.buttonText}>Contact Us</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.campaignsContainer}>
            <Text style={commonStyles.sectionTitle}>Upcoming Vaccination Campaigns</Text>

            <View style={commonStyles.card}>
              <View style={[commonStyles.row, commonStyles.spaceBetween]}>
                <Text style={styles.campaignTitle}>Flu Season Preparation</Text>
                <Text style={styles.campaignDate}>Oct 15 - Nov 30</Text>
              </View>
              <Text style={commonStyles.text}>
                Get your annual flu shot before the winter season. Special discounts for families and seniors.
              </Text>
              <TouchableOpacity style={[commonStyles.button, commonStyles.buttonOutline, styles.campaignButton]}>
                <Text style={commonStyles.buttonOutlineText}
                  onPress={() => nav.navigate('UpcomingCampaigns')}
                >Learn More</Text>
              </TouchableOpacity>
            </View>

            <View style={commonStyles.card}>
              <View style={[commonStyles.row, commonStyles.spaceBetween]}>
                <Text style={styles.campaignTitle}>Back-to-School Immunizations</Text>
                <Text style={styles.campaignDate}>Aug 1 - Sep 15</Text>
              </View>
              <Text style={commonStyles.text}>
                Ensure your children have all required immunizations before the school year starts.
              </Text>
              <TouchableOpacity style={[commonStyles.button, commonStyles.buttonOutline, styles.campaignButton]}>
                <Text style={commonStyles.buttonOutlineText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={commonStyles.imageContainer}>
            <Image
              source={require('../../assets/images/VacPatients.jpg')}
              style={commonStyles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.testimonialsContainer}>
            <Text style={commonStyles.sectionTitle}>What Our Patients Say</Text>

            <View style={commonStyles.card}>
              <Text style={commonStyles.text}>
                "The staff was friendly and professional. I was in and out in less than 20 minutes. Highly recommended!"
              </Text>
              <Text style={styles.testimonialAuthor}>- Sarah J.</Text>
            </View>

            <View style={commonStyles.card}>
              <Text style={commonStyles.text}>
                "As someone with a fear of needles, I appreciated how patient and understanding the nurse was during my vaccination."
              </Text>
              <Text style={styles.testimonialAuthor}>- Michael T.</Text>
            </View>
          </View>

          <View style={styles.testimonialsContainer}>
            <Text style={commonStyles.sectionTitle}>Find VaxServe</Text>
            <MapView
              style={commonStyles.map}
              region={region}
              onRegionChangeComplete={setRegion}
              ref={mapRef}
              provider='google'
            >
              {myFirstLocation.latitude && myFirstLocation.longitude &&
                <Marker
                  coordinate={{
                    latitude: myFirstLocation.latitude,
                    longitude: myFirstLocation.longitude
                  }}
                  title='My current location'
                  description='I am here'
                />
              }
              {mySecondLocation.latitude && mySecondLocation.longitude &&
                <CustomMarker
                  coordinate={{
                    latitude: 10.7573726,
                    longitude: 106.6820124
                  }}
                  title='VAXSERVE HERE'
                  image={require('../../assets/images/VaxServe.png')}
                />
              }
              {myThirdLocation.latitude && myThirdLocation.longitude &&
                <CustomMarker
                  coordinate={{
                    latitude: 10.8171088,
                    longitude: 106.6826627
                  }}
                  title='VAXSERVE HERE'
                  image={require('../../assets/images/VaxServe.png')}
                />
              }
              {myFourthLocation.latitude && myFourthLocation.longitude &&
                <CustomMarker
                  coordinate={{
                    latitude: 10.7551551,
                    longitude: 106.6764857
                  }}
                  title='VAXSERVE HERE'
                  image={require('../../assets/images/VaxServe.png')}
                />
              }
              {myFifthLocation.latitude && myFifthLocation.longitude &&
                <CustomMarker
                  coordinate={{
                    latitude: 10.7670187,
                    longitude: 106.6808416
                  }}
                  title='VAXSERVE HERE'
                  image={require('../../assets/images/VaxServe.png')}
                />
              }
              {myFifthLocation.latitude && myFifthLocation.longitude &&
                <CustomMarker
                  coordinate={{
                    latitude: 10.7668044,
                    longitude: 106.6858787
                  }}
                  title='VAXSERVE HERE'
                  image={require('../../assets/images/VaxServe.png')}
                />
              }
              {myFifthLocation.latitude && myFifthLocation.longitude &&
                <CustomMarker
                  coordinate={{
                    latitude: 10.7902357,
                    longitude: 106.65791
                  }}
                  title='VAXSERVE HERE'
                  image={require('../../assets/images/VaxServe.png')}
                />
              }
              {myFifthLocation.latitude && myFifthLocation.longitude &&
                <CustomMarker
                  coordinate={{
                    latitude: 10.8073027,
                    longitude: 106.711604
                  }}
                  title='VAXSERVE HERE'
                  image={require('../../assets/images/VaxServe.png')}
                />
              }
              
              {pin.latitude && pin.longitude &&
                <Marker
                  coordinate={{
                    latitude: parseFloat(pin.latitude),
                    longitude: parseFloat(pin.longitude)
                  }}
                  title='Default location'
                  description='I am here'
                />
              }
            </MapView>
          </View>

          <View style={commonStyles.footer}>
            <View style={commonStyles.footerSection}>
              <Text style={commonStyles.footerHeading}>About VaxServe</Text>
              <TouchableOpacity style={commonStyles.footerLink}>
                <Text style={commonStyles.footerLinkText}>Our Mission</Text>
              </TouchableOpacity>
              <TouchableOpacity style={commonStyles.footerLink}>
                <Text style={commonStyles.footerLinkText}>Team</Text>
              </TouchableOpacity>
              <TouchableOpacity style={commonStyles.footerLink}>
                <Text style={commonStyles.footerLinkText}>Careers</Text>
              </TouchableOpacity>
            </View>

            <View style={commonStyles.footerSection}>
              <Text style={commonStyles.footerHeading}>Support</Text>
              <TouchableOpacity style={commonStyles.footerLink}>
                <Text style={commonStyles.footerLinkText}>FAQs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={commonStyles.footerLink}>
                <Text style={commonStyles.footerLinkText}>Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={commonStyles.footerLink}>
                <Text style={commonStyles.footerLinkText}>Terms of Service</Text>
              </TouchableOpacity>
            </View>

            <View style={commonStyles.footerSection}>
              <Text style={commonStyles.footerHeading}>Contact</Text>
              <Text style={commonStyles.footerText}>contact@vaxserve.com</Text>
              <Text style={commonStyles.footerText}>(555) 123-4567</Text>
              <Text style={commonStyles.footerText}>97 Vo Van Tan, District 3, VaxServe Vaccination Hospital</Text>
            </View>
          </View>
          <View style={styles.copyright}>
            <Text style={styles.copyrightText}>© 2025 VaxServe. All rights reserved.</Text>
          </View>

        </ScrollView>

      </View>
      <View style={commonStyles.chatButtonContainer}>
        <TouchableOpacity
          onPress={() => setChatOptionsVisible(true)}
          style={[commonStyles.chatButton, commonStyles.largerChatButton]}
        >
          <Entypo name="chat" size={32} color={COLORS.lightGray} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background.primary,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.regular,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navLogo: {
    fontSize: FONT_SIZE.extraLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  navLinksContainer: {
    display: 'none',
  },
  navLink: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  navLinkText: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.regular,
  },
  authButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.small,
  },
  authButtonText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: COLORS.secondary,
  },
  menuButton: {
    padding: SPACING.small,
  },
  menuButtonText: {
    fontSize: FONT_SIZE.huge,
    color: COLORS.primary,
  },
  menuModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuModal: {
    backgroundColor: COLORS.background.primary,
    borderTopLeftRadius: BORDER_RADIUS.medium,
    borderTopRightRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    ...SHADOW.dark,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  menuTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  menuItem: {
    paddingVertical: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuItemText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.primary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.huge,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZE.enormous,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.small,
  },
  subtitle: {
    fontSize: FONT_SIZE.large,
    color: COLORS.white,
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.secondary,
  },
  overviewContainer: {
    padding: SPACING.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.large,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.medium,
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.small,
    marginHorizontal: SPACING.tiny,
    ...SHADOW.light,
  },
  statNumber: {
    fontSize: FONT_SIZE.huge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.small,
    color: COLORS.text.secondary,
    marginTop: SPACING.tiny,
  },
  featuresContainer: {
    padding: SPACING.medium,
    backgroundColor: COLORS.background.secondary,
  },
  feature: {
    marginBottom: SPACING.medium,
  },
  featureTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.tiny,
  },
  ctaContainer: {
    padding: SPACING.large,
    backgroundColor: COLORS.primary,
    marginVertical: SPACING.large,
  },
  ctaTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.small,
  },
  ctaText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.white,
    marginBottom: SPACING.large,
  },
  ctaButtons: {
    flexDirection: 'row',
  },
  ctaSecondaryButton: {
    marginLeft: SPACING.medium,
    borderColor: COLORS.white,
  },
  campaignsContainer: {
    padding: SPACING.medium,
  },
  campaignTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  campaignDate: {
    fontSize: FONT_SIZE.small,
    color: COLORS.text.secondary,
  },
  campaignButton: {
    alignSelf: 'flex-start',
    marginTop: SPACING.small,
  },
  testimonialsContainer: {
    padding: SPACING.medium,
    backgroundColor: COLORS.background.secondary,
  },
  testimonialAuthor: {
    fontSize: FONT_SIZE.small,
    fontWeight: '500',
    color: COLORS.text.secondary,
    textAlign: 'right',
    marginTop: SPACING.small,
  },
  copyright: {
    padding: SPACING.medium,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  copyrightText: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZE.small,
  }
};

export default LandingScreen;
