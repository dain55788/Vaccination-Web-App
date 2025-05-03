import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyDispatchContext, MyUserContext } from './src/utils/MyContexts';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useContext, useReducer } from "react";
import MyUserReducer from "./src/reducers/MyUserReducer";

import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AppointmentScreen from './src/screens/AppointmentScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AboutScreen from './src/screens/AboutScreen';
import ContactScreen from './src/screens/ContactScreen';
import ServicesScreen from './src/screens/ServicesScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  // const getUserRole = () => {
  //   if (!user) return null;
  //   if (user.specialty) return 'Doctor';
  //   if (user.shift) return 'Staff';
  //   if (user.health_note !== undefined) return 'Citizen';
  //   return null;
  // };

  // const role = getUserRole();

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