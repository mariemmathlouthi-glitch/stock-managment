/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Aperçu des commandes
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            ce mois-ci
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <TimelineItem
          color="success"
          icon="notifications"
          title="$2400, modifications de design"
          dateTime="22 déc. 19:20"
        />
        <TimelineItem
          color="error"
          icon="inventory_2"
          title="Nouvelle commande #1832412"
          dateTime="21 déc. 23:00"
        />
        <TimelineItem
          color="info"
          icon="shopping_cart"
          title="Paiements serveurs pour avril"
          dateTime="21 déc. 21:34"
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title="Nouvelle carte ajoutée pour la commande #4395133"
          dateTime="20 déc. 02:20"
        />
        <TimelineItem
          color="primary"
          icon="vpn_key"
          title="Décompression des paquets pour le développement"
          dateTime="18 déc. 04:54"
          lastItem
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
