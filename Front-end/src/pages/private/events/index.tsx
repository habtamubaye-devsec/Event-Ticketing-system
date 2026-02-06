import { useEffect, useState } from "react";
import type { EventType } from "../../../interface";
import { useParams } from "react-router-dom";
import { getEventsById } from "../../../api-services/events-service";
import { message, Spin, Image } from "antd";
import { MapPin, Timer } from "lucide-react";
import {
  getDateFormat,
  getDateTimeFormat,
} from "../../../helper";
import TicketSelection from "./common/ticket-selection";
import SEO from "../../../components/SEO";
import { seoConfig } from "../../../utils/seo-config";

function EventDetail() {
  const [eventData, setEventData] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(false);
  const params: any = useParams();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getEventsById(params.id);
      setEventData(response.data);
    } catch (error) {
      message.error("Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };

  const renderEventProperty = (lable: string, value: any) => {
    return (
      <div className="flex flex-col gap-1 text-sm">
        <span style={{ color: "var(--muted)" }}>{lable}</span>
        <span className="font-semibold" style={{ color: "var(--text)" }}>
          {value}
        </span>
      </div>
    );
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spin />
      </div>
    );
  }

  return (
    eventData && (
      <>
        <SEO
          title={eventData.name}
          description={eventData.description.substring(0, 160)}
          keywords={`${eventData.name}, event tickets, ${eventData.city}, ${eventData.organizer}, upcoming events`}
          ogImage={eventData.media[0] || seoConfig.defaultImage}
          ogType="article"
          canonicalPath={`/events/${eventData._id}`}
          structuredData={{
            "@context": "https://schema.org",
            "@type": "Event",
            name: eventData.name,
            description: eventData.description,
            startDate: `${eventData.date}T${eventData.time}`,
            endDate: `${eventData.date}T${eventData.time}`,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: eventData.address,
              address: {
                "@type": "PostalAddress",
                streetAddress: eventData.address,
                addressLocality: eventData.city,
                postalCode: eventData.pincode,
              },
            },
            image: eventData.media,
            organizer: {
              "@type": "Organization",
              name: eventData.organizer,
            },
            offers: eventData.ticketTypes.map((ticket) => ({
              "@type": "Offer",
              name: ticket.name,
              price: ticket.price,
              priceCurrency: "ETB",
              availability: ticket.available > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
              url: `${seoConfig.siteUrl}/events/${eventData._id}`,
              validFrom: new Date().toISOString(),
            })),
          }}
        />
        <div className="space-y-5">
          <div className="q-card p-4 sm:p-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
                {eventData?.name}
              </h1>

              <div className="flex flex-wrap gap-3">
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: "var(--border)", background: "var(--surface-2)", color: "var(--muted)" }}
                >
                  <MapPin size={14} style={{ color: "var(--primary)" }} />
                  <span>
                    {eventData?.address} {eventData?.city} {eventData?.pincode}
                  </span>
                </div>

                <div
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: "var(--border)", background: "var(--surface-2)", color: "var(--muted)" }}
                >
                  <Timer size={14} style={{ color: "var(--primary)" }} />
                  <span>{getDateTimeFormat(`${eventData?.date} ${eventData?.time}`)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="q-card p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {eventData?.media.map((media, index) => (
                <Image
                  src={media}
                  height={220}
                  className="object-cover rounded-2xl"
                  key={index}
                />
              ))}
            </div>
          </div>

          <div className="q-card p-4 sm:p-6">
            <h2 className="text-base font-extrabold" style={{ color: "var(--text)" }}>
              About this event
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {eventData?.description}
            </p>
          </div>

          <div className="q-card p-4 sm:p-6">
            <h2 className="text-base font-extrabold" style={{ color: "var(--text)" }}>
              Details
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {renderEventProperty("Organizer", eventData?.organizer)}
              {renderEventProperty("Address", eventData?.address)}
              {renderEventProperty("City", eventData?.city)}
              {renderEventProperty("Pincode", eventData?.pincode)}
              {renderEventProperty("Date", getDateFormat(eventData.date))}
              {renderEventProperty("Time", eventData?.time)}
            </div>
            <div className="mt-5">
              {renderEventProperty(
                "Guests",
                eventData?.guest[0] ? eventData?.guest.join(", ") : "No guest"
              )}
            </div>
          </div>

          <div className="q-card p-4 sm:p-6">
            <h2 className="text-base font-extrabold" style={{ color: "var(--text)" }}>
              Tickets
            </h2>
            <div className="mt-4">
              <TicketSelection eventData={eventData} />
            </div>
          </div>
        </div>
      </>
    )
  );
}

export default EventDetail;

