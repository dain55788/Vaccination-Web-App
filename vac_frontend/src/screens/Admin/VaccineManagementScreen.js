import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles, { COLORS, FONT_SIZE, SPACING } from '../../styles/MyStyles';
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "../../utils/MyContexts";
import { useContext } from "react";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { Button, HelperText, TextInput } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const VaccineManagementScreen = () => {
  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const [searchQuery, setSearchQuery] = useState('');

  const [vaccine, setVaccine] = useState([]);
  const [vaccineCategories, setVaccineCategories] = useState([]);

  const vaccineEndpoint = endpoints['vaccine'];
  const vaccineCategoryEndpoint = endpoints['vaccine-categories'];

  const availabelVaccines = vaccine;
  const [filteredVaccine, setFilteredVaccine] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [displayCount, setDisplayCount] = useState(4);
  const [scMsg, setScMsg] = useState(null);
  const [formData, setFormData] = useState({
    vaccine_name: '',
    dose_quantity: '',
    instruction: '',
    unit_price: '',
  });
  const [createFormData, setCreateFormData] = useState({
    category_id: '',
    category_name: '',
    vaccine_name: '',
    dose_quantity: '',
    instruction: '',
    unit_price: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [createFormErrors, setCreateFormErrors] = useState({});
  const [categoryPickerVisible, setCategoryPickerVisible] = useState(false);

  const setState = (value, field) => {
    setCampaign({ ...campaign, [field]: value });
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

  const info = [{
    label: 'Vaccine Name',
    icon: "information",
    secureTextEntry: false,
    field: "vaccine_name",
    description: "Vaccine Name"
  }, {
    label: 'Dose Quantity',
    icon: "information",
    secureTextEntry: false,
    field: "dose_quantity",
    description: "Current dose quantity"
  }, {
    label: 'Instruction',
    icon: "information",
    secureTextEntry: false,
    field: "instruction",
    description: "Instruction for specified vaccine"
  }, {
    label: 'Unit Price',
    icon: "currency-usd",
    secureTextEntry: false,
    field: "unit_price",
    description: "Current unit price of the vaccine"
  }];

  const createInfo = [{
    label: 'Category ID',
    icon: "information",
    secureTextEntry: false,
    field: "category_id",
    description: "Vaccine Category"
  }, {
    label: 'Vaccine Name',
    icon: "information",
    secureTextEntry: false,
    field: "vaccine_name",
    description: "Vaccine Name"
  }, {
    label: 'Dose Quantity',
    icon: "information",
    secureTextEntry: false,
    field: "dose_quantity",
    description: "Current dose quantity"
  }, {
    label: 'Instruction',
    icon: "information",
    secureTextEntry: false,
    field: "instruction",
    description: "Instruction for specified vaccine"
  }, {
    label: 'Unit Price',
    icon: "currency-usd",
    secureTextEntry: false,
    field: "unit_price",
    description: "Current unit price of the vaccine"
  }];

  const fetchVaccine = async () => {
    try {
      const response = await Apis.get(vaccineEndpoint);
      const vaccines = response.data.results;
      setVaccine(vaccines);
      setFilteredVaccine(vaccines);
    } catch (error) {
      console.error('Error fetching vaccines:', error);
    }
  };

  const fetchVaccineCategories = async () => {
    try {
      const response = await Apis.get(vaccineCategoryEndpoint);
      setVaccineCategories(response.data);
    } catch (error) {
      console.error('Error fetching vaccine categories:', error);
    }
  };

  useEffect(() => {
    fetchVaccine();
    fetchVaccineCategories();
  }, []);

  const handleEditClick = (vaccine) => {
    setSelectedVaccine(vaccine);
    setFormData({
      vaccine_name: vaccine.vaccine_name || '',
      dose_quantity: vaccine.dose_quantity.toString() || '',
      instruction: vaccine.instruction || '',
      unit_price: vaccine.unit_price?.toString() || '',
    });
    setFormErrors({});
    setMsg('');
    setIsEditModalVisible(true);
  };

  const handleDeleteVaccine = (vaccine) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the vaccine "${vaccine.vaccine_name}"?`,
      [
        {
          text: 'Sure',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await Apis.delete(`${vaccineEndpoint}${vaccine.id}/`);
              if (response.status === 204 || response.status === 200) {
                const updatedVaccines = Array.isArray(vaccine) ? vaccine.filter(v => v.id !== vaccine.id) : [];
                await fetchVaccine();
                Alert.alert('Success', 'Vaccine deleted successfully');
              } else {
                throw new Error('Unexpected response status: ' + response.status);
              }
            } finally {
              setLoading(false);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleCreateVaccine = async () => {
    const errors = validateCreateForm(createFormData, true);
    if (Object.keys(errors).length > 0) {
      setCreateFormErrors(errors);
      return;
    }

    try {
      const response = await Apis.post(vaccineEndpoint, {
        category: createFormData.category_id,
        vaccine_name: createFormData.vaccine_name,
        dose_quantity: Number(createFormData.dose_quantity),
        instruction: createFormData.instruction,
        unit_price: Number(createFormData.unit_price),
      });

      await fetchVaccine();
      setIsCreateModalVisible(false);
      setCreateFormData({
        category_id: '',
        vaccine_name: '',
        dose_quantity: '',
        instruction: '',
        unit_price: '',
      });
      setCreateFormErrors({});
      Alert.alert('Success', 'Vaccine created successfully');
    } catch (error) {
      console.error('Error creating vaccine:', error);
      setCreateFormErrors({ general: 'Failed to create vaccine. Please try again.' });
    }
  };

  const validateEditForm = () => {
    const errors = {};
    if (!formData.vaccine_name.trim()) errors.vaccine_name = 'Vaccine name is required';
    if (!formData.dose_quantity || isNaN(formData.dose_quantity) || Number(formData.dose_quantity) < 0)
      errors.dose_quantity = 'Valid dose quantity is required';
    if (!formData.instruction.trim()) errors.instruction = 'Instruction is required';
    if (!formData.unit_price || isNaN(formData.unit_price) || Number(formData.unit_price) < 0)
      errors.unit_price = 'Valid unit price is required';
    return errors;
  };

  const validateCreateForm = (data, isCreate = false) => {
    const errors = {};
    if (isCreate && !data.category_id) errors.category_id = 'Category is required';
    if (!data.vaccine_name.trim()) errors.vaccine_name = 'Vaccine name is required';
    if (!data.dose_quantity || isNaN(data.dose_quantity) || Number(data.dose_quantity) < 0)
      errors.dose_quantity = 'Valid dose quantity is required';
    if (!data.instruction.trim()) errors.instruction = 'Instruction is required';
    if (!data.unit_price || isNaN(data.unit_price) || Number(data.unit_price) < 0)
      errors.unit_price = 'Valid unit price is required';
    return errors;
  };

  const handleSave = async () => {
    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const noChanges =
      formData.vaccine_name === (selectedVaccine.vaccine_name || '') &&
      Number(formData.dose_quantity) === selectedVaccine.dose_quantity &&
      formData.instruction === (selectedVaccine.instruction || '') &&
      Number(formData.unit_price) === (selectedVaccine.unit_price || 0);

    if (noChanges) {
      setMsg('No changes were made to the vaccine information!!');
      return;
    }

    try {
      const response = await Apis.patch(`${vaccineEndpoint}${selectedVaccine.id}/`, {
        vaccine_name: formData.vaccine_name,
        dose_quantity: Number(formData.dose_quantity),
        instruction: formData.instruction,
        unit_price: Number(formData.unit_price),
      });

      const updatedVaccines = vaccine.map(v =>
        v.id === selectedVaccine.id ? { ...v, ...response.data } : v
      );
      setVaccine(updatedVaccines);
      setFilteredVaccine(updatedVaccines);
      setIsEditModalVisible(false);
      setSelectedVaccine(null);
      setFormData({ vaccine_name: '', dose_quantity: '', instruction: '', unit_price: '' });
      Alert.alert('Success', 'Successfully update vaccine information')
    } catch (error) {
      console.error('Error updating vaccine:', error);
      setFormErrors({ general: 'Failed to update vaccine. Please try again.' });
    }
  };

  const debounceSearch = useCallback((query) => {
    const searchLower = query.toLowerCase();
    const filtered = vaccine.filter(vaccine =>
      vaccine.vaccine_name?.toLowerCase().includes(searchLower) ||
      vaccine.id.toString().includes(searchLower)
    );
    setFilteredVaccine(filtered);
    setDisplayCount(4);
  }, [vaccine]);

  const handleLoadVaccines = () => {
    setDisplayCount(prevCount => prevCount + 4);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      debounceSearch(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, debounceSearch]);

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar style="dark" />
      <View style={commonStyles.header}>
        <TouchableOpacity
          style={commonStyles.backButton}
          onPress={() => nav.goBack()}
        >
          <Text style={commonStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>VaccineAdmin</Text>
        <TouchableOpacity onPress={
          () => {
            nav.navigate('CampaignManagement');
          }
        } style={styles.logoutButton}>
          <Text style={{ color: COLORS.primary, fontWeight: '500' }}>Campaign</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={commonStyles.scrollViewContent}>
        <View style={styles.welcomeSection}>
          <Text style={commonStyles.title}>Hi, {user.username}</Text>
          <Text style={commonStyles.subtitle}>Your vaccination management portal.</Text>
        </View>

        <Text style={commonStyles.title}>All Available Vaccines</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="🔎 Search vaccines by name or ID"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {filteredVaccine.length > 0 ? (
          filteredVaccine.slice(0, displayCount).map((availableVaccine) => (
            <View key={availableVaccine.id} style={commonStyles.card}>
              <View style={styles.vaccineItem}>
                <View style={styles.vaccineIconPlaceholder}>
                  <Text style={styles.vaccineIconText}>🦠</Text>
                </View>
                <View style={styles.vaccineDetails}>
                  <Text style={styles.vaccineName}>{availableVaccine.vaccine_name}</Text>
                  <Text style={styles.vaccineDescription}>Instruction: {availableVaccine.instruction}</Text>
                  <Text style={commonStyles.vaccineDoseQuantity}>Current Dose: {availableVaccine.dose_quantity}</Text>
                </View>
              </View>
              <View style={commonStyles.appointmentActions}>
                <TouchableOpacity
                  style={[commonStyles.button, styles.rescheduleButton]}
                  onPress={() => handleEditClick(availableVaccine)}
                >
                  <Text style={commonStyles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteVaccine(availableVaccine)}
                  style={[commonStyles.button, styles.cancelButton]}
                  labelStyle={commonStyles.buttonText}
                >
                  <Text style={commonStyles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={commonStyles.errorText}>No available vaccines, please create new vaccines!</Text>
          </View>
        )}
        <HelperText type="success" style={commonStyles.successText} visible={!!scMsg}>
          {scMsg}
        </HelperText>
        <TouchableOpacity style={[commonStyles.button, styles.viewAllButton]} onPress={handleLoadVaccines} disabled={loading} loading={loading}>
          <Text style={commonStyles.buttonText}>See more Vaccines</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[commonStyles.button, styles.viewAllButton]}
          onPress={() => {
            setIsCreateModalVisible(true);
            setCreateFormData({
              category_id: '',
              vaccine_name: '',
              dose_quantity: '',
              instruction: '',
              unit_price: '',
            });
            setCreateFormErrors({});
          }}
        >
          <Text style={commonStyles.buttonText}>Create new Vaccine</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={commonStyles.modalContainer}
          >
            <View style={commonStyles.modalContent}>
              <Text style={[commonStyles.cardTitle, { marginBottom: SPACING.large }]}>
                Edit Vaccine Information
              </Text>
              {formErrors.general && (
                <HelperText type="error" visible={true}>
                  {formErrors.general}
                </HelperText>
              )}
              {info.map(i => (
                <View key={i.field}>
                  <Text style={commonStyles.label}>{i.label}</Text>
                  <TextInput
                    style={commonStyles.input}
                    label={i.label}
                    secureTextEntry={i.secureTextEntry}
                    right={<TextInput.Icon icon={i.icon} />}
                    value={formData[i.field]}
                    onChangeText={(text) => setFormData({ ...formData, [i.field]: text })}
                    multiline={i.field === 'instruction'}
                    keyboardType={i.field === 'dose_quantity' || i.field === 'unit_price' ? 'numeric' : 'default'}
                    error={!!formErrors[i.field]}
                  />
                  <HelperText type="error" visible={!!formErrors[i.field]}>
                    {formErrors[i.field]}
                  </HelperText>
                </View>
              ))}

              <HelperText type="error" style={commonStyles.errorText} visible={msg}>
                {msg}
              </HelperText>

              <View style={commonStyles.appointmentActions}>
                <TouchableOpacity
                  style={[commonStyles.button, styles.rescheduleButton]}
                  onPress={handleSave}
                >
                  <Text style={commonStyles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[commonStyles.button, styles.cancelButton]}
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text style={commonStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCreateModalVisible}
        onRequestClose={() => setIsCreateModalVisible(false)}
        presentationStyle='overFullScreen'
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={commonStyles.modalContainer}
          >
            <ScrollView style={commonStyles.modalContent}>
              <View style={commonStyles.modalContent}>
                <Text style={[commonStyles.cardTitle, { marginBottom: SPACING.large }]}>
                  Create New Vaccine
                </Text>
                {createFormErrors.general && (
                  <HelperText type="error" visible={true}>
                    {createFormErrors.general}
                  </HelperText>
                )}
                <View>
                  <Text style={commonStyles.label}>Category</Text>
                  <View style={{ borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 4 }}>
                    <Picker
                      selectedValue={createFormData.category_id}
                      onValueChange={(value) => setCreateFormData({ ...createFormData, category_id: value })}
                      style={{ height: 50 }}
                    >
                      <Picker.Item label="Select a category" value="" />
                      {vaccineCategories.map(category => (
                        <Picker.Item key={category.id} label={category.category_name} value={category.id} />
                      ))}
                    </Picker>
                  </View>
                  <HelperText type="error" visible={!!createFormErrors.category_id}>
                    {createFormErrors.category_id}
                  </HelperText>
                </View>
                {createInfo.filter(i => i.field !== 'category_id').map(i => (
                  <View key={i.field}>
                    <Text style={commonStyles.label}>{i.label}</Text>
                    <TextInput
                      style={commonStyles.input}
                      label={i.label}
                      secureTextEntry={i.secureTextEntry}
                      right={<TextInput.Icon icon={i.icon} />}
                      value={createFormData[i.field]}
                      onChangeText={(text) => setCreateFormData({ ...createFormData, [i.field]: text })}
                      multiline={i.field === 'instruction'}
                      keyboardType={i.field === 'dose_quantity' || i.field === 'unit_price' ? 'numeric' : 'default'}
                      error={!!createFormErrors[i.field]}
                    />
                    <HelperText type="error" visible={!!createFormErrors[i.field]}>
                      {createFormErrors[i.field]}
                    </HelperText>
                  </View>
                ))}

                <View style={commonStyles.inputContainer}>
                  <Text style={commonStyles.label}>Vaccine Image</Text>
                  <TouchableOpacity style={commonStyles.dateButton} onPress={picker}>
                    <Text style={commonStyles.dateButtonText}>Choose Vaccine Image</Text>
                  </TouchableOpacity>
                  {vaccine?.image &&
                    <Image
                      style={[commonStyles.imageContainer, commonStyles.image, { marginTop: SPACING.medium }]}
                      source={{ uri: campaign.image.uri }}
                    />}
                </View>

                <View style={commonStyles.appointmentActions}>
                  <TouchableOpacity
                    style={[commonStyles.button, styles.rescheduleButton]}
                    onPress={handleCreateVaccine}
                  >
                    <Text style={commonStyles.buttonText}>Create</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[commonStyles.button, styles.cancelButton]}
                    onPress={() => setIsCreateModalVisible(false)}
                  >
                    <Text style={commonStyles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  rescheduleButton: {
    flex: 1,
    marginRight: SPACING.small,
    marginTop: -10,
  },
  cancelButton: {
    flex: 1,
    marginLeft: SPACING.small,
    marginTop: -10,
    backgroundColor: COLORS.danger,
  },
  logoutButton: {
    padding: 5,
  },
  welcomeSection: {
    marginBottom: SPACING.extraLarge,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.small,
    paddingBottom: SPACING.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  statusLabel: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  appointment: {
    flexDirection: 'row',
    marginBottom: SPACING.medium,
  },
  appointmentDate: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.small,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    marginRight: SPACING.medium,
  },
  appointmentMonth: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  appointmentDay: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  appointmentLocation: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  appointmentTime: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 2,
  },
  vaccineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.medium,
  },
  vaccineIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.medium,
  },
  vaccineIconText: {
    fontSize: 20,
  },
  vaccineDetails: {
    flex: 1,
  },
  vaccineName: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  vaccineDescription: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.secondary,
    marginTop: SPACING.regular,
    marginBottom: SPACING.regular
  },
  viewAllButton: {
    marginTop: SPACING.small,
  },
};

export default VaccineManagementScreen; 