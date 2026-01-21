import React from "react";
import { CalendarDays, CreditCard, QrCode, Sparkles, Ticket } from "lucide-react";

function WelcomeContent() {
  return (
    <div className="relative hidden min-h-screen lg:block">
      <img
        src="/auth-events-hero.svg"
        alt="Event ticketing"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/25 to-transparent" />

      {/* Floating feature cards */}
      <div className="pointer-events-none absolute left-10 top-10">
        <div className="w-fit rounded-2xl bg-white/10 px-4 py-3 text-white shadow-lg backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            Trending events, updated daily
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-10 top-16">
        <div className="rounded-2xl bg-white/10 p-4 text-white shadow-lg backdrop-blur">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-5 w-5" />
            <div>
              <div className="text-sm font-semibold">Plan & book faster</div>
              <div className="text-xs text-white/80">Filter by date, city, and category</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-10 top-44">
        <div className="rounded-2xl bg-white/10 p-4 text-white shadow-lg backdrop-blur">
          <div className="flex items-start gap-3">
            <QrCode className="mt-0.5 h-5 w-5" />
            <div>
              <div className="text-sm font-semibold">QR ticket check-in</div>
              <div className="text-xs text-white/80">Secure entry with instant verification</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex h-full flex-col justify-end p-10">
        <div className="max-w-lg rounded-2xl bg-black/35 p-7 text-white shadow-2xl backdrop-blur">
          <div className="flex items-center gap-2 text-white/90">
            <Ticket className="h-5 w-5" />
            <span className="text-xs font-semibold tracking-wide">QETERO • EVENT TICKETING</span>
          </div>

          <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight">
            Discover events.
            <span className="block text-white/90">Book tickets in minutes.</span>
          </h2>

          <p className="mt-3 text-sm text-white/85">
            Concerts, conferences, festivals, and community meetups — all in one place.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
              <CreditCard className="h-4 w-4" />
              <span className="text-white/90">Secure checkout and protected bookings</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
              <QrCode className="h-4 w-4" />
              <span className="text-white/90">Digital tickets with QR verification</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
              <CalendarDays className="h-4 w-4" />
              <span className="text-white/90">Smart filters by date and location</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeContent;