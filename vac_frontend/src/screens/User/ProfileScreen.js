import React, { useContext, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  Switch,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW } from '../../styles/MyStyles';
import { MyDispatchContext, MyUserContext } from '../../utils/MyContexts';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../../../config/Firebase';

const ProfileScreen = ({ navigation }) => {
  const user = useContext(MyUserContext)
  const dispatch = useContext(MyDispatchContext)
  const nav = useNavigation();
  const { loading, setLoading } = useState(false);

  const handleLogout = () => {
    nav.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
    dispatch({
      "type": "logout"
    })
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  }

  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    textReminders: true,
    darkMode: false
  });

  const handleToggleSetting = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'This would navigate to an edit profile screen');
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar style="dark" />

      <View style={[commonStyles.header, styles.header]}>
        <TouchableOpacity
          style={commonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={commonStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={commonStyles.scrollViewContent}>

        <View style={commonStyles.section}>
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
                <Image style={[commonStyles.imageContainer, styles.profileImagePlaceholder]} resizeMode="cover" source={{ uri: user.avatar }} />
            </View>
            <Text style={styles.profileName}>{user.username}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{user.phone_number}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth:</Text>
              <Text style={styles.infoValue}>{user.date_of_birth}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>{user.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender:</Text>
              <Text style={styles.infoValue}>{user.gender}</Text>
            </View>
          </View>
        </View>

        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionTitle}>Settings</Text>

          <View style={commonStyles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleToggleSetting('notifications')}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Email Updates</Text>
              <Switch
                value={settings.emailUpdates}
                onValueChange={() => handleToggleSetting('emailUpdates')}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Text Reminders</Text>
              <Switch
                value={settings.textReminders}
                onValueChange={() => handleToggleSetting('textReminders')}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Switch
                value={settings.darkMode}
                onValueChange={() => handleToggleSetting('darkMode')}
                trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity disabled={loading} loading={loading} style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  header: {
    justifyContent: 'space-between',
  },
  editButton: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.medium,
    fontWeight: '500',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  profileImageContainer: {
    marginBottom: SPACING.medium,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: FONT_SIZE.enormous,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  profileName: {
    fontSize: FONT_SIZE.huge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.medium,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.small,
    width: '100%',
    paddingHorizontal: SPACING.medium,
  },
  infoLabel: {
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
    color: COLORS.text.secondary,
    width: 140,
  },
  infoValue: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.primary,
    flex: 1,
  },
  cardDate: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.secondary,
  },
  cardBody: {
    marginVertical: SPACING.small,
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
    marginTop: SPACING.small,
  },
  addRecordButton: {
    marginTop: SPACING.medium,
  },
  emptyState: {
    padding: SPACING.large,
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.medium,
    alignItems: 'center',
    ...SHADOW.light,
  },
  emptyStateText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.secondary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingLabel: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.primary,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: SPACING.medium,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
  },
  footer: {
    height: 20,
  },
};

export default ProfileScreen; 