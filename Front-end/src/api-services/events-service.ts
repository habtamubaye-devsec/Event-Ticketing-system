import axios from "axios";
import api from "./api";

export const createEvent = async (data: any) => {
  try {
    const response = await api.post("/events/create-event", data);
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
  const response = await api.get(
    `/events/get-event?searchText=${filters.searchText}&date=${filters.date}`
  );
  return response.data; 
}
 // get events for report filter
export const getEventsFilters = async (filters: any) => {
  const response = await api.get("/events/get-event", {
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
  const response = await api.get(`/events/get-event/${id}`);
  return response.data;
}

export const updateEvent = async ( data: any, id: string) => {
  const response = await api.put(`/events/update-event/${id}`, data);
  return response.data;
}

export const deleteEvents = async (data: any, id: string) => {
  const response = await api.delete(`/events/delete-event/${id}`, { data });
  return response.data;
}