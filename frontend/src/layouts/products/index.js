import { useState, useEffect, useMemo, useCallback } from "react";

import Grid from "@mui/material/Grid";

import Card from "@mui/material/Card";

import Table from "@mui/material/Table";

import TableBody from "@mui/material/TableBody";

import TableCell from "@mui/material/TableCell";

import TableContainer from "@mui/material/TableContainer";

import TableHead from "@mui/material/TableHead";

import TableRow from "@mui/material/TableRow";

import Icon from "@mui/material/Icon";

import IconButton from "@mui/material/IconButton";

import CircularProgress from "@mui/material/CircularProgress";

import Snackbar from "@mui/material/Snackbar";

import Alert from "@mui/material/Alert";

import Chip from "@mui/material/Chip";

import InputAdornment from "@mui/material/InputAdornment";

import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";

import FormControl from "@mui/material/FormControl";

import Fade from "@mui/material/Fade";

import Grow from "@mui/material/Grow";

import Box from "@mui/material/Box";

import * as yup from "yup";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Footer from "examples/Footer";

import MDBox from "components/MDBox";

import MDTypography from "components/MDTypography";

import MDInput from "components/MDInput";

import MDButton from "components/MDButton";

import brand from "assets/theme/base/brand";
import { formatCurrency, useCurrency } from "utils/currency";

import { fetchProducts, createProduct, updateProduct, deleteProduct } from "api/products";

import ProductFormDialog from "layouts/products/components/ProductFormDialog";

import DeleteConfirmDialog from "layouts/products/components/DeleteConfirmDialog";



const LOW_STOCK_THRESHOLD = 10;



const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  quantity: "",
  price: "",
  currency: "TND",
  imageUrl: "",
  minStockThreshold: 5,
};

const productSchema = yup.object().shape({
  name: yup.string().trim().required("Le nom est requis"),
  category: yup.string().trim().required("La catégorie est requise"),
  quantity: yup
    .number()
    .typeError("La quantité doit être un nombre")
    .min(0, "La quantité ne peut pas être négative")
    .required("La quantité est requise"),
  price: yup
    .number()
    .typeError("Le prix doit être un nombre")
    .min(0, "Le prix ne peut pas être négatif")
    .required("Le prix est requis"),
  currency: yup.string().required("La devise est requise"),
  imageUrl: yup
    .string()
    .transform((curr, orig) => (orig === "" ? undefined : curr))
    .url("Veuillez entrer une URL valide")
    .optional()
    .nullable(),
  minStockThreshold: yup
    .number()
    .typeError("Le seuil doit être un nombre")
    .min(0, "Le seuil ne peut pas être négatif")
    .required("Le seuil de stock minimum est requis"),
});

const getStockStatus = (quantity, minStockThreshold = 5) => {
  if (quantity <= 0) return { label: "Rupture", ...brand.status.error };
  if (quantity <= (minStockThreshold ?? 5)) return { label: "Stock faible", ...brand.status.warning };
  return { label: "En stock", ...brand.status.success };
};



const formatPrice = (price, currency) => formatCurrency(price, currency);



const formatDate = (date) =>

  new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });



const getReference = (id) => (id ? id.slice(-8).toUpperCase() : "—");

const COLUMNS = [
  { name: "Produit", width: "25%", minWidth: "220px", align: "left" },
  { name: "Référence", width: "11%", minWidth: "110px", align: "left" },
  { name: "Catégorie", width: "11%", minWidth: "120px", align: "left" },
  { name: "Prix", width: "10%", minWidth: "95px", align: "left" },
  { name: "Stock", width: "11%", minWidth: "105px", align: "left" },
  { name: "Statut", width: "11%", minWidth: "125px", align: "left" },
  { name: "Date", width: "11%", minWidth: "110px", align: "left" },
  { name: "Actions", width: "10%", minWidth: "100px", align: "left" },
];

