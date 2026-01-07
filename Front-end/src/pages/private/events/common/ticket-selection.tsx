import { useState } from "react";
import type { EventType } from "../../../../interface";
import { Button, Input, message, Spin } from "antd";
import { createBooking } from "../../../../api-services/booking-service";
import { useNavigate } from "react-router-dom";

function TicketSelection({ eventData }: { eventData: EventType }) {
  const ticketTypes = eventData.ticketTypes;
  const [selectedTicketType, setSelectedTicketType] = useState<string>("");
  const [selectedTicketCount, setSelectedTicketCount] = useState<number>(1);
  const [maxCount, setMaxCount] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const selectedTicketPrice = ticketTypes.find(
    (ticketType) => ticketType.name === selectedTicketType
  )?.price;
  
  const navigate = useNavigate()
  const totalAmount = selectedTicketCount * selectedTicketPrice;

  const handleBooking = async () => {
    if (!selectedTicketType) {
      return message.error("Please select a ticket type");
    }
    if (selectedTicketCount > maxCount) {
      return message.error(`Only ${maxCount} tickets available`);
    }

    try {
      setLoading(true);
      const payload = {
        event: eventData._id,
        ticketType: selectedTicketType,
        ticketCount: selectedTicketCount,
        totalAmount: totalAmount,
      };
      const res = await createBooking(payload);
      message.success(res.message || "Booking successful!");
      navigate("/");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-extrabold" style={{ color: "var(--text)" }}>
          Select ticket type
        </h3>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          Choose a ticket category, then set quantity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ticketTypes.map((ticketType, index) => {
          let available = ticketType.available ? ticketType.available : ticketType.limit;
          const isSelected = selectedTicketType === ticketType.name;
          const isSoldOut = available <= 0;

          return (
            <button
              type="button"
              key={index}
              className="q-focus-ring w-full text-left rounded-2xl border p-4 transition"
              style={{
                borderColor: "var(--border)",
                background: isSelected
                  ? "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.14))"
                  : "var(--surface-2)",
                opacity: isSoldOut ? 0.6 : 1,
              }}
              disabled={isSoldOut}
              onClick={() => {
                setSelectedTicketType(ticketType.name);
                setMaxCount(available);
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold tracking-wider" style={{ color: "var(--muted)" }}>
                    {ticketType.name}
                  </div>
                  <div className="mt-1 text-lg font-black" style={{ color: "var(--text)" }}>
                    $ {ticketType.price}
                  </div>
                </div>
                <div
                  className="rounded-full border px-3 py-1 text-xs font-bold"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                    color: isSoldOut ? "var(--danger)" : "var(--muted)",
                  }}
                >
                  {isSoldOut ? "Sold out" : `${available} left`}
                </div>
              </div>

              <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                Limit: {ticketType.limit}
              </div>
            </button>
          );
        })}
      </div>

      <div className="q-card p-4" style={{ background: "var(--surface-2)" }}>
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5">
          <div className="flex-1">
            <div className="text-sm font-extrabold" style={{ color: "var(--text)" }}>
              Quantity
            </div>
            <div className="mt-2">
              <Input
                type="number"
                value={selectedTicketCount}
                onChange={(e) => setSelectedTicketCount(parseInt(e.target.value))}
                disabled={!selectedTicketType}
                max={maxCount}
                min={0}
              />
            </div>
            <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              {selectedTicketType
                ? selectedTicketCount > maxCount
                  ? `Only ${maxCount} tickets available`
                  : `Up to ${maxCount} tickets available`
                : "Select a ticket type to enable quantity"
              }
            </div>
          </div>

          <div className="sm:text-right">
            <div className="text-xs font-bold" style={{ color: "var(--muted)" }}>
              Total Amount
            </div>
            <div className="mt-1 text-xl font-black" style={{ color: "var(--text)" }}>
              ${Number.isFinite(totalAmount) ? totalAmount : 0}
            </div>
            <Button
              className="mt-3"
              type="primary"
              disabled={selectedTicketCount > maxCount || !selectedTicketType}
              onClick={handleBooking}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketSelection;
