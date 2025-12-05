import axios from 'axios';

// CHANGE THIS TO YOUR MAC'S IP ADDRESS
// Run: ifconfig | grep "inet " | grep -v 127.0.0.1
const API_BASE = 'http://192.168.1.184:3001'; // ← CHANGE THIS

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: async (companyId, password) => {
    // Check if it's an email (customer login)
    if (companyId.includes('@')) {
      // Customer login
      try {
        const response = await api.post('/api/customer/login', {
          email: companyId,
          password: password
        });
        return response.data;
      } catch (error) {
        throw new Error('Invalid customer credentials');
      }
    }
    
    // Existing admin/manager logic
    if (companyId.toLowerCase() === 'admin' && password === 'supersecret') {
      return {
        success: true,
        user: {
          id: 'ADMIN',
          name: 'System Administrator',
          role: 'admin',
          companyId: 'ADMIN',
        },
      };
    } else if (companyId.toUpperCase() === 'HVAC_A' && password === 'manager') {
      return {
        success: true,
        user: {
          id: 'HVAC_A_TECH',
          name: 'Alpha Cool Services',
          role: 'technician',
          companyId: 'HVAC_A',
        },
      };
    } else if (companyId.toUpperCase() === 'HVAC_B' && password === 'manager') {
      return {
        success: true,
        user: {
          id: 'HVAC_B_TECH',
          name: 'Beta Climate Control',
          role: 'technician',
          companyId: 'HVAC_B',
        },
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },
};

export const deviceAPI = {
  getDeviceStatus: async (deviceId) => {
    const response = await api.get(`/api/v1/devices/${deviceId}/status`);
    return response.data;
  },

  getDeviceHistory: async (deviceId, range = '1d') => {
    const response = await api.get(`/api/v1/devices/${deviceId}/history?range=${range}`);
    return response.data;
  },

  getFleetDevices: async (companyId) => {
    const response = await api.get(`/api/v1/devices/fleet/${companyId}`);
    return response.data;
  },

  registerDevice: async (ssid, password, companyId) => {
    const response = await api.get('/save', {
      params: { ssid, pass: password, cid: companyId },
    });
    return response.data;
  },
};

// Customer-specific API
export const customerAPI = {
  getDeviceStatus: async (customerId) => {
    const response = await api.get(`/api/customer/${customerId}/device`);
    return response.data;
  }
};

export default api;