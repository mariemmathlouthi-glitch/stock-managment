/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import PieChart from "examples/Charts/PieChart";

// API
import { fetchProducts } from "api/products";
import { getCurrencyLabel, useCurrency } from "utils/currency";

function StockDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = useCurrency();

  // Obtenir la date du jour formatée
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const capitalizedDate = today.charAt(0).toUpperCase() + today.slice(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts();
        // Assuming API returns an array of products
        setProducts(Array.isArray(data) ? data : (data.products || []));
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    const categoriesSet = new Set();
    const categoryQty = {};
    const categoryValue = {};

    products.forEach((p) => {
      const qty = Number(p.quantity) || 0;
      const threshold = p.minStockThreshold !== undefined ? Number(p.minStockThreshold) : 5;
      const price = Number(p.price) || 0;
      const cat = p.category || "Non catégorisé";

      if (qty === 0) outOfStock++;
      else if (qty <= threshold) lowStock++;
      else inStock++;

      categoriesSet.add(cat);

      if (!categoryQty[cat]) categoryQty[cat] = 0;
      if (!categoryValue[cat]) categoryValue[cat] = 0;

      categoryQty[cat] += qty;
      categoryValue[cat] += qty * price;
    });

    const categoryLabels = Object.keys(categoryQty);

    const chartQty = {
      labels: categoryLabels,
      datasets: { label: "Quantité totale", data: categoryLabels.map((c) => categoryQty[c]) },
    };

    const chartValue = {
      labels: categoryLabels,
      datasets: {
        label: `Valeur totale (${getCurrencyLabel(currency)})`,
        data: categoryLabels.map((c) => categoryValue[c]),
      },
    };

    const colors = ["info", "primary", "dark", "secondary", "success", "warning", "error"];
    const pieChart = {
      labels: categoryLabels,
      datasets: {
        label: "Produits",
        backgroundColors: categoryLabels.map((_, i) => colors[i % colors.length]),
        data: categoryLabels.map((c) => products.filter((p) => (p.category || "Non catégorisé") === c).length),
      },
    };

    const alerts = products
      .filter((p) => {
        const qty = Number(p.quantity) || 0;
        const threshold = p.minStockThreshold !== undefined ? Number(p.minStockThreshold) : 5;
        return qty <= threshold;
      })
      .map((p, index) => {
        const qty = Number(p.quantity) || 0;
        const threshold = p.minStockThreshold !== undefined ? Number(p.minStockThreshold) : 5;
        const isRupture = qty === 0;
        return {
          id: p._id || index,
          productId: p._id,
          productName: p.name,
          category: p.category || "Non catégorisé",
          quantity: qty,
          threshold: threshold,
          icon: isRupture ? "error" : "warning",
          color: isRupture ? "error" : "warning",
          title: isRupture ? `Rupture : ${p.name}` : `Stock faible : ${p.name}`,
          description: `Produit: '${p.name}' | Stock actuel: ${qty} | Seuil d'alerte: ${threshold}`,
        };
      });

    return {
      total: products.length,
      inStock,
      lowStock,
      outOfStock,
      categoriesCount: categoriesSet.size,
      chartQty,
      chartValue,
      pieChart,
      alerts,
    };
  }, [products, currency]);

  const handleAddProduct = () => {
    navigate("/products");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* En-tête */}
        <MDBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h3" fontWeight="bold">
              Tableau de bord
            </MDTypography>
            <MDTypography variant="button" color="text">
              Bienvenue sur votre espace de gestion, nous sommes le {capitalizedDate}.
            </MDTypography>
          </MDBox>
          <MDBox>
            <MDButton 
              variant="gradient" 
              color="info" 
              startIcon={<Icon>add</Icon>}
              onClick={handleAddProduct}
            >
              Ajouter un produit
            </MDButton>
          </MDBox>
        </MDBox>

        {loading ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" p={5}>
            <CircularProgress color="info" />
          </MDBox>
        ) : (
          <>
            {/* Cartes de statistiques */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6} lg={2.4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon="inventory_2"
                    title="Total Produits"
                    count={stats.total}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: "Références enregistrées",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={2.4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="check_circle"
                    title="En Stock"
                    count={stats.inStock}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: "Produits disponibles",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={2.4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="error"
                    icon="error"
                    title="Rupture"
                    count={stats.outOfStock}
                    percentage={{
                      color: "error",
                      amount: "",
                      label: "À réapprovisionner",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={2.4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="warning"
                    icon="warning"
                    title="Stock Faible"
                    count={stats.lowStock}
                    percentage={{
                      color: "warning",
                      amount: "",
                      label: "Stock ≤ seuil du produit",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={2.4}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="primary"
                    icon="category"
                    title="Catégories"
                    count={stats.categoriesCount}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: "Familles de produits",
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>

            {/* Graphiques */}
            <MDBox mb={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsBarChart
                      color="success"
                      title="Quantité par catégorie"
                      description="Volume de stock par famille"
                      date="En temps réel"
                      chart={stats.chartQty}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <ReportsBarChart
                      color="info"
                      title="Valeur du stock par catégorie"
                      description="Valorisation totale des produits"
                      date="En temps réel"
                      chart={stats.chartValue}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <MDBox mb={3}>
                    <PieChart
                      icon={{ color: "dark", component: "pie_chart" }}
                      title="Répartition (références)"
                      description="Proportion des références par catégorie"
                      chart={stats.pieChart}
                      height="16.5rem"
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>

            {/* Alertes et Actions Rapides */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ height: "100%" }}>
                  <MDBox p={3}>
                    <MDTypography variant="h6" gutterBottom>
                      Alertes de Stock ({stats.alerts.length})
                    </MDTypography>
                    <MDTypography variant="button" color="text">
                      Produits nécessitant votre attention (rupture ou stock faible).
                    </MDTypography>
                  </MDBox>
                  <MDBox pb={2} px={2} sx={{ maxHeight: "400px", overflow: "auto" }}>
                    {stats.alerts.length > 0 ? (
                      stats.alerts.map((alert) => (
                        <MDBox
                          key={alert.id}
                          p={2}
                          mb={2}
                          bgColor="grey-100"
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <MDBox display="flex" alignItems="center" gap={1.5}>
                            <Icon color={alert.color} fontSize="medium">
                              {alert.icon}
                            </Icon>
                            <MDBox>
                              <MDBox display="flex" alignItems="center" gap={1}>
                                <MDTypography variant="button" fontWeight="bold" sx={{ color: brand.textPrimary }}>
                                  {alert.productName}
                                </MDTypography>
                                <MDTypography variant="caption" sx={{ color: brand.textSecondary, opacity: 0.8 }}>
                                  ({alert.category})
                                </MDTypography>
                              </MDBox>
                              <MDTypography variant="caption" color="text" display="block">
                                Stock actuel : <strong>{alert.quantity}</strong> | Seuil alerte : <strong>{alert.threshold}</strong>
                              </MDTypography>
                            </MDBox>
                          </MDBox>
                          <MDButton
                            variant="outlined"
                            color={alert.color}
                            size="small"
                            onClick={() => navigate("/products")}
                            sx={{ minWidth: "75px" }}
                          >
                            Modifier
                          </MDButton>
                        </MDBox>
                      ))
                    ) : (
                      <MDBox p={2} textAlign="center">
                        <MDTypography variant="button" color="text">
                          Aucune alerte. Tous les stocks sont corrects.
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: "100%" }}>
                  <MDBox p={3}>
                    <MDTypography variant="h6" gutterBottom>
                      Actions Rapides
                    </MDTypography>
                  </MDBox>
                  <MDBox pb={3} px={3} display="flex" flexDirection="column" gap={2}>
                    <MDButton 
                      variant="outlined" 
                      color="dark" 
                      fullWidth 
                      startIcon={<Icon>list</Icon>}
                      onClick={() => navigate("/products")}
                    >
                      Gérer les produits
                    </MDButton>
                    {/* Les autres boutons sont optionnels si les pages n'existent pas encore */}
                    <MDButton variant="text" color="info" fullWidth startIcon={<Icon>summarize</Icon>}>
                      Générer un rapport
                    </MDButton>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default StockDashboard;
