import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { deviceAPI } from '../utils/api';

export default function SetupWizardScreen({ route, navigation }) {
  const { user } = useAuth();
  const { deviceMac } = route.params || {};

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deviceMac: deviceMac || '',
    wifiSSID: '',
    wifiPassword: '',
    companyId: user.companyId,
  });

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step === 1 && !formData.deviceMac.trim()) {
      Alert.alert('Error', 'Please enter device MAC address');
      return;
    }
    if (step === 2 && !formData.wifiSSID.trim()) {
      Alert.alert('Error', 'Please enter WiFi network name');
      return;
    }
    if (step === 3 && !formData.wifiPassword.trim()) {
      Alert.alert('Error', 'Please enter WiFi password');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await deviceAPI.registerDevice(
        formData.wifiSSID,
        formData.wifiPassword,
        formData.companyId
      );

      Alert.alert(
        'Success!',
        'Device registered successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('DeviceList'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to register device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 1: Device Identification</Text>
            <Text style={styles.stepDescription}>
              Enter or scan the device MAC address from the label
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., RPI_SIMULATOR_001"
              placeholderTextColor="#64748b"
              value={formData.deviceMac}
              onChangeText={(value) => updateField('deviceMac', value)}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => navigation.navigate('ScanDevice')}
            >
              <Text style={styles.scanButtonText}>📷 Scan QR Code</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 2: WiFi Network</Text>
            <Text style={styles.stepDescription}>
              Enter the customer's WiFi network name
            </Text>
            <TextInput
              style={styles.input}
              placeholder="WiFi Network Name (SSID)"
              placeholderTextColor="#64748b"
              value={formData.wifiSSID}
              onChangeText={(value) => updateField('wifiSSID', value)}
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 3: WiFi Password</Text>
            <Text style={styles.stepDescription}>
              Enter the WiFi password for the network
            </Text>
            <TextInput
              style={styles.input}
              placeholder="WiFi Password"
              placeholderTextColor="#64748b"
              value={formData.wifiPassword}
              onChangeText={(value) => updateField('wifiPassword', value)}
              secureTextEntry
            />
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Step 4: Review & Register</Text>
            <Text style={styles.stepDescription}>
              Confirm the details before registering
            </Text>
            <View style={styles.reviewCard}>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Device MAC:</Text>
                <Text style={styles.reviewValue}>{formData.deviceMac}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>WiFi Network:</Text>
                <Text style={styles.reviewValue}>{formData.wifiSSID}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Company:</Text>
                <Text style={styles.reviewValue}>{formData.companyId}</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              s <= step && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => setStep(step - 1)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.nextButton, loading && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {step === 4 ? 'Complete Setup' : 'Next →'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Cancel Button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.cancelButtonText}>Cancel Setup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#334155',
  },
  progressDotActive: {
    backgroundColor: '#3b82f6',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  stepContainer: {
    padding: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  scanButton: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#334155',
  },
  nextButton: {
    backgroundColor: '#3b82f6',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 14,
  },
});