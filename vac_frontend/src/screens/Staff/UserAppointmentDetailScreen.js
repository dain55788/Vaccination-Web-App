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

const UserAppointmentDetail = ({ route }) => {
  const { userId } = route.params;

  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const [appointmentsdata, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [appointmentvaccine, setAV] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const loadAV = async () => {
    try {
      setLoading(true);

      const response = await Apis.get(endpoints['appointmentvaccine']);
      const data = response.data;

      if (data?.results) { setAV([...appointmentvaccine, ...data.results]); }
      else { setAV([...appointmentvaccine, ...data]); }

    } catch (error) {
      console.error('Error fetching users data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAppointmentsData = async () => {
    try {
      setLoading(true);

      const response = await Apis.get(endpoints['appointment-bycitizen'](userId));
      const data = response.data;
      if (data?.results) { setAppointmentsData([...appointmentsdata, ...data.results]); }
      else { setAppointmentsData([...appointmentsdata, ...data]); }

    } catch (error) {
      console.error('Error fetching users data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      loadAppointmentsData();
      loadAV();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (appointmentsdata.length > 0 && appointmentvaccine.length > 0) {
      const mergedData = appointmentsdata.map((user) => {
        const vaccine = appointmentvaccine.find(av => av.id === user.id);
        return {
          ...user,
          vaccineName: vaccine ? vaccine.vaccine_info.vaccine_name : "No vaccine data",
          status: vaccine ? vaccine.status : "",
        };
      });
      setCombinedData(mergedData);
    }
  }, [appointmentsdata, appointmentvaccine]);

  const loadMore = () => {
    if (!loading) {
      setLoading(true);
    }
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [searchData, setSearchData] = useState([]);

  const search = useCallback((query) => {
    const searchLower = query.toLowerCase();
    const filtered = combinedData.filter(av =>
      // `${av?.first_name} ${av?.last_name}`.toLowerCase().includes(searchLower) ||
      // av.id.toString().includes(searchLower) ||
      `${av?.scheduled_date}`.includes(searchLower)
    );
    setSearchData(filtered);
  }, [combinedData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      search(searchQuery);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, search]);

  const renderItem = ({ item: i, index }) => (
    <View key={i.id ? `${i.id}-${index}` : `key-${index}`} style={commonStyles.card}>
      <Text style={[styles.title]}>Appointment: {i.id}</Text>

      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={[styles.textName]}>Vaccine Name: </Text>
        <Text style={[styles.textValue]}>{i.vaccineName}</Text>
      </Text>
      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={[styles.textName]}>Date: </Text>
        <Text style={[styles.textValue]}>{i.scheduled_date}</Text>
      </Text>
      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={[styles.textName]}>Location: </Text>
        <Text style={[styles.textValue]}>{i.location}</Text>
      </Text>
      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={styles.textName}>Status: </Text>
        <Text style={i.status === 'completed' ? styles.statusCompleted :
          (i.status === 'scheduled' ? styles.statusScheduled : styles.statusCancelled)}>
          {i.status}
        </Text>
      </Text>
      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={[styles.textName]}>Notes: </Text>
        <Text style={[styles.textValue]}>{i.notes}</Text>
      </Text>
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
        <Text style={commonStyles.headerTitle}>User Detail Appointment</Text>
        <View style={styles.emptySpace} />
      </View>
      <TextInput
        style={commonStyles.input}
        placeholder="🔎 Search by date (YYYY-MM-DD)"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        ListFooterComponent={!loading && <ActivityIndicator />}
        onEndReached={loadMore}
        data={searchData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : `key-${index}`}
        ListEmptyComponent={<Text style={styles.noData}>No Appointment data</Text>}
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
    fontSize: FONT_SIZE.extraLarge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.small,
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
    color: 'black',
  },
  textValue: {
    fontSize: FONT_SIZE.large,
    color: 'black',
    marginBottom: SPACING.small,
  },
  marginBot: {
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
  noData: {
    fontSize: FONT_SIZE.enormous,
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 5,
    margin: 8,
    color: 'red',
  },
});

export default UserAppointmentDetail;