import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PremiumStatCard from "layouts/dashboard/components/PremiumStatCard";
import brand from "assets/theme/base/brand";
import { fetchProducts } from "api/products";
import { formatCurrency, getCurrencyLabel, useCurrency } from "utils/currency";

import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const gradientChartLine = (ctx, colorStr) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, colorStr);
  gradient.addColorStop(1, "rgba(26, 18, 21, 0)");
  return gradient;
};

function Dashboard() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const currency = useCurrency();

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  const stockValue = useMemo(
    () =>
      products.reduce(
        (total, product) =>
          total + (Number(product.quantity) || 0) * (Number(product.price) || 0),
        0
      ),
    [products]
  );

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: brand.darkElevated,
        titleColor: brand.textPrimary,
        bodyColor: brand.textSecondary,
        borderColor: brand.inputBorder,
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    interaction: { intersect: false, mode: "index" },
    scales: {
      y: {
        grid: { drawBorder: false, display: true, drawOnChartArea: true, drawTicks: false, borderDash: [5, 5], color: "rgba(255, 255, 255, 0.05)" },
        ticks: { display: true, color: brand.iconMuted, padding: 10, font: { size: 11, family: "Inter" } },
      },
      x: {
        grid: { drawBorder: false, display: false, drawOnChartArea: false, drawTicks: false },
        ticks: { display: true, color: brand.iconMuted, padding: 20, font: { size: 11, family: "Inter" } },
      },
    },
  };

  const lineChartData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: "Valeur du stock",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: brand.accent,
        pointBorderColor: "#fff",
        borderColor: brand.accent,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          return gradientChartLine(ctx, "rgba(176, 42, 70, 0.4)");
        },
        data: [45000, 52000, 50000, 62000, 60000, 72000, 68000, 70000, 80000, 75000, 92000, 84320],
        maxBarThickness: 6,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: brand.darkElevated,
        titleColor: brand.textPrimary,
        bodyColor: brand.textSecondary,
        borderColor: brand.inputBorder,
        borderWidth: 1,
        padding: 10,
      },
    },
  };

  const doughnutChartData = {
    labels: ["Informatique", "Périphériques", "Mobilier", "Stockage", "Accessoires", "Audio"],
    datasets: [
      {
        label: "Répartition",
        weight: 9,
        borderWidth: 4,
        borderColor: brand.cardBg,
        backgroundColor: ["#db5971", "#fbbf24", "#818cf8", "#4ade80", "#f87171", "#94a3b8"],
        data: [32, 28, 15, 12, 8, 5],
        fill: false,
      },
    ],
  };

  const [activeTab, setActiveTab] = useState("valeur");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDTypography variant="h3" fontWeight="bold" sx={{ color: brand.textPrimary, mb: 4 }}>
          Tableau de bord
        </MDTypography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}>
            <PremiumStatCard
              icon="inventory_2"
              iconColor="#db5971"
              iconBg="rgba(219,89,113,0.15)"
              title="TOTAL PRODUITS"
              subtitle="vs mois dernier"
              value="156"
              trend="up"
              trendValue="↗ +12"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <PremiumStatCard
              icon="group"
              iconColor="#818cf8"
              iconBg="rgba(129,140,248,0.15)"
              title="UTILISATEURS ACTIFS"
              subtitle="nouveaux ce mois"
              value="24"
              trend="up"
              trendValue="↗ +3"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <PremiumStatCard
              icon="trending_up"
              iconColor="#4ade80"
              iconBg="rgba(74,222,128,0.15)"
              title="VALEUR DU STOCK"
              subtitle="vs mois dernier"
              value={formatCurrency(stockValue)}
              trend="up"
              trendValue="↗ +8.4%"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <PremiumStatCard
              icon="warning_amber"
              iconColor="#fbbf24"
              iconBg="rgba(251,191,36,0.15)"
              title="ALERTES ACTIVES"
              subtitle="dont 2 ruptures"
              value="8"
              trend="down"
              trendValue="↘ +2"
            />
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card
                sx={{
                  borderRadius: "16px",
                  background: `linear-gradient(145deg, ${brand.darkSurface} 0%, ${brand.cardBg} 100%)`,
                  borderTop: `1px solid rgba(176, 42, 70, 0.4)`,
                  boxShadow: brand.shadowCard,
                  height: "100%",
                }}
              >
                <MDBox p={3} display="flex" justifyContent="space-between" alignItems="flex-start">
                  <MDBox>
                    <MDTypography variant="caption" fontWeight="bold" sx={{ color: brand.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, display: "block" }}>
                      ÉVOLUTION ANNUELLE
                    </MDTypography>
                    <MDTypography variant="h5" fontWeight="bold" sx={{ color: brand.textPrimary }}>
                      Valeur du stock ({getCurrencyLabel(currency)})
                    </MDTypography>
                  </MDBox>
                  <MDBox display="flex" sx={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "8px", p: 0.5 }}>
                    <MDButton
                      variant={activeTab === "valeur" ? "contained" : "text"}
                      size="small"
                      onClick={() => setActiveTab("valeur")}
                      sx={{
                        backgroundColor: activeTab === "valeur" ? brand.accentLight : "transparent",
                        color: activeTab === "valeur" ? "#fff" : brand.textSecondary,
                        minWidth: "auto",
                        px: 2,
                        py: 0.5,
                        textTransform: "none",
                        "&:hover": { backgroundColor: activeTab === "valeur" ? brand.accent : "rgba(255,255,255,0.1)" },
                      }}
                    >
                      Valeur
                    </MDButton>
                    <MDButton
                      variant={activeTab === "flux" ? "contained" : "text"}
                      size="small"
                      onClick={() => setActiveTab("flux")}
                      sx={{
                        backgroundColor: activeTab === "flux" ? brand.accentLight : "transparent",
                        color: activeTab === "flux" ? "#fff" : brand.textSecondary,
                        minWidth: "auto",
                        px: 2,
                        py: 0.5,
                        textTransform: "none",
                        "&:hover": { backgroundColor: activeTab === "flux" ? brand.accent : "rgba(255,255,255,0.1)" },
                      }}
                    >
                      Flux
                    </MDButton>
                  </MDBox>
                </MDBox>
                <MDBox p={2} pt={0} height="300px">
                  <Line data={lineChartData} options={lineChartOptions} />
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card
                sx={{
                  borderRadius: "16px",
                  background: `linear-gradient(145deg, ${brand.darkSurface} 0%, ${brand.cardBg} 100%)`,
                  borderTop: `1px solid rgba(255, 255, 255, 0.1)`,
                  boxShadow: brand.shadowCard,
                  height: "100%",
                }}
              >
                <MDBox p={3} pb={0}>
                  <MDTypography variant="caption" fontWeight="bold" sx={{ color: brand.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, display: "block" }}>
                    RÉPARTITION
                  </MDTypography>
                  <MDTypography variant="h5" fontWeight="bold" sx={{ color: brand.textPrimary }}>
                    Stock par catégorie
                  </MDTypography>
                </MDBox>
                <MDBox p={3} pt={2} display="flex" flexDirection="column" alignItems="center">
                  <MDBox height="220px" width="100%" position="relative">
                    <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                  </MDBox>
                  <MDBox width="100%" mt={3} display="flex" flexWrap="wrap" justifyContent="space-between">
                    {[
                      { color: "#db5971", label: "Informatique", value: "32%" },
                      { color: "#818cf8", label: "Mobilier", value: "15%" },
                      { color: "#fbbf24", label: "Accessoires", value: "8%" },
                      { color: "#4ade80", label: "Périphériques", value: "28%" },
                      { color: "#f87171", label: "Stockage", value: "12%" },
                      { color: "#94a3b8", label: "Audio", value: "5%" },
                    ].map((item, key) => (
                      <MDBox key={key} display="flex" alignItems="center" justifyContent="space-between" width="45%" mb={1.5}>
                        <MDBox display="flex" alignItems="center" gap={1}>
                          <MDBox width="8px" height="8px" borderRadius="2px" sx={{ backgroundColor: item.color }} />
                          <MDTypography variant="caption" sx={{ color: brand.textSecondary }}>
                            {item.label}
                          </MDTypography>
                        </MDBox>
                        <MDTypography variant="caption" fontWeight="bold" sx={{ color: brand.textPrimary }}>
                          {item.value}
                        </MDTypography>
                      </MDBox>
                    ))}
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
