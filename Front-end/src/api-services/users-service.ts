import axios from "axios";

export const registerUser = async (data: any) => {
  try {
    const response = await axios.post("/api/users/register", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (data: any) => {
  try {
    const response = await axios.post("/api/users/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  const response = await axios.get("/api/users/currentUser");
  return response.data;
};

export const getAllUser = async () => {
  const response = await axios.get("/api/users/get-all-users");
  return response.data;
};

export const updateUserData = async (userId: string, data: any) => {
  const response = await axios.put("/api/users/update-user-data", {
    userId,
    ...data,
  });
  return response.data;
};
