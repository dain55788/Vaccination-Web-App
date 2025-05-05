import React from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../styles/MyStyles';
import { useNavigation } from "@react-navigation/native";

const ServicesScreen = () => {
  const nav = useNavigation();
  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar style="dark" />
      <View style={commonStyles.header}>
        <TouchableOpacity tại sao hot reload trong project của tôi không hoạt động
          style={styles.backButton}
          onPress={() => nav.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Our Services</Text>
        <View style={styles.emptySpace} />
      </View>

      <ScrollView style={commonStyles.padding}>
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Comprehensive Vaccination Services</Text>
          <Text style={commonStyles.text}>
            At VaxServe, we offer a wide range of vaccination services to meet the needs of individuals and families. 
            Our healthcare professionals are trained to provide safe, effective, and comfortable vaccination experiences.
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Available Vaccines</Text>
          
          <View style={styles.vaccineItem}>
            <View style={styles.vaccineIcon}>
              <Text style={styles.vaccineIconText}>🦠</Text>
            </View>
            <View style={styles.vaccineContent}>
              <Text style={styles.vaccineTitle}>COVID-19 Vaccination</Text>
              <Text style={commonStyles.text}>
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
              <Text style={commonStyles.text}>
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
              <Text style={commonStyles.text}>
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
              <Text style={commonStyles.text}>
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
              <Text style={commonStyles.text}>
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
              <Text style={commonStyles.text}>
                Specialized vaccines for international travelers including Typhoid, Yellow Fever, and Japanese Encephalitis.
              </Text>
            </View>
          </View>
        </View>

        {/* Special Programs */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Special Programs</Text>

          <View style={styles.programCard}>
            <Text style={styles.programTitle}>School Vaccination Program</Text>
            <Text style={commonStyles.text}>
              We partner with schools to provide convenient vaccination clinics for students, ensuring they meet all required immunizations for attendance.
            </Text>
            <TouchableOpacity style={[commonStyles.button, commonStyles.buttonOutline, styles.programButton]}>
              <Text style={commonStyles.buttonOutlineText}>Learn More</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.programCard}>
            <Text style={styles.programTitle}>Workplace Vaccination</Text>
            <Text style={commonStyles.text}>
              On-site vaccination services for businesses to protect employees against seasonal flu and other preventable diseases, minimizing sick days and promoting workplace health.
            </Text>
            <TouchableOpacity style={[commonStyles.button, commonStyles.buttonOutline, styles.programButton]}>
              <Text style={commonStyles.buttonOutlineText}>Learn More</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.programCard}>
            <Text style={styles.programTitle}>Senior Vaccination Initiative</Text>
            <Text style={commonStyles.text}>
              Specialized services for seniors, including high-dose flu vaccines, pneumococcal vaccines, and shingles vaccines with home visit options available.
            </Text>
            <TouchableOpacity style={[commonStyles.button, commonStyles.buttonOutline, styles.programButton]}>
              <Text style={commonStyles.buttonOutlineText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How It Works */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>How It Works</Text>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Schedule an Appointment</Text>
              <Text style={commonStyles.text}>
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
              <Text style={commonStyles.text}>
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
              <Text style={commonStyles.text}>
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
              <Text style={commonStyles.text}>
                We'll monitor you briefly after vaccination and provide digital records of your immunization.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={commonStyles.button}
          onPress={() => nav.navigate('Appointment')}
        >
          <Text style={commonStyles.buttonText}>Schedule Vaccination</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  backButton: {
    marginRight: SPACING.medium,
  },
  backButtonText: {
    fontSize: FONT_SIZE.huge,
    color: COLORS.primary,
  },
  emptySpace: {
    width: 40,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.medium,
  },
  vaccineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.medium,
    alignItems: 'flex-start',
  },
  vaccineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.medium,
  },
  vaccineIconText: {
    fontSize: FONT_SIZE.large,
  },
  vaccineContent: {
    flex: 1,
  },
  vaccineTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.tiny,
  },
  programCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  programTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.small,
  },
  programButton: {
    alignSelf: 'flex-start',
    marginTop: SPACING.small,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: SPACING.medium,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.medium,
  },
  stepNumberText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.medium,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.tiny,
  }
};

export default ServicesScreen;