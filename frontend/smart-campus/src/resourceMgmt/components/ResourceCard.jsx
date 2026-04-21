import { Link } from "react-router-dom";

function ResourceCard({ resource, isAdmin, onDelete }) {
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

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeIcons[resource.type] || "📦"}</span>
            <h3 className="text-lg font-bold text-slate-900">{resource.name}</h3>
          </div>
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[resource.status]}`}>
            {statusLabels[resource.status]}
          </span>
        </div>

        <p className="text-sm font-medium text-indigo-600 mb-3">{resource.typeDisplayName}</p>

        <div className="space-y-2 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{resource.location}</span>
          </div>
          {resource.capacity && (
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>Capacity: {resource.capacity}</span>
            </div>
          )}
          {resource.availableFrom && resource.availableTo && (
            <div className="flex items-center gap-2">
              <span>🕐</span>
              <span>{resource.availableFrom} - {resource.availableTo}</span>
            </div>
          )}
        </div>

        {resource.amenities && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.amenities.split(",").slice(0, 3).map((item, idx) => (
              <span key={idx} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {item.trim()}
              </span>
            ))}
            {resource.amenities.split(",").length > 3 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                +{resource.amenities.split(",").length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <Link
            to={`/resources/${resource.id}`}
            className="flex-1 text-center rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            View Details
          </Link>
          {isAdmin && (
            <>
              <Link
                to={`/resources/edit/${resource.id}`}
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-amber-600"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(resource.id)}
                className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-600"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default ResourceCard;