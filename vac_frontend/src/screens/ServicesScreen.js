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

const ServicesScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Our Services</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comprehensive Vaccination Services</Text>
          <Text style={styles.sectionText}>
            At VaxServe, we offer a wide range of vaccination services to meet the needs of individuals and families. 
            Our healthcare professionals are trained to provide safe, effective, and comfortable vaccination experiences.
          </Text>
        </View>

        {/* Vaccination Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Vaccines</Text>
          
          <View style={styles.vaccineItem}>
            <View style={styles.vaccineIcon}>
              <Text style={styles.vaccineIconText}>🦠</Text>
            </View>
            <View style={styles.vaccineContent}>
              <Text style={styles.vaccineTitle}>COVID-19 Vaccination</Text>
              <Text style={styles.vaccineText}>
                Primary series and booster doses of approved COVID-19 vaccines for all eligible age groups.
              </Text>
            </View>
          </View>

          <View style={styles.vaccineItem}>
            <View style={styles.vaccineIcon}>
              <Text style={styles.vaccineIconText}>🌡️</Text>
            </View>
            <View style={styles.vaccineContent}>
              <Text style={styles.vaccineTitle}>Influenza (Flu)</Text>
              <Text style={styles.vaccineText}>
                Seasonal flu vaccines including standard dose, high-dose for seniors, and preservative-free options.
              </Text>
            </View>
          </View>

          <View style={styles.vaccineItem}>
            <View style={styles.vaccineIcon}>
              <Text style={styles.vaccineIconText}>👶</Text>
            </View>
            <View style={styles.vaccineContent}>
              <Text style={styles.vaccineTitle}>Childhood Immunizations</Text>
              <Text style={styles.vaccineText}>
                Complete range of vaccines for children from birth through adolescence following CDC recommendations.
              </Text>
            </View>
          </View>

          <View style={styles.vaccineItem}>
            <View style={styles.vaccineIcon}>
              <Text style={styles.vaccineIconText}>🧠</Text>
            </View>
            <View style={styles.vaccineContent}>
              <Text style={styles.vaccineTitle}>Tdap (Tetanus, Diphtheria, Pertussis)</Text>
              <Text style={styles.vaccineText}>
                Protection against tetanus, diphtheria, and pertussis (whooping cough) for adolescents and adults.
              </Text>
            </View>
          </View>

          <View style={styles.vaccineItem}>
            <View style={styles.vaccineIcon}>
              <Text style={styles.vaccineIconText}>🏥</Text>
            </View>
            <View style={styles.vaccineContent}>
              <Text style={styles.vaccineTitle}>Hepatitis A & B</Text>
              <Text style={styles.vaccineText}>
                Vaccines to prevent Hepatitis A and B infections, available for children and adults.
              </Text>
            </View>
          </View>

          <View style={styles.vaccineItem}>
            <View style={styles.vaccineIcon}>
              <Text style={styles.vaccineIconText}>🦟</Text>
            </View>
            <View style={styles.vaccineContent}>
              <Text style={styles.vaccineTitle}>Travel Vaccines</Text>
              <Text style={styles.vaccineText}>
                Specialized vaccines for international travelers including Typhoid, Yellow Fever, and Japanese Encephalitis.
              </Text>
            </View>
          </View>
        </View>

        {/* Special Programs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Programs</Text>

          <View style={styles.programCard}>
            <Text style={styles.programTitle}>School Vaccination Program</Text>
            <Text style={styles.programText}>
              We partner with schools to provide convenient vaccination clinics for students, ensuring they meet all required immunizations for attendance.
            </Text>
            <TouchableOpacity style={styles.programButton}>
              <Text style={styles.programButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.programCard}>
            <Text style={styles.programTitle}>Workplace Vaccination</Text>
            <Text style={styles.programText}>
              On-site vaccination services for businesses to protect employees against seasonal flu and other preventable diseases, minimizing sick days and promoting workplace health.
            </Text>
            <TouchableOpacity style={styles.programButton}>
              <Text style={styles.programButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.programCard}>
            <Text style={styles.programTitle}>Senior Vaccination Initiative</Text>
            <Text style={styles.programText}>
              Specialized services for seniors, including high-dose flu vaccines, pneumococcal vaccines, and shingles vaccines with home visit options available.
            </Text>
            <TouchableOpacity style={styles.programButton}>
              <Text style={styles.programButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Schedule an Appointment</Text>
              <Text style={styles.stepText}>
                Book your vaccination appointment through our app, website, or by calling our service center.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Complete Pre-Vaccination Screening</Text>
              <Text style={styles.stepText}>
                Fill out a brief health questionnaire to ensure you can safely receive the vaccine.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Receive Your Vaccination</Text>
              <Text style={styles.stepText}>
                Our trained healthcare professionals will administer your vaccine in a clean, safe environment.
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Post-Vaccination Monitoring</Text>
              <Text style={styles.stepText}>
                We'll monitor you briefly after vaccination and provide digital records of your immunization.
              </Text>
            </View>
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What should I bring to my vaccination appointment?</Text>
            <Text style={styles.faqAnswer}>
              Please bring a valid ID, insurance card (if applicable), and any previous vaccination records if available.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Are walk-ins accepted?</Text>
            <Text style={styles.faqAnswer}>
              While appointments are preferred, we do accept walk-ins based on availability. Please call ahead to check current wait times.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How long should I stay after getting vaccinated?</Text>
            <Text style={styles.faqAnswer}>
              We recommend staying for 15-30 minutes after vaccination for monitoring, especially for first-time vaccines.
            </Text>
          </View>
        </View>

        {/* Contact for Services */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Get Vaccinated?</Text>
          <Text style={styles.ctaText}>
            Schedule your vaccination appointment today or contact us with any questions about our services.
          </Text>
          <View style={styles.ctaButtons}>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Appointment')}
            >
              <Text style={styles.ctaButtonText}>Make Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.ctaButton, styles.ctaSecondaryButton]}
              onPress={() => navigation.navigate('Contact')}
            >
              <Text style={styles.ctaSecondaryButtonText}>Contact Us</Text>
            </TouchableOpacity>
          </View>
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
  vaccineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  vaccineIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  vaccineIconText: {
    fontSize: 24,
  },
  vaccineContent: {
    flex: 1,
  },
  vaccineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  vaccineText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  programCard: {
    backgroundColor: '#f0f7ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2a6df4',
  },
  programTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a6df4',
    marginBottom: 10,
  },
  programText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 15,
  },
  programButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#2a6df4',
    borderRadius: 20,
  },
  programButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a6df4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  faqItem: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: '#2a6df4',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  ctaText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    lineHeight: 24,
  },
  ctaButtons: {
    flexDirection: 'row',
  },
  ctaButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 10,
  },
  ctaButtonText: {
    color: '#2a6df4',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ctaSecondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },
  ctaSecondaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ServicesScreen; 