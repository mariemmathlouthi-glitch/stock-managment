import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { useMaterialUIController } from "context";
import { getBrand } from "assets/theme/base/brand";

function TablePagination({
  currentPage,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  itemLabel = "éléments",
}) {
  const [controller] = useMaterialUIController();
  const brand = getBrand(controller.darkMode);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems === 0) {
    return null;
  }

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array with smart ellipsis if necessary
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buttonStyle = (isActive) => ({
    minWidth: "36px",
    height: "36px",
    px: 1.25,
    py: 0.5,
    borderRadius: "8px",
    fontSize: "0.825rem",
    fontWeight: isActive ? 700 : 500,
    textTransform: "none",
    transition: "all 0.2s ease",
    ...(isActive
      ? {
          background: brand.gradientButton,
          color: "#ffffff !important",
          boxShadow: brand.shadowAccent,
          border: "none",
        }
      : {
          backgroundColor: brand.inputBg,
          borderColor: brand.inputBorder,
          color: brand.textSecondary,
          "&:hover": {
            borderColor: brand.accent,
            color: brand.accent,
            backgroundColor: "rgba(176,42,70,0.06)",
          },
        }),
  });

  const navButtonStyle = (disabled) => ({
    height: "36px",
    px: 1.5,
    borderRadius: "8px",
    fontSize: "0.825rem",
    fontWeight: 600,
    textTransform: "none",
    backgroundColor: brand.inputBg,
    borderColor: brand.inputBorder,
    color: disabled ? brand.iconMuted : brand.textPrimary,
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: disabled ? brand.inputBorder : brand.accent,
      color: disabled ? brand.iconMuted : brand.accent,
      backgroundColor: disabled ? brand.inputBg : "rgba(176,42,70,0.06)",
    },
  });

  return (
    <MDBox
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      px={3}
      py={2.5}
      sx={{
        borderTop: `1px solid ${brand.inputBorder}`,
        backgroundColor: brand.cardBg,
      }}
    >
      <MDTypography variant="button" sx={{ color: brand.textSecondary, fontSize: "0.825rem" }}>
        Affichage de <strong>{startIndex}</strong> à <strong>{endIndex}</strong> sur{" "}
        <strong>{totalItems}</strong> {itemLabel}
      </MDTypography>

      <MDBox display="flex" alignItems="center" gap={0.75} flexWrap="wrap">
        <MDButton
          variant="outlined"
          size="small"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          sx={navButtonStyle(currentPage <= 1)}
        >
          <Icon sx={{ mr: 0.5, fontSize: "1.1rem" }}>navigate_before</Icon>
          Précédent
        </MDButton>

        {pageNumbers.map((page, idx) => {
          if (page === "...") {
            return (
              <MDTypography
                key={`ellipsis-${idx}`}
                variant="caption"
                sx={{ px: 0.75, color: brand.textSecondary, fontWeight: "bold" }}
              >
                ...
              </MDTypography>
            );
          }

          const isActive = page === currentPage;
          return (
            <MDButton
              key={page}
              variant={isActive ? "contained" : "outlined"}
              size="small"
              onClick={() => onPageChange(page)}
              sx={buttonStyle(isActive)}
            >
              {page}
            </MDButton>
          );
        })}

        <MDButton
          variant="outlined"
          size="small"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          sx={navButtonStyle(currentPage >= totalPages)}
        >
          Suivant
          <Icon sx={{ ml: 0.5, fontSize: "1.1rem" }}>navigate_next</Icon>
        </MDButton>
      </MDBox>
    </MDBox>
  );
}

TablePagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  itemLabel: PropTypes.string,
};

export default TablePagination;
