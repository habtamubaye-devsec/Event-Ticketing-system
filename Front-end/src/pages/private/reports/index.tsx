import { useEffect, useState } from "react";
import PageTitle from "../../../components/pageTitle";
import { getUserReport } from "../../../api-services/report-service";
import { message } from "antd";
import ReportCard from "../admin/reports/reportCard";

function UserReportPage() {
  const [reports, setReports] = useState<any>([]);

  const getReports = async () => {
    try {
      const response = await getUserReport();
      setReports(response.data);
      console.log(reports);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getReports();
  }, []);
  return (
    <div>
      <PageTitle title="User Reports" />

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
          value={reports.totalAmountSpent}
          isAmountProperty={true}
        />

        <ReportCard
          title="Total Amount Refunded"
          description="Total amount refunded for cancelled bookings"
          value={reports.totalAmountReceivedAsRefund}
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
    </div>
  );
}

export default UserReportPage;
