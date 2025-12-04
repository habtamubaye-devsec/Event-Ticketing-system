import { useEffect, useState } from "react";
import PageTitle from "../../../../../components/pageTitle";
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
    return <Spin tip="Loading event data..." />;
  }

  return (
    <div className="px-2 ">
      <PageTitle title="Edit Event" />
      <div className="mt-10">
        <EventForm initialData={eventData} type="edit" />
      </div>
    </div>
  );
}

export default EditEventsPage;
