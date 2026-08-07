import PropTypes from "prop-types";

import Dialog from "@mui/material/Dialog";

import DialogTitle from "@mui/material/DialogTitle";

import DialogContent from "@mui/material/DialogContent";

import DialogActions from "@mui/material/DialogActions";

import CircularProgress from "@mui/material/CircularProgress";

import Icon from "@mui/material/Icon";

import Slide from "@mui/material/Slide";

import { forwardRef } from "react";

import MDBox from "components/MDBox";

import MDTypography from "components/MDTypography";

import MDButton from "components/MDButton";

import brand from "assets/theme/base/brand";



const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

Transition.displayName = "DeleteDialogTransition";



function DeleteConfirmDialog({ open, onClose, onConfirm, productName, loading }) {

  return (

    <Dialog

      open={open}

      onClose={onClose}

      maxWidth="xs"

      fullWidth

      TransitionComponent={Transition}

      PaperProps={{

        sx: {

          borderRadius: "16px",

          overflow: "hidden",

          boxShadow: "0 24px 60px rgba(26, 18, 21, 0.18)",

        },

      }}

    >

      <DialogTitle sx={{ pt: 3, px: 3, pb: 1 }}>

        <MDBox display="flex" alignItems="center" gap={1.5}>

          <MDBox

            display="flex"

            alignItems="center"

            justifyContent="center"

            width="2.5rem"

            height="2.5rem"

            borderRadius="10px"

            sx={{ backgroundColor: brand.status.error.bg }}

          >

            <Icon sx={{ color: brand.status.error.color }}>delete_forever</Icon>

          </MDBox>

          <MDTypography variant="h5" fontWeight="bold" sx={{ color: brand.textPrimary }}>

            Confirmer la suppression

          </MDTypography>

        </MDBox>

      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>

        <MDTypography variant="body2" sx={{ color: brand.textSecondary, lineHeight: 1.7 }}>

          Êtes-vous sûr de vouloir supprimer ce produit

          {productName ? (

            <>

              {" "}

              <MDTypography component="span" fontWeight="bold" sx={{ color: brand.textPrimary }}>

                « {productName} »

              </MDTypography>

            </>

          ) : (

            ""

          )}{" "}

          ? Cette action est irréversible.

        </MDTypography>

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

            "&:hover": { borderColor: brand.accent, color: brand.accent },

          }}

        >

          Annuler

        </MDButton>

        <MDButton

          variant="contained"

          onClick={onConfirm}

          disabled={loading}

          sx={{

            borderRadius: "10px",

            backgroundColor: brand.status.error.color,

            color: "white !important",

            fontWeight: 600,

            boxShadow: "0 4px 14px rgba(239, 68, 68, 0.35)",

            "&:hover": {

              backgroundColor: "#dc2626",

              boxShadow: "0 6px 20px rgba(239, 68, 68, 0.45)",

            },

          }}

        >

          {loading ? <CircularProgress size={18} color="inherit" /> : "Supprimer"}

        </MDButton>

      </DialogActions>

    </Dialog>

  );

}



DeleteConfirmDialog.propTypes = {

  open: PropTypes.bool.isRequired,

  onClose: PropTypes.func.isRequired,

  onConfirm: PropTypes.func.isRequired,

  productName: PropTypes.string,

  loading: PropTypes.bool.isRequired,

};



export default DeleteConfirmDialog;
