import axios from "axios";

export const getAdminReport = async (data: any) => {
  const response = await axios.post("/api/reports/get-admin-reports", data);
  return response.data;
};

export const getUserReport = async () => {
  const response = await axios.get("/api/reports/get-user-reports");
  return response.data;
};
