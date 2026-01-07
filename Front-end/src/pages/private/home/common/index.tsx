import type { EventType } from "../../../../interface";
import { Button } from "antd";
import { MapPin, Timer } from "lucide-react";
import { getDateTimeFormat } from "../../../../helper";
import { useNavigate } from "react-router-dom";

function EventCard({ event }: { event: EventType }) {
  const navigate = useNavigate();
  const mainImage = event.media?.[0] ||
    "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=800&q=80";
  const status = (event.status ?? "upcoming").toUpperCase();
  const handleCardClick = () => navigate(`/events/${event._id}`);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
      className="q-card group flex h-full min-h-[520px] w-full max-w-full flex-col overflow-hidden rounded-3xl border border-transparent bg-[var(--surface)] transition duration-300 ease-out hover:-translate-y-1 hover:border-[var(--border)] hover:shadow-[0_25px_45px_rgba(15,23,42,0.15)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
    >
      <div className="h-56 w-full overflow-hidden rounded-t-3xl">
        <img
          src={mainImage}
          alt={event.name}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-4 py-5">
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
            {event.name}
          </h2>
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--muted)" }}>
            {event.description}
          </p>
        </div>

        <div className="space-y-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          <div className="inline-flex items-center gap-2">
            <Timer size={16} style={{ color: "var(--primary)" }} />
            {getDateTimeFormat(`${event.date} ${event.time}`)}
          </div>
          <div className="inline-flex items-center gap-2">
            <MapPin size={16} style={{ color: "var(--primary)" }} />
            {event.address}, {event.city}, {event.pincode}
          </div>
        </div>

        <div className="mt-auto space-y-2 border-t border-dashed border-[var(--border)] pt-4 text-sm" style={{ color: "var(--muted)" }}>
          <p>Organizer: <span className="font-semibold" style={{ color: "var(--text)" }}>{event.organizer}</span></p>
          {event.guest?.length ? (
            <p>Guests: <span className="font-semibold" style={{ color: "var(--text)" }}>{event.guest.join(", ")}</span></p>
          ) : null}
          <p>Status: <span className="font-semibold uppercase" style={{ color: "var(--primary)" }}>{status}</span></p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[0.65rem] tracking-[0.3em]" style={{ color: "var(--primary)" }}>
              DETAILS
            </span>
            <Button type="primary" size="small" onClick={() => navigate(`/events/${event._id}`)}>
              View Event
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
