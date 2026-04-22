import axios from 'axios';

const TICKETS_BASE_URL = 'http://localhost:8080/api/tickets';

const ticketApi = axios.create({
  baseURL: TICKETS_BASE_URL,
});

const authApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1/user',
});

const resourceApi = axios.create({
  baseURL: 'http://localhost:8080/api/resources',
});

const bookingApi = axios.create({
  baseURL: 'http://localhost:8080/api/bookings',
});


const addAuthInterceptor = (api) => {
  api.interceptors.request.use(
    (config) => {
      // Read either of the possible token keys used across the app
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
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
addAuthInterceptor(resourceApi);
addAuthInterceptor(bookingApi);


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

export const uploadAttachment = async (ticketId, file) => {
  try {
    const form = new FormData();
    form.append('file', file);
    const response = await ticketApi.post(`/${ticketId}/attachments/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('uploadAttachment failed:', error);
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

export const updateTicketStatus = async (ticketId, status, resolutionNotes = null) => {
  try {
    const body = { status };
    if (resolutionNotes) {
      body.resolutionNotes = resolutionNotes;
    }
    const response = await ticketApi.put(`/${ticketId}/status`, body);
    return response.data;
  } catch (error) {
    console.error('updateTicketStatus failed:', error);
    throw error;
  }
};

export const rejectTicket = async (ticketId, rejectionReason) => {
  try {
    const response = await ticketApi.put(`/${ticketId}/reject`, { rejectionReason });
    return response.data;
  } catch (error) {
    console.error('rejectTicket failed:', error);
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

export const updateComment = async (ticketId, commentId, message) => {
  try {
    const response = await ticketApi.put(`/${ticketId}/comments/${commentId}`, { message });
    return response.data;
  } catch (error) {
    console.error('updateComment failed:', error);
    throw error;
  }
};

export const deleteComment = async (ticketId, commentId) => {
  try {
    await ticketApi.delete(`/${ticketId}/comments/${commentId}`);
  } catch (error) {
    console.error('deleteComment failed:', error);
    throw error;
  }
};

export const getTechnicians = async () => {
  try {
    const response = await authApi.get('/technicians');
    return response.data;
  } catch (error) {
    console.error('getTechnicians failed:', error);
    throw error;
  }
};


export const getAvailableResources = async () => {
  try {
    const response = await resourceApi.get('/available');
    return response.data;
  } catch (error) {
    console.error('getAvailableResources failed:', error);
    throw error;
  }
};

export const getBookingsByUser = async (userId) => {
  try {
    const response = await bookingApi.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('getBookingsByUser failed:', error);
    throw error;
  }
};

export const deleteTicket = async (ticketId) => {
  try {
    await ticketApi.delete(`/${ticketId}`);
  } catch (error) {
    console.error('deleteTicket failed:', error);
    throw error;
  }
};