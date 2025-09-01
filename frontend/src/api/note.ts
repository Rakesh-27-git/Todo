import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/notes", // your backend URL
  withCredentials: true, // so cookies (JWT tokens) are included
});

export const createNote = async (data: { content: string }) => {
  const response = await API.post("/create", data);
  return response.data;
};

export const getNotes = async () => {
  const response = await API.get("/");
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};
