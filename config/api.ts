// API Configuration
// For physical Android device, use your machine's IP address (e.g., http://192.168.X.X:8080)
// For Android emulator, use http://10.0.2.2:8080
// For iOS simulator, use http://localhost:8080
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://YOUR_MACHINE_IP:8080';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
  },
};

export default API_BASE_URL;
