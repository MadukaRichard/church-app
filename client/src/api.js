import axios from 'axios';

// This is your "Central Command" for talking to the backend
const api = axios.create({
  // RIGHT NOW: We are using your local computer
  // LATER (When deployed): We will change this ONE line to your live server URL
  baseURL: 'http://127.0.0.1:5000/api'
});

export default api;