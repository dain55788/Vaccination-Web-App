import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext, useReducer, useEffect, useState } from "react";
import { MyUserContext, MyDispatchContext } from './src/utils/MyContexts';
import { onAuthStateChanged } from 'firebase/auth';
import { UnreadMessagesContext, UnreadMessagesProvider } from './src/utils/UnreadMessagesContext';
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from './src/utils/AuthenticatedUserContext';
import commonStyles, { COLORS } from './src/styles/MyStyles';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import { auth } from "./config/Firebase";
import MyUserReducer from "./src/reducers/MyUserReducer";
import { MenuProvider } from 'react-native-popup-menu';

import HomeScreen from './src/screens/Home/HomeScreen';
import LandingScreen from './src/screens/Home/LandingScreen';
import AboutScreen from './src/screens/Home/AboutScreen';
// import WelcomeScreen from './src/screens//Home/Welcome';

import Chat from './src/screens/Chat/Chat';
import Chats from './src/screens/Chat/Chats';
import ChatInfo from './src/screens/Chat/ChatInfo';
import ChatMenu from './src/screens/Chat/ChatMenu';
import ChatHeader from './src/screens/Chat/ChatHeader';
import Users from './src/screens/Chat/Users';

import LoginScreen from './src/screens/User/LoginScreen';
import RegisterScreen from './src/screens/User/RegisterScreen';
import ProfileScreen from './src/screens/User/ProfileScreen';

import AppointmentScreen from './src/screens/Services/AppointmentScreen';
import ContactScreen from './src/screens/Services/ContactScreen';
import ServicesScreen from './src/screens/Services/ServicesScreen';
import UpcomingCampaignsScreen from './src/screens/Services/UpcomingCampaignsScreen';
import RegisterCampaignScreen from './src/screens/Services/RegisterCampaignScreen';

import AdminDashboardScreen from './src/screens/Admin/AdminDashboardScreen';
import PublicCampaignManagementScreen from './src/screens/Admin/PublicCampaignManagementScreen';
import VaccineManagementScreen from './src/screens/Admin/VaccineManagementScreen';

import UserVaccinationHistoryScreen from './src/screens/Staff/UserVaccinationHistoryScreen';
import AppointmentStatusScreen from './src/screens/Staff/AppointmentStatusScreen';
import UserAppointmentDetailScreen from './src/screens/Staff/UserAppointmentDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const TabNavigator = () => {
  const { unreadCount, setUnreadCount } = useContext(UnreadMessagesContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = route.name === 'Chats' ? 'chatbubbles' : 'settings';
          iconName += focused ? '' : '-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        presentation: 'modal',
      })}
    >
      <Tab.Screen name="Chats" options={{ tabBarBadge: unreadCount > 0 ? unreadCount : null }}>
        {() => <Chats setUnreadCount={setUnreadCount} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const MainStack = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f8f9fa' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({ route }) => ({
          headerTitle: () => <ChatHeader chatName={route.params.chatName} chatId={route.params.id} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ChatMenu chatName={route.params.chatName} chatId={route.params.id} />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Chats"
        component={TabNavigator} options={{ headerShown: false }}
      />

      <Stack.Screen name="ChatInfo" component={ChatInfo} />
      <Stack.Screen name="Users" component={Users} />

      <Stack.Screen name="Appointment" component={AppointmentScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Services" component={ServicesScreen} />
      <Stack.Screen name="UpcomingCampaigns" component={UpcomingCampaignsScreen} />
      <Stack.Screen name="RegisterCampaign" component={RegisterCampaignScreen} />

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="About" component={AboutScreen} />

      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="CampaignManagement" component={PublicCampaignManagementScreen} />
      <Stack.Screen name="VaccineManagement" component={VaccineManagementScreen} />

      <Stack.Screen name="UserVaccinationHistory" component={UserVaccinationHistoryScreen} />
      <Stack.Screen name="AppointmentStatus" component={AppointmentStatusScreen} />
      <Stack.Screen name="UserAppointmentDetail" component={UserAppointmentDetailScreen} />

    </Stack.Navigator>
  </NavigationContainer>
);

const RootNavigator = () => {
  const { unreadCount, setUnreadCount } = useContext(UnreadMessagesContext);
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authenticatedUser) => {
      setUser(authenticatedUser || null);
      setIsLoading(false);
    });

    return unsubscribeAuth;
  }, [setUser]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  <Tab.Screen name="Chats" options={{ tabBarBadge: unreadCount > 0 ? unreadCount : null }}>
    {() => <Chats setUnreadCount={setUnreadCount} />}
  </Tab.Screen>

  return <MainStack />;
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <MenuProvider>
      <SafeAreaProvider>
        <MyUserContext.Provider value={user}>
          <MyDispatchContext.Provider value={dispatch}>
            <AuthenticatedUserProvider>
              <UnreadMessagesProvider>
                <RootNavigator />
              </UnreadMessagesProvider>
            </AuthenticatedUserProvider>
          </MyDispatchContext.Provider>
        </MyUserContext.Provider>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </MenuProvider>
  );
};

export default App;