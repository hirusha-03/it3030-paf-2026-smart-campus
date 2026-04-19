import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const TOKEN_KEYS = [
  "token",
  "jwt",
  "JwtToken",
  "accessToken",
  "authToken",
  "id_token",
];

const AUTH_OBJECT_KEYS = [
  "auth",
  "authData",
  "user",
  "currentUser",
  "loginResponse",
  "authResponse",
];

function normalizeToken(rawToken) {
  if (typeof rawToken !== "string") {
    return "";
  }

  const trimmed = rawToken.trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.toLowerCase().startsWith("bearer ") ? trimmed.slice(7).trim() : trimmed;
}

function readTokenFromStorage(storage) {
  for (const key of TOKEN_KEYS) {
    const value = storage.getItem(key);
    const normalized = normalizeToken(value);
    if (normalized) {
      return normalized;
    }
  }

  for (const key of AUTH_OBJECT_KEYS) {
    const raw = storage.getItem(key);
    if (!raw) {
      continue;
    }

    try {
      const parsed = JSON.parse(raw);
      const normalized =
        normalizeToken(parsed?.token) ||
        normalizeToken(parsed?.jwt) ||
        normalizeToken(parsed?.JwtToken) ||
        normalizeToken(parsed?.accessToken);

      if (normalized) {
        return normalized;
      }
    } catch {
      // Ignore non-JSON values.
    }
  }

  return "";
}

function getAuthToken() {
  return readTokenFromStorage(localStorage) || readTokenFromStorage(sessionStorage);
}

function persistTokenFromUrl() {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  const queryToken =
    url.searchParams.get("token") ||
    url.searchParams.get("jwt") ||
    url.searchParams.get("accessToken");

  const hashParams = new URLSearchParams(url.hash.startsWith("#") ? url.hash.slice(1) : "");
  const hashToken =
    hashParams.get("token") ||
    hashParams.get("jwt") ||
    hashParams.get("accessToken");

  const token = normalizeToken(queryToken || hashToken);
  if (!token) {
    return;
  }

  localStorage.setItem("token", token);
}

persistTokenFromUrl();

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

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
    const response = await apiClient.post("/bookings", bookingData);
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
