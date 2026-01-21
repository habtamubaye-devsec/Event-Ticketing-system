import api from "./api";

export const registerUser = async (data: any) => {
  try {
    const response = await api.post("/users/register", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data: any) => {
  try {
    const response = await api.post("/users/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/currentUser");
  return response.data;
};

export const getAllUser = async () => {
  const response = await api.get("/users/get-all-users");
  return response.data;
};

export const updateUserData = async (userId: string, data: any) => {
  const response = await api.put("/users/update-user-data", {
    userId,
    ...data,
  });
  return response.data;
};
