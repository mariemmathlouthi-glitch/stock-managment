import { useCallback, useEffect, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useMaterialUIController } from "context";
import { getBrand } from "assets/theme/base/brand";
import { formatCurrency, useCurrency } from "utils/currency";
import { createProduct, fetchProducts } from "api/products";
import {
  cancelPurchaseOrder,
  createPurchaseOrder,
  createSupplier,
  getPurchaseOrders,
  getSuppliers,
  receivePurchaseOrder,
} from "api/purchaseOrders";

const statusLabel = {
  draft: "Brouillon",
  pending: "En attente",
  confirmed: "Confirmée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

function Billing() {
  const [controller] = useMaterialUIController();
  const currency = useCurrency();
  const formatPrice = (value) => formatCurrency(value, currency);
  const brand = getBrand(controller.darkMode);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [status, setStatus] = useState("draft");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
  const [deliveryDate, setDeliveryDate] = useState("");
  const [query, setQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const [requestedUnitPrice, setRequestedUnitPrice] = useState(0);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({ name: "", category: "", price: "" });
  const [notice, setNotice] = useState(null);
  const [supplierForm, setSupplierForm] = useState({ name: "", contact: "", email: "", phone: "" });
  const load = useCallback(async () => {
    try {
      const [p, s, o] = await Promise.all([fetchProducts(), getSuppliers(), getPurchaseOrders()]);
      setProducts(p.products || []);
      setSuppliers(s.suppliers || []);
      setOrders(o.orders || []);
    } catch (e) {
      setNotice({ severity: "error", message: e.message });
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const availableProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          (p.category || "").toLowerCase().includes(query.toLowerCase()) ||
          p._id.toLowerCase().includes(query.toLowerCase())
      ),
    [products, query]
  );
  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const createAndSelectProduct = () => {
    const price = Number(productForm.price);
    if (
      !productForm.name.trim() ||
      !productForm.category.trim() ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setNotice({
        severity: "error",
        message: "Renseignez le nom, la catégorie et un prix valide pour le nouveau produit.",
      });
      return;
    }
    const product = {
      _id: `new-${Date.now()}`,
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      price,
      isNewProduct: true,
    };
    setProducts((current) => [product, ...current]);
    setSelectedProductId(product._id);
    setRequestedUnitPrice(price);
    setQuery("");
    setProductForm({ name: "", category: "", price: "" });
    setShowProductForm(false);
    setNotice({
      severity: "success",
      message:
        "Nouveau produit ajouté à cette commande. Il ne sera mis en stock qu’à la livraison.",
    });
  };
  const addItem = (product, quantity = 1, unitPrice = product.price || 0) =>
    setItems((current) => {
      if (current.some((item) => item.lineId === product._id)) {
        return current.map((item) =>
          item.lineId === product._id
            ? { ...item, quantity: item.quantity + quantity, unitPrice }
            : item
        );
      }
      setNotice({ severity: "success", message: "Produit ajouté à la commande avec succès." });
      return [
        ...current,
        {
          lineId: product._id,
          ...(product.isNewProduct
            ? { isNewProduct: true, category: product.category }
            : { product: product._id }),
          name: product.name,
          reference: product.reference || product._id.slice(-6).toUpperCase(),
          quantity,
          unitPrice,
          currency: product.currency || currency,
        },
      ];
    });
  const addSelectedProduct = () => {
    const product = products.find((item) => item._id === selectedProductId);
    const quantity = Number(requestedQuantity);
    const unitPrice = Number(requestedUnitPrice);
    if (!product)
      return setNotice({ severity: "error", message: "Sélectionnez un produit existant." });
    if (!Number.isInteger(quantity) || quantity < 1)
      return setNotice({
        severity: "error",
        message: "La quantité doit être au moins égale à 1.",
      });
    if (!Number.isFinite(unitPrice) || unitPrice < 0)
      return setNotice({
        severity: "error",
        message: "Le prix unitaire doit être positif ou nul.",
      });
    addItem(product, quantity, unitPrice);
    setSelectedProductId("");
    setRequestedQuantity(1);
    setRequestedUnitPrice(0);
  };
  const updateItem = (id, field, value) =>
    setItems((current) =>
      current.map((item) =>
        item.lineId === id
          ? {
              ...item,
              [field]: Math.max(field === "quantity" ? 1 : 0, Number(value) || 0),
            }
          : item
      )
    );
  const submit = async () => {
    if (!supplier || !items.length) {
      setNotice({
        severity: "error",
        message: "Sélectionnez un fournisseur et ajoutez au moins un produit.",
      });
      return;
    }
    try {
      const formattedItems = items.map(({ lineId, ...item }) => {
        if (item.isNewProduct || !item.product) {
          const { product, ...cleanItem } = item;
          return { ...cleanItem, isNewProduct: true };
        }
        return item;
      });
      const orderPayload = {
        supplier,
        items: formattedItems,
        orderDate,
        expectedDeliveryDate: deliveryDate,
        status,
      };
      let result;
      try {
        result = await createPurchaseOrder(orderPayload);
      } catch (error) {
        const requiresProduct = /items\.\d+\.product.*required/i.test(error.message);
        const hasNewProducts = formattedItems.some((item) => item.isNewProduct);
        if (!requiresProduct || !hasNewProducts) throw error;

        const itemsWithProducts = await Promise.all(
          formattedItems.map(async (item) => {
            if (!item.isNewProduct) return item;
            const created = await createProduct({
              name: item.name,
              category: item.category,
              quantity: 0,
              price: item.unitPrice,
              currency,
            });
            const { isNewProduct, ...existingItem } = item;
            return { ...existingItem, product: created.product._id };
          })
        );
        result = await createPurchaseOrder({ ...orderPayload, items: itemsWithProducts });
      }
      if (!result.order?._id) throw new Error("La commande n'a pas pu être enregistrée.");
      setItems([]);
      setSupplier("");
      await load();
      setNotice({ severity: "success", message: `Commande ${result.order.number} créée.` });
    } catch (e) {
      setNotice({ severity: "error", message: e.message });
    }
  };
  const cancel = async (id) => {
    try {
      await cancelPurchaseOrder(id);
      setOrders((current) =>
        current.map((order) => (order._id === id ? { ...order, status: "cancelled" } : order))
      );
    } catch (e) {
      setNotice({ severity: "error", message: e.message });
    }
  };
  const receive = async (id) => {
    try {
      const result = await receivePurchaseOrder(id);
      setOrders((current) =>
        current.map((order) => (order._id === id ? { ...order, ...result.order } : order))
      );
      setNotice({ severity: "success", message: "Commande réceptionnée : le stock a été mis à jour." });
    } catch (e) {
      setNotice({ severity: "error", message: e.message });
    }
  };
  const addSupplier = async () => {
    if (!supplierForm.name.trim())
      return setNotice({ severity: "error", message: "Le nom du fournisseur est requis." });
    try {
      const result = await createSupplier(supplierForm);
      if (!result.supplier?._id)
        throw new Error("Le fournisseur n'a pas pu être enregistré.");
      setSuppliers((current) => [...current, result.supplier]);
      setSupplier(result.supplier._id);
      setSupplierForm({ name: "", contact: "", email: "", phone: "" });
      setNotice({ severity: "success", message: "Fournisseur ajouté avec succès." });
    } catch (e) {
      setNotice({ severity: "error", message: e.message });
    }
  };
  const card = {
    borderRadius: "16px",
    background: brand.cardBg,
    boxShadow: brand.shadowCard,
    border: `1px solid ${brand.inputBorder}`,
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MDBox>
            <MDTypography variant="h3" fontWeight="bold" sx={{ color: brand.textPrimary }}>
              Commandes fournisseur
            </MDTypography>
            <MDTypography variant="button" sx={{ color: brand.textSecondary }}>
              Créez, préparez et suivez vos réapprovisionnements.
            </MDTypography>
          </MDBox>
        </MDBox>
        <Grid container spacing={3} mb={3}>
          {[
            ["receipt_long", "Produits sélectionnés", items.length],
            ["inventory_2", "Quantité totale", totalQuantity],
            ["payments", "Montant total", formatPrice(total)],
          ].map(([icon, label, value]) => (
            <Grid item xs={12} sm={4} key={label}>
              <Card sx={{ ...card, p: 2.5 }}>
                <MDBox display="flex" justifyContent="space-between">
                  <MDBox>
                    <MDTypography variant="button" sx={{ color: brand.textSecondary }}>
                      {label}
                    </MDTypography>
                    <MDTypography variant="h4" sx={{ color: brand.textPrimary }}>
                      {value}
                    </MDTypography>
                  </MDBox>
                  <Icon sx={{ color: brand.accent }}>{icon}</Icon>
                </MDBox>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ ...card, p: 3 }}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <MDTypography variant="h6">Produits à commander</MDTypography>
                <MDBox display="flex" gap={1} alignItems="center">
                  <MDInput
                    placeholder="Rechercher un produit"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <MDButton
                    color="info"
                    variant="outlined"
                    size="small"
                    onClick={() => setQuery("")}
                  >
                    <Icon>clear</Icon>&nbsp;Effacer
                  </MDButton>
                  <MDButton
                    color="info"
                    variant="text"
                    size="small"
                    onClick={() => setShowProductForm((open) => !open)}
                  >
                    <Icon>add_circle_outline</Icon>&nbsp;Nouveau produit
                  </MDButton>
                </MDBox>
              </MDBox>
              <MDTypography
                variant="caption"
                display="block"
                mb={1}
                sx={{ color: brand.textSecondary }}
              >
                Sélectionnez un produit, renseignez la quantité et le prix, puis ajoutez-le à la
                commande.
              </MDTypography>
              {showProductForm && (
                <MDBox
                  p={2}
                  mb={2}
                  borderRadius="lg"
                  sx={{ backgroundColor: brand.inputBg, border: `1px solid ${brand.inputBorder}` }}
                >
                  <MDTypography variant="button" display="block" mb={1}>
                    Nouveau produit à commander
                  </MDTypography>
                  <MDTypography
                    variant="caption"
                    display="block"
                    mb={1.5}
                    sx={{ color: brand.textSecondary }}
                  >
                    Ce produit sera ajouté à cette commande, pas au stock. Il sera créé dans le
                    stock à la livraison.
                  </MDTypography>
                  <Grid container spacing={1.5} alignItems="flex-end">
                    <Grid item xs={12} md={4}>
                      <MDInput
                        fullWidth
                        label="Nom du produit *"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <MDInput
                        fullWidth
                        label="Catégorie *"
                        value={productForm.category}
                        onChange={(e) =>
                          setProductForm({ ...productForm, category: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <MDInput
                        fullWidth
                        type="number"
                        label="Prix unitaire *"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        inputProps={{ min: 0, step: "0.01" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <MDButton
                        fullWidth
                        color="info"
                        variant="gradient"
                        onClick={createAndSelectProduct}
                      >
                        Ajouter
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
              )}
              <Grid container spacing={1.5} alignItems="flex-end" mb={2}>
                <Grid item xs={12} md={6}>
                  <MDTypography variant="caption" display="block" mb={0.5}>
                    Produit
                  </MDTypography>
                  <Select
                    fullWidth
                    value={selectedProductId}
                    onChange={(e) => {
                      const product = products.find((item) => item._id === e.target.value);
                      setSelectedProductId(e.target.value);
                      setRequestedUnitPrice(product?.price ?? 0);
                    }}
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value="" disabled>
                      Sélectionner un produit
                    </MenuItem>
                    {!availableProducts.length && (
                      <MenuItem disabled>Aucun produit disponible</MenuItem>
                    )}
                    {availableProducts.map((product) => (
                      <MenuItem key={product._id} value={product._id}>
                        {product.name} — {product._id.slice(-6).toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={6} md={2}>
                  <MDInput
                    fullWidth
                    type="number"
                    label="Quantité"
                    value={requestedQuantity}
                    onChange={(e) => setRequestedQuantity(e.target.value)}
                    inputProps={{ min: 1, step: 1 }}
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <MDInput
                    fullWidth
                    type="number"
                    label="Prix unitaire"
                    value={requestedUnitPrice}
                    onChange={(e) => setRequestedUnitPrice(e.target.value)}
                    inputProps={{ min: 0, step: "0.01" }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <MDButton fullWidth color="info" variant="gradient" onClick={addSelectedProduct}>
                    <Icon>add</Icon>&nbsp;Ajouter
                  </MDButton>
                </Grid>
              </Grid>
              <TableContainer sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {["Produit", "Référence", "Quantité", "Prix unitaire", "Total", ""].map(
                        (head) => (
                          <TableCell key={head}>{head}</TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!items.length && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <MDTypography variant="button" sx={{ color: brand.textSecondary }}>
                            Aucun produit dans cette commande. Sélectionnez-en un ci-dessus.
                          </MDTypography>
                        </TableCell>
                      </TableRow>
                    )}
                    {items.map((item) => (
                      <TableRow key={item.lineId}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.reference}</TableCell>
                        <TableCell>
                          <MDInput
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.lineId, "quantity", e.target.value)}
                            inputProps={{ min: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <MDInput
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.lineId, "unitPrice", e.target.value)}
                            inputProps={{ min: 0, step: "0.01" }}
                          />
                        </TableCell>
                        <TableCell>{formatPrice(item.quantity * item.unitPrice)}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              setItems((current) =>
                                current.filter((line) => line.lineId !== item.lineId)
                              )
                            }
                          >
                            <Icon color="error">delete_outline</Icon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ ...card, p: 3 }}>
              <MDTypography variant="h6" mb={2}>
                Créer la commande
              </MDTypography>
              <MDTypography variant="button" sx={{ color: brand.textSecondary }}>
                Fournisseur
              </MDTypography>
              <Select
                fullWidth
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                displayEmpty
                sx={{ mt: 0.5, mb: 2 }}
              >
                <MenuItem value="" disabled>
                  Sélectionner un fournisseur
                </MenuItem>
                {suppliers.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.name} — {s.contact || s.email || s.phone || "Sans contact"}
                  </MenuItem>
                ))}
              </Select>
              <MDTypography
                variant="button"
                sx={{ color: brand.textSecondary }}
                display="block"
                mb={0.5}
              >
                Statut de la commande
              </MDTypography>
              <Select
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ mb: 2 }}
              >
                {Object.entries(statusLabel).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              {!suppliers.length && (
                <MDTypography variant="caption" color="error" display="block" mb={2}>
                  Aucun fournisseur disponible. Ajoutez-en via l’API fournisseurs.
                </MDTypography>
              )}
              <MDBox sx={{ borderTop: `1px solid ${brand.inputBorder}` }} my={2.5} />
              <MDTypography variant="h6" display="block" mb={0.5}>
                Ajouter un fournisseur
              </MDTypography>
              <MDTypography
                variant="caption"
                display="block"
                mb={1.5}
                sx={{ color: brand.textSecondary }}
              >
                Seul le nom du fournisseur est obligatoire.
              </MDTypography>
              <MDTypography variant="caption" display="block" mb={0.5}>
                Nom du fournisseur *
              </MDTypography>
              <MDInput
                fullWidth
                placeholder="Ex. : Société Dupont"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                inputProps={{ required: true }}
                sx={{ mb: 1 }}
              />
              <MDTypography variant="caption" display="block" mb={0.5}>
                Contact <span style={{ color: brand.textSecondary }}>(optionnel)</span>
              </MDTypography>
              <MDInput
                fullWidth
                placeholder="Contact"
                value={supplierForm.contact}
                onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                sx={{ mb: 1 }}
              />
              <MDTypography variant="caption" display="block" mb={0.5}>
                E-mail <span style={{ color: brand.textSecondary }}>(optionnel)</span>
              </MDTypography>
              <MDInput
                fullWidth
                type="email"
                placeholder="E-mail"
                value={supplierForm.email}
                onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                sx={{ mb: 1 }}
              />
              <MDTypography variant="caption" display="block" mb={0.5}>
                Téléphone <span style={{ color: brand.textSecondary }}>(optionnel)</span>
              </MDTypography>
              <MDInput
                fullWidth
                type="tel"
                placeholder="Téléphone"
                value={supplierForm.phone}
                onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                sx={{ mb: 1 }}
              />
              <MDButton
                color="info"
                variant="outlined"
                fullWidth
                onClick={addSupplier}
                sx={{ mb: 2 }}
              >
                <Icon>person_add</Icon>&nbsp;Ajouter le fournisseur
              </MDButton>
              <MDTypography variant="caption" display="block" mb={0.5}>
                Date de commande
              </MDTypography>
              <MDInput
                fullWidth
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                sx={{ mb: 1.5 }}
              />
              <MDTypography variant="caption" display="block" mb={0.5}>
                Livraison prévue <span style={{ color: brand.textSecondary }}>(optionnel)</span>
              </MDTypography>
              <MDInput
                fullWidth
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
              <MDBox mt={3} p={2} borderRadius="lg" sx={{ backgroundColor: brand.inputBg }}>
                <MDTypography variant="button">Résumé</MDTypography>
                <MDTypography variant="h5" sx={{ color: brand.accent }}>
                  {formatPrice(total)}
                </MDTypography>
              </MDBox>
              <MDButton fullWidth color="info" variant="gradient" onClick={submit} sx={{ mt: 2 }}>
                <Icon>check</Icon>&nbsp;Enregistrer la commande
              </MDButton>
            </Card>
          </Grid>
        </Grid>
        <Card sx={{ ...card, p: 3, mt: 3 }}>
          <MDTypography variant="h6" mb={2}>
            Commandes récentes
          </MDTypography>
          <Table>
            <TableHead>
              <TableRow>
                {["N° commande", "Fournisseur", "Date", "Statut", "Montant", "Action"].map(
                  (head) => (
                    <TableCell key={head}>{head}</TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.number}</TableCell>
                  <TableCell>{order.supplier?.name || "—"}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{statusLabel[order.status]}</TableCell>
                  <TableCell>
                    {formatPrice(
                      order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                    )}
                  </TableCell>
                  <TableCell>
                    {!["cancelled", "delivered"].includes(order.status) && (
                      <MDButton
                        color="error"
                        variant="text"
                        size="small"
                        onClick={() => cancel(order._id)}
                      >
                        Annuler
                      </MDButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <Snackbar
          open={Boolean(notice)}
          autoHideDuration={4000}
          onClose={() => setNotice(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            top: { xs: 88, sm: 96 },
            zIndex: (theme) => theme.zIndex.modal + 1,
          }}
        >
          <Alert
            severity={notice?.severity}
            variant="filled"
            onClose={() => setNotice(null)}
            sx={{ boxShadow: 6 }}
          >
            {notice?.message}
          </Alert>
        </Snackbar>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
export default Billing;
