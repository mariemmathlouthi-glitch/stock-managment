const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Si le token est invalide ou expiré, on déconnecte l'utilisateur
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("utilisateur");
      window.location.href = "/authentication/sign-in";
    }
    throw new Error(data.message || "Une erreur est survenue.");
  }
  return data;
};

export async function fetchProducts() {
  const response = await fetch(`${API_BASE}/api/products`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response);
}

export async function fetchProductById(id) {
  const response = await fetch(`${API_BASE}/api/products/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response);
}

export async function createProduct(productData) {
  const response = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return handleResponse(response);
}
