import { Link, useLocation } from "react-router-dom";

const segmentLabels: Record<string, string> = {
  booking: "Bookings",
  bookings: "Bookings",
  events: "Events",
  profile: "Profile",
  reports: "Reports",
  home: "Home",
  faq: "FAQ",
  terms: "Terms",
  privacy: "Privacy",
  admin: "Admin",
  "admin-events": "Events",
};

const knownRoutes = new Set([
  "/",
  "/bookings",
  "/reports",
  "/profile",
  "/admin/bookings",
  "/admin/users",
  "/admin/reports",
  "/admin/events",
  "/admin/events/create",
  "/admin/events/edit",
  "/faq",
  "/terms",
  "/privacy",
]);

const isIdSegment = (segment: string) => {
  return /^[0-9]+$/.test(segment) || /^[0-9a-f]{24}$/i.test(segment);
};

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const rawSegments = pathname.split("/").filter(Boolean);
  const sanitizedSegments = rawSegments.filter((segment) => !isIdSegment(segment));

  if (!rawSegments.length) {
    return (
      <div className="text-xs uppercase tracking-[0.5em] text-[var(--muted)]">
        Home
      </div>
    );
  }

  const entries: Array<{ label: string; path: string }> = [];
  const pathAccumulator: string[] = [];
  sanitizedSegments.forEach((segment) => {
    const cleanSegment = segment.replace(/-/g, " ");
    pathAccumulator.push(segment);

    const rawPath = `/${pathAccumulator.join("/")}`;
    if (!knownRoutes.has(rawPath)) {
      return;
    }

    entries.push({
      label: segmentLabels[segment] || cleanSegment,
      path: rawPath,
    });
  });

  return (
    <nav className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.45em] text-[var(--muted)]">
      <Link to="/" className="text-[var(--muted)] transition hover:text-[var(--text)]">
        Home
      </Link>
      {entries.map((entry, index) => (
        <div key={`${entry.path}-${index}`} className="flex items-center gap-2">
          <span aria-hidden="true">/</span>
          <Link
            to={entry.path}
            className="transition hover:text-[var(--text)]"
            aria-current={index === entries.length - 1 ? "page" : undefined}
          >
            {entry.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
