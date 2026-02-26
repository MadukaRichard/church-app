import axios from 'axios';

// In development, requests go through the CRA proxy (package.json).
// In production, requests go to the live Render backend.
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://church-app-8y7l.onrender.com/api'
    : '/api'
});

export default api;