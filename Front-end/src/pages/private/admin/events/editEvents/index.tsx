import { useEffect, useState } from "react";
import EventForm from "../common/event-form";
import { getEventsById } from "../../../../../api-services/events-service";
import { useParams } from "react-router-dom";
import { message, Spin } from "antd";


function EditEventsPage() {
  const [eventData, setEventData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const params: any = useParams();

  const getData = async () => {
    try {
      setLoading(true);
      const response = await getEventsById(params.id);
      setEventData(response.data);
    } catch (error) {
      message.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="q-card p-6 sm:p-8 q-animate-in">
        <Spin tip="Loading event data..." />
      </div>
    );
  }

  return (
    <div className="px-2 space-y-6">
      <EventForm initialData={eventData} type="edit" />
    </div>
  );
}

export default EditEventsPage;
