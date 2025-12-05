import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../utils/api';

const celsiusToFahrenheit = (celsius) => {
  return ((parseFloat(celsius) * 9 / 5) + 32).toFixed(1);
};

export default function CustomerDashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const data = await customerAPI.getDeviceStatus(user.id);
      setDeviceData(data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleContactSupport = () => {
    Linking.openURL('tel:+15551234567');
  };

  if (loading || !deviceData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading your building data...</Text>
      </View>
    );
  }

  const tempF = celsiusToFahrenheit(deviceData.sensors.temp_c);
  const isCompressorActive = deviceData.sensors.compressor_state;
  const healthColor = deviceData.health_score > 80 ? '#22c55e' : 
                     deviceData.health_score > 60 ? '#eab308' : '#ef4444';

  return (
    <View style={styles.container}>
      {/* Header Bar with Logo and Menu */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        <View style={styles.logoHeader}>
          <View style={styles.logoSmall}>
            <Text style={styles.logoIconSmall}>⚡</Text>
          </View>
          <Text style={styles.logoTextSmall}>NEXUS</Text>
        </View>

        <TouchableOpacity onPress={logout} style={styles.logoutButtonHeader}>
          <Text style={styles.logoutIconSmall}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
      >
        {/* Building Info */}
        <View style={styles.buildingHeader}>
          <Text style={styles.buildingName}>{user.buildingName}</Text>
          <Text style={styles.subtitle}>HVAC System Status</Text>
        </View>

        {/* Dashboard Cards Row */}
        <View style={styles.dashboardCards}>
          <TouchableOpacity style={styles.dashboardCard}>
            <Text style={styles.dashboardIcon}>🏢</Text>
            <Text style={styles.dashboardCardTitle}>Company</Text>
            <Text style={styles.dashboardCardValue}>{user.companyId}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dashboardCard}>
            <Text style={styles.dashboardIcon}>🔧</Text>
            <Text style={styles.dashboardCardTitle}>System Diagnostics</Text>
            <Text style={styles.dashboardCardStatus}>
              {deviceData.health_score > 80 ? 'ALL SYSTEMS NOMINAL' : 'ATTENTION NEEDED'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Banner */}
        <View style={styles.statusBanner}>
          <View style={[styles.statusDot, { backgroundColor: healthColor }]} />
          <Text style={[styles.statusText, { color: healthColor }]}>
            {deviceData.health_score > 80 ? 'SYSTEM HEALTHY' : 
             deviceData.health_score > 60 ? 'ATTENTION NEEDED' : 'SERVICE REQUIRED'}
          </Text>
        </View>

        {/* Current Temperature */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Temperature</Text>
          <Text style={styles.mainValue}>{tempF}<Text style={styles.unit}>°F</Text></Text>
          <Text style={styles.description}>Your building's temperature is comfortable</Text>
        </View>

        {/* System Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Overview</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Current Load</Text>
              <Text style={styles.infoValue}>{deviceData.sensors.current_amp}A</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Compressor</Text>
              <Text style={[styles.infoValue, { color: isCompressorActive ? '#06b6d4' : '#64748b' }]}>
                {isCompressorActive ? 'ACTIVE' : 'IDLE'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Noise Level</Text>
              <Text style={styles.infoValue}>{deviceData.sensors.noise_db} dB</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Health Score</Text>
              <Text style={[styles.infoValue, { color: healthColor }]}>
                {deviceData.health_score}%
              </Text>
            </View>
          </View>
        </View>

        {/* System Message */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Status</Text>
          <Text style={styles.messageText}>{deviceData.ui_message}</Text>
        </View>

        {/* Contact Support */}
        <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
          <Text style={styles.supportButtonText}>📞 Contact HVAC Service</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by NEXUS HVAC</Text>
          <Text style={styles.footerText}>Last updated: {new Date().toLocaleTimeString()}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSmall: {
    width: 36,
    height: 36,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoIconSmall: {
    fontSize: 20,
  },
  logoTextSmall: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  logoutButtonHeader: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIconSmall: {
    fontSize: 24,
  },
  scrollContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  buildingHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  buildingName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  dashboardCards: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  dashboardCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  dashboardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  dashboardCardTitle: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 8,
  },
  dashboardCardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  dashboardCardStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#22c55e',
    textAlign: 'center',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1e293b',
    margin: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  mainValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  unit: {
    fontSize: 36,
    color: '#94a3b8',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
  },
  supportButton: {
    backgroundColor: '#3b82f6',
    margin: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
});