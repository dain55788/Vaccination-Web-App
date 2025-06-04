import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, Animated, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { commonStyles, COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../styles/MyStyles';
import Apis, { endpoints } from '../../utils/Apis';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from '../../utils/MyContexts';
import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
import { TextInput } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
const { SENDGRID_API_KEY } = Constants.expoConfig.extra;

const UpcomingCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentDate = new Date();
  const [fadeAnim] = useState(new Animated.Value(0));
  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState({});

  const STATUS_OPTIONS = [
    { key: 'planned', label: 'Planned' },
    { key: 'ongoing', label: 'Ongoing' },
    { key: 'completed', label: 'Completed' },
  ];

  const handleRegisterCampaign = (campaign) => {
    if (user === null) {
      Alert.alert(
        'Please sign in to continue',
        'You need to log in to register our Campaigns.',
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
      nav.navigate('RegisterCampaign', { campaign });
    }
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setEditingCampaign({
      campaign_name: campaign.campaign_name,
      start_date: new Date(campaign.start_date),
      end_date: new Date(campaign.end_date),
      description: campaign.description,
      location: campaign.location || '',
      target_population: campaign.target_population?.toString() || '',
      status: campaign.status,
    });
    setEditModalVisible(true);
  };

  const handleDeleteCampaign = (campaign) => {
    Alert.alert(
      'Delete Campaign',
      `Are you sure you want to delete "${campaign.campaign_name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await Apis.delete(`${endpoints['campaign']}${campaign.id}/`);
              setCampaigns(campaigns.filter(c => c.id !== campaign.id));
              Alert.alert('Success', 'Campaign deleted successfully');

              showEmailConfirmation(campaign, 'delete');

            } catch (error) {
              Alert.alert('Error', 'Failed to delete campaign');
              console.error('Delete error:', error);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await Apis.get(endpoints['campaign']);
        const upcoming = response.data.results.filter(campaign =>
          new Date(campaign.start_date) > currentDate
        );
        setCampaigns(upcoming);
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        setError('Failed to fetch campaigns');
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const renderCampaign = ({ item }) => (
    <View style={[commonStyles.card, styles.campaignCard]}>
      {item.image && (
        <View style={commonStyles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={commonStyles.image}
            resizeMode="cover"
          />
        </View>
      )}
      <Text style={commonStyles.cardTitle}>{item.campaign_name}</Text>
      <Text style={commonStyles.subtitle}>{item.description}</Text>

      <View style={styles.campaignDetails}>
        <View style={[commonStyles.row, commonStyles.marginVertical]}>
          <Ionicons name="location-outline" size={16} color={COLORS.primary} style={styles.fieldIcon} />
          <Text style={commonStyles.text}>
            <Text style={{ fontWeight: 'bold' }}>Location: </Text>
            {item.location}
          </Text>
        </View>

        <View style={commonStyles.row}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.primary} style={styles.fieldIcon} />
          <Text style={commonStyles.text}>
            <Text style={{ fontWeight: 'bold' }}>Start: </Text>
            {new Date(item.start_date).toLocaleDateString()}
          </Text>
        </View>

        <View style={commonStyles.row}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.primary} style={styles.fieldIcon} />
          <Text style={commonStyles.text}>
            <Text style={{ fontWeight: 'bold' }}>End: </Text>
            {new Date(item.end_date).toLocaleDateString()}
          </Text>
        </View>

        {item.target_population && (
          <View style={commonStyles.row}>
            <Ionicons name="people-outline" size={16} color={COLORS.primary} style={styles.fieldIcon} />
            <Text style={commonStyles.text}>
              <Text style={{ fontWeight: 'bold' }}>Target Population: </Text>
              {item.target_population}
            </Text>
          </View>
        )}

        <View style={commonStyles.row}>
          <Ionicons name="flag-outline" size={16} color={COLORS.primary} style={styles.fieldIcon} />
          <Text style={commonStyles.text}>
            <Text style={{ fontWeight: 'bold' }}>Status: </Text>
            <Text style={[styles.statusText, styles[item.status]]}>
              {STATUS_OPTIONS.find(s => s.key === item.status)?.label || item.status}
            </Text>
          </Text>
        </View>
      </View>

      {user && user.is_superuser ? (
        <View style={styles.adminActions}>
          <TouchableOpacity
            style={[commonStyles.button, styles.editButton]}
            onPress={() => handleEditCampaign(item)}
          >
            <View style={commonStyles.registerButtonContent}>
              <Ionicons name="create-outline" size={20} color={COLORS.white} style={commonStyles.registerIcon} />
              <Text style={commonStyles.buttonText}>Edit</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.button, commonStyles.deleteButton]}
            onPress={() => handleDeleteCampaign(item)}
          >
            <View style={commonStyles.registerButtonContent}>
              <Ionicons name="trash-outline" size={20} color={COLORS.white} style={commonStyles.registerIcon} />
              <Text style={commonStyles.buttonText}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[commonStyles.registerButton, commonStyles.campaignRegisterButton]}
          onPress={() => handleRegisterCampaign(item)}
        >
          <View style={commonStyles.registerButtonContent}>
            <Ionicons name="person-add-outline" size={20} color={COLORS.white} style={commonStyles.registerIcon} />
            <Text style={commonStyles.registerButtonText}>Register for Campaign</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleUpdateCampaign = async () => {
    if (!editingCampaign.campaign_name.trim()) {
      Alert.alert('Error', 'Campaign name is required');
      return;
    }

    if (!editingCampaign.description.trim()) {
      Alert.alert('Error', 'Description is required');
      return;
    }

    if (editingCampaign.start_date >= editingCampaign.end_date) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    setUpdateLoading(true);
    try {
      const updateData = {
        campaign_name: editingCampaign.campaign_name,
        start_date: editingCampaign.start_date.toISOString().split('T')[0],
        end_date: editingCampaign.end_date.toISOString().split('T')[0],
        description: editingCampaign.description,
        location: editingCampaign.location,
        target_population: editingCampaign.target_population ? parseInt(editingCampaign.target_population) : null,
        status: editingCampaign.status,
      };

      const response = await Apis.patch(`${endpoints['campaign']}${selectedCampaign.id}/`, updateData);

      setCampaigns(campaigns.map(c =>
        c.id === selectedCampaign.id ? { ...c, ...response.data } : c
      ));

      setEditModalVisible(false);
      Alert.alert('Success', 'Campaign updated successfully');

    } catch (error) {
      Alert.alert('Error', 'Failed to update campaign');
      console.error('Update error:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setEditingCampaign({ ...editingCampaign, start_date: selectedDate });
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEditingCampaign({ ...editingCampaign, end_date: selectedDate });
    }
  };

  const renderEditModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={commonStyles.modalContainer}
      >
        <View style={[commonStyles.modalContent, styles.editModal]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={commonStyles.chatOptionsHeader}>
              <Text style={commonStyles.chatOptionsTitle}>Edit Campaign</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={commonStyles.formContainer}>
              <Text style={commonStyles.formLabel}>Campaign Name *</Text>
              <TextInput
                style={commonStyles.input}
                value={editingCampaign.campaign_name}
                onChangeText={(text) => setEditingCampaign({ ...editingCampaign, campaign_name: text })}
                placeholder="Enter campaign name"
              />
            </View>

            <View style={commonStyles.formContainer}>
              <Text style={commonStyles.formLabel}>Description *</Text>
              <TextInput
                style={[commonStyles.input, styles.textArea]}
                value={editingCampaign.description}
                onChangeText={(text) => setEditingCampaign({ ...editingCampaign, description: text })}
                placeholder="Enter description"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={commonStyles.formContainer}>
              <Text style={commonStyles.formLabel}>Location</Text>
              <TextInput
                style={commonStyles.input}
                value={editingCampaign.location}
                onChangeText={(text) => setEditingCampaign({ ...editingCampaign, location: text })}
                placeholder="Enter location"
              />
            </View>

            <View style={commonStyles.formContainer}>
              <Text style={commonStyles.formLabel}>Target Population</Text>
              <TextInput
                style={commonStyles.input}
                value={editingCampaign.target_population}
                onChangeText={(text) => setEditingCampaign({ ...editingCampaign, target_population: text })}
                placeholder="Enter target population"
                keyboardType="numeric"
              />
            </View>

            <View style={commonStyles.formContainer}>
              <Text style={commonStyles.formLabel}>Start Date *</Text>
              <TouchableOpacity
                style={commonStyles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={commonStyles.dateButtonText}>
                  {editingCampaign.start_date?.toLocaleDateString() || 'Select date'}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  testID="startDateTimePicker"
                  value={editingCampaign.start_date || new Date()}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={commonStyles.formContainer}>
              <Text style={commonStyles.formLabel}>End Date *</Text>
              <TouchableOpacity
                style={commonStyles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={commonStyles.dateButtonText}>
                  {editingCampaign.end_date?.toLocaleDateString() || 'Select date'}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  testID="endDateTimePicker"
                  value={editingCampaign.end_date || new Date()}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                  minimumDate={editingCampaign.start_date || new Date()}
                />
              )}
            </View>

            <View style={commonStyles.formContainer}>
              <Text style={commonStyles.formLabel}>Status</Text>
              <View style={commonStyles.optionsContainer}>
                {STATUS_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      commonStyles.optionButton,
                      editingCampaign.status === option.key && commonStyles.selectedOption
                    ]}
                    onPress={() => setEditingCampaign({ ...editingCampaign, status: option.key })}
                  >
                    <Text style={[
                      commonStyles.text,
                      editingCampaign.status === option.key && commonStyles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={commonStyles.modalActions}>
              <TouchableOpacity
                style={[commonStyles.button, commonStyles.buttonOutline, commonStyles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={commonStyles.buttonOutlineText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[commonStyles.button, updateLoading && commonStyles.buttonDisabled]}
                onPress={handleUpdateCampaign}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={commonStyles.buttonText}>Update Campaign</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight || '#4da8ff']}
        style={styles.header}
      >
        <Ionicons name="medkit-outline" size={32} color={COLORS.white} />
        <Text style={styles.headerTitle}>Upcoming Vaccination Campaigns</Text>
      </LinearGradient>

      <View style={styles.container}>
      <View style={styles.introContainer}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} style={styles.introIcon} />
          <Text style={styles.introText}>
            {user && user.is_superuser 
              ? 'Manage upcoming vaccination campaigns. Edit or delete campaigns as needed to keep information current and accurate.'
              : 'Stay protected with our upcoming vaccination campaigns! These initiatives provide essential vaccines to safeguard our community against preventable diseases. Check the details below to find a campaign near you and join us in promoting public health.'
            }
          </Text>
        </View>
        <FlatList
          data={campaigns}
          renderItem={renderCampaign}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={[commonStyles.scrollViewContent, styles.listContent]}
          ListEmptyComponent={
            <View style={commonStyles.centerContent}>
              <Ionicons name="alert-circle-outline" size={40} color={COLORS.gray} style={styles.emptyIcon} />
              <Text style={[commonStyles.text, styles.emptyText]}>No upcoming campaigns found</Text>
            </View>
          }
        />
      </View>

      {renderEditModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#f5f5f5',
    opacity: 0.95,
  },
  header: {
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  introContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    margin: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  introIcon: {
    marginRight: SPACING.sm,
  },
  introText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: FONT_SIZE.md * 1.5,
    flex: 1,
  },
  listContent: {
    padding: SPACING.md,
  },
  campaignCard: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.medium,
  },
  campaignDetails: {
    marginBottom: SPACING.medium,
  },
  fieldIcon: {
    marginRight: SPACING.small,
  },
  statusText: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  planned: {
    color: COLORS.info,
  },
  ongoing: {
    color: COLORS.success,
  },
  completed: {
    color: COLORS.gray,
  },
  cancelled: {
    color: COLORS.danger,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
    marginTop: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  emptyIcon: {
    marginBottom: SPACING.sm,
  },
});

export default UpcomingCampaigns;