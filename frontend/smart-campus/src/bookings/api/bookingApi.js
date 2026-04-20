import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    // Support tokens stored under multiple keys for backward compatibility
    const token = localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('JwtToken');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export async function createBooking(bookingData) {
  try {
    const response = await apiClient.post("/bookings", bookingData || {});
    return response.data;
  } catch (error) {
    console.error("createBooking failed:", error);
    throw error;
  }
}

export async function getAvailableResources() {
  try {
    const response = await apiClient.get("/resources", {
      params: {
        page: 0,
        size: 100,
        sortBy: "id",
        sortDir: "asc",
      },
    });

    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.content)) {
      return data.content;
    }

    return [];
  } catch (error) {
    console.error("getAvailableResources failed:", error);
    throw error;
  }
}

export async function getUserBookings(userId) {
  try {
    const response = await apiClient.get(`/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("getUserBookings failed:", error);
    throw error;
  }
}

export async function getMyBookings() {
  try {
    const response = await apiClient.get("/bookings/me");
    return response.data;
  } catch (error) {
    console.error("getMyBookings failed:", error);
    throw error;
  }
}

export async function getAllBookings() {
  try {
    const response = await apiClient.get("/bookings");
    return response.data;
  } catch (error) {
    console.error("getAllBookings failed:", error);
    throw error;
  }
}

export async function updateBookingStatus(bookingId, status, rejectionReason) {
  try {
    const params = { status };
    if (rejectionReason) {
      params.rejectionReason = rejectionReason;
    }

    const response = await apiClient.patch(`/bookings/${bookingId}/status`, null, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("updateBookingStatus failed:", error);
    throw error;
  }
}

export async function deleteBooking(bookingId) {
  try {
    await apiClient.delete(`/bookings/${bookingId}`);
    return null;
  } catch (error) {
    console.error("deleteBooking failed:", error);
    throw error;
  }
}
