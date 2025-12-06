import type { EventType } from "../../../../interface";
import { Button } from "antd";
import { MapPin, Timer } from "lucide-react";
import { getDateTimeFormat } from "../../../../helper";
import { useNavigate } from "react-router-dom";

function EventCard({ event }: { event: EventType }) {
  const mainImage = event.media[0];
  const navigate = useNavigate();

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 border-1 rounded-xl border-gray-200 mt-3 items-center lg:gap-5">
      <div className="col-span-1">
        <img
          src={mainImage}
          alt={event.name}
          className="w-full h-48 object-cover rounded-t"
        />
      </div>
      <div className="col-span-2 flex flex-col gap-5 p-3">
        <h1 className="text-gray-800 text-lg font-bold">{event.name}</h1>
        <p className="text-gray-600 text-sm line-clamp-3">
          {event.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1 bg-gray-200 p-2 rounded">
            <div className="flex gap-2 items-center">
              <MapPin size={16} />
              <p className="text-xs">
                {" "}
                {event.address}, {event.city}, {event.pincode}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Timer size={16} />
              <p className="text-xs">
                {getDateTimeFormat(`${event.date} ${event.time}`)}
              </p>
            </div>
          </div>
          <Button
            type="primary"
            onClick={() => navigate(`/events/${event._id}`)}
          >
            View Event
          </Button>
        </div>
      </div>
    </div>
  );
} 

export default EventCard;
