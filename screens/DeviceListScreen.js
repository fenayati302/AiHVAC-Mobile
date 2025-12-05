import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { deviceAPI } from '../utils/api';

const celsiusToFahrenheit = (celsius) => {
  return ((parseFloat(celsius) * 9 / 5) + 32).toFixed(1);
};

export default function DeviceListScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDevices();
    const interval = setInterval(loadDevices, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDevices = async () => {
  try {
    let data;
    
    // If admin, fetch ALL devices from all companies
    if (user.role === 'admin') {
      // Fetch devices from multiple companies
      const hvacA = await deviceAPI.getFleetDevices('HVAC_A');
      const hvacB = await deviceAPI.getFleetDevices('HVAC_B');
      data = [...hvacA, ...hvacB];
    } else {
      // Regular users see only their company's devices
      data = await deviceAPI.getFleetDevices(user.companyId);
    }
    
    setDevices(data);
  } catch (error) {
    console.error('Error loading devices:', error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const onRefresh = () => {
    setRefreshing(true);
    loadDevices();
  };

  const getHealthColor = (healthState) => {
    const colors = {
      OK: '#22c55e',
      Warning: '#eab308',
      Critical: '#ef4444',
      Offline: '#64748b',
    };
    return colors[healthState] || '#94a3b8';
  };

  const renderDevice = ({ item }) => {
    const tempF = celsiusToFahrenheit(item.liveTemp);
    const healthColor = getHealthColor(item.healthState);
    const isOnline = parseFloat(item.liveTemp) > 0;

    return (
      <TouchableOpacity
        style={styles.deviceCard}
        onPress={() => navigation.navigate('Monitoring', { deviceId: item.mac })}
      >
        <View style={styles.deviceHeader}>
          <View style={styles.deviceInfo}>
            <View style={[styles.statusDot, { backgroundColor: healthColor }]} />
            <View>
              <Text style={styles.deviceName}>{item.mac}</Text>
              <Text style={styles.deviceCompany}>Company: {item.companyId}</Text>
            </View>
          </View>
          <View style={styles.deviceStats}>
            <Text style={styles.tempValue}>{tempF}°F</Text>
            <Text style={[styles.statusText, { color: healthColor }]}>
              {isOnline ? 'ACTIVE' : 'OFFLINE'} / {item.healthState.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>HVAC Fleet</Text>
          <Text style={styles.headerSubtitle}>Company: {user.companyId}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Device List */}
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item) => item.mac}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No devices registered yet</Text>
            <TouchableOpacity
              style={styles.setupButton}
              onPress={() => navigation.navigate('SetupWizard')}
            >
              <Text style={styles.setupButtonText}>+ Setup New Device</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating Action Button */}
      {devices.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('SetupWizard')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  deviceCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  deviceCompany: {
    fontSize: 12,
    color: '#64748b',
  },
  deviceStats: {
    alignItems: 'flex-end',
  },
  tempValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    marginTop: 16,
    color: '#94a3b8',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
    marginBottom: 24,
  },
  setupButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  setupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});