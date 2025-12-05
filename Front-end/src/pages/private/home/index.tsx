import { message } from "antd";
import { useEffect, useState } from "react"
import { getCurrentUser } from "../../../api-services/users-service";
import { getEvents } from "../../../api-services/events-service";
import type { EventType } from "../../../interface";
import EventCard from "./common";
import Filters from "./common/filters";

function Home() {
  const [user, setUser] = useState<any>(null);
  const [ events, setEvents ] = useState<EventType[]>([]);
  const [ filters, setFilters ] = useState({
    searchText: "",
    date: "",
  });
  const [ loading, setLoading ] = useState(false);

  // const getData = async () => {
  //   try {
  //     const response = await getCurrentUser();
  //     const eventResponse = await getEvents()
  //     setUser(response.data);
  //     setEvents(eventResponse.data)
  //   } catch (error:any) {
  //     message.error(error.response.data.message || error.message);
  //     console.log(error.response.data.message || error.message);
  //   }
  // }

   const getData = async (filtersObj: any) => {
    try {
      setLoading(true)
      const response = await getEvents(filtersObj)
      setEvents(response.data)
    } catch (error:any) {
      message.error(error.response.data.message || error.message);
      console.log(error.response.data.message || error.message);
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getData({ searchText: "", date: "" })
  }, []);

  return (
    <div>
      {/* <h1>Homepage</h1>
      <p>Welcome, {user?.name}!</p> */}

      <Filters filters={filters} setFilters={setFilters} onFilter={getData}/>

      <div className="felx flex-col gap-7">
        {events.map((event:any) =>
        <EventCard key={event._id} event={event}/>
        )}
      </div>
    </div>
  )
}


export default Home