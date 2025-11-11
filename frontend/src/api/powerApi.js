import axios from "axios";

const API_BASE = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const powerApi = {
  getStatus: async () => (await api.get("/status")).data,
  getSummary: async () => (await api.get("/summary")).data,
  getTrend: async (limit = 50) => (await api.get(`/trend?limit=${limit}`)).data,
  getStatistics: async () => (await api.get("/statistics")).data,
  getDistribution: async () => (await api.get("/distribution")).data,
  getCostEstimate: async () => (await api.get("/cost_estimate")).data,
};
