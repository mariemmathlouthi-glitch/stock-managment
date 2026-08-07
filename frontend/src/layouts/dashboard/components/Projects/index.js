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

import { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import staticData from "layouts/dashboard/components/Projects/data";

function Projects({ recentUsers }) {
  const { t } = useTranslation();
  const { columns, rows } = recentUsers?.length
    ? {
        columns: [
          { Header: t("dashboard.columns.name"), accessor: "name", width: "35%", align: "left" },
          { Header: t("dashboard.columns.email"), accessor: "email", align: "left" },
          { Header: t("dashboard.columns.role"), accessor: "role", align: "center" },
          { Header: t("dashboard.columns.joined"), accessor: "joined", align: "center" },
        ],
        rows: recentUsers.map((user) => ({
          name: `${user.prenom} ${user.nom}`,
          email: user.email,
          role: user.role,
          joined: new Date(user.createdAt).toLocaleDateString(),
        })),
      }
    : staticData();
  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Projects
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              done
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>30 done</strong> this month
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>
      <MDBox>
        <DataTable
          table={{ columns, rows }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

Projects.propTypes = {
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

Projects.defaultProps = {
  recentUsers: null,
};

export default Projects;
