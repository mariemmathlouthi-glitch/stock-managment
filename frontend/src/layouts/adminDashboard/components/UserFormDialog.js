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
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import { getBrandTokens } from "assets/theme/base/brand";
import { useMaterialUIController } from "context";

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
Transition.displayName = "UserDialogTransition";

function UserFormDialog({ open, onClose, onSubmit, formData, onChange, errors, loading, isEdit }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const brand = useMemo(() => getBrandTokens(darkMode), [darkMode]);

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
    "& input, & textarea, & .MuiSelect-select": {
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
            <Icon sx={{ color: brand.accent }}>{isEdit ? "manage_accounts" : "person_add"}</Icon>
          </MDBox>
          <MDBox>
            <MDTypography variant="h6" fontWeight="bold" sx={{ color: brand.textPrimary }}>
              {isEdit ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: brand.textSecondary }}>
              {isEdit
                ? "Mettez à jour les informations du compte"
                : "Remplissez les informations pour créer un nouveau compte"}
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

      <MDBox component="form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <DialogContent sx={{ px: 3 }}>
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
              {errors.general}
            </Alert>
          )}
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <MDTypography variant="caption" sx={labelSx}>
                PRÉNOM <span style={{ color: brand.accent }}>*</span>
              </MDTypography>
              <MDInput
                name="prenom"
                value={formData.prenom || ""}
                onChange={onChange}
                fullWidth
                error={Boolean(errors.prenom)}
                placeholder="Ex: Jean"
                InputProps={{ sx: inputStyles }}
              />
              {errors.prenom && (
                <MDTypography variant="caption" color="error" mt={0.5} display="block">
                  {errors.prenom}
                </MDTypography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDTypography variant="caption" sx={labelSx}>
                NOM <span style={{ color: brand.accent }}>*</span>
              </MDTypography>
              <MDInput
                name="nom"
                value={formData.nom || ""}
                onChange={onChange}
                fullWidth
                error={Boolean(errors.nom)}
                placeholder="Ex: Dupont"
                InputProps={{ sx: inputStyles }}
              />
              {errors.nom && (
                <MDTypography variant="caption" color="error" mt={0.5} display="block">
                  {errors.nom}
                </MDTypography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDTypography variant="caption" sx={labelSx}>
                ADRESSE EMAIL <span style={{ color: brand.accent }}>*</span>
              </MDTypography>
              <MDInput
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={onChange}
                fullWidth
                error={Boolean(errors.email)}
                placeholder="exemple@domaine.com"
                InputProps={{ sx: inputStyles }}
              />
              {errors.email && (
                <MDTypography variant="caption" color="error" mt={0.5} display="block">
                  {errors.email}
                </MDTypography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDTypography variant="caption" sx={labelSx}>
                TÉLÉPHONE <span style={{ color: brand.accent }}>*</span>
              </MDTypography>
              <MDInput
                name="telephone"
                value={formData.telephone || ""}
                onChange={onChange}
                fullWidth
                error={Boolean(errors.telephone)}
                placeholder="Ex: +216 20 123 456"
                InputProps={{ sx: inputStyles }}
              />
              {errors.telephone && (
                <MDTypography variant="caption" color="error" mt={0.5} display="block">
                  {errors.telephone}
                </MDTypography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDTypography variant="caption" sx={labelSx}>
                RÔLE <span style={{ color: brand.accent }}>*</span>
              </MDTypography>
              <FormControl fullWidth size="small">
                <Select
                  name="role"
                  value={formData.role || "user"}
                  onChange={onChange}
                  sx={{ height: 44, borderRadius: "10px", ...inputStyles }}
                >
                  <MenuItem value="user">Utilisateur (Standard)</MenuItem>
                  <MenuItem value="admin">Administrateur</MenuItem>
                </Select>
              </FormControl>
              {errors.role && (
                <MDTypography variant="caption" color="error" mt={0.5} display="block">
                  {errors.role}
                </MDTypography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDTypography variant="caption" sx={labelSx}>
                STATUT DU COMPTE <span style={{ color: brand.accent }}>*</span>
              </MDTypography>
              <FormControl fullWidth size="small">
                <Select
                  name="estActif"
                  value={formData.estActif !== undefined ? formData.estActif : true}
                  onChange={onChange}
                  sx={{ height: 44, borderRadius: "10px", ...inputStyles }}
                >
                  <MenuItem value={true}>Actif</MenuItem>
                  <MenuItem value={false}>Désactivé</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <MDTypography variant="caption" sx={labelSx}>
                MOT DE PASSE {!isEdit && <span style={{ color: brand.accent }}>*</span>}
              </MDTypography>
              <MDInput
                name="motDePasse"
                type="password"
                value={formData.motDePasse || ""}
                onChange={onChange}
                fullWidth
                error={Boolean(errors.motDePasse)}
                placeholder={
                  isEdit ? "Laisser vide pour conserver le mot de passe actuel" : "••••••••"
                }
                InputProps={{ sx: inputStyles }}
              />
              {errors.motDePasse && (
                <MDTypography variant="caption" color="error" mt={0.5} display="block">
                  {errors.motDePasse}
                </MDTypography>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <MDButton
            type="button"
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
          <MDButton
            type="submit"
            variant="contained"
            onClick={onSubmit}
            disabled={loading}
            sx={buttonGradientSx}
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : isEdit ? (
              "ENREGISTRER"
            ) : (
              "CRÉER L'UTILISATEUR"
            )}
          </MDButton>
        </DialogActions>
      </MDBox>
    </Dialog>
  );
}

UserFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    prenom: PropTypes.string,
    nom: PropTypes.string,
    email: PropTypes.string,
    telephone: PropTypes.string,
    role: PropTypes.string,
    estActif: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    motDePasse: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

export default UserFormDialog;
