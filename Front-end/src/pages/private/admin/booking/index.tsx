import { useEffect, useMemo, useState } from "react";
import PageTitle from "../../../../components/pageTitle";
import type { BookingType } from "../../../../interface";
import { Button, message, Modal, Table, Tabs, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  checkInBookingByQr,
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

  const notCheckedInBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          (booking.status ?? "booked") === "booked" && !booking.checkedIn
      ),
    [bookings]
  );

  const checkedInBookings = useMemo(
    () => bookings.filter((booking) => booking.checkedIn || booking.status === "checked-in"),
    [bookings]
  );

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

  const handleManualCheckIn = (record: BookingRow) => {
    const code = record.qrCode;
    const eventId = (record.event as { _id?: string } | undefined)?._id;
    const attendeeName = (record.user as { name?: string } | undefined)?.name ?? "Attendee";

    if (!code) {
      message.error("Booking code not available for this attendee");
      return;
    }

    Modal.confirm({
      title: "Check in attendee?",
      content: `${attendeeName} • ${code}`,
      okText: "Check in",
      okButtonProps: { type: "primary" },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          await checkInBookingByQr(code, eventId);
          message.success("Checked in successfully");
          await getData();
        } catch (error: unknown) {
          message.error(getErrorMessage(error));
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleCheckInAllNotChecked = () => {
    if (!notCheckedInBookings.length) return;

    Modal.confirm({
      title: "Check in all attendees in this tab?",
      content: `This will check in ${notCheckedInBookings.length} booking(s).`,
      okText: "Check in all",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        const successes: string[] = [];
        const failures: string[] = [];
        try {
          setLoading(true);
          for (const booking of notCheckedInBookings) {
            const code = booking.qrCode;
            const eventId = (booking.event as { _id?: string } | undefined)?._id;
            if (!code) {
              failures.push(booking._id);
              continue;
            }
            try {
              await checkInBookingByQr(code, eventId);
              successes.push(booking._id);
            } catch {
              failures.push(booking._id);
            }
          }

          if (successes.length) {
            message.success(`Checked in ${successes.length} booking(s)`);
          }
          if (failures.length) {
            message.warning(`Failed for ${failures.length} booking(s)`);
          }
          await getData();
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const ticketTypeFilters = Array.from(
    new Set(
      bookings
        .map((booking) => booking.ticketType)
        .filter((ticketType): ticketType is string => Boolean(ticketType))
    )
  ).map((ticketType) => ({ text: ticketType, value: ticketType }));

  const statusFilters = [
    { text: "Booked", value: "booked" },
    { text: "Checked-in", value: "checked-in" },
    { text: "Canceled", value: "canceled" },
  ];

  const columns: ColumnsType<BookingRow> = [
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
      onFilter: (value, record) => record.ticketType === String(value),
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
      render: (status: string, record: BookingRow) => {
        const normalizedStatus = record.checkedIn ? "checked-in" : status;
        const isBooked = normalizedStatus === "booked";
        const isCheckedIn = normalizedStatus === "checked-in";
        const isCanceled = normalizedStatus === "canceled";
        const color = isCheckedIn
          ? "processing"
          : isBooked
          ? "success"
          : isCanceled
          ? "default"
          : "default";
        return (
          <Tag color={color}>
            {(normalizedStatus || "unknown").toUpperCase()}
          </Tag>
        );
      },
      filters: statusFilters,
      onFilter: (value, record) => record.status === String(value),
      sorter: (a: BookingRow, b: BookingRow) =>
        (a.status ?? "").localeCompare(b.status ?? ""),
    },
  ];

  const uncheckedColumns: ColumnsType<BookingRow> = [
    ...columns,
    {
      title: "Action",
      key: "action",
      render: (_value: unknown, record: BookingRow) => {
        const isCheckedIn = Boolean(record.checkedIn) || record.status === "checked-in";
        const canCheckIn = !isCheckedIn && (record.status ?? "booked") === "booked";
        return canCheckIn ? (
          <Button size="small" type="primary" onClick={() => handleManualCheckIn(record)}>
            Check in
          </Button>
        ) : (
          <span className="text-(--muted) text-sm">—</span>
        );
      },
    },
  ];

  const checkedColumns: ColumnsType<BookingRow> = [
    ...columns,
    {
      title: "Checked-in At",
      dataIndex: "checkedInAt",
      key: "checkedInAt",
      responsive: ["lg"],
      render: (checkedInAt: string | undefined, record: BookingRow) => {
        const value = checkedInAt || (record as { checkedInAt?: string }).checkedInAt;
        return value ? getDateTimeFormat(value) : "-";
      },
      sorter: (a: BookingRow, b: BookingRow) => {
        const aTime = a.checkedInAt ? new Date(a.checkedInAt).getTime() : 0;
        const bTime = b.checkedInAt ? new Date(b.checkedInAt).getTime() : 0;
        return aTime - bTime;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Bookings" />

      <div className="q-card overflow-x-auto">
        <Tabs
          defaultActiveKey="not-checked"
          items={[
            {
              key: "not-checked",
              label: `Not Checked In (${notCheckedInBookings.length})`,
              children: (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCheckInAllNotChecked}
                      disabled={!notCheckedInBookings.length}
                      loading={loading}
                    >
                      Check in all
                    </Button>
                  </div>
                  <Table
                    dataSource={notCheckedInBookings}
                    columns={uncheckedColumns}
                    loading={loading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: "max-content" }}
                  />
                </div>
              ),
            },
            {
              key: "checked",
              label: `Checked In (${checkedInBookings.length})`,
              children: (
                <Table
                  dataSource={checkedInBookings}
                  columns={checkedColumns}
                  loading={loading}
                  rowKey="_id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: "max-content" }}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default AdminBooking;
