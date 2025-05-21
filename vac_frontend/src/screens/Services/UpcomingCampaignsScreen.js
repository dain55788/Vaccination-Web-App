import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import { commonStyles, COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../styles/MyStyles';
import Apis, { endpoints } from '../../utils/Apis';

const UpcomingCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentDate = new Date();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await Apis.get(endpoints['campaign']);
        const upcoming = response.data.results.filter(campaign => 
          new Date(campaign.start_date) > currentDate
        );
        setCampaigns(upcoming);
        setLoading(false);
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
    </View>
  );

  if (loading) {
    return (
      <View style={commonStyles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonStyles.centerContent}>
        <Text style={commonStyles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <FlatList
        data={campaigns}
        renderItem={renderCampaign}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={commonStyles.scrollViewContent}
        ListEmptyComponent={
          <View style={commonStyles.centerContent}>
            <Text style={commonStyles.text}>No upcoming campaigns found</Text>
          </View>
        }
      />
    </View>
  );
};

export default UpcomingCampaigns;