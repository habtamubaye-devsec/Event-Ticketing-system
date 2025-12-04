import { useEffect, useState } from "react";
import PageTitle from "../../../../components/pageTitle";
import ReportFilters from "./filters";
import { message, Table } from "antd";
import { getEventsFilters } from "../../../../api-services/events-service";
import type { EventType } from "../../../../interface";
import { getAdminReport } from "../../../../api-services/report-service";
import ReportCard from "./reportCard";

function AdminReport() {
  const [reports, setReports] = useState<any>([]);
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
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getEventData = async () => {
    try {
      const response = await getEventsFilters({ searchText: "", date: "" });
      setEvents(response.data);
    } catch (error: any) {
      message.error(error.message);
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

  const ticketTypeColumns = [
    {
      title: "Ticket Type",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ticket Sold",
      dataIndex: "ticketsSold",
      key: "ticketsSold",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
    },
  ];

  return (
    <div>
      <PageTitle title="Reports" />
      <ReportFilters
        events={events}
        filters={filters}
        setFilters={setFilters}
        onFilter={getReports}
      />

      <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ReportCard
          title="Total Booking"
          description="Total number of booking made by users"
          value={reports.totalBooking}
          isAmountProperty={false}
        />

        <ReportCard
          title="Cancelled Booking"
          description="Total number of cancelled booking by users"
          value={reports.cancelledBooking}
          isAmountProperty={false}
        />

        <ReportCard
          title="Total Revenue"
          description="Total number generated from all bookings"
          value={reports.totalRevenueCollected}
          isAmountProperty={true}
        />

        <ReportCard
          title="Total Amount Refunded"
          description="Total amount refunded for cancelled bookings"
          value={reports.totalRevenueRefunded}
          isAmountProperty={true}
        />

        <ReportCard
          title="Tickets Sold"
          description="Total number of tickets sold for events"
          value={reports.totalTickets}
          isAmountProperty={false}
        />

        <ReportCard
          title="Tickets Cancelled"
          description="Total number of tickets cancelled for all events"
          value={reports.cancelledTickets}
          isAmountProperty={false}
        />
      </div>

      {reports.ticketTypesAndThierSales && (
        <div className="mt-7 flex flex-col gap-5">
          <h1 className="text-red-600 text-sm font-bold col-span-4">
            Ticket Sales By Events
          </h1>
          <Table
            columns={ticketTypeColumns}
            dataSource={reports.ticketTypesAndThierSales}
          />
        </div>
      )}
    </div>
  );
}

export default AdminReport;
