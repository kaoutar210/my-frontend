import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Accept: "application/json",
  },
});

/* ================= TOKEN ================= */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ IMPORTANT: gérer FormData automatiquement
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

/* ================= AUTO LOGOUT ================= */
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const tpService = {

  // GET ALL TPs
  getAllTPs: async (category = "") => {

    const url = category
      ? `/admin/tp?category=${category}`
      : "/admin/tp";

    const response = await API.get(url);

    return response.data;
  },

  // GET ONE TP
getOneTP: async (id) => {
  const response = await API.get(`/admin/tp/${id}`);
  return response.data;
},

  // START TP
  startTP: async (id) => {
    return true;
  }
};
export default API;