import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
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
  register: (payload) => api.post("/api/auth/register", payload),
  login: (payload) => api.post("/api/auth/login", payload),
};

export const ContactsAPI = {
  list: (params) => api.get("/api/contacts", { params }),
  create: (payload) => api.post("/api/contacts", payload),
  get: (id) => api.get(`/api/contacts/${id}`),
  update: (id, payload) => api.put(`/api/contacts/${id}`, payload),
  remove: (id) => api.delete(`/api/contacts/${id}`),
};
