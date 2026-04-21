import axios from "axios";

const RESOURCES_BASE_URL = "http://localhost:8080/api/resources";

const resourceApi = axios.create({
  baseURL: RESOURCES_BASE_URL,
});

// Add token interceptor (will be integrated with your auth later)
resourceApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Make sure it has "Bearer " prefix
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request'); // Debug
    } else {
      console.log('No token found!');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function getAllResources(page = 0, size = 10, sortBy = "id", sortDir = "asc") {
  try {
    const response = await resourceApi.get(`?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
    return response.data;
  } catch (error) {
    console.error("getAllResources failed:", error);
    throw error;
  }
}

export async function getResourceById(id) {
  try {
    const response = await resourceApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("getResourceById failed:", error);
    throw error;
  }
}

export async function searchResources(filters) {
  try {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.location) params.append("location", filters.location);
    if (filters.minCapacity) params.append("minCapacity", filters.minCapacity);
    if (filters.status) params.append("status", filters.status);
    
    const response = await resourceApi.get(`/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("searchResources failed:", error);
    throw error;
  }
}

export async function getResourcesByType(type) {
  try {
    const response = await resourceApi.get(`/type/${type}`);
    return response.data;
  } catch (error) {
    console.error("getResourcesByType failed:", error);
    throw error;
  }
}

export async function getAvailableResources() {
  try {
    const response = await resourceApi.get(`/available`);
    return response.data;
  } catch (error) {
    console.error("getAvailableResources failed:", error);
    throw error;
  }
}

export async function createResource(resourceData) {
  try {
    const response = await resourceApi.post("", resourceData);
    return response.data;
  } catch (error) {
    console.error("createResource failed:", error);
    throw error;
  }
}

export async function updateResource(id, resourceData) {
  try {
    const response = await resourceApi.put(`/${id}`, resourceData);
    return response.data;
  } catch (error) {
    console.error("updateResource failed:", error);
    throw error;
  }
}

export async function updateResourceStatus(id, status) {
  try {
    const response = await resourceApi.patch(`/${id}/status?status=${status}`);
    return response.data;
  } catch (error) {
    console.error("updateResourceStatus failed:", error);
    throw error;
  }
}

export async function deleteResource(id) {
  try {
    const response = await resourceApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("deleteResource failed:", error);
    throw error;
  }
}