import api from "./api";

export const getAdminReport = async (data: any) => {
  const response = await api.post("/reports/get-admin-reports", data);
  return response.data;
};

export const getUserReport = async () => {
  const response = await api.get("/reports/get-user-reports");
  return response.data;
};
