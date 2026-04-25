import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createBooking, getAvailableResources, getBookingById, updateBooking } from "../api/bookingApi";
import BookingForm from "../components/BookingForm";
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
    location: resource.location || "--",
    capacity: resource.capacity ?? "--",
    features: parseFeatureList(resource.amenities),
    imageUrl: resource.imageUrl || "https://picsum.photos/seed/resource-fallback/600/360",
  };
}

function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editBookingId = Number(searchParams.get("editBookingId"));
  const isEditMode = Number.isFinite(editBookingId) && editBookingId > 0;

  const [resources, setResources] = useState([]);
  const [selectedResourceType, setSelectedResourceType] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [initialFormValues, setInitialFormValues] = useState(null);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [isLoadingBooking, setIsLoadingBooking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const resourceTypes = [...new Set(resources.map((resource) => resource.type).filter(Boolean))];
  const filteredResources = useMemo(
    () => (selectedResourceType
      ? resources.filter((resource) => resource.type === selectedResourceType)
      : []),
    [resources, selectedResourceType],
  );
  const selectedResource = useMemo(
    () => filteredResources.find((resource) => resource.id === selectedResourceId) || null,
    [filteredResources, selectedResourceId],
  );
  const bookingFormKey = isEditMode
    ? `edit-${editBookingId}-${initialFormValues?.date || 'loading'}`
    : 'create';

  useEffect(() => {
    let isMounted = true;

    const loadResources = async () => {
      setIsLoadingResources(true);
      try {
        const [data, bookingData] = await Promise.all([
          getAvailableResources(),
          isEditMode ? getBookingById(editBookingId) : Promise.resolve(null),
        ]);
        const mapped = Array.isArray(data)
          ? data.map(mapResourceForUi).filter((resource) => Number.isInteger(resource.id))
          : [];

        if (isMounted && mapped.length > 0) {
          setResources(mapped);

          if (isEditMode && bookingData) {
            const bookingStatus = typeof bookingData?.status === "string" ? bookingData.status.toUpperCase() : "";
            if (bookingStatus !== "PENDING") {
              setErrorMessage("Only pending bookings can be updated.");
              setSelectedResourceType(mapped[0]?.type || "");
              setSelectedResourceId(mapped[0]?.id ?? null);
            } else {
              const bookingResourceId = Array.isArray(bookingData?.resourceIds)
                ? Number(bookingData.resourceIds[0])
                : null;
              const matchedResource = mapped.find((resource) => resource.id === bookingResourceId) || null;
              const fallbackResource = mapped[0] || null;
              const selected = matchedResource || fallbackResource;

              if (selected) {
                setSelectedResourceType(selected.type || "");
                setSelectedResourceId(selected.id);
              }

              setInitialFormValues({
                date: bookingData?.date || "",
                startTime: bookingData?.startTime || "",
                endTime: bookingData?.endTime || "",
                purpose: bookingData?.purpose || "",
                expectedAttendees: bookingData?.expectedAttendees,
              });
            }
          } else {
            const initialType = mapped[0]?.type || "";
            const initialResourcesForType = initialType
              ? mapped.filter((resource) => resource.type === initialType)
              : [];
            setSelectedResourceType(initialType);
            setSelectedResourceId(initialResourcesForType[0]?.id ?? null);
            setInitialFormValues(null);
          }
        } else if (isMounted) {
          setResources([]);
          setSelectedResourceType("");
          setSelectedResourceId(null);
          setErrorMessage("No resources available right now.");
        }

        if (isMounted && isEditMode) {
          setIsLoadingBooking(false);
        }
      } catch (error) {
        if (isMounted) {
          setResources([]);
          setSelectedResourceType("");
          setSelectedResourceId(null);
          const backendMessage =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            (isEditMode
              ? "Unable to load booking details right now."
              : "Unable to load resources from database right now.");
          setErrorMessage(backendMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoadingResources(false);
          setIsLoadingBooking(false);
        }
      }
    };

    if (isEditMode) {
      setIsLoadingBooking(true);
    }

    loadResources();

    return () => {
      isMounted = false;
    };
  }, [editBookingId, isEditMode]);

  useEffect(() => {
    if (!selectedResourceType) {
      setSelectedResourceId(null);
      return;
    }

    if (!filteredResources.some((resource) => resource.id === selectedResourceId)) {
      setSelectedResourceId(filteredResources[0]?.id ?? null);
    }
  }, [selectedResourceType, filteredResources, selectedResourceId]);

  const handleResourceTypeChange = (event) => {
    setSelectedResourceType(event.target.value);
  };

  const handleResourceChange = (event) => {
    const nextId = Number(event.target.value);
    setSelectedResourceId(Number.isFinite(nextId) ? nextId : null);
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
      if (isEditMode) {
        await updateBooking(editBookingId, payload);
        setSuccessMessage("Booking updated successfully!");
      } else {
        await createBooking(payload);
        setSuccessMessage("Booking successful!");
      }
      navigate("/dashboard/bookings");
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (isEditMode
          ? "Unable to update booking. Please check conflicts and try again."
          : "Unable to create booking. Please check time conflicts and try again.");
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
            {isEditMode
              ? "Update your pending booking by changing resource, schedule, or purpose."
              : "Choose a resource, provide your schedule and usage details, then submit your booking request."}
          </p>
        </header>

        {isEditMode && isLoadingBooking && (
          <div className="mb-6 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
            Loading booking details...
          </div>
        )}

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
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">Selected Resource</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Review the selected resource details before submitting your booking.
                </p>

                <dl className="mt-5 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</dt>
                    <dd className="mt-1 text-slate-900">{selectedResource.name || "--"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Type</dt>
                    <dd className="mt-1 text-slate-900">{selectedResource.type || "--"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</dt>
                    <dd className="mt-1 text-slate-900">{selectedResource.location || "--"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Capacity</dt>
                    <dd className="mt-1 text-slate-900">{selectedResource.capacity ?? "--"}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                Please select a resource to view details.
              </div>
            )}
          </section>

          <div className="lg:col-span-3">
            <BookingForm
              key={bookingFormKey}
              resourceTypes={resourceTypes}
              selectedResourceType={selectedResourceType}
              onResourceTypeChange={handleResourceTypeChange}
              resources={filteredResources}
              selectedResourceId={selectedResourceId || ""}
              selectedResource={selectedResource}
              onResourceChange={handleResourceChange}
              onSubmit={handleBookingSubmit}
              isSubmitting={isSubmitting || isLoadingResources || isLoadingBooking || !selectedResourceId}
              initialValues={initialFormValues}
              submitLabel={isEditMode ? "Update Booking" : "Create Booking"}
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
