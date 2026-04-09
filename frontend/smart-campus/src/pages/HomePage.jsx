import Navbar from '../components/Navbar';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Smart Campus Booking System
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Book Campus Spaces Faster and Smarter
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Centralize classroom, lab, and facility reservations in one place.
              Manage availability, reduce conflicts, and keep campus operations seamless.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#"
                className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Start Booking
              </a>
              <a
                href="#"
                className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
              >
                View Resources
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Today at a Glance</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Available Rooms</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">18</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Active Bookings</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">42</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Pending Requests</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">6</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-4">
                <p className="text-sm text-slate-500">Resources Online</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">95%</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
