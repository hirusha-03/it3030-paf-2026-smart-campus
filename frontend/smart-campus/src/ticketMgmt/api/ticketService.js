import axios from 'axios';

const TICKETS_BASE_URL = 'http://localhost:8080/api/tickets';

const ticketApi = axios.create({
  baseURL: TICKETS_BASE_URL,
});

// Add request interceptor to include auth token
ticketApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createTicket = async (ticketData) => {
  try {
    const response = await ticketApi.post('', ticketData);
    return response.data;
  } catch (error) {
    console.error('createTicket failed:', error);
    throw error;
  }
};

export const getTickets = async () => {
  try {
    const response = await ticketApi.get('');
    return response.data;
  } catch (error) {
    console.error('getTickets failed:', error);
    throw error;
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const response = await ticketApi.get(`/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error('getTicketById failed:', error);
    throw error;
  }
};

export const assignTicket = async (ticketId, assignedToId) => {
  try {
    const response = await ticketApi.put(`/${ticketId}/assign`, { assignedToId });
    return response.data;
  } catch (error) {
    console.error('assignTicket failed:', error);
    throw error;
  }
};

export const updateTicketStatus = async (ticketId, status) => {
  try {
    const response = await ticketApi.put(`/${ticketId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('updateTicketStatus failed:', error);
    throw error;
  }
};

export const addComment = async (ticketId, message) => {
  try {
    const response = await ticketApi.post(`/${ticketId}/comments`, { message });
    return response.data;
  } catch (error) {
    console.error('addComment failed:', error);
    throw error;
  }
};