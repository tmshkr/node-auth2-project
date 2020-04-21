import axios from "axios";
export default function () {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
