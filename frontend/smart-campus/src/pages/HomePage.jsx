import Navbar from '../components/Navbar';

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main>
        <section id="home" className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto w-full max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Streamline Your Campus Resources
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Manage room and equipment bookings in one place with a modern platform built for students,
              faculty, and administrators.
            </p>
            <a
              href="/dashboard"
              className="mt-10 inline-flex rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Go to Dashboard
            </a>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Core Features</h2>
            <p className="mt-3 text-slate-600">Everything needed to run smart campus bookings smoothly.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Smart Resource Booking</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Book rooms and equipment effortlessly with a clear, guided workflow.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Automated Conflict Prevention</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Never double-book a room again with automatic schedule conflict checks.
              </p>
            </article>

            <article id="dashboards" className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Role-Based Dashboards</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Dedicated dashboard views for Students and Admins with relevant actions.
              </p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
