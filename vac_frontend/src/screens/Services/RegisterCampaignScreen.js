import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    SafeAreaView,
    Image,
    ActivityIndicator
} from 'react-native';
import { commonStyles, COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../styles/MyStyles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MyUserContext, MyCampaignsContext } from '../../utils/MyContexts';
import Apis, { endpoints } from '../../utils/Apis';
import { useNavigation } from "@react-navigation/native";

const RegisterCampaignScreen = ({ route }) => {
    const { campaign } = route.params;
    const user = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const [formData, setFormData] = useState({
        fullName: `${user.first_name} ${user.last_name}`,
        phoneNumber: user.phone_number,
        email: user.email,
        dateOfBirth: user.date_of_birth,
        address: user.address,
        emergencyContact: '',
        emergencyPhone: '',
        medicalConditions: '',
        allergies: '',
        previousVaccinations: '',
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {

        const notesArray = [];

        notesArray.push(`Emergency Contact: ${formData.emergencyContact}`);
        notesArray.push(`Emergency Phone: ${formData.emergencyPhone}`);
        notesArray.push(`Medical Conditions: ${formData.medicalConditions}`);
        notesArray.push(`Allergies: ${formData.allergies}`);
        notesArray.push(`Previous Vaccinations: ${formData.previousVaccinations}`);

        let notes = notesArray.join('\n');

        setLoading(true);
        try {
            const registrationData = {
                injection_date: new Date().toISOString().split('T')[0],
                campaign: campaign.id,
                citizen: user.id,
                notes: notes,
            };

            console.log('Registration Data:', registrationData);

            let response = await Apis.post(endpoints['campaigncitizen'], registrationData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Registration Response:', response.data);

            Alert.alert(
                'Registration Successful!',
                `You have been successfully registered for ${campaign.campaign_name}. You will receive a confirmation email shortly.`,
                [
                    {
                        text: 'OK',
                        onPress: () => nav.navigate('Home')
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Registration Failed', 'There was an error processing your registration. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderInputField = (label, field, placeholder, multiline = false, keyboardType = 'default') => (
        <View style={commonStyles.formCard}>
            <Text style={commonStyles.formLabel}>{label}</Text>
            <TextInput
                style={[commonStyles.textInput, multiline && { height: 80, textAlignVertical: 'top' }]}
                placeholder={placeholder}
                value={formData[field]}
                onChangeText={(value) => handleInputChange(field, value)}
                multiline={multiline}
                keyboardType={keyboardType}
                placeholderTextColor={COLORS.text.muted}
            />
        </View>
    );

    return (
        <SafeAreaView style={commonStyles.safeArea}>
            <LinearGradient
                colors={[COLORS.primary]}
                style={commonStyles.header}
            >
                <TouchableOpacity onPress={() => nav.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <View style={commonStyles.headerContent}>
                    <Text style={[commonStyles.headerTitle, { color: COLORS.primary }]}>Campaign Registration</Text>
                </View>
                <View style={{ width: 24 }} />
            </LinearGradient>

            <ScrollView style={commonStyles.container} contentContainerStyle={commonStyles.scrollViewContent}>
                <View style={[commonStyles.card, { marginBottom: SPACING.large }]}>
                    {campaign.image && (
                        <View style={commonStyles.imageContainer}>
                            <Image
                                source={{ uri: campaign.image }}
                                style={[commonStyles.image, { height: 150 }]}
                                resizeMode="cover"
                            />
                        </View>
                    )}
                    <Text style={commonStyles.cardTitle}>{campaign.campaign_name}</Text>
                    <Text style={commonStyles.subtitle}>{campaign.description}</Text>

                    <View style={[commonStyles.row, { marginTop: SPACING.medium }]}>
                        <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                        <Text style={[commonStyles.text, { marginLeft: SPACING.small }]}>
                            <Text style={{ fontWeight: 'bold' }}>Location: </Text>
                            {campaign.location}
                        </Text>
                    </View>

                    <View style={commonStyles.row}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                        <Text style={[commonStyles.text, { marginLeft: SPACING.small }]}>
                            <Text style={{ fontWeight: 'bold' }}>Date: </Text>
                            {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                <View style={commonStyles.formCard}>
                    <Text style={commonStyles.sectionTitle}>Personal Information</Text>

                    {renderInputField('Full Name *', 'fullName', 'Enter your full name')}
                    {renderInputField('Phone Number *', 'phoneNumber', 'Enter your phone number', false, 'phone-pad')}
                    {renderInputField('Email Address *', 'email', 'Enter your email address', false, 'email-address')}
                    {renderInputField('Date of Birth *', 'dateOfBirth', 'DD/MM/YYYY')}
                    {renderInputField('Address *', 'address', 'Enter your full address', true)}

                    <Text style={[commonStyles.sectionTitle, { marginTop: SPACING.large }]}>Emergency Contact</Text>

                    {renderInputField('Emergency Contact Name', 'emergencyContact', 'Enter emergency contact name')}
                    {renderInputField('Emergency Contact Phone', 'emergencyPhone', 'Enter emergency contact phone', false, 'phone-pad')}

                    <Text style={[commonStyles.sectionTitle, { marginTop: SPACING.large }]}>Medical Information</Text>

                    {renderInputField('Medical Conditions', 'medicalConditions', 'List any medical conditions (optional)', true)}
                    {renderInputField('Allergies', 'allergies', 'List any allergies (optional)', true)}
                    {renderInputField('Previous Vaccinations', 'previousVaccinations', 'List recent vaccinations (optional)', true)}

                    <Text style={[commonStyles.text, { fontSize: FONT_SIZE.small, color: COLORS.text.secondary, marginTop: SPACING.medium, fontStyle: 'italic' }]}>
                        * Required fields
                    </Text>

                    <TouchableOpacity
                        style={[commonStyles.registerButton, { marginTop: SPACING.large }]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} style={{ marginRight: SPACING.small }} />
                                <Text style={commonStyles.registerButtonText}>Complete Registration</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[commonStyles.button, commonStyles.buttonOutline, { marginTop: SPACING.medium }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={[commonStyles.buttonText, commonStyles.buttonOutlineText]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RegisterCampaignScreen;