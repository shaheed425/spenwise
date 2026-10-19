import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "production"
    ? "https://spenwiseback.onrender.com"
    : "http://localhost:5000");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/* ================= TOKEN HANDLING ================= */
export const setauthtoken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

/* ================= AUTH ================= */
export const loginUser = async (data) => {
  const res = await api.post("/api/users/login", data);
  return res.data;
};

export const registerUser = async (data) => {
  const res = await api.post("/api/users/register", data);
  return res.data;
};

export const verifyOtp = async (data) => {
  const res = await api.post("/api/users/verify-otp", data);
  return res.data;
};

/* ================= PASSWORD RESET (TOKEN BASED) ================= */

export const requestPasswordReset = async (email) => {
  const res = await api.post("/api/users/forgot-password", { email });
  return res.data;
};

// export const resetPassword = async (token, password) => {
//   const res = await api.post(`/api/users/reset-password/${token}`, {
//     password,
//   });
//   return res.data;
// };

/* ================= EXPENSES ================= */
export const addExpense = async (data) => {
  const res = await api.post("/api/expenses", data);
  return res.data;
};

export const getExpenses = async () => {
  const res = await api.get("/api/expenses");
  return res.data;
};

export const deleteExpenseAPI = async (id) => {
  const res = await api.delete(`/api/expenses/${id}`);
  return res.data;
};

export const updateExpenseAPI = async (id, data) => {
  const res = await api.put(`/api/expenses/${id}`, data);
  return res.data;
};

/* ================= INCOME ================= */
export const addincome = async (data, id) => {
  const res = await api.post(`/api/income/addIncome/${id}`, data);
  return res.data;
};

export const getIncome = async (id) => {
  const res = await api.get(`/api/income/getbyid/${id}`);
  return res.data;
};

export const deleteIncomeAPI = async (id) => {
  const res = await api.delete(`/api/income/${id}`);
  return res.data;
};

export const updateIncomeAPI = async (id, data) => {
  const res = await api.put(`/api/income/${id}`, data);
  return res.data;
};

/* ================= REPORT ================= */
export const getMonthlyReport = async (month) => {
  const res = await api.get(`/api/reports/monthly?month=${month}`);
  return res.data;
};

/* ================= ADMIN ================= */
export const getAdminDashboard = async () => {
  const res = await api.get("/api/admin/dashboard");
  return res.data;
};

export const resetPassword = async (otp, password) => {
  const res = await api.post(`/api/users/reset-password/${otp}`, {
    password,
  });
  return res.data;
};

export default api;