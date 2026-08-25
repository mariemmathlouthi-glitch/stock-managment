const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Session expirée ou token manquant. Veuillez vous réauthentifier.");
    }
    if (response.status === 403) {
      throw new Error(
        "Accès refusé. Seul un utilisateur ayant le rôle Administrateur peut accéder à cette page."
      );
    }
    if (response.status === 404) {
      throw new Error("Route API introuvable (404). Vérifiez la configuration du serveur backend.");
    }
    throw new Error(data.message || `Erreur serveur (${response.status})`);
  }
  return data;
};

const makeFetchRequest = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const primaryUrl = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(primaryUrl, { ...options, headers });
    return await handleResponse(response);
  } catch (error) {
    // Si la requête vers API_BASE échoue (ex: erreur réseau), tenter le chemin relatif
    if (API_BASE && endpoint.startsWith("/api/")) {
      try {
        const response = await fetch(endpoint, { ...options, headers });
        return await handleResponse(response);
      } catch (fallbackError) {
        throw error;
      }
    }
    throw error;
  }
};

export async function fetchUsers() {
  return makeFetchRequest("/api/users");
}

export async function createUser(userData) {
  return makeFetchRequest("/api/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function updateUser(id, userData) {
  return makeFetchRequest(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

export async function toggleUserStatus(id) {
  return makeFetchRequest(`/api/users/${id}/toggle-status`, {
    method: "PATCH",
  });
}

export async function deleteUser(id) {
  return makeFetchRequest(`/api/users/${id}`, {
    method: "DELETE",
  });
}
