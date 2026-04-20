import { useState } from "react";

const initialFormState = {
  date: "",
  startTime: "",
  endTime: "",
  purpose: "",
  expectedAttendees: "",
};

const MAX_PURPOSE_LENGTH = 500;

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentTimeString() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const tokenParts = token.split(".");
  if (tokenParts.length < 2) {
    return null;
  }

  try {
    const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function BookingForm({
  resources,
  selectedResourceId,
  onResourceChange,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const todayDate = getTodayDateString();
  const currentTime = getCurrentTimeString();
  const isTodaySelected = formData.date === todayDate;

  const validateForm = (data) => {
    const errors = {};

    if (!selectedResourceId) {
      errors.resourceIds = "Please select a resource.";
    }

    if (!data.date) {
      errors.date = "Date is required.";
    } else if (data.date < todayDate) {
      errors.date = "Past dates are not allowed.";
    }

    if (!data.startTime) {
      errors.startTime = "Start time is required.";
    }

    if (!data.endTime) {
      errors.endTime = "End time is required.";
    }

    if (data.date && data.date < todayDate) {
      errors.startTime = errors.startTime || "Start time cannot be in the past.";
      errors.endTime = errors.endTime || "End time cannot be in the past.";
    }

    if (data.date === todayDate && data.startTime && data.startTime < currentTime) {
      errors.startTime = "Start time cannot be in the past for today.";
    }

    if (data.date === todayDate && data.endTime && data.endTime < currentTime) {
      errors.endTime = "End time cannot be in the past for today.";
    }

    if (data.startTime && data.endTime && data.endTime <= data.startTime) {
      errors.endTime = "End time must be later than start time.";
    }

    if (!data.purpose || !data.purpose.trim()) {
      errors.purpose = "Purpose is required.";
    } else if (data.purpose.length > MAX_PURPOSE_LENGTH) {
      errors.purpose = `Purpose cannot exceed ${MAX_PURPOSE_LENGTH} characters.`;
    }

    if (data.expectedAttendees !== "") {
      if (!/^\d+$/.test(data.expectedAttendees)) {
        errors.expectedAttendees = "Expected attendees must contain numbers only.";
      } else if (Number(data.expectedAttendees) < 1) {
        errors.expectedAttendees = "Expected attendees must be at least 1.";
      }
    }

    return errors;
  };

  const markFieldTouched = (name) => {
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    let nextValue = value;
    if (name === "expectedAttendees") {
      nextValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    const nextData = {
      ...formData,
      [name]: nextValue,
    };
    setFieldErrors(validateForm(nextData));
  };

  const normalizeTime = (timeValue) => {
    if (!timeValue) {
      return "";
    }
    return timeValue.length === 5 ? `${timeValue}:00` : timeValue;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setTouchedFields({
      resourceIds: true,
      date: true,
      startTime: true,
      endTime: true,
      purpose: true,
      expectedAttendees: true,
    });

    const validationErrors = validateForm(formData);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const token = localStorage.getItem("JwtToken");
    const decoded = decodeJwtPayload(token);
    const loggedInUserId = Number(decoded?.id ?? decoded?.userId ?? decoded?.sub);

    const payload = {
      ...(Number.isFinite(loggedInUserId) && loggedInUserId > 0 ? { userId: loggedInUserId } : {}),
      // If JwtToken does not contain a numeric user ID claim (id/userId/sub),
      // backend should expose it via token claims or provide /api/users/me endpoint.
      resourceIds: [selectedResourceId],
      date: formData.date,
      startTime: normalizeTime(formData.startTime),
      endTime: normalizeTime(formData.endTime),
      purpose: formData.purpose,
      expectedAttendees: formData.expectedAttendees === "" ? null : Number(formData.expectedAttendees),
    };

    try {
      await onSubmit(payload);
      setFormData(initialFormState);
      setFieldErrors({});
      setTouchedFields({});
    } catch {
      // Error UI is handled by the parent page.
    }
  };

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Booking Details</h2>
        <p className="mt-2 text-sm text-slate-600">
          Complete the form below to send your request for the selected campus resource.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="resourceIds" className="mb-1 block text-sm font-semibold text-slate-700">
            Resource
          </label>
          <select
            id="resourceIds"
            name="resourceIds"
            value={selectedResourceId}
            onChange={(event) => {
              onResourceChange(event);
              markFieldTouched("resourceIds");
              setFieldErrors(validateForm(formData));
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
            aria-invalid={Boolean(fieldErrors.resourceIds && touchedFields.resourceIds)}
          >
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name}
              </option>
            ))}
          </select>
          {fieldErrors.resourceIds && touchedFields.resourceIds && (
            <p className="mt-1 text-xs font-medium text-rose-700">{fieldErrors.resourceIds}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="mb-1 block text-sm font-semibold text-slate-700">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              onBlur={() => markFieldTouched("date")}
              min={todayDate}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
              aria-invalid={Boolean(fieldErrors.date && touchedFields.date)}
            />
            {fieldErrors.date && touchedFields.date && (
              <p className="mt-1 text-xs font-medium text-rose-700">{fieldErrors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor="expectedAttendees" className="mb-1 block text-sm font-semibold text-slate-700">
              Expected Attendees
            </label>
            <input
              id="expectedAttendees"
              name="expectedAttendees"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.expectedAttendees}
              onChange={handleChange}
              onBlur={() => markFieldTouched("expectedAttendees")}
              placeholder="Optional"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              aria-invalid={Boolean(fieldErrors.expectedAttendees && touchedFields.expectedAttendees)}
            />
            {fieldErrors.expectedAttendees && touchedFields.expectedAttendees && (
              <p className="mt-1 text-xs font-medium text-rose-700">{fieldErrors.expectedAttendees}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="startTime" className="mb-1 block text-sm font-semibold text-slate-700">
              Start Time
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              onBlur={() => markFieldTouched("startTime")}
              min={isTodaySelected ? currentTime : undefined}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
              aria-invalid={Boolean(fieldErrors.startTime && touchedFields.startTime)}
            />
            {fieldErrors.startTime && touchedFields.startTime && (
              <p className="mt-1 text-xs font-medium text-rose-700">{fieldErrors.startTime}</p>
            )}
          </div>

          <div>
            <label htmlFor="endTime" className="mb-1 block text-sm font-semibold text-slate-700">
              End Time
            </label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              onBlur={() => markFieldTouched("endTime")}
              min={formData.startTime || (isTodaySelected ? currentTime : undefined)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
              aria-invalid={Boolean(fieldErrors.endTime && touchedFields.endTime)}
            />
            {fieldErrors.endTime && touchedFields.endTime && (
              <p className="mt-1 text-xs font-medium text-rose-700">{fieldErrors.endTime}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="purpose" className="mb-1 block text-sm font-semibold text-slate-700">
            Purpose
          </label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            onBlur={() => markFieldTouched("purpose")}
            rows={4}
            placeholder="Enter the purpose of this booking"
            maxLength={MAX_PURPOSE_LENGTH}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
            aria-invalid={Boolean(fieldErrors.purpose && touchedFields.purpose)}
          />
          <div className="mt-1 flex items-center justify-between gap-2">
            {fieldErrors.purpose && touchedFields.purpose ? (
              <p className="text-xs font-medium text-rose-700">{fieldErrors.purpose}</p>
            ) : (
              <span className="text-xs text-slate-500">Required field</span>
            )}
            <span className="text-xs text-slate-500">
              {formData.purpose.length}/{MAX_PURPOSE_LENGTH}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Create Booking"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default BookingForm;
