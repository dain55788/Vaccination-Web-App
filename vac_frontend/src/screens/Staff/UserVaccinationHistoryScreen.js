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
  Image,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserVaccinationHistory = () => {

  const nav = useNavigation();
  const user = useContext(MyUserContext);

  const [usersdata, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState(null);

  const loadUsersData = async () => {
    if (page > 0) {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const url = `${endpoints['get-users']}?page=${page}`;
        const response = await Apis.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data;
        if (data?.results) { setUsersData([...usersdata, ...data.results]); }
        else { setUsersData([...usersdata, ...data]); }

        if (data.next === null) { setPage(0); }

      } catch (error) {
        console.error('Error fetching users data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      loadUsersData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [page]);

  const loadMore = () => {
    if (!loading && page > 0) {
      setLoading(true);
      setPage(page + 1);
    }
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [searchData, setSearchData] = useState([]);

  const search = useCallback((query) => {
    const searchLower = query.toLowerCase();
    const filtered = usersdata.filter(av =>
      `${av?.first_name} ${av?.last_name}`.toLowerCase().includes(searchLower) ||
      av.id.toString().includes(searchLower)
    );
    setSearchData(filtered);
  }, [usersdata]);


  useEffect(() => {
    const timer = setTimeout(() => {
      search(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, search]);

  const renderItem = ({ item, index }) => (

    <View key={item?.id ? `${item.id}-${index}` : `key-${index}`} style={[commonStyles.card, { flex: 1, flexDirection: 'row', }]}>
      <View>
        <Image style={[commonStyles.imageContainer, styles.profileImagePlaceholder]} resizeMode="cover" source={{ uri: item.avatar }} />
      </View>
      <View style={styles.userDetail}>
        <Text style={[commonStyles.title, styles.marginBot]}>
          Citizen: {item?.first_name} {item?.last_name}
        </Text>
        <Text style={[styles.textDescription]}>
          Appointments: {item?.appointment_info?.scheduled_date}
        </Text>
        <TouchableOpacity style={commonStyles.button}
          onPress={() => nav.navigate("UserAppointmentDetail", { "userId": item.id })}>
          <Text style={styles.seeAppointments}>
            See Appointments
          </Text>
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
        <Text style={commonStyles.headerTitle}>Track User Vaccination History</Text>
        <View style={styles.emptySpace} />
      </View>
      <TextInput
        style={commonStyles.input}
        placeholder="🔎 Search users by name or ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        ListFooterComponent={loading && <ActivityIndicator />}
        onEndReached={loadMore}
        data={searchData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : `key-${index}`}
        ListEmptyComponent={!loading && <Text style={styles.emptyText}>No Users Data</Text>}

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
  marginBot: {
    marginBottom: SPACING.small,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetail: {
    marginLeft: SPACING.large,
    marginTop: SPACING.enormous,
  },
  seeAppointments: {
    width: 200,
    textAlign: 'center',
    color: 'black',
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
  },
});

export default UserVaccinationHistory;