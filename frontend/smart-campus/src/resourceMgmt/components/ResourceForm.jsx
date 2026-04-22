import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getResourceById, createResource, updateResource } from "../api/resourceService";

function ResourceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "LECTURE_HALL",
    capacity: "",
    location: "",
    building: "",
    floor: "",
    availableFrom: "08:00:00",
    availableTo: "18:00:00",
    status: "ACTIVE",
    amenities: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (id) {
      fetchResource();
    }
  }, [id]);

  const fetchResource = async () => {
    setLoading(true);
    try {
      const response = await getResourceById(id);
      // backend returns DTO directly or wrapped { success, data }
      const data = response?.data ?? response;
      if (data) {
        // Merge backend data with defaults so controlled inputs don't become uncontrolled
        setFormData((prev) => ({
          ...prev,
          ...data,
          capacity: data.capacity ?? prev.capacity ?? "",
          floor: data.floor ?? prev.floor ?? "",
          description: data.description ?? prev.description ?? "",
          amenities: data.amenities ?? prev.amenities ?? "",
          imageUrl: data.imageUrl ?? prev.imageUrl ?? "",
          availableFrom: data.availableFrom ?? prev.availableFrom,
          availableTo: data.availableTo ?? prev.availableTo,
          type: data.type ?? prev.type,
          status: data.status ?? prev.status,
        }));
      } else {
        setError("Failed to load resource");
      }
    } catch (err) {
      setError("Failed to load resource");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const submitData = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      floor: formData.floor ? parseInt(formData.floor) : null,
    };

    try {
      if (id) {
        await updateResource(id, submitData);
      } else {
        await createResource(submitData);
      }
      navigate("/resources");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save resource");
      console.error(err);
    } finally {
      setIsSubmitting(false);
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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {id ? "Edit Resource" : "Create New Resource"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {id ? "Update the resource details below." : "Fill in the details to add a new campus resource."}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Resource Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name ?? ""}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="e.g., Main Lecture Hall"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Resource Type *</label>
              <select
                name="type"
                value={formData.type ?? ""}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Laboratory</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Number of people"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location ?? ""}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="e.g., Building A, Floor 2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Building</label>
              <input
                type="text"
                name="building"
                value={formData.building ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Building name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Floor</label>
              <input
                type="number"
                name="floor"
                value={formData.floor ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Floor number"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Available From</label>
              <input
                type="time"
                name="availableFrom"
                value={formData.availableFrom ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Available To</label>
              <input
                type="time"
                name="availableTo"
                value={formData.availableTo ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
              <select
                name="status"
                value={formData.status ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="ACTIVE">Active</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
              <textarea
                name="description"
                value={formData.description ?? ""}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Detailed description of the resource..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Amenities</label>
              <textarea
                name="amenities"
                value={formData.amenities ?? ""}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="e.g., Projector, AC, WiFi, Whiteboard (comma separated)"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">Image URL (Optional)</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl ?? ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/resources")}
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : id ? "Update Resource" : "Create Resource"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResourceForm;