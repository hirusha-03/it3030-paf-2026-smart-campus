function ResourceCard({ resource, isSelected }) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        isSelected ? "border-indigo-300 ring-2 ring-indigo-600" : "border-slate-200"
      }`}
    >
      <img
        src={resource.imageUrl}
        alt={resource.name}
        className="h-40 w-full object-cover"
      />
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{resource.name}</h3>
          <p className="text-sm font-medium text-indigo-700">{resource.type}</p>
        </div>

        <p className="text-sm text-slate-600">Capacity: {resource.capacity}</p>

        <div className="flex flex-wrap gap-2">
          {resource.features.map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default ResourceCard;
