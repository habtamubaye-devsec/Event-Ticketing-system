import axios from "axios";

export const createEvent = async (data: any) => {
  try {
    const response = await axios.post("/api/events/create-event", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error response:", error.response);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
 
export const getEvents = async ( filters: any) => {
  const response = await axios.get(`/api/events/get-event?searchText=${filters.searchText}&date=${filters.date}`);
  return response.data; 
}
 // get events for report filter
export const getEventsFilters = async (filters: any) => {
  const response = await axios.get("/api/events/get-event", {
    params: {
      searchText: filters.searchText || "",
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
      eventId: filters.eventId || "",
    },
  });
  return response.data;
};

export const getEventsById = async ( id: string) => {
  const response = await axios.get(`/api/events/get-event/${id}`);
  return response.data;
}

export const updateEvent = async ( data: any, id: string) => {
  const response = await axios.put(`/api/events/update-event/${id}`, data);
  return response.data;
}

export const deleteEvents = async (data: any, id: string) => {
  const response = await axios.delete(`/api/events/delete-event/${id}`, data);
  return response.data;
}