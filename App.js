import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Text, View } from "react-native";
import "react-native-gesture-handler";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Import Screens
import CustomDrawer from "./components/CustomDrawer";
import CustomerDashboardScreen from "./screens/CustomerDashboardScreen";
import DeviceListScreen from "./screens/DeviceListScreen";
import LoginScreen from "./screens/LoginScreen";
import MonitoringScreen from "./screens/MonitoringScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ReportsScreen from "./screens/ReportsScreen";
import ScanDeviceScreen from "./screens/ScanDeviceScreen";
import SetupWizardScreen from "./screens/SetupWizardScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

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

function CustomerDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="CustomerDashboard"
        component={CustomerDashboardScreen}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Reports" component={ReportsScreen} />
    </Drawer.Navigator>
  );
}

function TechnicianDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="DeviceList" component={DeviceListScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="Reports" component={ReportsScreen} />
      <Drawer.Screen name="Monitoring" component={MonitoringScreen} />
      <Drawer.Screen name="SetupWizard" component={SetupWizardScreen} />
      <Drawer.Screen name="ScanDevice" component={ScanDeviceScreen} />
    </Drawer.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : user.role === "customer" ? (
        // Customer gets drawer navigation with limited features
        <Stack.Screen
          name="CustomerDrawer"
          component={CustomerDrawerNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        // Technician/Admin/Manager get full drawer navigation
        <Stack.Screen
          name="TechnicianDrawer"
          component={TechnicianDrawerNavigator}
          options={{ headerShown: false }}
        />
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