const inputStyles = {

  backgroundColor: brand.inputBg,

  borderRadius: "10px",

  "& .MuiOutlinedInput-notchedOutline": {

    borderColor: `${brand.inputBorder} !important`,

  },

  "&:hover .MuiOutlinedInput-notchedOutline": {

    borderColor: `${brand.accent} !important`,

  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {

    borderColor: `${brand.accent} !important`,

    borderWidth: "1.5px",

  },

};



const buttonGradientSx = {

  background: brand.gradientButton,

  color: "white !important",

  borderRadius: "10px",

  fontWeight: 600,

  letterSpacing: 0.5,

  boxShadow: brand.shadowAccent,

  transition: "all 0.25s ease",

  "&:hover": {

    background: brand.gradientButtonHover,

    boxShadow: brand.shadowAccentHover,

    transform: "translateY(-1px)",

  },

};



function StatCard({ title, value, icon, iconColor, iconBg, delay = 0 }) {

  return (

    <Grow in timeout={400 + delay}>

      <Card

        sx={{
          borderRadius: "16px",
          p: 2.5,
          height: "100%",
          border: `1px solid ${brand.inputBorder}`,
          boxShadow: brand.shadowCard,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: brand.shadowCardHover,
            transform: "translateY(-3px)",
          },
        }}
      >
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start">
          <MDBox>
            <MDTypography
              variant="caption"
              fontWeight="medium"
              sx={{ color: brand.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 }}
            >
              {title}
            </MDTypography>
            <MDTypography variant="h4" fontWeight="bold" mt={0.75} sx={{ color: brand.textPrimary }}>
              {value}
            </MDTypography>
          </MDBox>
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="3rem"
            height="3rem"
            borderRadius="12px"
            sx={{ backgroundColor: iconBg }}
          >
            <Icon sx={{ color: iconColor, fontSize: "1.35rem" }}>{icon}</Icon>
          </MDBox>
        </MDBox>
      </Card>
    </Grow>
  );
}

