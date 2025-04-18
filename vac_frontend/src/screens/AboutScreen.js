import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About VaxServe</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Mission Statement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            VaxServe is dedicated to making vaccination services accessible, efficient, and user-friendly for everyone. We believe in protecting public health through easy access to essential vaccinations and professional healthcare services.
          </Text>
        </View>

        {/* What We Do */}
        <View style={styles.section}>
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
        <View style={styles.section}>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.sectionText}>
            VaxServe is powered by a dedicated team of healthcare professionals, technologists, and administrators working together to provide the best vaccination services to our community.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 24,
    color: '#2a6df4',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a6df4',
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  featureItem: {
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  valueItem: {
    marginBottom: 15,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a6df4',
    marginBottom: 5,
  },
  valueText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default AboutScreen; 