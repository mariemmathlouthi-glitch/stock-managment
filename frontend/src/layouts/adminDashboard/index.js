/**
=========================================================
* Admin Dashboard
=========================================================
*/

import Grid from "@mui/material/Grid";

// Material Dashboard components
import MDBox from "components/MDBox";

// Layout and components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

function AdminDashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="security"
                title="Administrateur"
                count="1"
                percentage={{ color: "success", amount: "", label: "Compte principal" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="group"
                title="Utilisateurs totaux"
                count="2,300"
                percentage={{ color: "success", amount: "+3%", label: "ce mois" }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AdminDashboard;
