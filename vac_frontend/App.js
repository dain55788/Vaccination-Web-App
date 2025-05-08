import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyDispatchContext, MyUserContext } from './src/utils/MyContexts';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext, useReducer } from "react";
import MyUserReducer from "./src/reducers/MyUserReducer";
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './config/Firebase';

import HomeScreen from './src/screens/Home/HomeScreen';
import LandingScreen from './src/screens/Home/LandingScreen';
import AboutScreen from './src/screens/Home/AboutScreen';

import LoginScreen from './src/screens/User/LoginScreen';
import RegisterScreen from './src/screens/User/RegisterScreen';
import ProfileScreen from './src/screens/User/ProfileScreen';

import AppointmentScreen from './src/screens/Services/AppointmentScreen';
import ContactScreen from './src/screens/Services/ContactScreen';
import ServicesScreen from './src/screens/Services/ServicesScreen';
// import ChatScreen from './src/screens/Services/ChatScreen';

import AdminDashboardScreen from './src/screens/Admin/AdminDashboardScreen';
import PublicCampaignManagementScreen from './src/screens/Admin/PublicCampaignManagementScreen';
import VaccineManagementScreen from './src/screens/Admin/VaccineManagementScreen';

import UserVaccinationHistoryScreen from './src/screens/Staff/UserVaccinationHistoryScreen';
import AppointmentStatusScreen from './src/screens/Staff/AppointmentStatusScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const user = useContext(MyUserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user === null ? 'Landing' : 'Home'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f8f9fa' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Appointment" component={AppointmentScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Services" component={ServicesScreen} />
        {/* <Stack.Screen name="Chat" component={ChatScreen} /> */}

        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="CampaignManagement" component={PublicCampaignManagementScreen}/>
        <Stack.Screen name="VaccineManagement" component={VaccineManagementScreen} />

        <Stack.Screen name="UserVaccinationHistory" component={UserVaccinationHistoryScreen}/>
        <Stack.Screen name="AppointmentStatus" component={AppointmentStatusScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <SafeAreaProvider>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <AppNavigator />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
};

export default App;