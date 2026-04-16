import axios from 'axios';

const TICKETS_BASE_URL = 'http://localhost:8080/api/tickets';

const ticketApi = axios.create({
  baseURL: TICKETS_BASE_URL,
});

const authApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1/user',
});

const addAuthInterceptor = (api) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error('Unauthorized - Token may be expired');
        localStorage.removeItem('authToken');
        // Optionally redirect to login
      }
      if (error.response?.status === 403) {
        console.error('Forbidden - Insufficient permissions');
      }
      if (error.response?.status === 404) {
        console.error('Resource not found');
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(ticketApi);
addAuthInterceptor(authApi);

export const getCurrentUser = async () => {
  try {
    const response = await authApi.get('/me');
    return response.data;
  } catch (error) {
    console.error('getCurrentUser failed:', error);
    throw error;
  }
};

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