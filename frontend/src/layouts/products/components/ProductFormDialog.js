import PropTypes from "prop-types";

import Dialog from "@mui/material/Dialog";

import DialogTitle from "@mui/material/DialogTitle";

import DialogContent from "@mui/material/DialogContent";

import DialogActions from "@mui/material/DialogActions";

import Grid from "@mui/material/Grid";

import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Slide from "@mui/material/Slide";

import { forwardRef } from "react";

import MDBox from "components/MDBox";

import MDTypography from "components/MDTypography";

import MDInput from "components/MDInput";

import MDButton from "components/MDButton";

import brand from "assets/theme/base/brand";



const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

Transition.displayName = "DialogTransition";



const inputStyles = {
  backgroundColor: "#0d080a",
  borderRadius: "10px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2a1e24 !important",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#f50057 !important",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#f50057 !important",
  },
  "& input, & textarea": {
    color: "#a89a9f",
  },
};



const labelSx = {
  fontWeight: 700,
  color: "#a89a9f",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  fontSize: "0.65rem",
  mb: 0.75,
  display: "block",
};



const buttonGradientSx = {
  background: "#f50057",
  color: "white !important",
  borderRadius: "10px",
  fontWeight: 700,
  textTransform: "uppercase",
  boxShadow: "0 4px 14px 0 rgba(245, 0, 87, 0.39)",
  "&:hover": {
    background: "#d8004d",
    boxShadow: "0 6px 20px 0 rgba(245, 0, 87, 0.45)",
  },
};



function ProductFormDialog({ open, onClose, onSubmit, formData, onChange, errors, loading, isEdit }) {
  const total = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.price) || 0);
  const currencySymbol = formData.currency === "TND" ? "TND" : formData.currency === "USD" ? "$" : "€";

  return (
    <Dialog

      open={open}

      onClose={onClose}

      maxWidth="sm"

      fullWidth

      TransitionComponent={Transition}

      PaperProps={{
        sx: {
          backgroundColor: "#1a1114",
          borderRadius: "16px",
          border: "1px solid #2a1e24",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
        },
      }}

    >

      <DialogTitle sx={{ pb: 1, pt: 3, px: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>

        <MDBox display="flex" alignItems="center" gap={1.5}>

          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="2.5rem"
            height="2.5rem"
            borderRadius="10px"
            sx={{ backgroundColor: "rgba(245, 0, 87, 0.15)" }}
          >
            <Icon sx={{ color: "#f50057" }}>{isEdit ? "edit" : "add"}</Icon>
          </MDBox>
          <MDBox>
            <MDTypography variant="h6" fontWeight="bold" sx={{ color: "white" }}>
              {isEdit ? "Modifier le produit" : "Ajouter un produit"}
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: "#a89a9f" }}>
              {isEdit ? "Mettez à jour les informations du produit" : "Remplissez les champs pour créer un nouvel article"}
            </MDTypography>
          </MDBox>
        </MDBox>
        <IconButton onClick={onClose} sx={{ 
          backgroundColor: "#1f1619", 
          borderRadius: "8px", 
          p: 0.5,
          "&:hover": { backgroundColor: "#2d2226" } 
        }}>
          <Icon sx={{ color: "#a89a9f", fontSize: "1.2rem" }}>close</Icon>
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>

        <MDBox component="form" pt={1}>

          <Grid container spacing={2.5}>

            <Grid item xs={12}>
              <MDTypography variant="caption" sx={labelSx}>
                NOM DU PRODUIT <span style={{ color: "#f50057" }}>*</span>
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
                CATÉGORIE <span style={{ color: "#f50057" }}>*</span>
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
                QUANTITÉ EN STOCK <span style={{ color: "#f50057" }}>*</span>
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
                PRIX UNITAIRE <span style={{ color: "#f50057" }}>*</span>
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
                DEVISE <span style={{ color: "#f50057" }}>*</span>
              </MDTypography>
              <MDInput
                select
                name="currency"
                value={formData.currency || "EUR"}
                onChange={onChange}
                fullWidth
                InputProps={{ sx: inputStyles }}
              >
                <MenuItem value="EUR">Euro (€)</MenuItem>
                <MenuItem value="TND">Dinar (TND)</MenuItem>
                <MenuItem value="USD">Dollar ($)</MenuItem>
              </MDInput>
            </Grid>
            <Grid item xs={12}>
              <MDTypography variant="caption" sx={labelSx}>
                PHOTO DU PRODUIT (URL Optionnelle)
              </MDTypography>
              <MDInput
                name="imageUrl"
                value={formData.imageUrl}
                onChange={onChange}
                fullWidth
                error={Boolean(errors.imageUrl)}
                placeholder="https://..."
                InputProps={{ sx: inputStyles }}
              />
              {errors.imageUrl && (
                <MDTypography variant="caption" color="error" mt={0.5} display="block">
                  {errors.imageUrl}
                </MDTypography>
              )}
            </Grid>
          </Grid>
          <MDBox mt={3} p={2} borderRadius="10px" sx={{ backgroundColor: "rgba(245,0,87,0.05)", border: `1px dashed #2a1e24` }}>
            <MDTypography variant="h6" fontWeight="bold" sx={{ color: "white", display: "flex", justifyContent: "space-between" }}>
              <span>Total Estimé :</span>
              <span style={{ color: "#f50057" }}>
                {total.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currencySymbol}
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
            borderColor: "#2a1e24",
            color: "#a89a9f",
            backgroundColor: "transparent",
            "&:hover": { borderColor: "#f50057", color: "#f50057" },
          }}
        >
          ANNULER
        </MDButton>
        <MDButton variant="contained" onClick={onSubmit} disabled={loading} sx={buttonGradientSx}>
          {loading ? <CircularProgress size={18} color="inherit" /> : isEdit ? "ENREGISTRER" : "CRÉER LE PRODUIT"}
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

