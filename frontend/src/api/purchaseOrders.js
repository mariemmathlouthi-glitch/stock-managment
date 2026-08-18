const API_BASE = process.env.REACT_APP_API_URL || "";

const headers = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
const request = async (url, options = {}) => {
  const response = await fetch(`${API_BASE}${url}`, { headers: headers(), ...options });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : {};
  if (!response.ok) {
    throw new Error(
      data.message ||
        "Le service des fournisseurs/commandes n’est pas disponible. Redémarrez le serveur backend."
    );
  }
  return data;
};
export const getSuppliers = () => request("/api/suppliers");
export const createSupplier = (supplier) =>
  request("/api/suppliers", { method: "POST", body: JSON.stringify(supplier) });
export const getPurchaseOrders = () => request("/api/purchase-orders");
export const createPurchaseOrder = (order) =>
  request("/api/purchase-orders", { method: "POST", body: JSON.stringify(order) });
export const receivePurchaseOrder = (id) =>
  request(`/api/purchase-orders/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status: "delivered" }),
  });
export const cancelPurchaseOrder = (id) =>
  request(`/api/purchase-orders/${id}/cancel`, { method: "PATCH" });
