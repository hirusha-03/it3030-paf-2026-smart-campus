import axios from 'axios';

function getToken() {
  return (
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('JwtToken') ||
    localStorage.getItem('JwtToken')
  );
}

function authHeader() {
  const token = getToken();
  if (!token) return {};
  const headerValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  return { Authorization: headerValue };
}

export async function fetchTopResources(limit = 10) {
  const res = await axios.get(`/api/admin/analytics/top-resources?limit=${limit}`, { headers: authHeader() });
  return res.data;
}

export async function fetchPeakHours() {
  const res = await axios.get(`/api/admin/analytics/peak-hours`, { headers: authHeader() });
  return res.data;
}

export async function fetchBookingsOverTime(days = 30) {
  const res = await axios.get(`/api/admin/analytics/bookings-over-time?days=${days}`, { headers: authHeader() });
  return res.data;
}

export async function fetchStats(topLimit = 10, days = 30) {
  const res = await axios.get(`/api/admin/analytics/stats?topLimit=${topLimit}&days=${days}`, { headers: authHeader() });
  return res.data;
}

export async function fetchResourceUtilization(days = 30) {
  const res = await axios.get(`/api/admin/analytics/resource-utilization?days=${days}`, { headers: authHeader() });
  return res.data;
}
