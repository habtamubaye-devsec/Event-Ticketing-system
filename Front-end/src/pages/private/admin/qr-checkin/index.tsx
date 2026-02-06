import { useEffect, useMemo, useState } from "react";
import { Button, message, Modal, Select, Table, Tabs, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Html5Qrcode } from "html5-qrcode";
import PageTitle from "../../../../components/pageTitle";
import {
  checkInBookingByQr,
  getAllBooking,
  verifyBookingByQr,
} from "../../../../api-services/booking-service";
import { getEvents } from "../../../../api-services/events-service";
import type { BookingType, EventType } from "../../../../interface";
import { getDateTimeFormat } from "../../../../helper";

type VerifyData = {
  _id: string;
  qrCode: string;
  status?: string;
  checkedIn?: boolean;
  checkedInAt?: string;
  ticketType?: string;
  ticketCount?: number;
  user?: { name?: string; email?: string };
  event?: { _id?: string; name?: string; date?: string; time?: string; address?: string; city?: string };
};

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

function parseLocalDate(dateText?: string) {
  if (!dateText || typeof dateText !== "string") return null;
  const parts = dateText.split("-").map((value) => Number(value));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
}

function isUpcomingEvent(event: Pick<EventType, "date">) {
  const eventDate = parseLocalDate(event.date);
  if (!eventDate) return true;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return eventDate.getTime() >= today.getTime();
}

