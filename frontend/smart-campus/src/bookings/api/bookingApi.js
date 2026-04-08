import axios from "axios";

const BOOKINGS_BASE_URL = "http://localhost:8080/api/bookings";

const bookingApi = axios.create({
  baseURL: BOOKINGS_BASE_URL,
});

export async function createBooking(bookingData) {
  try {
    const response = await bookingApi.post("/", bookingData);
    return response.data;
  } catch (error) {
    console.error("createBooking failed:", error);
    throw error;
  }
}

export async function getUserBookings(userId) {
  try {
    const response = await bookingApi.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("getUserBookings failed:", error);
    throw error;
  }
}

export async function getAllBookings() {
  try {
    const response = await bookingApi.get("/");
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

    const response = await bookingApi.patch(`/${bookingId}/status`, null, {
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
    await bookingApi.delete(`/${bookingId}`);
    return null;
  } catch (error) {
    console.error("deleteBooking failed:", error);
    throw error;
  }
}
