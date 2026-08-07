const API_BASE = process.env.REACT_APP_API_URL || "";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchDashboardOverview() {
  const response = await fetch(`${API_BASE}/api/dashboard/overview`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erreur lors de la récupération du dashboard.");
  }

  return response.json();
}
