import { useEffect, useState } from "react";
import PageTitle from "../../../../components/pageTitle";
import type { BookingType } from "../../../../interface";
import { message, Table, Tag } from "antd";
import {
  getAllBooking,
} from "../../../../api-services/booking-service";
import { getDateTimeFormat } from "../../../../helper";

type BookingRow = BookingType & {
  ticketType?: string;
  ticketCount?: number;
  status?: string;
};

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const maybe = error as {
      message?: unknown;
      response?: { data?: { message?: unknown } };
    };
    const respMsg = maybe.response?.data?.message;
    if (typeof respMsg === "string" && respMsg) return respMsg;
    if (typeof maybe.message === "string" && maybe.message) return maybe.message;
  }
  return "Something went wrong";
}

function AdminBooking() {
  const [bookings, setBooking] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getAllBooking();
      setBooking(response.data);
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const ticketTypeFilters = Array.from(
    new Set(
      bookings
        .map((booking) => booking.ticketType)
        .filter((ticketType): ticketType is string => Boolean(ticketType))
    )
  ).map((ticketType) => ({ text: ticketType, value: ticketType }));

  const statusFilters = [
    { text: "Booked", value: "booked" },
    { text: "Cancelled", value: "cancelled" },
  ];

  const columns = [
    {
      title: "Event / Attendee",
      dataIndex: "event",
      key: "event",
      render: (event: unknown, record: BookingRow) => {
        const evt = event as {
          name?: string;
          date?: string;
          time?: string;
          location?: string;
          address?: string;
          city?: string;
        } | null;
        const user = record.user as { name?: string } | null;
        if (!evt) return "";
        const name = evt.name ?? "Event";
        const dateTime = getDateTimeFormat(`${evt.date ?? ""} ${evt.time ?? ""}`);
        const location = evt.location || evt.address || evt.city;
        return (
          <div className="space-y-1">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {name}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {user?.name ? `${user.name} • ` : ""}
              {dateTime}
              {location ? ` • ${location}` : ""}
            </p>
          </div>
        );
      },
      sorter: (a: BookingRow, b: BookingRow) => {
        const aName = (a.event as { name?: string } | undefined)?.name ?? "";
        const bName = (b.event as { name?: string } | undefined)?.name ?? "";
        return aName.localeCompare(bName);
      },
    },
    {
      title: "Ticket Type",
      dataIndex: "ticketType",
      key: "ticketType",
      filters: ticketTypeFilters,
      onFilter: (value: string | number | boolean, record: BookingRow) =>
        record.ticketType === value,
      responsive: ["lg"],
    },
    {
      title: "Ticket Count",
      dataIndex: "ticketCount",
      key: "ticketCount",
      responsive: ["md"],
      sorter: (a: BookingRow, b: BookingRow) => (a.ticketCount ?? 0) - (b.ticketCount ?? 0),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      responsive: ["lg"],
      sorter: (a: BookingRow, b: BookingRow) =>
        (a.totalAmount ?? 0) - (b.totalAmount ?? 0),
    },
    {
      title: "Booked ON",
      dataIndex: "createdAt",
      responsive: ["lg"],
      key: "createdAt",
      render: (createdAt: string) => getDateTimeFormat(createdAt),
      sorter: (a: BookingRow, b: BookingRow) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ["sm"],
      render: (status: string) => {
        const isBooked = status === "booked";
        return (
          <Tag color={isBooked ? "success" : "default"}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      filters: statusFilters,
      onFilter: (value: string | number | boolean, record: BookingRow) =>
        record.status === value,
      sorter: (a: BookingRow, b: BookingRow) =>
        (a.status ?? "").localeCompare(b.status ?? ""),
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Bookings" />

      <div className="q-card overflow-x-auto">
        <Table
          dataSource={bookings}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}

export default AdminBooking;
