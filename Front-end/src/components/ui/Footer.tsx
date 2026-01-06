import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useTheme } from "../../theme/theme-context";

const quickLinks = [
  { label: "Events", href: "/" },
  { label: "My bookings", href: "/bookings" },
];

const supportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com" },
  { icon: Twitter, label: "Twitter", href: "https://www.twitter.com" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com" },
];

const contactDetails = [
  { title: "Email", value: "hello@eventsystem.app" },
  { title: "Phone", value: "+251 991 515 588" },
  { title: "Office", value: "4 Addis Plaza, Addis Ababa" },
];

export default function Footer() {
  const { isDark } = useTheme();
  const gradientClasses = isDark
    ? "from-slate-950 via-slate-900 to-slate-800"
    : "from-slate-100 via-white/90 to-emerald-50";
  const textColor = isDark ? "text-slate-200" : "text-slate-700";
  const borderClass = isDark ? "border-white/10" : "border-slate-200";
  const blurOne = isDark ? "bg-emerald-500/25" : "bg-emerald-200/40";
  const blurTwo = isDark ? "bg-fuchsia-500/20" : "bg-rose-200/40";
  const cardBg = isDark ? "bg-white/5" : "bg-white/90";
  const cardBorder = isDark ? "border-white/10" : "border-slate-200";
  const shadowClass = "shadow-[0_30px_80px_rgba(15,23,42,0.25)]";
  const sectionText = isDark ? "text-slate-200" : "text-slate-700";

  return (
<footer className={`relative overflow-hidden bg-gradient-to-br ${gradientClasses}`}>
  {/* Decorative blurs */}
  <div
    className={`pointer-events-none absolute -right-10 top-4 h-28 w-28 rounded-full blur-[70px] ${blurOne}`}
  />
  <div
    className={`pointer-events-none absolute -left-6 bottom-0 h-36 w-36 rounded-full blur-[90px] ${blurTwo}`}
  />

  {/* Main content */}
  <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
    
    {/* === TOP GRID === */}
    <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-3">

      {/* Column 1 — Brand */}
      <div className={`flex flex-col gap-5 text-center lg:text-left rounded-3xl ${cardBorder} ${cardBg} p-6 ${shadowClass}`}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.6em] text-emerald-300">
          Curated nights
        </span>

        <h2 className="text-xl font-semibold uppercase tracking-[0.2em] text-white" style={{ color: isDark ? "#e2e8f0" : "#475467" }}>
          Event Ticketing System
        </h2>

        <p className="text-sm leading-relaxed" style={{ color: isDark ? "#e2e8f0" : "#475467" }}>
          Seat reservations, curated lineups, and live reminders all in one sleek
          place. Keep your evenings action-ready with minimal scrolling.
        </p>

        <div className="flex justify-center lg:justify-start flex-wrap gap-4 pt-2">
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className={`group flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:border-emerald-400 hover:bg-emerald-500/20 ${
                isDark
                  ? "border-white/15 bg-white/5"
                  : "border-slate-300/60 bg-slate-100"
              }`}
            >
              <Icon size={16} className={isDark ? "text-white" : "text-slate-900"} />
            </a>
          ))}
        </div>
      </div>

      {/* Column 2 — Links */}
      <div className={`flex flex-col gap-6 text-center sm:text-left rounded-3xl border ${cardBorder} ${cardBg} p-6 ${shadowClass}`}>
        {/* Quick Links */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.5em] text-emerald-300">
            Quick links
          </h3>
          <ul className="mt-6 space-y-3 text-base">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className={`inline-block transition hover:translate-x-1 hover:text-white ${sectionText}`}
                  aria-label={link.label}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.5em] text-emerald-300">
            Support
          </h3>
          <ul className="mt-6 space-y-3 text-base">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className={`inline-block transition hover:translate-x-1 hover:text-white ${sectionText}`}
                  aria-label={link.label}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Column 3 — Contact */}
      <div className={`flex flex-col gap-5 text-center lg:text-left rounded-3xl border ${cardBorder} ${cardBg} p-6 ${shadowClass}`}>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.5em] text-emerald-300">
          Reach us
        </h3>

          <div className="space-y-3 text-base">
          {contactDetails.map((contact) => (
            <p key={contact.title}>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-slate-400 mb-1">
                {contact.title}
              </span>
                <span className={`font-semibold ${sectionText}`}>
                {contact.value}
              </span>
            </p>
          ))}
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className={`inline-flex items-center justify-center rounded-full border px-5 py-2 text-[10px] font-bold uppercase tracking-[0.4em] transition-all hover:border-emerald-400 hover:bg-emerald-500/20 ${
              isDark
                ? "border-white/30 text-white"
                : "border-slate-400 bg-white text-slate-900"
            }`}
          >
            Plan another night
          </Link>
        </div>
      </div>
    </div>

    {/* === BOTTOM BAR === */}
    <div
      className={`${borderClass} mt-14 border-t pt-6 text-[10px] uppercase tracking-[0.4em] ${textColor}`}
    >
      <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Event Ticketing System.</span>
        <span className={textColor}>See you at the next show.</span>
      </div>
    </div>
  </div>
</footer>

  );
}
