import React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Import Screens
import LoginScreen from '../screens/LoginScreen';
import DeviceListScreen from '../screens/DeviceListScreen';
import MonitoringScreen from '../screens/MonitoringScreen';
import SetupWizardScreen from '../screens/SetupWizardScreen';
import ScanDeviceScreen from '../screens/ScanDeviceScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e293b',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="DeviceList"
            component={DeviceListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Monitoring"
            component={MonitoringScreen}
            options={{
              title: 'Device Monitoring',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="SetupWizard"
            component={SetupWizardScreen}
            options={{
              title: 'Device Setup',
              headerBackTitle: 'Cancel',
            }}
          />
          <Stack.Screen
            name="ScanDevice"
            component={ScanDeviceScreen}
            options={{
              title: 'Scan Device',
              headerBackTitle: 'Back',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

// Register the app component
registerRootComponent(App);

export default App;