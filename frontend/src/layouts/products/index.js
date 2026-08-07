import { useState, useEffect, useMemo, useCallback } from "react";

import Grid from "@mui/material/Grid";

import Card from "@mui/material/Card";

import Table from "@mui/material/Table";

import TableBody from "@mui/material/TableBody";

import TableCell from "@mui/material/TableCell";

import TableContainer from "@mui/material/TableContainer";

import TableHead from "@mui/material/TableHead";

import TableRow from "@mui/material/TableRow";

import Icon from "@mui/material/Icon";

import IconButton from "@mui/material/IconButton";

import CircularProgress from "@mui/material/CircularProgress";

import Snackbar from "@mui/material/Snackbar";

import Alert from "@mui/material/Alert";

import Chip from "@mui/material/Chip";

import InputAdornment from "@mui/material/InputAdornment";

import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";

import FormControl from "@mui/material/FormControl";

import Fade from "@mui/material/Fade";

import Grow from "@mui/material/Grow";

import Box from "@mui/material/Box";

import * as yup from "yup";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Footer from "examples/Footer";

import MDBox from "components/MDBox";

import MDTypography from "components/MDTypography";

import MDInput from "components/MDInput";

import MDButton from "components/MDButton";

import brand from "assets/theme/base/brand";

import { fetchProducts, createProduct, updateProduct, deleteProduct } from "api/products";

import ProductFormDialog from "layouts/products/components/ProductFormDialog";

import DeleteConfirmDialog from "layouts/products/components/DeleteConfirmDialog";

const LOW_STOCK_THRESHOLD = 10;

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  quantity: "",
  price: "",
  currency: "EUR",
  imageUrl: "",
};

// NOTE: This is a temporary restore stub - full file being restored
function Products() {
  return null;
}

export default Products;
