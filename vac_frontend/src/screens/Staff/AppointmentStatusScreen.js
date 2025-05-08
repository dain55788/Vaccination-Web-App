import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../styles/MyStyles';
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "../../utils/MyContexts";
import { useContext } from "react";
import { ActivityIndicator, List } from 'react-native-paper';


const AppointmentStatusScreen = () => {
  const appointmentVaccineEndpoint = endpoints['appointmentvaccine'];
  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const [appointmentVaccines, setAppointmentVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadAppointmentVaccines = async () => {
    if (page > 0) {
      let url = `${endpoints['appointment']}?page=${page}`;
      
      try {
        setLoading(true);
        const response = await Apis.get(url);
        const data = response.data;
        setAppointmentVaccines([...appointmentVaccines, ...data.results]);
        if (res.data.next === null)
          setPage(0);
      } catch (error) {
        console.error('Error fetching appointments vaccines:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadAppointmentVaccines();
  }, []);

  useEffect(() => {
    setPage(1);
  }, []);

  const loadMore = () => {
    if (!loading && page > 0)
      setPage(page + 1);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {appointmentVaccines?.length > 0 ? (
          appointmentVaccines.map(i => (
            <View key={i.id} style={styles.card}>
              <Text style={styles.title}>Lịch Khám</Text>
              <Text>Vaccine: {i.vaccine_info?.vaccine_name} </Text>
              <Text>Doctor: {i.staff_info?.first_name} {i.staff_info?.last_name}</Text>
              <Text>Cost: ${i.cost}</Text>
              <Text>Location: {i.location}</Text>
              <Text>scheduled_date: {i.scheduled_date}</Text>
              <Text>Status: {i.status}</Text>
            </View>)
          )) : (
          <Text style={styles.emptyText}>Không có dữ liệu lịch khám</Text>
        )}
      </ScrollView>
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
  },
});

export default AppointmentStatusScreen;