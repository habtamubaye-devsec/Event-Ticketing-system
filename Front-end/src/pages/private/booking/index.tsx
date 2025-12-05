import { useEffect, useState } from "react";
import PageTitle from "../../../components/pageTitle";
import type { BookingType } from "../../../interface";
import { message, Table } from "antd";
import {
  cancelBookings,
  // deleteBookings,
  getUserBooking,
} from "../../../api-services/booking-service";
import { getDateTimeFormat } from "../../../helper";
// import { Trash } from "lucide-react";

function UserBooking() {
  const [bookings, setBooking] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getUserBooking();
      setBooking(response.data);
    } catch (error: any) {
      message.error(error.message);
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
    } catch (error: any) {
      message.error(error.message);
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

  const columns = [
    {
      title: "Event Name",
      dataIndex: "event",
      key: "event",
      render: (event: any) => event.name,
    },
    {
      title: "Date and Time",
      dataIndex: "event",
      key: "event",
      render: (event: any) => getDateTimeFormat(`${event.date} ${event.time}`),
    },
    {
      title: "Ticket Type",
      dataIndex: "ticketType",
      key: "ticketType",
    },
    {
      title: "Ticket Count",
      dataIndex: "ticketCount",
      key: "ticketCount",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => status.toUpperCase(),
    },
    {
      title: "Booked ON",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => getDateTimeFormat(createdAt),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: BookingType) => {
        return record.status === "booked" ? (
          <span
            onClick={() => handleCancel(record._id)}
            className="text-red-500 cursor-pointer text-sm underline"
          >
            Cancel
          </span>
        ) : <span className="text-gray-600">Canceled</span>
        
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
    <div>
      <PageTitle title="Bookings" />

      <Table
        dataSource={bookings}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />
    </div>
  );
}

export default UserBooking;
