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

import { useEffect } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";

// @emotion
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const { t } = useTranslation();
  const cacheLtr = createCache({
    key: "sidenav-ltr",
  });

  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /**
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Determine current user's role (from localStorage.utilisateur)
  let currentUserRole = null;
  try {
    const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));
    currentUserRole = utilisateur && utilisateur.role ? utilisateur.role : null;
  } catch (e) {
    currentUserRole = null;
  }

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    ({ type, name, icon, title, noCollapse, key, href, route, requiredRole }) => {
      let returnValue;

      // Filter out sign-in
      if (key === "sign-in") return null;

      // If a route requires a role and the current user doesn't have it, skip it
      if (requiredRole && currentUserRole !== requiredRole) return null;

      if (type === "collapse") {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavCollapse
              name={t(name)}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
            />
          </Link>
        ) : (
          <NavLink key={key} to={route}>
            <SidenavCollapse name={t(name)} icon={icon} active={key === collapseName} />
          </NavLink>
        );
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {t(title)}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

  return (
    <CacheProvider value={cacheLtr}>
      <div dir="ltr">
        <SidenavRoot
          {...rest}
          variant="permanent"
          anchor="left"
          ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
          PaperProps={{
            sx: {
              left: "0 !important",
              right: "auto !important",
            },
          }}
        >
          <MDBox pt={3} pb={1} px={3} textAlign="center">
            <MDBox
              display={{ xs: "block", xl: "none" }}
              position="absolute"
              top={0}
              right={0}
              p={1.625}
              onClick={closeSidenav}
              sx={{ cursor: "pointer" }}
            >
              <MDTypography variant="h6" color="secondary">
                <Icon sx={{ fontWeight: "bold" }}>close</Icon>
              </MDTypography>
            </MDBox>
            <MDBox component={NavLink} to="/" display="flex" alignItems="center" justifyContent="center" gap={1.5}>
              {brand && (
                <MDBox
                  component="img"
                  src={brand}
                  alt="Stockflow"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    p: 0.5,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  }}
                />
              )}
              <MDBox sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}>
                <MDTypography
                  component="h6"
                  variant="button"
                  fontWeight="bold"
                  color={textColor}
                  textTransform="uppercase"
                  letterSpacing={1}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <span style={{ color: "white" }}>STOCK</span>
                  <span style={{ color: "#b02a46" }}>FLOW</span>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
          <Divider
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
          <List sx={{ px: 0.5, py: 1, flex: 1 }}>{renderRoutes}</List>

          {localStorage.getItem("token") && (
            <>
              <Divider light />
              <MDBox p={2} mt="auto">
                <MDBox
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("utilisateur");
                    window.location.href = "/authentication/sign-in";
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    position: "relative",
                    color: "rgba(255, 255, 255, 0.7)",
                    transition: "all 0.2s ease-in-out",
                    borderLeft: "3px solid transparent",
                    "&:hover, &:focus": {
                      backgroundColor: "rgba(176,42,70,0.18)",
                      color: "white",
                      borderLeft: "3px solid #b02a46",
                      boxShadow: "0 0 16px rgba(176,42,70,0.35)",
                      "& svg, svg g": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <MDBox
                    sx={{
                      minWidth: "32px",
                      minHeight: "32px",
                      color: "inherit",
                      borderRadius: "0.375rem",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Icon sx={{ color: "inherit", fontSize: "1.125rem" }}>logout</Icon>
                  </MDBox>
                  <MDTypography
                    variant="button"
                    fontWeight="light"
                    color="inherit"
                    sx={{
                      marginLeft: "10px",
                      opacity: miniSidenav ? 0 : 1,
                      maxWidth: miniSidenav ? 0 : "100%",
                      transition: "opacity 0.2s, max-width 0.2s",
                      fontSize: "0.875rem",
                    }}
                  >
                    {t("sidebar.logout")}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </>
          )}
        </SidenavRoot>
      </div>
    </CacheProvider>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
