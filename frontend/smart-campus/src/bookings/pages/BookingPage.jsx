import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking, getAvailableResources } from "../api/bookingApi";
import BookingForm from "../components/BookingForm";
import ResourceCard from "../components/ResourceCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function parseFeatureList(amenities) {
  if (typeof amenities !== "string" || !amenities.trim()) {
    return [];
  }

  return amenities
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapResourceForUi(resource) {
  return {
    id: Number(resource.id),
    name: resource.name || `Resource #${resource.id}`,
    type: resource.typeDisplayName || resource.type || "Resource",
    capacity: resource.capacity ?? "--",
    features: parseFeatureList(resource.amenities),
    imageUrl: resource.imageUrl || "https://picsum.photos/seed/resource-fallback/600/360",
  };
}

function BookingPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const selectedResource =
    resources.find((resource) => resource.id === selectedResourceId) || null;

  useEffect(() => {
    let isMounted = true;

    const loadResources = async () => {
      setIsLoadingResources(true);
      try {
        const data = await getAvailableResources();
        const mapped = Array.isArray(data)
          ? data.map(mapResourceForUi).filter((resource) => Number.isInteger(resource.id))
          : [];

        if (isMounted && mapped.length > 0) {
          setResources(mapped);
          setSelectedResourceId(mapped[0].id);
        } else if (isMounted) {
          setResources([]);
          setSelectedResourceId(null);
          setErrorMessage("No resources available right now.");
        }
      } catch {
        if (isMounted) {
          setResources([]);
          setSelectedResourceId(null);
          setErrorMessage("Unable to load resources from database right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingResources(false);
        }
      }
    };

    loadResources();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResourceChange = (event) => {
    setSelectedResourceId(Number(event.target.value));
  };

  const handleBookingSubmit = async (payload) => {
    if (!selectedResourceId) {
      setErrorMessage("No resource selected. Please wait for resources to load.");
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await createBooking(payload);
      setSuccessMessage("Booking successful!");
      navigate("/my-bookings");
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to create booking. Please check time conflicts and try again.";
      setErrorMessage(backendMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Request Campus Resource
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Choose a resource, provide your schedule and usage details, then submit your booking request.
          </p>
        </header>

        {successMessage && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
            {errorMessage}
          </div>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-5">
          <section className="lg:col-span-2">
            {selectedResource ? (
              <ResourceCard
                resource={selectedResource}
                isSelected
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                Resource details will appear after loading from database.
              </div>
            )}
          </section>

          <div className="lg:col-span-3">
            <BookingForm
              resources={resources}
              selectedResourceId={selectedResourceId || ""}
              onResourceChange={handleResourceChange}
              onSubmit={handleBookingSubmit}
              isSubmitting={isSubmitting || isLoadingResources || !selectedResourceId}
            />
            {isLoadingResources && (
              <p className="mt-3 text-xs text-slate-500">Loading resources from server...</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BookingPage;
