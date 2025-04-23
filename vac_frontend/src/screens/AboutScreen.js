import React from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import commonStyles, { COLORS, SPACING, FONT_SIZE } from '../styles/MyStyles';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={commonStyles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>About VaxServe</Text>
        <View style={styles.emptySpace} />
      </View>

      <ScrollView style={commonStyles.padding}>
        {/* Mission Statement */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={commonStyles.text}>
            VaxServe is dedicated to making vaccination services accessible, efficient, and user-friendly for everyone. We believe in protecting public health through easy access to essential vaccinations and professional healthcare services.
          </Text>
        </View>

        {/* What We Do */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>What We Do</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>• Easy Appointment Scheduling</Text>
            <Text style={styles.featureText}>Book your vaccination appointments online with just a few clicks</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>• Multiple Location Options</Text>
            <Text style={styles.featureText}>Choose from various vaccination centers near you</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>• Comprehensive Vaccine Coverage</Text>
            <Text style={styles.featureText}>Access to a wide range of essential vaccinations</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureTitle}>• Professional Healthcare Staff</Text>
            <Text style={styles.featureText}>Experienced medical professionals ensuring safe vaccinations</Text>
          </View>
        </View>

        {/* Our Values */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Accessibility</Text>
            <Text style={styles.valueText}>Making healthcare services available to everyone</Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Safety</Text>
            <Text style={styles.valueText}>Ensuring the highest standards of medical care</Text>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueTitle}>Innovation</Text>
            <Text style={styles.valueText}>Using technology to improve healthcare delivery</Text>
          </View>
        </View>

        {/* Team */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={commonStyles.text}>
            VaxServe is powered by a dedicated team of healthcare professionals, technologists, and administrators working together to provide the best vaccination services to our community.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Additional styles specific to AboutScreen
const styles = {
  backButton: {
    marginRight: SPACING.medium,
  },
  backButtonText: {
    fontSize: FONT_SIZE.huge,
    color: COLORS.primary,
  },
  emptySpace: {
    width: 40, // To balance the header since we have a back button on the left
  },
  sectionTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.regular,
  },
  featureItem: {
    marginBottom: SPACING.regular,
  },
  featureTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.tiny,
  },
  featureText: {
    fontSize: FONT_SIZE.regular,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  valueItem: {
    marginBottom: SPACING.regular,
  },
  valueTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.tiny,
  },
  valueText: {
    fontSize: FONT_SIZE.regular,
    color: COLORS.text.secondary,
    lineHeight: 20,
  }
};

export default AboutScreen; 