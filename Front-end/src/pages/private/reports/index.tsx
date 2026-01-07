import { useEffect, useState } from "react";
import { Button, message } from "antd";
import PageTitle from "../../../components/pageTitle";
import { getUserReport } from "../../../api-services/report-service";

type UserReports = {
  totalBooking?: number;
  cancelledBooking?: number;
  totalAmountSpent?: number;
  totalAmountReceivedAsRefund?: number;
  totalTickets?: number;
  cancelledTickets?: number;
};

const numberFormatter = new Intl.NumberFormat("en-US");

const formatNumber = (value?: number) => {
  if (typeof value !== "number") return "—";
  return numberFormatter.format(value);
};

const formatCurrency = (value?: number) => {
  if (typeof value !== "number") return "—";
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

function UserReportPage() {
  const [reports, setReports] = useState<UserReports>({});
  const [lastSynced, setLastSynced] = useState("");

  const getReports = async () => {
    try {
      const response = await getUserReport();
      setReports(response.data);
      setLastSynced(new Date().toLocaleString());
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    getReports();
  }, []);
  const totalBookings = reports.totalBooking ?? 0;
  const totalTickets = reports.totalTickets ?? 0;
  const totalRevenue = reports.totalAmountSpent ?? 0;
  const totalRefund = reports.totalAmountReceivedAsRefund ?? 0;
  const cancellationRate = totalBookings
    ? Math.round(((reports.cancelledBooking ?? 0) / totalBookings) * 100)
    : 0;
  const refundRate = totalRevenue
    ? Math.round((totalRefund / totalRevenue) * 100)
    : 0;
  const highlightCards = [
    {
      label: "Total bookings",
      value: formatNumber(totalBookings),
      description: "All events captured",
    },
    {
      label: "Tickets sold",
      value: formatNumber(totalTickets),
      description: "Seats confirmed",
    },
    {
      label: "Revenue generated",
      value: formatCurrency(totalRevenue),
      description: "All confirmed sales",
    },
  ];
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface)] shadow-[0_20px_45px_rgba(15,23,42,0.15)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
          <div>
            <PageTitle title="User Reports" />
            <p className="text-sm text-[var(--muted)] max-w-3xl">
              Track bookings, cancellations, and revenue in a single dashboard-ready snapshot.
            </p>
          </div>
          <Button type="text" className="text-sm text-[var(--primary)]" onClick={getReports}>
            Refresh
          </Button>
        </div>
        <div className="space-y-6 px-6 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {highlightCards.map((highlight) => (
              <div
                key={highlight.label}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--muted)]">
                  {highlight.label}
                </p>
                <p className="mt-2 text-3xl font-black text-[var(--text)]">
                  {highlight.value}
                </p>
                <p className="text-xs uppercase tracking-[0.5em] text-[var(--muted)]">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--muted)]">Cancellation rate</p>
              <p className="mt-3 text-4xl font-black text-[var(--text)]">{cancellationRate}%</p>
              <p className="text-sm text-[var(--muted)] mt-2">
                {formatNumber(reports.cancelledBooking)} cancelled of {formatNumber(totalBookings)} bookings
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--muted)]">Refund capture</p>
              <p className="mt-3 text-4xl font-black text-[var(--text)]">{refundRate}%</p>
              <p className="text-sm text-[var(--muted)] mt-2">
                Refunded {formatCurrency(totalRefund)} in total
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
            <span>
              {lastSynced ? `Last synced ${lastSynced}` : "Fetching the latest report data"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default UserReportPage;