function StatusChip({ label, color, bg }) {
  return (
    <Chip
      label={
        <MDBox display="flex" alignItems="center" gap={0.75}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: color,
            }}
          />
          {label}
        </MDBox>
      }
      size="small"
      sx={{
        backgroundColor: bg,
        color,
        fontWeight: 600,
        fontSize: "0.72rem",
        height: 26,
        borderRadius: "8px",
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}

function Products() {
  const currency = useCurrency();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showNotification = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data.products || []);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    const refreshStock = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.products || []);
      } catch {
        // Le prochain rafraîchissement réessaiera sans interrompre l'utilisation de la page.
      }
    };

    const refreshInterval = window.setInterval(refreshStock, 3000);
    window.addEventListener("focus", refreshStock);

    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", refreshStock);
    };
  }, [loadProducts]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const stockValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const lowStock = products.filter((p) => p.quantity > 0 && p.quantity <= (p.minStockThreshold ?? 5)).length;
    return { totalProducts, stockValue, lowStock, categories: categories.length };
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

      const status = getStockStatus(product.quantity, product.minStockThreshold).label;
      const statusMap = { all: true, "En stock": status === "En stock", "Stock faible": status === "Stock faible", Rupture: status === "Rupture" };
      const matchesStatus = statusMap[statusFilter];

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setFormData({ ...EMPTY_FORM, currency });
    setFormErrors({});
    setFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      currency: product.currency || currency,
      imageUrl: product.imageUrl || "",
      minStockThreshold: product.minStockThreshold !== undefined ? product.minStockThreshold : 5,
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const handleOpenDelete = (product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = async () => {
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        quantity: formData.quantity === "" ? undefined : Number(formData.quantity),
        price: formData.price === "" ? undefined : Number(formData.price),
        currency: formData.currency,
        imageUrl: formData.imageUrl,
        minStockThreshold: formData.minStockThreshold === "" ? undefined : Number(formData.minStockThreshold),
      };
      const validatedPayload = await productSchema.validate(payload, { abortEarly: false });
      setFormErrors({});
      setFormLoading(true);

      const finalPayload = {
        ...validatedPayload,
        imageUrl: validatedPayload.imageUrl || "",
      };

      if (selectedProduct) {
        const data = await updateProduct(selectedProduct._id, finalPayload);
        setProducts((prev) => prev.map((p) => (p._id === selectedProduct._id ? data.product : p)));
        showNotification("Produit mis à jour avec succès.");
      } else {
        const data = await createProduct(finalPayload);
        setProducts((prev) => [data.product, ...prev]);
        showNotification("Produit créé avec succès.");
      }

      setFormOpen(false);
    } catch (error) {
      if (error.inner) {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
      } else {
        showNotification(error.message, "error");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(selectedProduct._id);
      setProducts((prev) => prev.filter((p) => p._id !== selectedProduct._id));
      showNotification("Produit supprimé avec succès.");
      setDeleteOpen(false);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const statusTabs = ["all", "En stock", "Stock faible", "Rupture"];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3}>
        <Fade in timeout={500}>
          <MDBox mb={4}>
            <MDBox display="flex" alignItems="center" mb={1}>
              <MDBox width="28px" height="2px" sx={{ backgroundColor: brand.accent }} mr={1.5} />
              <MDTypography variant="caption" fontWeight="bold" sx={{ color: brand.accent, letterSpacing: 1.2 }}>
                INVENTAIRE
              </MDTypography>
            </MDBox>
            <MDTypography variant="h3" fontWeight="bold" sx={{ color: brand.textPrimary }}>
              Gestion des produits
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: brand.textSecondary, mt: 0.5 }}>
              Suivez, filtrez et gérez l&apos;ensemble de votre catalogue en temps réel.
            </MDTypography>
          </MDBox>
        </Fade>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Produits"
              value={stats.totalProducts}
              icon="inventory_2"
              iconColor={brand.accent}
              iconBg="rgba(176,42,70,0.12)"
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Valeur du Stock"
              value={formatPrice(stats.stockValue, currency)}
              icon="trending_up"
              iconColor={brand.status.success.color}
              iconBg={brand.status.success.bg}
              delay={80}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Stock Faible"
              value={stats.lowStock}
              icon="warning_amber"
              iconColor={brand.status.warning.color}
              iconBg={brand.status.warning.bg}
              delay={160}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Catégories"
              value={stats.categories}
              icon="category"
              iconColor={brand.status.info.color}
              iconBg={brand.status.info.bg}
              delay={240}
            />
          </Grid>
        </Grid>

        <Fade in timeout={600}>
          <Card
            sx={{
              borderRadius: "16px",
              overflow: "hidden",
              border: `1px solid ${brand.inputBorder}`,
              boxShadow: brand.shadowCard,
            }}
          >
            <MDBox
              p={3}
              sx={{
                borderBottom: `1px solid ${brand.inputBorder}`,
                background: `linear-gradient(180deg, ${brand.cardBg} 0%, ${brand.inputBg} 100%)`,
              }}
            >
              <MDBox
                display="flex"
                flexDirection={{ xs: "column", lg: "row" }}
                gap={2}
                alignItems={{ lg: "center" }}
              >
                <MDInput
                  placeholder="Rechercher un produit..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon fontSize="small" sx={{ color: brand.iconMuted }}>search</Icon>
                      </InputAdornment>
                    ),
                    sx: inputStyles,
                  }}
                  sx={{ maxWidth: { lg: 300 } }}
                />
                <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start" sx={{ ml: 0.5 }}>
                        <Icon fontSize="small" sx={{ color: brand.iconMuted }}>filter_list</Icon>
                      </InputAdornment>
                    }
                    sx={{ height: 42, borderRadius: "10px", ...inputStyles }}
                  >
                    <MenuItem value="all">Toutes les catégories</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <MDBox display="flex" gap={1} flexWrap="wrap" flex={1}>
                  {statusTabs.map((tab) => {
                    const isActive = statusFilter === tab;
                    return (
                      <MDButton
                        key={tab}
                        variant={isActive ? "contained" : "outlined"}
                        size="small"
                        onClick={() => setStatusFilter(tab)}
                        sx={{
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          minWidth: "auto",
                          px: 1.75,
                          py: 0.75,
                          textTransform: "none",
                          transition: "all 0.2s ease",
                          ...(isActive
                            ? {
                                ...buttonGradientSx,
                                border: "none",
                              }
                            : {
                                borderColor: brand.inputBorder,
                                color: brand.textSecondary,
                                "&:hover": {
                                  borderColor: brand.accent,
                                  color: brand.accent,
                                  backgroundColor: "rgba(176,42,70,0.04)",
                                },
                              }),
                        }}
                      >
                        {tab === "all" ? "Tous" : tab}
                      </MDButton>
                    );
                  })}
                </MDBox>
                <MDButton variant="contained" onClick={handleOpenCreate} sx={{ ...buttonGradientSx, whiteSpace: "nowrap", px: 2.5 }}>
                  <Icon sx={{ mr: 0.5, fontSize: "1.1rem" }}>add</Icon>
                  Ajouter un produit
                </MDButton>
              </MDBox>
            </MDBox>

            <MDBox p={{ xs: 2, md: 3 }} pt={2}>
              {loading ? (
                <MDBox display="flex" flexDirection="column" justifyContent="center" alignItems="center" py={10} gap={2}>
                  <CircularProgress sx={{ color: brand.accent }} size={36} />
                  <MDTypography variant="caption" sx={{ color: brand.textSecondary }}>
                    Chargement des produits...
                  </MDTypography>
                </MDBox>
              ) : filteredProducts.length === 0 ? (
                <MDBox textAlign="center" py={10}>
                  <MDBox
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    width="4rem"
                    height="4rem"
                    borderRadius="16px"
                    mb={2}
                    sx={{ backgroundColor: "rgba(176,42,70,0.08)" }}
                  >
                    <Icon sx={{ fontSize: 32, color: brand.accent }}>inventory_2</Icon>
                  </MDBox>
                  <MDTypography variant="h6" fontWeight="bold" sx={{ color: brand.textPrimary }}>
                    {products.length === 0 ? "Aucun produit pour le moment" : "Aucun produit ne correspond à votre recherche"}
                  </MDTypography>
                  <MDTypography variant="body2" sx={{ color: brand.textSecondary, mt: 0.5 }}>
                    {products.length === 0
                      ? "Commencez par ajouter votre premier article au catalogue."
                      : "Essayez de modifier vos filtres ou votre recherche."}
                  </MDTypography>
                  {products.length === 0 && (
                    <MDButton variant="contained" onClick={handleOpenCreate} sx={{ ...buttonGradientSx, mt: 3 }}>
                      Ajouter votre premier produit
                    </MDButton>
                  )}
                </MDBox>
              ) : (
                <TableContainer sx={{ overflowX: "auto", borderRadius: "12px" }}>
                  <Table sx={{ minWidth: 800, tableLayout: "fixed", width: "100%" }}>
                    <TableHead
                      sx={{
                        display: "table-header-group !important",
                        padding: "0 !important",
                        borderRadius: "0 !important",
                      }}
                    >
                      <TableRow
                        sx={{
                          display: "table-row !important",
                          "& th": {
                            borderBottom: `1px solid ${brand.inputBorder}`,
                            backgroundColor: brand.inputBg,
                            py: 1.75,
                            display: "table-cell !important",
                          },
                        }}
                      >
                        {COLUMNS.map((col) => (
                          <TableCell
                            key={col.name}
                            align={col.align}
                            sx={{
                              width: col.width,
                              minWidth: col.minWidth,
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              letterSpacing: 0.8,
                              color: brand.textSecondary,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {col.name}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.map((product, index) => {
                        const status = getStockStatus(product.quantity, product.minStockThreshold);
                        return (
                          <TableRow
                            key={product._id}
                            sx={{
                              transition: "background-color 0.2s ease",
                              animation: `fadeIn 0.35s ease ${index * 0.04}s both`,
                              "@keyframes fadeIn": {
                                from: { opacity: 0, transform: "translateY(6px)" },
                                to: { opacity: 1, transform: "translateY(0)" },
                              },
                              "&:hover": {
                                backgroundColor: "rgba(176,42,70,0.03)",
                              },
                              "& td": {
                                borderBottom: `1px solid ${brand.inputBorder}`,
                                py: 2,
                                display: "table-cell !important",
                              },
                            }}
                          >
                            <TableCell
                              align={COLUMNS[0].align}
                              sx={{
                                width: COLUMNS[0].width,
                                minWidth: COLUMNS[0].minWidth,
                              }}
                            >
                              <MDBox display="flex" alignItems="center" gap={1.5}>
                                <MDBox
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  width="2.75rem"
                                  height="2.75rem"
                                  borderRadius="12px"
                                  sx={{ backgroundColor: "rgba(176,42,70,0.1)", flexShrink: 0 }}
                                >
                                  <Icon sx={{ color: brand.accent, fontSize: "1.15rem" }}>inventory_2</Icon>
                                </MDBox>
                                <MDBox sx={{ minWidth: 0, width: "100%" }}>
                                  <MDTypography
                                    variant="button"
                                    fontWeight="bold"
                                    display="block"
                                    sx={{
                                      color: brand.textPrimary,
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {product.name}
                                  </MDTypography>
                                  <MDTypography
                                    variant="caption"
                                    display="block"
                                    sx={{
                                      color: brand.textSecondary,
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {product.description || "—"}
                                  </MDTypography>
                                </MDBox>
                              </MDBox>
                            </TableCell>
                            <TableCell
                              align={COLUMNS[1].align}
                              sx={{
                                width: COLUMNS[1].width,
                                minWidth: COLUMNS[1].minWidth,
                              }}
                            >
                              <MDTypography
                                variant="caption"
                                fontWeight="medium"
                                sx={{
                                  fontFamily: "monospace",
                                  color: brand.textSecondary,
                                  backgroundColor: brand.inputBorder,
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: "6px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {getReference(product._id)}
                              </MDTypography>
                            </TableCell>

                            <TableCell
                              align={COLUMNS[2].align}
                              sx={{
                                width: COLUMNS[2].width,
                                minWidth: COLUMNS[2].minWidth,
                              }}
                            >
                              <Chip
                                label={product.category}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(99,102,241,0.08)",
                                  color: brand.status.info.color,
                                  fontWeight: 500,
                                  fontSize: "0.75rem",
                                  borderRadius: "6px",
                                  maxWidth: "100%",
                                }}
                              />
                            </TableCell>

                            <TableCell
                              align={COLUMNS[3].align}
                              sx={{
                                width: COLUMNS[3].width,
                                minWidth: COLUMNS[3].minWidth,
                              }}
                            >
                              <MDTypography
                                variant="button"
                                fontWeight="bold"
                                sx={{
                                  color: brand.accent,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {formatPrice(product.price, product.currency)}
                              </MDTypography>
                            </TableCell>

                            <TableCell
                              align={COLUMNS[4].align}
                              sx={{
                                width: COLUMNS[4].width,
                                minWidth: COLUMNS[4].minWidth,
                              }}
                            >
                              <MDBox>
                                <MDTypography
                                  variant="button"
                                  fontWeight="medium"
                                  sx={{
                                    color: status.color,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {product.quantity} unités
                                </MDTypography>
                                <MDTypography
                                  variant="caption"
                                  display="block"
                                  sx={{
                                    color: brand.textSecondary,
                                    fontSize: "0.68rem",
                                  }}
                                >
                                  Seuil : {product.minStockThreshold ?? 5}
                                </MDTypography>
                              </MDBox>
                            </TableCell>

                            <TableCell
                              align={COLUMNS[5].align}
                              sx={{
                                width: COLUMNS[5].width,
                                minWidth: COLUMNS[5].minWidth,
                              }}
                            >
                              <StatusChip label={status.label} color={status.color} bg={status.bg} />
                            </TableCell>

                            <TableCell
                              align={COLUMNS[6].align}
                              sx={{
                                width: COLUMNS[6].width,
                                minWidth: COLUMNS[6].minWidth,
                              }}
                            >
                              <MDTypography
                                variant="caption"
                                sx={{
                                  color: brand.textSecondary,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {formatDate(product.createdAt)}
                              </MDTypography>
                            </TableCell>

                            <TableCell
                              align={COLUMNS[7].align}
                              sx={{
                                width: COLUMNS[7].width,
                                minWidth: COLUMNS[7].minWidth,
                              }}
                            >
                              <MDBox display="flex" gap={0.75} alignItems="center">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenEdit(product)}
                                  sx={{
                                    backgroundColor: brand.status.info.bg,
                                    borderRadius: "8px",
                                    transition: "all 0.2s ease",
                                    "&:hover": { backgroundColor: "rgba(99,102,241,0.22)", transform: "scale(1.05)" },
                                  }}
                                >
                                  <Icon fontSize="small" sx={{ color: brand.status.info.color }}>
                                    edit
                                  </Icon>
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDelete(product)}
                                  sx={{
                                    backgroundColor: brand.status.error.bg,
                                    borderRadius: "8px",
                                    transition: "all 0.2s ease",
                                    "&:hover": { backgroundColor: "rgba(239,68,68,0.22)", transform: "scale(1.05)" },
                                  }}
                                >
                                  <Icon fontSize="small" sx={{ color: brand.status.error.color }}>
                                    delete
                                  </Icon>
                                </IconButton>
                              </MDBox>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                </TableContainer>

              )}

            </MDBox>

          </Card>

        </Fade>

      </MDBox>

      <Footer />



      <ProductFormDialog

        open={formOpen}

        onClose={() => setFormOpen(false)}

        onSubmit={handleFormSubmit}

        formData={formData}

        onChange={handleFormChange}

        errors={formErrors}

        loading={formLoading}

        isEdit={Boolean(selectedProduct)}

      />



      <DeleteConfirmDialog

        open={deleteOpen}

        onClose={() => setDeleteOpen(false)}

        onConfirm={handleDeleteConfirm}

        productName={selectedProduct?.name}

        loading={deleteLoading}

      />



      <Snackbar

        open={snackbar.open}

        autoHideDuration={4000}

        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}

        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}

        TransitionComponent={Grow}

      >

        <Alert

          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}

          severity={snackbar.severity}

          variant="filled"

          sx={{

            width: "100%",

            borderRadius: "12px",

            boxShadow: brand.shadowCardHover,

            ...(snackbar.severity === "success" && { backgroundColor: brand.status.success.color }),

          }}

        >

          {snackbar.message}

        </Alert>

      </Snackbar>

    </DashboardLayout>

  );

}



export default Products;
