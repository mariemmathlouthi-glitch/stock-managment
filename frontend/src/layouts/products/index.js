import { useState, useEffect, useMemo, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { getBrand } from "assets/theme/base/brand";
import { useMaterialUIController } from "context";
import { fetchProducts } from "api/products";

function Products() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const brand = useMemo(() => getBrand(darkMode), [darkMode]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.products || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3} px={3}>
        <MDTypography variant="h3" fontWeight="bold" sx={{ color: brand.textPrimary }}>
          Gestion des produits
        </MDTypography>
        <MDTypography variant="body2" sx={{ color: brand.textSecondary, mt: 1, mb: 3 }}>
          Version temporaire. Applique le fichier products-index.js du zip stockflow-fixes-v2 pour le tableau, la recherche et les filtres complets.
        </MDTypography>
        {loading ? (
          <CircularProgress sx={{ color: brand.accent }} />
        ) : (
          <Card sx={{ p: 3, backgroundColor: brand.cardBg, border: `1px solid ${brand.inputBorder}` }}>
            <MDTypography sx={{ color: brand.textPrimary }}>
              {products.length} produit(s) trouve(s).
            </MDTypography>
          </Card>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Products;
