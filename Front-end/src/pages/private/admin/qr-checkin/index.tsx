import { useEffect, useMemo, useState } from "react";
import { Button, message, Modal, Select, Tag } from "antd";
import { Html5Qrcode } from "html5-qrcode";
import PageTitle from "../../../../components/pageTitle";
import { checkInBookingByQr, verifyBookingByQr } from "../../../../api-services/booking-service";
import { getEvents } from "../../../../api-services/events-service";
import type { EventType } from "../../../../interface";

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

  return (
    <div className="space-y-6">
      <PageTitle title="QR Check-in" />

      <div className="q-card p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[260px] flex-1">
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
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--muted)]">
              Only upcoming events are shown
            </p>
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
