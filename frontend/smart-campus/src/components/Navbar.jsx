function Navbar() {
  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="text-lg font-bold tracking-tight text-slate-900">Smart Campus Hub</div>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="/" className="transition-colors hover:text-slate-900">
            Home
          </a>
          <a href="/#features" className="transition-colors hover:text-slate-900">
            Features
          </a>
          <a href="/dashboard" className="transition-colors hover:text-slate-900">
            Dashboards
          </a>
        </div>

        {/* TODO: This button will trigger the OAuth 2.0 login flow required by the assignment. */}
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
