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

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const renderItem = ({ item: i, index }) => (
    <View key={i.id ? `${i.id}-${index}` : `key-${index}`} style={commonStyles.card}>
      <Text>Hello</Text>
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
      <View style={styles.container}>
        <Text style={styles.text}>This is the Appointment Screen</Text>
        <Text style={styles.text}>Appointment ID: {userId}</Text>
      </View>

      {/* <FlatList
        onEndReached={loadMore} ListFooterComponent={loading && <ActivityIndicator />}
        data={searchAV}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ? `${item.id}-${index}` : `key-${index}`}
        ListEmptyComponent={<Text style={styles.emptyText}>No appointmentVaccines data</Text>}
      /> */}
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
    fontSize: FONT_SIZE.enormous,
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

export default UserAppointmentDetail;