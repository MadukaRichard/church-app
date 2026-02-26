import axios from 'axios';

// This is your "Central Command" for talking to the backend.
// In development, requests go through the proxy in package.json (http://localhost:5000).
// In production, change this to your live server URL (e.g. https://yourserver.com/api).
const api = axios.create({
  baseURL: '/api'
});

export default api;