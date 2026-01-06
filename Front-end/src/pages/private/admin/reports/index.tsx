import { useEffect, useState } from "react";
import PageTitle from "../../../../components/pageTitle";
import ReportFilters from "./filters";
import { message, Table } from "antd";
import { getEventsFilters } from "../../../../api-services/events-service";
import type { EventType } from "../../../../interface";
import { getAdminReport } from "../../../../api-services/report-service";
import ReportCard from "./reportCard";
import type { CSSProperties } from "react";

type TicketTypeSalesRow = {
  name: string;
  ticketsSold: number;
  revenue: number;
};

type AdminReports = {
  totalBooking?: number;
  cancelledBooking?: number;
  totalRevenueCollected?: number;
  totalRevenueRefunded?: number;
  totalTickets?: number;
  cancelledTickets?: number;
  ticketTypesAndThierSales?: TicketTypeSalesRow[];
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

function AdminReport() {
  const [reports, setReports] = useState<AdminReports>({});
  const [events, setEvents] = useState<EventType[]>([]);
  const [filters, setFilters] = useState({
    eventId: "",
    startDate: "",
    endDate: "",
  });

  const getReports = async () => {
    try {
      const response = await getAdminReport(filters);
      setReports(response.data);
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    }
  };

  const getEventData = async () => {
    try {
      const response = await getEventsFilters({ searchText: "", date: "" });
      setEvents(response.data);
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    getEventData();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      getReports();
    }
  }, [filters, events]);

  const ticketTypes = reports.ticketTypesAndThierSales ?? [];
  const ticketTypeFilters = Array.from(new Set(ticketTypes.map((row) => row.name))).map((name) => ({
    text: name,
    value: name,
  }));

  const ticketTypeColumns = [
    {
      title: "Ticket Type",
      dataIndex: "name",
      key: "name",
      filters: ticketTypeFilters,
      onFilter: (value: string | number | boolean, record: TicketTypeSalesRow) =>
        record.name === value,
      sorter: (a: TicketTypeSalesRow, b: TicketTypeSalesRow) => a.name.localeCompare(b.name),
    },
    {
      title: "Ticket Sold",
      dataIndex: "ticketsSold",
      key: "ticketsSold",
      sorter: (a: TicketTypeSalesRow, b: TicketTypeSalesRow) => a.ticketsSold - b.ticketsSold,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      sorter: (a: TicketTypeSalesRow, b: TicketTypeSalesRow) => a.revenue - b.revenue,
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Reports" />
      <ReportFilters
        events={events}
        filters={filters}
        setFilters={setFilters}
        onFilter={getReports}
      />

      <div className="q-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="q-stagger-item" style={{ ['--q-delay' as '--q-delay']: '0ms' } as CSSProperties}>
          <ReportCard
            title="Total Booking"
            description="Total number of booking made by users"
            value={reports.totalBooking}
            isAmountProperty={false}
          />
        </div>

        <div className="q-stagger-item" style={{ ['--q-delay' as '--q-delay']: '60ms' } as CSSProperties}>
          <ReportCard
            title="Cancelled Booking"
            description="Total number of cancelled booking by users"
            value={reports.cancelledBooking}
            isAmountProperty={false}
          />
        </div>

        <div className="q-stagger-item" style={{ ['--q-delay' as '--q-delay']: '120ms' } as CSSProperties}>
          <ReportCard
            title="Total Revenue"
            description="Total number generated from all bookings"
            value={reports.totalRevenueCollected}
            isAmountProperty={true}
          />
        </div>

        <div className="q-stagger-item" style={{ ['--q-delay' as '--q-delay']: '180ms' } as CSSProperties}>
          <ReportCard
            title="Total Amount Refunded"
            description="Total amount refunded for cancelled bookings"
            value={reports.totalRevenueRefunded}
            isAmountProperty={true}
          />
        </div>

        <div className="q-stagger-item" style={{ ['--q-delay' as '--q-delay']: '240ms' } as CSSProperties}>
          <ReportCard
            title="Tickets Sold"
            description="Total number of tickets sold for events"
            value={reports.totalTickets}
            isAmountProperty={false}
          />
        </div>

        <div className="q-stagger-item" style={{ ['--q-delay' as '--q-delay']: '300ms' } as CSSProperties}>
          <ReportCard
            title="Tickets Cancelled"
            description="Total number of tickets cancelled for all events"
            value={reports.cancelledTickets}
            isAmountProperty={false}
          />
        </div>
      </div>

      {reports.ticketTypesAndThierSales && (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-[var(--text)]">
              Ticket Sales By Event
            </h2>
            <div className="text-xs text-[var(--muted)]">
              Breakdown by ticket type
            </div>
          </div>

          <div className="q-card overflow-x-auto">
            <Table
              columns={ticketTypeColumns}
              dataSource={ticketTypes}
              pagination={{ pageSize: 10 }}
              scroll={{ x: "max-content" }}
              rowKey={(record) => `${record.name}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReport;
