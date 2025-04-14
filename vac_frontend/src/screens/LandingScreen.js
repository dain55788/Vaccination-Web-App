import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Modal, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const LandingScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <Text style={styles.navLogo}>VaxServe</Text>
        <View style={styles.navLinksContainer}>
          <TouchableOpacity style={styles.navLink}>
            <Text style={styles.navLinkText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => navigation.navigate('Services')}
          >
            <Text style={styles.navLinkText}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => navigation.navigate('About')}
          >
            <Text style={styles.navLinkText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => navigation.navigate('Contact')}
          >
            <Text style={styles.navLinkText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navLink}>
            <Text style={styles.navLinkText}>Upcoming Campaigns</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => navigation.navigate('Appointment')}
          >
            <Text style={styles.navLinkText}>Make Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navLink}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.navLinkText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navLink, styles.authButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.navLinkText, styles.authButtonText]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navLink, styles.authButton, styles.registerButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.navLinkText, styles.authButtonText]}>Create Account</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Mobile Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuModalContainer}>
          <View style={styles.menuModal}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Services');
              }}
            >
              <Text style={styles.menuItemText}>Services</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('About');
              }}
            >
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Contact');
              }}
            >
              <Text style={styles.menuItemText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Upcoming Campaigns</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Login');
              }}
            >
              <Text style={styles.menuItemText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('Register');
              }}
            >
              <Text style={styles.menuItemText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>VaxServe</Text>
          <Text style={styles.subtitle}>Fast, Safe, Reliable Vaccination</Text>
        </View>

        {/* Main Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Vaccination Image</Text>
          </View>
        </View>

        {/* Overview Section */}
        <View style={styles.overviewContainer}>
          <Text style={styles.sectionTitle}>What is VaxServe?</Text>
          <Text style={styles.overviewText}>
            VaxServe is a comprehensive vaccination service platform designed to make healthcare accessible to everyone.
            We provide vaccination services, appointment scheduling, and digital health records to ensure you stay protected
            against preventable diseases. Our team of healthcare professionals is dedicated to ensuring your safety and comfort
            throughout the vaccination process.
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Locations</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Patients</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10+</Text>
              <Text style={styles.statLabel}>Vaccines</Text>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>✓ Easy Scheduling</Text>
            <Text style={styles.featureText}>Book your vaccination appointment with just a few taps</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>✓ Multiple Vaccines</Text>
            <Text style={styles.featureText}>COVID-19, Flu, HPV, and many other essential vaccines</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>✓ Digital Records</Text>
            <Text style={styles.featureText}>Access your vaccination history anytime, anywhere</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureTitle}>✓ Reminders</Text>
            <Text style={styles.featureText}>Never miss your next dose with automated notifications</Text>
          </View>
        </View>

        {/* Recent News Section */}
        <View style={styles.newsContainer}>
          <Text style={styles.sectionTitle}>Recent News</Text>
          
          <View style={styles.newsItem}>
            <View style={styles.newsDate}>
              <Text style={styles.newsDateText}>JUN 15</Text>
            </View>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>New COVID-19 Booster Available</Text>
              <Text style={styles.newsExcerpt}>
                The latest COVID-19 booster targeting new variants is now available at all VaxServe locations.
              </Text>
              <TouchableOpacity>
                <Text style={styles.newsReadMore}>Read more →</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.newsItem}>
            <View style={styles.newsDate}>
              <Text style={styles.newsDateText}>MAY 22</Text>
            </View>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>Flu Season Preparation Guide</Text>
              <Text style={styles.newsExcerpt}>
                Learn how to prepare for the upcoming flu season and why early vaccination is crucial.
              </Text>
              <TouchableOpacity>
                <Text style={styles.newsReadMore}>Read more →</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.newsItem}>
            <View style={styles.newsDate}>
              <Text style={styles.newsDateText}>APR 10</Text>
            </View>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>VaxServe Expands to 10 New Cities</Text>
              <Text style={styles.newsExcerpt}>
                We're excited to announce our expansion to 10 new cities nationwide to serve more communities.
              </Text>
              <TouchableOpacity>
                <Text style={styles.newsReadMore}>Read more →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Our Campaign Section */}
        <View style={styles.campaignContainer}>
          <Text style={styles.sectionTitle}>Our Campaign</Text>
          
          <View style={styles.campaignCard}>
            <View style={styles.campaignImagePlaceholder}>
              <Text style={styles.placeholderText}>Campaign Image</Text>
            </View>
            <Text style={styles.campaignTitle}>Vaccines For All Initiative</Text>
            <Text style={styles.campaignDescription}>
              Our "Vaccines For All" initiative aims to ensure that every person, regardless of location or socioeconomic status, 
              has access to essential vaccinations. Through partnerships with local health departments and community organizations, 
              we're working to eliminate barriers to vaccination services.
            </Text>
            <View style={styles.campaignStats}>
              <View style={styles.campaignStatItem}>
                <Text style={styles.campaignStatNumber}>75K+</Text>
                <Text style={styles.campaignStatLabel}>People Vaccinated</Text>
              </View>
              <View style={styles.campaignStatItem}>
                <Text style={styles.campaignStatNumber}>120+</Text>
                <Text style={styles.campaignStatLabel}>Communities Served</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.campaignButton}>
              <Text style={styles.campaignButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.campaignCard}>
            <View style={styles.campaignImagePlaceholder}>
              <Text style={styles.placeholderText}>Campaign Image</Text>
            </View>
            <Text style={styles.campaignTitle}>Education & Awareness Program</Text>
            <Text style={styles.campaignDescription}>
              Our education and awareness program focuses on providing accurate information about vaccines, 
              addressing common concerns, and promoting the importance of immunization for public health. 
              Through workshops, online resources, and community events, we're building vaccine confidence.
            </Text>
            <TouchableOpacity style={styles.campaignButton}>
              <Text style={styles.campaignButtonText}>Join Our Efforts</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Customer Reviews */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.sectionTitle}>What Our Customers Say</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsScrollContainer}
          >
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewStars}>★★★★★</Text>
                <Text style={styles.reviewerName}>Sarah J.</Text>
              </View>
              <Text style={styles.reviewText}>
                "The entire process was simple and efficient. The staff was friendly and professional, 
                making my vaccination experience completely stress-free."
              </Text>
            </View>
            
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewStars}>★★★★★</Text>
                <Text style={styles.reviewerName}>Michael T.</Text>
              </View>
              <Text style={styles.reviewText}>
                "I love that I can manage all my family's vaccinations in one app. The reminder 
                system has been a lifesaver for keeping up with my kids' immunization schedules."
              </Text>
            </View>
            
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewStars}>★★★★☆</Text>
                <Text style={styles.reviewerName}>Lisa R.</Text>
              </View>
              <Text style={styles.reviewText}>
                "Quick appointment booking and minimal wait times. The digital vaccination 
                records make it easy to share information with my doctor."
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerColumns}>
            <View style={styles.footerColumn}>
              <Text style={styles.footerColumnTitle}>Company</Text>
              <TouchableOpacity><Text style={styles.footerLink}>About Us</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Our Team</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Careers</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>News</Text></TouchableOpacity>
            </View>
            
            <View style={styles.footerColumn}>
              <Text style={styles.footerColumnTitle}>Resources</Text>
              <TouchableOpacity><Text style={styles.footerLink}>Blog</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Vaccine Info</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>FAQ</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Contact Support</Text></TouchableOpacity>
            </View>
            
            <View style={styles.footerColumn}>
              <Text style={styles.footerColumnTitle}>Legal</Text>
              <TouchableOpacity><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Terms of Service</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Cookie Policy</Text></TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.footerBottom}>
            <Text style={styles.footerText}>© 2023 KẻNghiệnVaccine. All rights reserved.</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>f</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>t</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>in</Text>
              </TouchableOpacity>
            </View>
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  navLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a6df4',
  },
  navLinksContainer: {
    flexDirection: 'row',
    display: 'none', // Hidden on small screens
    '@media (min-width: 768px)': {
      display: 'flex',
    },
  },
  navLink: {
    marginHorizontal: 10,
  },
  navLinkText: {
    color: '#444',
    fontWeight: '500',
  },
  navAuthLink: {
    backgroundColor: '#2a6df4',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  navAuthLinkText: {
    color: 'white',
    fontWeight: 'bold',
  },
  navRegisterLink: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2a6df4',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  navRegisterLinkText: {
    color: '#2a6df4',
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 5,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#2a6df4',
  },
  menuModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuModal: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a6df4',
  },
  closeButton: {
    fontSize: 20,
    color: '#555',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#444',
  },
  menuAuthButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  menuLoginButton: {
    backgroundColor: '#2a6df4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  menuRegisterButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a6df4',
    flex: 1,
    marginLeft: 5,
  },
  menuLoginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuRegisterButtonText: {
    color: '#2a6df4',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2a6df4',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e1e4e8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  overviewContainer: {
    marginBottom: 30,
  },
  overviewText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a6df4',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  featuresContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  feature: {
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a6df4',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    color: '#555',
  },
  newsContainer: {
    marginVertical: 20,
  },
  newsItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  newsDate: {
    width: 60,
    backgroundColor: '#2a6df4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  newsDateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  newsContent: {
    flex: 1,
    padding: 15,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  newsExcerpt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  newsReadMore: {
    color: '#2a6df4',
    fontWeight: '500',
    fontSize: 14,
  },
  reviewsContainer: {
    marginVertical: 20,
  },
  reviewsScrollContainer: {
    paddingBottom: 10,
    paddingRight: 20,
  },
  reviewCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewStars: {
    color: '#FFD700',
    fontSize: 16,
  },
  reviewerName: {
    fontWeight: 'bold',
    color: '#444',
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  ctaContainer: {
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: '#2a6df4',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a6df4',
  },
  secondaryButtonText: {
    color: '#2a6df4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  campaignContainer: {
    marginVertical: 20,
  },
  campaignCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  campaignImagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#e1e4e8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  campaignTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a6df4',
    marginBottom: 10,
  },
  campaignDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 15,
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  campaignStatItem: {
    alignItems: 'center',
  },
  campaignStatNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2a6df4',
  },
  campaignStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  campaignButton: {
    backgroundColor: '#2a6df4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  campaignButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 30,
  },
  footerColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  footerColumn: {
    minWidth: '30%',
    marginBottom: 20,
  },
  footerColumnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  footerLink: {
    color: '#666',
    marginBottom: 10,
    fontSize: 14,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
  socialLinks: {
    flexDirection: 'row',
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2a6df4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  socialIcon: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  registerButton: {
    backgroundColor: '#34C759',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default LandingScreen; 