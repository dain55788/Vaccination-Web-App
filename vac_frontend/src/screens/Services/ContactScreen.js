import React, { useState } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import commonStyles, { COLORS, SPACING, FONT_SIZE, SHADOW } from '../../styles/MyStyles';

const ContactScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !subject || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        'Thank you for your message. We will get back to you soon.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <StatusBar style="dark" />
      
      <View style={commonStyles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Contact Us</Text>
        <View style={styles.emptySpace} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={commonStyles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={commonStyles.padding}>
            {/* Contact Information */}
            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>Get in Touch</Text>
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Email:</Text>
                <Text style={styles.contactText}>support@vaxserve.com</Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Phone:</Text>
                <Text style={styles.contactText}>+1 (555) 123-4567</Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Address:</Text>
                <Text style={styles.contactText}>123 Healthcare Ave{'\n'}Medical District{'\n'}City, State 12345</Text>
              </View>
            </View>

            {/* Contact Form */}
            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>Send us a Message</Text>
              
              <View style={commonStyles.formContainer}>
                <Text style={commonStyles.label}>Name *</Text>
                <TextInput
                  style={commonStyles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />
              </View>

              <View style={commonStyles.formContainer}>
                <Text style={commonStyles.label}>Email *</Text>
                <TextInput
                  style={commonStyles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={commonStyles.formContainer}>
                <Text style={commonStyles.label}>Subject *</Text>
                <TextInput
                  style={commonStyles.input}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Enter subject"
                />
              </View>

              <View style={commonStyles.formContainer}>
                <Text style={commonStyles.label}>Message *</Text>
                <TextInput
                  style={[commonStyles.input, styles.messageInput]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Enter your message"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[commonStyles.button, isSubmitting && commonStyles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={commonStyles.buttonText}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Business Hours */}
            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>Business Hours</Text>
              <View style={styles.hoursItem}>
                <Text style={styles.hoursDay}>Monday - Friday:</Text>
                <Text style={styles.hoursTime}>9:00 AM - 6:00 PM</Text>
              </View>
              <View style={styles.hoursItem}>
                <Text style={styles.hoursDay}>Saturday:</Text>
                <Text style={styles.hoursTime}>9:00 AM - 2:00 PM</Text>
              </View>
              <View style={styles.hoursItem}>
                <Text style={styles.hoursDay}>Sunday:</Text>
                <Text style={styles.hoursTime}>Closed</Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Additional styles specific to ContactScreen
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
    marginBottom: SPACING.medium,
  },
  contactItem: {
    marginBottom: SPACING.medium,
  },
  contactLabel: {
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.tiny,
  },
  contactText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  messageInput: {
    minHeight: 100,
    paddingTop: SPACING.small,
  },
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.small,
    paddingBottom: SPACING.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  hoursDay: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  hoursTime: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.secondary,
  }
};

export default ContactScreen; 