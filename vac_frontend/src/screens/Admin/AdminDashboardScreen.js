import React, { useState, useEffect } from 'react';
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
import { ActivityIndicator, HelperText, List, TextInput } from 'react-native-paper';

const AdminDashboard = () => {
  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const [stats, setStats] = useState({});
  const [percentcompleted, setPC] = useState([]);
  const [timeFilter, setTimeFilter] = useState('month');
  const [loading, setLoading] = useState(false);
  const [vaccineusage, setVU] = useState([]);

  const loadVU = async () => {
    try {
      setLoading(true);
      const response = await Apis.get(`${endpoints['vaccineusage']}`);
      const data = response.data;
      if (data?.results) { setVU(data.results); }
      else { setVU(data); }
    } catch (error) {
      console.error('Error loading vaccineusage:', error);
    } finally {
      setLoading(false);
    }
  };


  const loadPC = async () => {
    try {
      setLoading(true);
      console.info(`${endpoints['appointment']}/completion-rate/`);
      const response = await Apis.get(`${endpoints['appointment']}completion-rate/`);
      const data = response.data;

      if (data?.results) { setPC(data.results); }
      else { setPC(data); }

    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await Apis.get(`${endpoints['get-statistics']}?type=${timeFilter}`);
      setStats(response.data);

    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };
  useEffect(() => {
    // loadStatistics();
    loadVU();
    loadPC();
  }, []);

  const renderVU = ({ item: i, index }) => (
    <View key={i.id ? `${i.id}-${index}` : `key-${index}`} style={commonStyles.card}>
      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={[styles.textName]}>Vaccine type: </Text>
        <Text style={[styles.textValue]}>{i.vaccine_types}</Text>
      </Text>
      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={[styles.textName]}>Period: </Text>
        <Text style={[styles.textValue]}>{i.period}</Text>
      </Text>
    </View>
  );

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
        <Text style={commonStyles.headerTitle}>Admin Statistics</Text>
        <View style={styles.emptySpace} />
      </View>
      <View>
        <Text>Total Vaccinations: {percentcompleted.total_appointments || 0}</Text>
        <Text>Total Scheduled: {percentcompleted.total_scheduled || 0}</Text>
        <Text>Total Completed: {percentcompleted.total_completed || 0}</Text>
        <Text>Total Cancelled: {percentcompleted.total_cancelled || 0}</Text>
        <Text>Completion Rate: {percentcompleted.completion_rate_percent || 0}%</Text>
      </View>
      <FlatList
        data={vaccineusage}
        renderItem={renderVU}
        keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : `key-${index}`}
        ListEmptyComponent={<Text style={styles.emptyText}>No Vaccine Usage data</Text>}
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
});

export default AdminDashboard;