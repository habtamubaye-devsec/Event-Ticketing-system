import { useEffect, useState } from "react";
import PageTitle from "../../../components/pageTitle";
import type { BookingType } from "../../../interface";
import { Button, message, Table, Tag } from "antd";
import {
  cancelBookings,
  // deleteBookings,
  getUserBooking,
} from "../../../api-services/booking-service";
import { getDateTimeFormat } from "../../../helper";
// import { Trash } from "lucide-react";

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

function UserBooking() {
  const [bookings, setBooking] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getUserBooking();
      setBooking(response.data);
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      setLoading(true);
      await cancelBookings(id);
      message.success("Booking canceled successfully");
      getData(); // Refresh table
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = async (id: string) => {
  //   try {
  //     setLoading(true);
  //     await deleteBookings(id);
  //     message.success("Booking Deleted successfully");
  //     getData(); // Refresh table
  //   } catch (error: any) {
  //     message.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    getData();
  }, []);

  const renderEventDetails = (event: unknown) => {
    const evt =
      (event as {
        name?: unknown;
        date?: unknown;
        time?: unknown;
        location?: unknown;
        address?: unknown;
        city?: unknown;
      } | null) ?? null;
    if (!evt) return "";
    const name = typeof evt.name === "string" ? evt.name : "Event";
    const dateValue = `${typeof evt.date === "string" ? evt.date : ""} ${
      typeof evt.time === "string" ? evt.time : ""
    }`.trim();
    const dateTime = dateValue ? getDateTimeFormat(dateValue) : "";
    const location =
      typeof evt.location === "string"
        ? evt.location
        : typeof evt.address === "string"
        ? evt.address
        : typeof evt.city === "string"
        ? evt.city
        : "";
    const detailLine = [dateTime, location].filter(Boolean).join(" • ");
    return (
      <div className="space-y-1">
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          {name}
        </p>
        {detailLine ? (
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {detailLine}
          </p>
        ) : null}
      </div>
    );
  };

  const getEventName = (record: BookingRow) => {
    return (
      (record.event as { name?: string } | undefined)?.name ?? ""
    );
  };

  const columns = [
    {
      title: "Event / Details",
      dataIndex: "event",
      key: "event",
      render: renderEventDetails,
      sorter: (a: BookingRow, b: BookingRow) =>
        getEventName(a).localeCompare(getEventName(b)),
    },
    {
      title: "Ticket Type",
      dataIndex: "ticketType",
      key: "ticketType",
      responsive: ["md"],
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const isBooked = status === "booked";
        return (
          <Tag color={isBooked ? "success" : "default"}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      responsive: ["sm"],
    },
    {
      title: "Booked ON",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => getDateTimeFormat(createdAt),
      responsive: ["lg"],
      sorter: (a: BookingRow, b: BookingRow) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_value: unknown, record: BookingRow) => {
        return record.status === "booked" ? (
          <Button
            type="link"
            danger
            size="small"
            onClick={() => handleCancel(record._id)}
          >
            Cancel
          </Button>
        ) : (
          <span className="text-[var(--muted)] text-sm">Canceled</span>
        );
        
        // (
        //   <span onClick={() => handleDelete(record._id)}
        //   className="text-gray-400">
        //     <Trash />
        //   </span>
        // );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Bookings" />

      <div className="q-card">
        <Table
          dataSource={bookings}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={false}
        />
      </div>
    </div>
  );
}

export default UserBooking;
