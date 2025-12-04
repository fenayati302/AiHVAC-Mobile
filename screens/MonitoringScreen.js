import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { deviceAPI } from '../utils/api';

const celsiusToFahrenheit = (celsius) => {
  return ((parseFloat(celsius) * 9 / 5) + 32).toFixed(1);
};

export default function MonitoringScreen({ route, navigation }) {
  const { deviceId } = route.params;
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: deviceId,
    });
    loadDeviceData();
    const interval = setInterval(loadDeviceData, 1000);
    return () => clearInterval(interval);
  }, [deviceId]);

  const loadDeviceData = async () => {
    try {
      const data = await deviceAPI.getDeviceStatus(deviceId);
      setDeviceData(data);
    } catch (error) {
      console.error('Error loading device:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDeviceData();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading device data...</Text>
      </View>
    );
  }

  if (!deviceData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Device offline or not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadDeviceData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tempF = celsiusToFahrenheit(deviceData.sensors.temp_c);
  const isCompressorActive = deviceData.sensors.compressor_state;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3b82f6"
        />
      }
    >
      {/* Status Banner */}
      <View style={styles.statusBanner}>
        <View style={[styles.statusDot, { backgroundColor: '#22c55e' }]} />
        <Text style={styles.statusText}>SYSTEM ONLINE</Text>
      </View>

      {/* Temperature Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Temperature</Text>
          <Text style={styles.cardIcon}>🌡️</Text>
        </View>
        <Text style={styles.mainValue}>{tempF}<Text style={styles.unit}>°F</Text></Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Current</Text>
            <Text style={styles.statValue}>{tempF}°F</Text>
          </View>
        </View>
      </View>

      {/* Current Load Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Current Load</Text>
          <Text style={styles.cardIcon}>⚡</Text>
        </View>
        <Text style={styles.mainValue}>
          {deviceData.sensors.current_amp}
          <Text style={styles.unit}>A</Text>
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Current Draw</Text>
            <Text style={styles.statValue}>{deviceData.sensors.current_amp}A</Text>
          </View>
        </View>
      </View>

      {/* Compressor Status Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Compressor Status</Text>
          <Text style={styles.cardIcon}>💨</Text>
        </View>
        <View style={styles.compressorStatus}>
          <View
            style={[
              styles.compressorIndicator,
              { backgroundColor: isCompressorActive ? '#06b6d4' : '#64748b' },
            ]}
          />
          <Text
            style={[
              styles.compressorText,
              { color: isCompressorActive ? '#06b6d4' : '#64748b' },
            ]}
          >
            {isCompressorActive ? 'ACTIVE' : 'IDLE'}
          </Text>
        </View>
      </View>

      {/* Diagnostics Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>System Diagnostics</Text>
          <Text style={styles.cardIcon}>🔍</Text>
        </View>
        <Text style={styles.diagnosticText}>{deviceData.ui_message}</Text>
        <View style={styles.diagnosticGrid}>
          <View style={styles.diagnosticItem}>
            <Text style={styles.diagnosticLabel}>Noise Level</Text>
            <Text style={styles.diagnosticValue}>
              {deviceData.sensors.noise_db} dB
            </Text>
          </View>
          <View style={styles.diagnosticItem}>
            <Text style={styles.diagnosticLabel}>Health Score</Text>
            <Text style={styles.diagnosticValue}>
              {deviceData.health_score}%
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionButtonText}>← Back to Fleet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
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
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    padding: 12,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1e293b',
    margin: 16,
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardIcon: {
    fontSize: 28,
  },
  mainValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  unit: {
    fontSize: 32,
    color: '#94a3b8',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  compressorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  compressorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  compressorText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  diagnosticText: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 16,
    lineHeight: 24,
  },
  diagnosticGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  diagnosticItem: {
    flex: 1,
    alignItems: 'center',
  },
  diagnosticLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  diagnosticValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionButtons: {
    padding: 16,
    paddingBottom: 32,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});