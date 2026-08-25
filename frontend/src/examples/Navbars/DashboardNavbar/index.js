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

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "components/LanguageSwitcher";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(null);
  const navigate = useNavigate();
  const route = useLocation().pathname.split("/").slice(1);
  const { t } = useTranslation();

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const handleOpenUserMenu = (event) => {
    setUserMenu((prev) => (prev ? null : event.currentTarget));
  };
  const handleCloseUserMenu = () => setUserMenu(null);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title={t("navbar.check_new_messages")} />
      <NotificationItem icon={<Icon>podcasts</Icon>} title={t("navbar.manage_podcast_sessions")} />
      <NotificationItem
        icon={<Icon>shopping_cart</Icon>}
        title={t("navbar.payment_successfully_completed")}
      />
    </Menu>
  );

  // Render the user menu
  const renderUserMenu = () => (
    <Menu
      anchorEl={userMenu}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(userMenu)}
      onClose={handleCloseUserMenu}
      sx={{
        mt: 1.5,
        "& .MuiPaper-root": {
          borderRadius: "12px",
          padding: "4px 0",
          minWidth: "170px",
          boxShadow: darkMode
            ? "0 10px 30px rgba(0, 0, 0, 0.5)"
            : "0 10px 30px rgba(0, 0, 0, 0.12)",
          border: darkMode
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: darkMode ? "#202940" : "#ffffff",
          zIndex: 1300,
        },
      }}
    >
      <MenuItem
        onClick={() => {
          handleCloseUserMenu();
          navigate("/dashboard");
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.2,
          transition: "all 150ms ease",
          "&:hover": {
            backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <Icon sx={{ color: darkMode ? "#fff" : "#344767", fontSize: "1.2rem" }}>dashboard</Icon>
        <MDTypography
          variant="button"
          fontWeight="medium"
          sx={{ color: darkMode ? "#fff" : "#344767" }}
        >
          Tableau de bord
        </MDTypography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleCloseUserMenu();
          localStorage.removeItem("token");
          localStorage.removeItem("utilisateur");
          navigate("/authentication/sign-in");
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.2,
          transition: "all 150ms ease",
          "&:hover": {
            backgroundColor: "rgba(229, 62, 62, 0.08)",
          },
        }}
      >
        <Icon sx={{ color: "#e53e3e", fontSize: "1.2rem" }}>logout</Icon>
        <MDTypography variant="button" fontWeight="medium" sx={{ color: "#e53e3e" }}>
          Déconnexion
        </MDTypography>
      </MenuItem>
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <LanguageSwitcher />
          </MDBox>
        ) : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <LanguageSwitcher />
            </MDBox>
            <MDBox pr={1}>
              <MDInput label={t("navbar.search_placeholder")} />
            </MDBox>
            <MDBox color={light ? "white" : "inherit"} display="flex" alignItems="center">
              <MDBox
                display="flex"
                alignItems="center"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  px: 1.5,
                  py: 0.5,
                  mr: 1,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Icon sx={{ color: "#a89a9f", fontSize: "1rem", mr: 0.5 }}>schedule</Icon>
                <MDTypography variant="button" fontWeight="medium" sx={{ color: "#a89a9f" }}>
                  Décembre 2024
                </MDTypography>
              </MDBox>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton>
              <MDBox
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ ml: 1, mr: 1, cursor: "pointer" }}
                onClick={handleOpenUserMenu}
              >
                <MDBox
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="2.2rem"
                  height="2.2rem"
                  borderRadius="50%"
                  sx={{
                    background: "linear-gradient(135deg, #b02a46 0%, #db5971 100%)",
                    boxShadow: "0 2px 8px rgba(176,42,70,0.3)",
                  }}
                >
                  <Icon sx={{ color: "#fff", fontSize: "1rem" }}>person</Icon>
                </MDBox>
                <MDTypography
                  variant="button"
                  fontWeight="medium"
                  sx={{
                    color: darkMode ? "#fff" : "#344767",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Ayari Rahma
                </MDTypography>
                <Icon sx={{ color: "#a89a9f", fontSize: "1rem", cursor: "pointer" }}>
                  expand_more
                </Icon>
              </MDBox>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              {renderMenu()}
              {renderUserMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
