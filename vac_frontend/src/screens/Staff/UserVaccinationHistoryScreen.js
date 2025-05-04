import React from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../styles/MyStyles';


const UserVaccinationHistory = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track User Vaccination History</Text>
      <Text style={commonStyles.text}>Welcome to the Admin Dashboard. View statistics and manage the platform.</Text>
    </View>
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

export default UserVaccinationHistory;