import axios from "axios";

const api = axios.create({
  baseURL: "https://127.0.0.1:3000",
});

export function getToken() {
  return localStorage.getItem("token");
}
export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      setToken(null);
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(err);
  }
);

export default api;

export const AuthAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
};

export const ContactsAPI = {
  list: (params) => api.get("/api/contacts", { params }),
  create: (data) => api.post("/api/contacts", data),
  get: (id) => api.get(`/api/contacts/${id}`),
  update: (id, data) => api.put(`/api/contacts/${id}`, data),
  remove: (id) => api.delete(`/api/contacts/${id}`),
};
