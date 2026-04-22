import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllResources, searchResources, deleteResource } from "../api/resourceService";
import ResourceCard from "./ResourceCard";
import ResourceSearch from "./ResourceSearch";

// Helper function to check if user is admin
const isUserAdmin = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    const userData = JSON.parse(user);
    const roles = userData?.roles || [];
    const userRole = Array.isArray(roles) ? roles[0] : roles;
    
    return userRole?.toLowerCase() === 'admin' || 
           userRole?.replace('ROLE_', '').toLowerCase() === 'admin';
  } catch {
    return false;
  }
};

function ResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    minCapacity: "",
    status: "",
  });
  const [isSearching, setIsSearching] = useState(false);
  const isAdmin = isUserAdmin();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await getAllResources(0, 50);
      const page = response?.data ?? response;
      if (page?.content && Array.isArray(page.content)) {
        setResources(page.content);
      } else if (Array.isArray(response)) {
        setResources(response);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setIsSearching(true);
    try {
      const activeFilters = {};
      if (filters.type) activeFilters.type = filters.type;
      if (filters.location) activeFilters.location = filters.location;
      if (filters.minCapacity) activeFilters.minCapacity = filters.minCapacity;
      if (filters.status) activeFilters.status = filters.status;

      const response = await searchResources(activeFilters);
      const data = response?.data ?? response;
      if (Array.isArray(data)) {
        setResources(data);
      } else if (data?.content && Array.isArray(data.content)) {
        setResources(data.content);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsSearching(false);
    fetchResources();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id);
        if (isSearching) {
          handleSearch();
        } else {
          fetchResources();
        }
      } catch (error) {
        alert("Failed to delete resource");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Facilities & Resources</h1>
          <p className="mt-1 text-slate-500">Browse and manage all campus resources.</p>
        </div>
        {isAdmin && (
          <Link
            to="/resources/create"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
          >
            <span>+</span> Add Resource
          </Link>
        )}
      </div>

      <ResourceSearch
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {resources.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500">No resources found.</p>
          {isAdmin && (
            <Link to="/resources/create" className="mt-3 inline-block text-indigo-600 hover:text-indigo-700">
              Click here to add your first resource
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ResourceList;