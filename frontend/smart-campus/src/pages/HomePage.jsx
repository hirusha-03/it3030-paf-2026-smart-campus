import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const quickStats = [
    '50+ Lecture Halls',
    '20+ Labs',
    '99% Conflict-Free',
    '24/7 Booking Access',
  ];

  const steps = [
    {
      title: 'Find a Space',
      description: 'Browse available resources across lecture halls, labs, and shared facilities.',
    },
    {
      title: 'Check Availability',
      description: 'Use real-time availability status to avoid booking overlaps and scheduling conflicts.',
    },
    {
      title: 'Book & Manage',
      description: 'Submit your request and track approvals, updates, and changes from your dashboard.',
    },
  ];

  const features = [
    {
      title: 'Smart Availability Engine',
      description: 'Live schedule checks reduce double-bookings and keep campus operations smooth.',
    },
    {
      title: 'Role-Aware Booking Flows',
      description: 'Students, staff, and admins get tailored workflows with clear status visibility.',
    },
    {
      title: 'Centralized Booking Insights',
      description: 'Monitor demand trends and usage patterns from one clean management interface.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-700">
              Smart Campus Hub
            </p>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Manage Campus Resources with Ease
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Streamline lecture hall, lab, and shared space reservations with a reliable booking
              flow designed for students, staff, and administrators.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#"
                className="rounded-lg bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500"
              >
                Explore Resources
              </a>
              <Link
                to="/dashboard/bookings"
                className="rounded-lg border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                View My Bookings
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-10">
            <div className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
              {quickStats.map((stat) => (
                <div key={stat}>
                  <p className="text-lg font-bold text-slate-900">{stat}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">How It Works</h2>
              <p className="mt-3 text-slate-600">A clear 3-step process for reliable campus bookings.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Step {index + 1}</p>
                  <h3 className="mt-3 text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Core Features</h2>
              <p className="mt-3 text-slate-600">Built to support high-volume booking operations across campus.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg"
                >
                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-4 leading-relaxed text-slate-600">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
