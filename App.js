import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Text, View } from "react-native";
import "react-native-gesture-handler";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Import Screens
import DeviceListScreen from "./screens/DeviceListScreen";
import LoginScreen from "./screens/LoginScreen";
import MonitoringScreen from "./screens/MonitoringScreen";
import ScanDeviceScreen from "./screens/ScanDeviceScreen";
import SetupWizardScreen from "./screens/SetupWizardScreen";

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f172a",
      }}
    >
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={{ color: "#94a3b8", marginTop: 16 }}>Loading...</Text>
    </View>
  );
}

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1e293b",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
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
              title: "Device Monitoring",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="SetupWizard"
            component={SetupWizardScreen}
            options={{
              title: "Device Setup",
              headerBackTitle: "Cancel",
            }}
          />
          <Stack.Screen
            name="ScanDevice"
            component={ScanDeviceScreen}
            options={{
              title: "Scan Device",
              headerBackTitle: "Back",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
