import { useMemo } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { getBrand } from "assets/theme/base/brand";
import { useMaterialUIController } from "context";

function PremiumStatCard({ icon, iconColor, iconBg, title, value, subtitle, trend, trendValue }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const brand = useMemo(() => getBrand(darkMode), [darkMode]);

  const isUp = trend === "up";
  const trendColor = isUp ? brand.status.success.color : brand.status.error.color;
  const trendBg = isUp ? brand.status.success.bg : brand.status.error.bg;
  const trendIcon = isUp ? "north_east" : "south_east";

  return (
    <Card
      sx={{
        borderRadius: "16px",
        background: `linear-gradient(145deg, ${brand.darkSurface} 0%, ${brand.cardBg} 100%)`,
        borderTop: `1px solid rgba(176, 42, 70, 0.1)`,
        boxShadow: brand.shadowCard,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: brand.shadowCardHover,
        },
      }}
    >
      <MDBox
        position="absolute"
        top="-20%"
        left="-10%"
        width="100px"
        height="100px"
        borderRadius="50%"
        sx={{
          background: `radial-gradient(circle, ${iconBg} 0%, transparent 70%)`,
          filter: "blur(20px)",
          opacity: 0.8,
          zIndex: 0,
        }}
      />
      <MDBox p={2.5} position="relative" zIndex={1}>
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <MDBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3rem"
            height="3rem"
            borderRadius="12px"
            sx={{ backgroundColor: iconBg }}
          >
            <Icon sx={{ color: iconColor, fontSize: "1.2rem" }}>{icon}</Icon>
          </MDBox>
          <MDBox
            display="flex"
            alignItems="center"
            px={1}
            py={0.5}
            borderRadius="8px"
            sx={{ backgroundColor: trendBg }}
          >
            <Icon sx={{ color: trendColor, fontSize: "0.9rem", mr: 0.5 }}>{trendIcon}</Icon>
            <MDTypography variant="caption" fontWeight="bold" sx={{ color: trendColor }}>
              {trendValue}
            </MDTypography>
          </MDBox>
        </MDBox>

        <MDBox>
          <MDTypography variant="h3" fontWeight="bold" sx={{ color: brand.textPrimary, mb: 0.5 }}>
            {value}
          </MDTypography>
          <MDTypography
            variant="caption"
            fontWeight="bold"
            sx={{
              color: brand.textSecondary,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              display: "block",
              mb: 0.5,
            }}
          >
            {title}
          </MDTypography>
          <MDTypography
            variant="button"
            sx={{ color: brand.iconMuted, fontSize: "0.75rem", display: "block" }}
          >
            {subtitle}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

PremiumStatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  iconBg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(["up", "down"]).isRequired,
  trendValue: PropTypes.string.isRequired,
};

export default PremiumStatCard;
