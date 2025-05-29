import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, Animated, TouchableOpacity, Alert } from 'react-native';
import { commonStyles, COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../styles/MyStyles';
import Apis, { endpoints } from '../../utils/Apis';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from '../../utils/MyContexts';

const UpcomingCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentDate = new Date();
  const [fadeAnim] = useState(new Animated.Value(0));
  const nav = useNavigation();
  const user = useContext(MyUserContext);

  const handleRegisterCampaign = (campaign) => {
    if (user === null) {
      Alert.alert(
        'Please sign in to continue',
        'You need to log in to register our Campaigns.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign In',
            onPress: () => nav.navigate('Login'),
          },
        ],
        { cancelable: true }
      );
    } else {
      nav.navigate('RegisterCampaign', { campaign });
    }
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await Apis.get(endpoints['campaign']);
        const upcoming = response.data.results.filter(campaign =>
          new Date(campaign.start_date) > currentDate
        );
        setCampaigns(upcoming);
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        setError('Failed to fetch campaigns');
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const renderCampaign = ({ item }) => (
    <View style={commonStyles.card}>
      {item.image && (
        <View style={commonStyles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={commonStyles.image}
            resizeMode="cover"
          />
        </View>
      )}
      <Text style={commonStyles.cardTitle}>{item.campaign_name}</Text>
      <Text style={commonStyles.subtitle}>{item.description}</Text>
      <View style={[commonStyles.row, commonStyles.marginVertical]}>
        <Text style={commonStyles.text}>
          <Text style={{ fontWeight: 'bold' }}>Location: </Text>
          {item.location}
        </Text>
      </View>
      <View style={commonStyles.row}>
        <Text style={commonStyles.text}>
          <Text style={{ fontWeight: 'bold' }}>Start: </Text>
          {new Date(item.start_date).toLocaleDateString()}
        </Text>
      </View>
      <View style={commonStyles.row}>
        <Text style={commonStyles.text}>
          <Text style={{ fontWeight: 'bold' }}>End: </Text>
          {new Date(item.end_date).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity 
        style={[commonStyles.registerButton, commonStyles.campaignRegisterButton]}
        onPress={() => handleRegisterCampaign(item)}
      >
        <View style={commonStyles.registerButtonContent}>
          <Ionicons name="person-add-outline" size={20} color={COLORS.white} style={commonStyles.registerIcon} />
          <Text style={commonStyles.registerButtonText}>Register for Campaign</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // if (loading) {
  //   return (
  //     <View style={commonStyles.centerContent}>
  //       <ActivityIndicator size="large" color={COLORS.primary} />
  //     </View>
  //   );
  // }

  // if (error) {
  //   return (
  //     <View style={commonStyles.centerContent}>
  //       <Text style={commonStyles.errorText}>{error}</Text>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryLight || '#4da8ff']}
        style={styles.header}
      >
        <Ionicons name="medkit-outline" size={32} color={COLORS.white} />
        <Text style={styles.headerTitle}>Upcoming Vaccination Campaigns</Text>
      </LinearGradient>
      
      <View style={styles.container}>
        <View style={styles.introContainer}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} style={styles.introIcon} />
          <Text style={styles.introText}>
            Stay protected with our upcoming vaccination campaigns! These initiatives provide essential vaccines to safeguard our community against preventable diseases. Check the details below to find a campaign near you and join us in promoting public health.
          </Text>
        </View>
        <FlatList
          data={campaigns}
          renderItem={renderCampaign}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={[commonStyles.scrollViewContent, styles.listContent]}
          ListEmptyComponent={
            <View style={commonStyles.centerContent}>
              <Ionicons name="alert-circle-outline" size={40} color={COLORS.gray} style={styles.emptyIcon} />
              <Text style={[commonStyles.text, styles.emptyText]}>No upcoming campaigns found</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#f5f5f5',
    opacity: 0.95,
  },
  header: {
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
  introContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    margin: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  introIcon: {
    marginRight: SPACING.sm,
  },
  introText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: FONT_SIZE.md * 1.5,
    flex: 1,
  },
  listContent: {
    padding: SPACING.md,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
  },
  fieldIcon: {
    marginRight: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
    marginTop: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  emptyIcon: {
    marginBottom: SPACING.sm,
  },
});

export default UpcomingCampaigns;