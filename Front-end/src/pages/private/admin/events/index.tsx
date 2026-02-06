import PageTitle from "../../../../components/pageTitle";
import { Button, message, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteEvents, getEvents } from "../../../../api-services/events-service";
import { getDateTimeFormat } from "../../../../helper";
import { Pen, Trash } from "lucide-react";
import type { EventType } from "../../../../interface";

function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getEvents({ searchText: "", date: "" });
      setEvents(response.data);
    } catch {
      message.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const deleteEventHandler = async (id: string) => {
    try {
      setLoading(true);
      await deleteEvents({}, id);
      message.success("Event Deleted Successfully");
      getData();
    } catch {
      message.error("Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const statusFilters = [
    { text: "Booked", value: "booked" },
    { text: "Cancelled", value: "cancelled" },
  ];

  const columns = [
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: EventType, b: EventType) => a.name.localeCompare(b.name),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (date: unknown, row: EventType) => {
        const dateStr = typeof date === "string" ? date : "";
        return getDateTimeFormat(`${dateStr} ${row.time}`);
      },
      key: "date",
      sorter: (a: EventType, b: EventType) => {
        const aTime = new Date(`${a.date} ${a.time}`).getTime();
        const bTime = new Date(`${b.date} ${b.time}`).getTime();
        return aTime - bTime;
      },
    },
    {
      title: "Organizer",
      dataIndex: "organizer",
      key: "organizer",
      responsive: ["md"],
      sorter: (a: EventType, b: EventType) => a.organizer.localeCompare(b.organizer),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (date: unknown) => getDateTimeFormat(typeof date === "string" ? date : ""),
      responsive: ["lg"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: statusFilters,
      onFilter: (value: string | number | boolean, record: EventType) =>
        record.status === value,
      sorter: (a: EventType, b: EventType) =>
        (a.status ?? "").localeCompare(b.status ?? ""),
      responsive: ["md"],
      render: (status: string | undefined) => {
        const normalized = status ? status.toUpperCase() : "UNKNOWN";
        const color = status === "cancelled" ? "error" : "success";
        return <Tag color={color}>{normalized}</Tag>;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_text: unknown, record: EventType) => (
        <div className="flex items-center gap-1">
          <Button
            type="text"
            danger
            aria-label="Delete event"
            icon={<Trash size={16} />}
            onClick={() => deleteEventHandler(record._id)}
          />
          <Button
            type="text"
            aria-label="Edit event"
            icon={<Pen size={16} />}
            onClick={() => navigate(`/admin/events/edit/${record._id}`)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageTitle title="Events" />
        <Button type="primary" onClick={() => navigate("/admin/events/create")}>
          Create Events
        </Button>
      </div>

      <div className="q-card overflow-x-auto">
        <Table
          dataSource={events}
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

export default EventsPage;
