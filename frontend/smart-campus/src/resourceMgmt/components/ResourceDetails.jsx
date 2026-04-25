import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getResourceById, deleteResource, updateResourceStatus } from "../api/resourceService";

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

function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdmin = isUserAdmin();

  const defaultImage = "https://via.placeholder.com/800x400?text=No+Image";

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    setLoading(true);
    try {
      const response = await getResourceById(id);
      const data = response?.data ?? response;
      if (data) {
        setResource(data);
      } else {
        setError("Resource not found");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Resource not found");
      } else {
        setError("Failed to load resource");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id);
        navigate("/resources");
      } catch (err) {
        alert("Failed to delete resource");
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateResourceStatus(id, newStatus);
      fetchResource();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const typeIcons = {
    LECTURE_HALL: "🏛️",
    LAB: "🔬",
    MEETING_ROOM: "💼",
    EQUIPMENT: "📷",
  };

  const statusColors = {
    ACTIVE: "bg-green-100 text-green-800",
    MAINTENANCE: "bg-yellow-100 text-yellow-800",
    OUT_OF_SERVICE: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    ACTIVE: "Active",
    MAINTENANCE: "Maintenance",
    OUT_OF_SERVICE: "Out of Service",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">{error || "Resource not found"}</p>
        <Link to="/resources" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
          ← Back to Resources
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/resources" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
        <span>←</span> Back to Resources
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Hero Image Section */}
        <div className="relative h-64 w-full overflow-hidden bg-slate-100 md:h-96">
          <img
            src={resource.imageUrl || defaultImage}
            alt={resource.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>

        <div className="border-b border-slate-100 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{typeIcons[resource.type] || "📦"}</span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{resource.name}</h1>
                <p className="text-sm font-medium text-indigo-600">{resource.typeDisplayName}</p>
              </div>
            </div>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColors[resource.status]}`}>
              {statusLabels[resource.status]}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-slate-500">Location</h3>
              <p className="mt-1 text-slate-900">{resource.location}</p>
              {resource.building && (
                <p className="mt-1 text-sm text-slate-500">
                  Building {resource.building}, Floor {resource.floor}
                </p>
              )}
            </div>

            {resource.capacity && (
              <div>
                <h3 className="text-sm font-medium text-slate-500">Capacity</h3>
                <p className="mt-1 text-slate-900">{resource.capacity} people</p>
              </div>
            )}

            {resource.availableFrom && resource.availableTo && (
              <div>
                <h3 className="text-sm font-medium text-slate-500">Availability</h3>
                <p className="mt-1 text-slate-900">
                  {resource.availableFrom} - {resource.availableTo}
                </p>
              </div>
            )}

            {resource.createdAt && (
              <div>
                <h3 className="text-sm font-medium text-slate-500">Created</h3>
                <p className="mt-1 text-slate-900">{new Date(resource.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {resource.description && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-500">Description</h3>
              <p className="mt-1 text-slate-700">{resource.description}</p>
            </div>
          )}

          {resource.amenities && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-500">Amenities</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {resource.amenities.split(",").map((item, idx) => (
                  <span key={idx} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {item.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="border-t border-slate-100 bg-slate-50 p-6">
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/resources/edit/${resource.id}`}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
              >
                Edit Resource
              </Link>

              <select
                value={resource.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="ACTIVE">Set Active</option>
                <option value="MAINTENANCE">Set Maintenance</option>
                <option value="OUT_OF_SERVICE">Set Out of Service</option>
              </select>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-rose-500"
              >
                Delete Resource
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourceDetails;