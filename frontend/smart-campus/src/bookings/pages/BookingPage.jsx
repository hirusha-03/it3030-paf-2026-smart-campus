import { useState } from "react";
import { createBooking } from "../api/bookingApi";
import BookingForm from "../components/BookingForm";
import ResourceCard from "../components/ResourceCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const DUMMY_RESOURCES = [
  {
    id: 101,
    name: "Lecture Hall A",
    type: "Lecture Hall",
    capacity: 120,
    features: ["Projector", "Smart Board", "PA System"],
    imageUrl: "https://picsum.photos/seed/lecture-hall-a/600/360",
  },
  {
    id: 102,
    name: "Meeting Room 1",
    type: "Meeting Room",
    capacity: 18,
    features: ["Video Conferencing", "Whiteboard", "Air Conditioning"],
    imageUrl: "https://picsum.photos/seed/meeting-room-1/600/360",
  },
  {
    id: 103,
    name: "Computer Lab B",
    type: "Lab",
    capacity: 40,
    features: ["Desktop PCs", "High-Speed Internet", "Projector"],
    imageUrl: "https://picsum.photos/seed/computer-lab-b/600/360",
  },
];

function BookingPage() {
  const [selectedResourceId, setSelectedResourceId] = useState(DUMMY_RESOURCES[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const selectedResource =
    DUMMY_RESOURCES.find((resource) => resource.id === selectedResourceId) || DUMMY_RESOURCES[0];

  const handleResourceChange = (event) => {
    setSelectedResourceId(Number(event.target.value));
  };

  const handleBookingSubmit = async (payload) => {
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await createBooking(payload);
      setSuccessMessage("Booking successful!");
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
            <ResourceCard
              resource={selectedResource}
              isSelected
            />
          </section>

          <div className="lg:col-span-3">
            <BookingForm
              resources={DUMMY_RESOURCES}
              selectedResourceId={selectedResourceId}
              onResourceChange={handleResourceChange}
              onSubmit={handleBookingSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BookingPage;
