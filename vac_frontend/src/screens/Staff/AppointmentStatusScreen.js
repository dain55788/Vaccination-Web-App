import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../styles/MyStyles';
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "../../utils/MyContexts";
import { useContext } from "react";
import { ActivityIndicator, HelperText, List, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const AppointmentStatusScreen = () => {
  const appointmentVaccineEndpoint = endpoints['appointmentvaccine'];
  const nav = useNavigation();
  const user = useContext(MyUserContext);

  const [appointmentVaccines, setAppointmentVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [msg, setMsg] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    notes: '',
  });

  const loadAppointmentVaccines = async () => {
    if (!hasMore || loading) return;
    try {
      setLoading(true);
      const url = `${endpoints['appointmentvaccine']}?page=${page}`;
      const response = await Apis.get(url);
      const data = response.data;

      setAppointmentVaccines(prev => [...prev, ...data.results]);
      if (!data.next) {
        setHasMore(false);
      } else {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching appointment vaccines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointmentVaccines();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchAV, setSearchAV] = useState([]);

  const search = useCallback((query) => {
    const searchLower = query.toLowerCase();
    const filtered = appointmentVaccines.filter(av =>
      av.vaccine_info?.vaccine_name?.toLowerCase().includes(searchLower) ||
      av.id.toString().includes(searchLower)
    );
    setSearchAV(filtered);
  }, [appointmentVaccines]);

  const handleEditClick = (data) => {
    setSelectedData(data);
    setFormData({
      status: data.status || '',
      notes: data.notes || '',
    });
    setMsg('');
    setIsEditModalVisible(true);
  };
  const handleSave = async () => {
    if (!formData.status) {
      setMsg('Status is required');
      return;
    };

    const noChanges =
      formData.status === (selectedData.status || '') &&
      formData.notes === (selectedData.notes || '');

    if (noChanges) {
      setMsg('Nothing has to change!!');
      return;
    }

    try {
      const response = await Apis.patch(`${endpoints['appointmentvaccine']}${selectedData.id}/`, {
        status: formData.status,
        notes: formData.notes,
      });

      const updateStatusandNotes = appointmentVaccines.map(v =>
        v.id === selectedData.id ? { ...v, ...response.data } : v
      );

      setAppointmentVaccines(updateStatusandNotes);
      setIsEditModalVisible(false);
      setSelectedData(null);
      setFormData({ status: '', notes: '' });
      Alert.alert('Success', 'Successfully update status information')
    } catch (error) {
      console.error('Error updating vaccine:', error);
      setMsg('Failed to update status. Please try again.');
    }
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      search(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, search]);

  const renderItem = ({ item: i, index }) => (
    <View key={i.id ? `${i.id}-${index}` : `key-${index}`} style={commonStyles.card}>
      <Text style={[styles.textName]}>Appointment {i.id}</Text>
      <Text style={[commonStyles.title, styles.marginBot]}>
        Vaccine: {i.vaccine_info?.vaccine_name}
      </Text>

      <Text style={[styles.textDescription]}>
        Doctor: {i.doctor_info?.first_name} {i.doctor_info?.last_name}
      </Text>

      <Text style={[styles.textDescription]}>
        Location: {i.appointment_info?.location}
      </Text>

      <Text style={[styles.textDescription]}>
        Scheduled_date: {i.appointment_info?.scheduled_date}
      </Text>

      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={styles.textDescription}>Status: </Text>
        <Text style={
          i.status === 'completed' ? styles.statusCompleted :
            (i.status === 'scheduled' ? styles.statusScheduled : styles.statusCancelled)
        }>
          {i.status}
        </Text>
      </Text>

      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={[styles.textDescription]}>Notes: </Text>
        <Text style={[styles.notesValue]}>{i.notes}</Text>
      </Text>

      <View style={commonStyles.appointmentActions}>
        <TouchableOpacity
          style={[commonStyles.button, styles.rescheduleButton]}
          onPress={() => handleEditClick(i)}
        >
          <Text style={commonStyles.buttonText}>Edit Status and Notes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={commonStyles.header}>
        <TouchableOpacity
          style={commonStyles.backButton}
          onPress={() => nav.goBack()}
        >
          <Text style={commonStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Appointments Status</Text>
        <View style={styles.emptySpace} />
      </View>
      <TextInput
        style={commonStyles.input}
        placeholder="🔎 Search vaccines by name or ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
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
                Edit Appointment's Status
              </Text>

              <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.formLabel}>Status</Text>
                <View style={styles.flexCol}>
                  <TouchableOpacity
                    style={[styles.radioButton, styles.radioSpacing, formData['status'] === 'scheduled' && styles.radioButtonSelected]}
                    onPress={() => setFormData({ ...formData, ['status']: 'scheduled' })}
                  >
                    <View style={formData['status'] === 'scheduled' ? styles.radioInnerSelected : styles.radioInner} />
                    <Text style={styles.radioLabel}>Scheduled</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.radioButton, styles.radioSpacing, formData['status'] === 'cancelled' && styles.radioButtonSelected]}
                    onPress={() => setFormData({ ...formData, ['status']: 'cancelled' })}
                  >
                    <View style={formData['status'] === 'cancelled' ? styles.radioInnerSelected : styles.radioInner} />
                    <Text style={styles.radioLabel}>Cancelled</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.radioButton, styles.radioSpacing, formData['status'] === 'completed' && styles.radioButtonSelected]}
                    onPress={() => setFormData({ ...formData, ['status']: 'completed' })}
                  >
                    <View style={formData['status'] === 'completed' ? styles.radioInnerSelected : styles.radioInner} />
                    <Text style={styles.radioLabel}>Completed</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={commonStyles.input}
                  label={'Notes'}
                  right={<TextInput.Icon icon={'pencil'} />}
                  value={formData['notes']}
                  onChangeText={(text) => setFormData({ ...formData, ['notes']: text })}
                  error={!!msg}
                />

                <HelperText type="error" style={commonStyles.errorText} visible={msg}>
                  {msg}
                </HelperText>

              </View>

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

      <FlatList
        onEndReached={loadMore} ListFooterComponent={loading && <ActivityIndicator />}
        data={searchAV}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : `key-${index}`}
        ListEmptyComponent={<Text style={styles.emptyText}>No appointmentVaccines data</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.medium,
    backgroundColor: COLORS.background.primary,
  },
  title: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.medium,
  }, radioContainer: {
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
  flexCol: {
    flexDirection: 'column',
  },
  radioSpacing: {
    margin: 5,
    padding: 3,
  },
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
  textName: {
    fontSize: FONT_SIZE.large,
    marginTop: SPACING.small,
    marginBottom: SPACING.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  textDescription: {
    fontSize: FONT_SIZE.large,
    color: COLORS.text.secondary,
    marginBottom: SPACING.small,
  },
  statusScheduled: {
    fontSize: FONT_SIZE.large,
    color: '#66B2FF',
    marginBottom: SPACING.small,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  statusCompleted: {
    fontSize: FONT_SIZE.large,
    color: '#28A745',
    marginBottom: SPACING.small,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  statusCancelled: {
    fontSize: FONT_SIZE.large,
    color: '#DC3545',
    marginBottom: SPACING.small,
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  notesValue: {
    fontSize: FONT_SIZE.large,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: SPACING.small,
  },
  marginBot: {
    marginBottom: SPACING.small,
  },
});

export default AppointmentStatusScreen;