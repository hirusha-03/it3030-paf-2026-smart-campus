import ResourceDetails from "../components/ResourceDetails";

function ResourceDetailsPage({ isAdmin }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ResourceDetails isAdmin={isAdmin} />
    </div>
  );
}

export default ResourceDetailsPage;