function AdminQrCheckin() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeCode, setActiveCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerifyData | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [eventBookings, setEventBookings] = useState<BookingRow[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const scannerRegionId = useMemo(() => "qr-scanner-region", []);

  const upcomingEvents = useMemo(
    () => events.filter((evt) => isUpcomingEvent(evt)),
    [events]
  );

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const resp = await getEvents({ searchText: "", date: "" });
        const list = (resp?.data as EventType[] | undefined) ?? [];
        setEvents(list);
      } catch (e: any) {
        message.error(e?.response?.data?.message || e?.message || "Unable to load events");
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      if (!selectedEventId) {
        setEventBookings([]);
        return;
      }
      try {
        setBookingsLoading(true);
        const resp = await getAllBooking();
        const list = (resp?.data as BookingRow[] | undefined) ?? [];
        setEventBookings(
          list.filter(
            (b) => String((b.event as { _id?: string } | undefined)?._id) === String(selectedEventId)
          )
        );
      } catch (error: unknown) {
        message.error(getErrorMessage(error));
      } finally {
        setBookingsLoading(false);
      }
    };

    loadBookings();
  }, [selectedEventId]);

  const notCheckedInBookings = useMemo(
    () => eventBookings.filter((b) => (b.status ?? "booked") === "booked" && !b.checkedIn),
    [eventBookings]
  );

  const checkedInBookings = useMemo(
    () => eventBookings.filter((b) => b.checkedIn || b.status === "checked-in"),
    [eventBookings]
  );

  useEffect(() => {
    if (!scannerOpen) return;

    const html5QrCode = new Html5Qrcode(scannerRegionId);
    let cancelled = false;

    const start = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          async (decodedText) => {
            if (cancelled) return;
            setActiveCode(decodedText);
            setScannerOpen(false);
          }
        );
      } catch (e: any) {
        message.error(e?.message || "Unable to start camera");
        setScannerOpen(false);
      }
    };

    start();

    return () => {
      cancelled = true;
      html5QrCode
        .stop()
        .catch(() => undefined)
        .finally(() => {
          html5QrCode.clear().catch(() => undefined);
        });
    };
  }, [scannerOpen, scannerRegionId]);

  const onVerify = async () => {
    if (!selectedEventId) {
      message.warning("Select an event first");
      return;
    }
    if (!activeCode.trim()) {
      message.warning("Scan or paste a QR code first");
      return;
    }
    try {
      setLoading(true);
      const resp = await verifyBookingByQr(activeCode.trim(), selectedEventId);
      setVerifyResult(resp.data);
      message.success("Booking verified");
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "Verify failed");
      setVerifyResult(null);
    } finally {
      setLoading(false);
    }
  };

  const onCheckIn = async () => {
    if (!selectedEventId) {
      message.warning("Select an event first");
      return;
    }
    if (!activeCode.trim()) return;
    try {
      setLoading(true);
      await checkInBookingByQr(activeCode.trim(), selectedEventId);
      message.success("Checked in successfully");
      await onVerify();
    } catch (e: any) {
      message.error(e?.response?.data?.message || e?.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = async (record: BookingRow) => {
    const code = record.qrCode;
    if (!selectedEventId) {
      message.warning("Select an event first");
      return;
    }
    if (!code) {
      message.error("Booking code not available for this attendee");
      return;
    }

    try {
      setBookingsLoading(true);
      await checkInBookingByQr(code, selectedEventId);
      message.success("Checked in successfully");
      // refresh list for this event
      const resp = await getAllBooking();
      const list = (resp?.data as BookingRow[] | undefined) ?? [];
      setEventBookings(
        list.filter(
          (b) => String((b.event as { _id?: string } | undefined)?._id) === String(selectedEventId)
        )
      );
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    } finally {
      setBookingsLoading(false);
    }
  };

  const attendeeColumns: ColumnsType<BookingRow> = [
    {
      title: "Attendee",
      dataIndex: "user",
      key: "user",
      render: (user: unknown, record: BookingRow) => {
        const u = (user as { name?: string; email?: string } | null) ?? null;
        const code = record.qrCode ?? "";
        return (
          <div className="space-y-1">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {u?.name || "Attendee"}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {u?.email ? `${u.email} • ` : ""}
              {code}
            </p>
          </div>
        );
      },
      sorter: (a, b) => {
        const aName = ((a.user as { name?: string } | undefined)?.name ?? "").toLowerCase();
        const bName = ((b.user as { name?: string } | undefined)?.name ?? "").toLowerCase();
        return aName.localeCompare(bName);
      },
    },
    {
      title: "Ticket",
      dataIndex: "ticketType",
      key: "ticketType",
      responsive: ["md"],
      render: (_t: unknown, record: BookingRow) => {
        const type = record.ticketType ?? "-";
        const count = record.ticketCount ?? 0;
        return `${type} • ${count}`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: unknown, record: BookingRow) => {
        const normalizedStatus = record.checkedIn ? "checked-in" : (typeof status === "string" ? status : "");
        const isBooked = normalizedStatus === "booked";
        const isCheckedIn = normalizedStatus === "checked-in";
        const isCanceled = normalizedStatus === "canceled";
        const color = isCheckedIn ? "processing" : isBooked ? "success" : isCanceled ? "default" : "default";
        return <Tag color={color}>{(normalizedStatus || "unknown").toUpperCase()}</Tag>;
      },
      responsive: ["sm"],
    },
    {
      title: "Booked On",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["lg"],
      render: (createdAt: string) => getDateTimeFormat(createdAt),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  const notCheckedColumns: ColumnsType<BookingRow> = [
    ...attendeeColumns,
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
    ...attendeeColumns,
    {
      title: "Checked-in At",
      dataIndex: "checkedInAt",
      key: "checkedInAt",
      responsive: ["lg"],
      render: (checkedInAt: string | undefined, record: BookingRow) => {
        const value = checkedInAt || record.checkedInAt;
        return value ? getDateTimeFormat(value) : "-";
      },
      sorter: (a, b) => {
        const aTime = a.checkedInAt ? new Date(a.checkedInAt).getTime() : 0;
        const bTime = b.checkedInAt ? new Date(b.checkedInAt).getTime() : 0;
        return aTime - bTime;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="QR Check-in" />

      <div className="q-card p-5 space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[260px] flex-1">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--muted)]">
              Only upcoming events are shown
            </p>
            <Select
              value={selectedEventId || undefined}
              onChange={(value) => {
                setSelectedEventId(value);
                setVerifyResult(null);
              }}
              placeholder="Select event for check-in"
              className="w-full"
              options={upcomingEvents.map((evt) => ({
                label: `${evt.name} • ${evt.date}${evt.time ? ` ${evt.time}` : ""}`,
                value: evt._id,
              }))}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label as string | undefined)?.toLowerCase().includes(input.toLowerCase()) ?? false
              }
            />
          </div>
          <Button type="primary" onClick={() => setScannerOpen(true)}>
            Scan QR
          </Button>
          <input
            value={activeCode}
            onChange={(e) => setActiveCode(e.target.value)}
            placeholder="Or paste booking code"
            className="flex-1 min-w-[260px] rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
          <Button onClick={onVerify} loading={loading}>
            Verify
          </Button>
          <Button
            onClick={onCheckIn}
            loading={loading}
            disabled={!verifyResult || verifyResult.checkedIn || verifyResult.status !== "booked" || !selectedEventId}
          >
            Check-in
          </Button>
        </div>

        {verifyResult ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[var(--text)]">{verifyResult.event?.name || "Event"}</p>
                <p className="text-xs text-[var(--muted)]">
                  {verifyResult.user?.name ? `${verifyResult.user.name} • ` : ""}
                  {verifyResult.qrCode}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Tag color={verifyResult.status === "booked" ? "success" : "default"}>{(verifyResult.status || "").toUpperCase()}</Tag>
                <Tag color={verifyResult.checkedIn ? "processing" : "default"}>
                  {verifyResult.checkedIn ? "CHECKED IN" : "NOT CHECKED IN"}
                </Tag>
              </div>
            </div>
            <div className="mt-3 text-sm text-[var(--muted)]">
              Tickets: <span className="text-[var(--text)] font-semibold">{verifyResult.ticketCount ?? "-"}</span>
              {verifyResult.ticketType ? ` • Type: ${verifyResult.ticketType}` : ""}
            </div>
          </div>
        ) : null}
      </div>

      {selectedEventId ? (
        <div className="q-card p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-bold text-[var(--text)]">Attendees</p>
              <p className="text-xs text-[var(--muted)]">Showing bookings for selected event</p>
            </div>
            <div className="text-xs text-[var(--muted)]">
              Total: <span className="text-[var(--text)] font-semibold">{eventBookings.length}</span>
            </div>
          </div>

          <Tabs
            defaultActiveKey="not-checked"
            items={[
              {
                key: "not-checked",
                label: `Not Checked In (${notCheckedInBookings.length})`,
                children: (
                  <Table
                    dataSource={notCheckedInBookings}
                    columns={notCheckedColumns}
                    loading={bookingsLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: "max-content" }}
                  />
                ),
              },
              {
                key: "checked",
                label: `Checked In (${checkedInBookings.length})`,
                children: (
                  <Table
                    dataSource={checkedInBookings}
                    columns={checkedColumns}
                    loading={bookingsLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: "max-content" }}
                  />
                ),
              },
            ]}
          />
        </div>
      ) : null}

      <Modal open={scannerOpen} onCancel={() => setScannerOpen(false)} footer={null} title="Scan QR" centered>
        <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-black">
          <div id={scannerRegionId} style={{ width: "100%" }} />
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">Allow camera access, then point at the QR code.</p>
      </Modal>
    </div>
  );
}

export default AdminQrCheckin;
