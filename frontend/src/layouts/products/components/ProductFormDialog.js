import PropTypes from "prop-types";
import { forwardRef, useMemo } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import { getBrand } from "assets/theme/base/brand";
import { useMaterialUIController } from "context";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
Transition.displayName = "DialogTransition";

function ProductFormDialog({ open, onClose, onSubmit, formData, onChange, errors, loading, isEdit }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const brand = useMemo(() => getBrand(darkMode), [darkMode]);

  const total = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.price) || 0);
  const currencySymbol =
    formData.currency === "TND" ? "TND" : formData.currency === "USD" ? "$" : "€";

  const inputStyles = {
    backgroundColor: brand.inputBg,
    borderRadius: "10px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: `${brand.inputBorder} !important`,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: `${brand.accent} !important`,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: `${brand.accent} !important`,
    },
    "& input, & textarea": {
      color: brand.textPrimary,
    },
  };

  const labelSx = {
    fontWeight: 700,
    color: brand.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontSize: "0.65rem",
    mb: 0.75,
    display: "block",
  };

  const buttonGradientSx = {
    background: brand.gradientButton,
    color: "white !important",
    borderRadius: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    boxShadow: brand.shadowAccent,
    "&:hover": {
      background: brand.gradientButtonHover,
      boxShadow: brand.shadowAccentHover,
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          backgroundColor: brand.cardBg,
          borderRadius: "16px",
          border: `1px solid ${brand.inputBorder}`,
          overflow: "hidden",
          boxShadow: brand.shadowCardHover,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          pt: 3,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <MDBox display="flex" alignItems="center" gap={1.5}>
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="2.5rem"
            height="2.5rem"
            borderRadius="10px"
            sx={{ backgroundColor: brand.iconBoxBg }}
          >
            <Icon sx={{ color: brand.accent }}>{isEdit ? "edit" : "add"}</Icon>
          </MDBox>
          <MDBox>
            <MDTypography variant="h6" fontWeight="bold" sx={{ color: brand.textPrimary }}>
              {isEdit ? "Modifier le produit" : "Ajouter un produit"}
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: brand.textSecondary }}>
              {isEdit
                ? "Mettez à jour les informations du produit"
                : "Remplissez les champs pour créer un nouvel article"}
            </MDTypography>
          </MDBox>
        </MDBox>
        <IconButton
          onClick={onClose}
          sx={{
            backgroundColor: brand.inputBg,
            borderRadius: "8px",
            p: 0.5,
            "&:hover": { backgroundColor: brand.inputBorder },
          }}
        >
          <Icon sx={{ color: brand.iconMuted, fontSize: "1.2rem" }}>close</Icon>
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        <MDBox component="form" pt={1}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <MDTypography variant="caption" sx={labelSx}>
                NOM DU PRODUIT <span style={{ color: brand.accent }}>*</span>
              </MDTypography>
              <MDInput
                name="name"
                value={formData.name}
                onChange={onChange}
                fullWidth
                error={Boolean(errors.name)}
                placeholder="Nom du produit"
                InputProps={{ sx: inputStyles }}
              />
              {errors.name && (
                <MDTypography variant="caption" color="error" mt={0.5} display="block">
                  {errors.name}
                </MDTypography>
              )}
            </Grid>

            <Grid item xs={12}>
              <MDTypography variant="caption" sx={labelSx}>
                DESCRIPTION DU PRODUIT (Optionnel)
              </MDTypography>
              <MDInput
                name="description"
                value={formData.description}
                onChange={onChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Description du produit"
                InputProps={{ sx: inputStyles }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDTypography variant="caption" sx={labelSx}>
                CATÉGORIE <span style={{ color: brand.accent }}>*</span>
              </MDTypography>
              <MDInput
                name="category"
                value={formData.category}
                onChange={onChange}
                fullWidth
                error={Boolean(errors.category)}
                placeholder="Ex: Informatique"
                InputProps={{ sx: inputStyles }}
              />
              {errors.category && (
                <MDTypography variant="caption" color="error" mt={0.5} display="block">
                  {errors.category}
                </MDTypography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDTypography variant="caption" sx={labelSx}>
                QUANTITÉ EN STOCK <span style={{ color: brand.accent }}>*</span>
              </MDTypography>
              <MDInput
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={onChange}
                fullWidth
                error={Boolean(errors.quantity)}
                placeholder="0"
                inputProps={{ min: 0 }}
                InputProps={{ sx: inputStyles }}
              />
              {errors.quantity && (
                <MDTypography variant="caption" color="error" mt={0.5} display="block">
                  {errors.quantity}
                </MDTypography>
              )}
            </Grid>

            <Grid item xs={12} sm={8}>
              <MDTypography variant="caption" sx={labelSx}>
                PRIX UNITAIRE <span style={{ color: brand.accent }}>*</span>
              </MDTypography>
              <MDInput
                name="price"
                type="number"
                value={formData.price}
                onChange={onChange}
                fullWidth
                error={Boolean(errors.price)}
                placeholder="0.00"
                inputProps={{ min: 0, step: "0.01" }}
                InputProps={{ sx: inputStyles }}
              />
              {errors.price && (
                <MDTypography variant="caption" color="error" mt={0.5} display="block">
                  {errors.price}
                </MDTypography>
              )}
            </Grid>

            <Grid item xs={12} sm={4}>
              <MDTypography variant="caption" sx={labelSx}>
                DEVISE
              </MDTypography>
              <MDInput
                name="currency"
                value={formData.currency || "EUR"}
                onChange={onChange}
                fullWidth
                select
                SelectProps={{ native: true }}
                InputProps={{ sx: inputStyles }}
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="TND">TND</option>
              </MDInput>
            </Grid>
          </Grid>

          <MDBox
            mt={3}
            p={2}
            borderRadius="10px"
            sx={{
              backgroundColor: brand.iconBoxBg,
              border: `1px dashed ${brand.inputBorder}`,
            }}
          >
            <MDTypography
              variant="h6"
              fontWeight="bold"
              sx={{ color: brand.textPrimary, display: "flex", justifyContent: "space-between" }}
            >
              <span>Total Estimé :</span>
              <span style={{ color: brand.accent }}>
                {total.toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {currencySymbol}
              </span>
            </MDTypography>
          </MDBox>
        </MDBox>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <MDButton
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: "10px",
            borderColor: brand.inputBorder,
            color: brand.textSecondary,
            backgroundColor: "transparent",
            "&:hover": { borderColor: brand.accent, color: brand.accent },
          }}
        >
          ANNULER
        </MDButton>
        <MDButton variant="contained" onClick={onSubmit} disabled={loading} sx={buttonGradientSx}>
          {loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : isEdit ? (
            "ENREGISTRER"
          ) : (
            "CRÉER LE PRODUIT"
          )}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

ProductFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currency: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

export default ProductFormDialog;
