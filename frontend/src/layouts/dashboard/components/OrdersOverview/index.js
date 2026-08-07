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

import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview({ recentUsers }) {
  const { t } = useTranslation();
  const timelineItems = recentUsers?.length
    ? recentUsers.slice(0, 5).map((user, index) => ({
        color: "info",
        icon: "person",
        title: `${user.prenom} ${user.nom} ${t("dashboard.timeline.joined")}`,
        dateTime: new Date(user.createdAt).toLocaleString(),
        lastItem: index === Math.min(recentUsers.length, 5) - 1,
      }))
    : [
        {
          color: "success",
          icon: "notifications",
          title: "$2400, Design changes",
          dateTime: "22 DEC 7:20 PM",
        },
        {
          color: "error",
          icon: "inventory_2",
          title: "New order #1832412",
          dateTime: "21 DEC 11 PM",
        },
        {
          color: "info",
          icon: "shopping_cart",
          title: "Server payments for April",
          dateTime: "21 DEC 9:34 PM",
        },
        {
          color: "warning",
          icon: "payment",
          title: "New card added for order #4395133",
          dateTime: "20 DEC 2:20 AM",
        },
        {
          color: "primary",
          icon: "vpn_key",
          title: "New card added for order #4395133",
          dateTime: "18 DEC 4:54 AM",
          lastItem: true,
        },
      ];

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          {t("dashboard.overview.title")}
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              {t("dashboard.overview.growth")}
            </MDTypography>
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        {timelineItems.map((item, index) => (
          <TimelineItem
            key={`${item.title}-${index}`}
            color={item.color}
            icon={item.icon}
            title={item.title}
            dateTime={item.dateTime}
            description={item.description}
            lastItem={item.lastItem}
          />
        ))}
      </MDBox>
    </Card>
  );
}

OrdersOverview.propTypes = {
  recentUsers: PropTypes.arrayOf(
    PropTypes.shape({
      prenom: PropTypes.string,
      nom: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ),
};

OrdersOverview.defaultProps = {
  recentUsers: null,
};

export default OrdersOverview;
