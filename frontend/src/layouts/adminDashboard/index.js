import { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
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
import Tooltip from "@mui/material/Tooltip";
import * as yup from "yup";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import { getBrandTokens } from "assets/theme/base/brand";
import { useMaterialUIController } from "context";

import { fetchUsers, createUser, updateUser, deleteUser, toggleUserStatus } from "api/users";
import UserFormDialog from "./components/UserFormDialog";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import TablePagination from "components/TablePagination";

const EMPTY_USER_FORM = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  role: "user",
  estActif: true,
  motDePasse: "",
};

const createUserSchema = yup.object().shape({
  prenom: yup.string().trim().required("Le prénom est requis"),
  nom: yup.string().trim().required("Le nom est requis"),
  email: yup.string().trim().email("Adresse email invalide").required("L'email est requis"),
  telephone: yup.string().trim().required("Le numéro de téléphone est requis"),
  role: yup.string().oneOf(["admin", "user"]).required("Le rôle est requis"),
  estActif: yup.boolean().required(),
  motDePasse: yup
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Le mot de passe est requis"),
});

const updateUserSchema = yup.object().shape({
  prenom: yup.string().trim().required("Le prénom est requis"),
  nom: yup.string().trim().required("Le nom est requis"),
  email: yup.string().trim().email("Adresse email invalide").required("L'email est requis"),
  telephone: yup.string().trim().required("Le numéro de téléphone est requis"),
  role: yup.string().oneOf(["admin", "user"]).required("Le rôle est requis"),
  estActif: yup.boolean().required(),
  motDePasse: yup
    .string()
    .transform((curr) => (curr === "" ? undefined : curr))
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .optional()
    .nullable(),
});

const COLUMNS = [
  { name: "Utilisateur", width: "25%", minWidth: "220px", align: "left" },
  { name: "Email", width: "20%", minWidth: "180px", align: "left" },
  { name: "Téléphone", width: "15%", minWidth: "130px", align: "left" },
  { name: "Rôle", width: "12%", minWidth: "120px", align: "left" },
  { name: "Statut", width: "13%", minWidth: "120px", align: "left" },
  { name: "Actions", width: "15%", minWidth: "130px", align: "center" },
];

function StatCard({ title, value, icon, iconColor, iconBg, delay = 0 }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const brand = useMemo(() => getBrandTokens(darkMode), [darkMode]);

  return (
    <Grow in timeout={400 + delay}>
      <Card
        sx={{
          borderRadius: "16px",
          p: 2.5,
          height: "100%",
          backgroundColor: brand.cardBg,
          border: `1px solid ${brand.inputBorder}`,
          boxShadow: brand.shadowCard,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: brand.shadowCardHover,
            transform: "translateY(-3px)",
          },
        }}
      >
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start">
          <MDBox>
            <MDTypography
              variant="caption"
              fontWeight="medium"
              sx={{ color: brand.textSecondary, textTransform: "uppercase", letterSpacing: 0.5 }}
            >
              {title}
            </MDTypography>
            <MDTypography
              variant="h4"
              fontWeight="bold"
              mt={0.75}
              sx={{ color: brand.textPrimary }}
            >
              {value}
            </MDTypography>
          </MDBox>
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="3rem"
            height="3rem"
            borderRadius="12px"
            sx={{ backgroundColor: iconBg }}
          >
            <Icon sx={{ color: iconColor, fontSize: "1.35rem" }}>{icon}</Icon>
          </MDBox>
        </MDBox>
      </Card>
    </Grow>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  iconBg: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

function StatusChip({ estActif }) {
  return (
    <Chip
      label={
        <MDBox display="flex" alignItems="center" gap={0.75}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: estActif ? "#10b981" : "#ef4444",
            }}
          />
          {estActif ? "Actif" : "Désactivé"}
        </MDBox>
      }
      size="small"
      sx={{
        backgroundColor: estActif ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
        color: estActif ? "#10b981" : "#ef4444",
        fontWeight: 700,
        fontSize: "0.72rem",
        height: 26,
        borderRadius: "8px",
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}

StatusChip.propTypes = {
  estActif: PropTypes.bool.isRequired,
};

function RoleChip({ role }) {
  const isAdmin = role === "admin";
  return (
    <Chip
      label={isAdmin ? "Admin" : "Utilisateur"}
      size="small"
      sx={{
        backgroundColor: isAdmin ? "rgba(176, 42, 70, 0.12)" : "rgba(107, 114, 128, 0.12)",
        color: isAdmin ? "#b02a46" : "#6b7280",
        fontWeight: 700,
        fontSize: "0.72rem",
        height: 26,
        borderRadius: "8px",
        "& .MuiChip-label": { px: 1.25 },
      }}
    />
  );
}

RoleChip.propTypes = {
  role: PropTypes.string.isRequired,
};

function AdminDashboard() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const brand = useMemo(() => getBrandTokens(darkMode), [darkMode]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(EMPTY_USER_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [apiError, setApiError] = useState(null);

  let currentUserId = null;
  try {
    const currentUser = JSON.parse(localStorage.getItem("utilisateur"));
    currentUserId = currentUser ? currentUser.id : null;
  } catch (e) {
    currentUserId = null;
  }

  const showNotification = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await fetchUsers();
      const userList = Array.isArray(data) ? data : data.users || [];
      setUsers(userList);
    } catch (error) {
      setApiError(error.message || "Erreur de connexion au serveur API / MongoDB.");
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.estActif !== false).length;
    const inactiveUsers = users.filter((u) => u.estActif === false).length;
    const adminCount = users.filter((u) => u.role === "admin").length;
    return { totalUsers, activeUsers, inactiveUsers, adminCount };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        (user.nom || "").toLowerCase().includes(searchLower) ||
        (user.prenom || "").toLowerCase().includes(searchLower) ||
        (user.email || "").toLowerCase().includes(searchLower) ||
        (user.telephone || "").toLowerCase().includes(searchLower);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const userStatus = user.estActif !== false ? "actif" : "inactif";
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "actif" && userStatus === "actif") ||
        (statusFilter === "inactif" && userStatus === "inactif");

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setFormData(EMPTY_USER_FORM);
    setFormErrors({});
    setFormOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      prenom: user.prenom || "",
      nom: user.nom || "",
      email: user.email || "",
      telephone: user.telephone || "",
      role: user.role || "user",
      estActif: user.estActif !== false,
      motDePasse: "",
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "estActif" ? (value === true || value === "true") : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (formErrors[name] || formErrors.general) {
      setFormErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const handleFormSubmit = async () => {
    try {
      const isEdit = Boolean(selectedUser);
      const schema = isEdit ? updateUserSchema : createUserSchema;
      const validatedPayload = await schema.validate(formData, { abortEarly: false });

      setFormErrors({});
      setFormLoading(true);

      if (isEdit) {
        const data = await updateUser(selectedUser._id, validatedPayload);
        setUsers((prev) => prev.map((u) => (u._id === selectedUser._id ? data.user : u)));
        showNotification("Utilisateur mis à jour avec succès.");
      } else {
        const data = await createUser(validatedPayload);
        setUsers((prev) => [data.user, ...prev]);
        showNotification("Utilisateur créé avec succès.");
      }

      setFormOpen(false);
    } catch (error) {
      if (error.inner) {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
      } else {
        setFormErrors({ general: error.message });
        showNotification(error.message, "error");
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (user._id === currentUserId) {
      showNotification("Vous ne pouvez pas désactiver votre propre compte.", "warning");
      return;
    }

    setStatusLoadingId(user._id);
    try {
      const data = await toggleUserStatus(user._id);
      setUsers((prev) => prev.map((u) => (u._id === user._id ? data.user : u)));
      showNotification(data.message || "Statut mis à jour.");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    if (selectedUser._id === currentUserId) {
      showNotification("Vous ne pouvez pas supprimer votre propre compte.", "error");
      setDeleteOpen(false);
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteUser(selectedUser._id);
      setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
      showNotification("Utilisateur supprimé avec succès.");
      setDeleteOpen(false);
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

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
      borderWidth: "1.5px",
    },
  };

  const buttonGradientSx = {
    background: brand.gradientButton,
    color: "white !important",
    borderRadius: "10px",
    fontWeight: 600,
    letterSpacing: 0.5,
    boxShadow: brand.shadowAccent,
    transition: "all 0.25s ease",
    "&:hover": {
      background: brand.gradientButtonHover,
      boxShadow: brand.shadowAccentHover,
      transform: "translateY(-1px)",
    },
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3}>
        <Fade in timeout={500}>
          <MDBox mb={4}>
            <MDBox display="flex" alignItems="center" mb={1}>
              <MDBox width="28px" height="2px" sx={{ backgroundColor: brand.accent }} mr={1.5} />
              <MDTypography
                variant="caption"
                fontWeight="bold"
                sx={{ color: brand.accent, letterSpacing: 1.2 }}
              >
                ADMINISTRATION
              </MDTypography>
            </MDBox>
            <MDTypography variant="h3" fontWeight="bold" sx={{ color: brand.textPrimary }}>
              Gestion des utilisateurs
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: brand.textSecondary, mt: 0.5 }}>
              Gérez les comptes, attribuez les rôles et contrôlez l&apos;accès à la plateforme.
            </MDTypography>
          </MDBox>
        </Fade>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Utilisateurs"
              value={stats.totalUsers}
              icon="group"
              iconColor={brand.accent}
              iconBg="rgba(176,42,70,0.12)"
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Comptes Actifs"
              value={stats.activeUsers}
              icon="check_circle"
              iconColor="#10b981"
              iconBg="rgba(16, 185, 129, 0.12)"
              delay={80}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Comptes Désactivés"
              value={stats.inactiveUsers}
              icon="block"
              iconColor="#ef4444"
              iconBg="rgba(239, 68, 68, 0.12)"
              delay={160}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Administrateurs"
              value={stats.adminCount}
              icon="admin_panel_settings"
              iconColor="#3b82f6"
              iconBg="rgba(59, 130, 246, 0.12)"
              delay={240}
            />
          </Grid>
        </Grid>

        <Fade in timeout={600}>
          <Card
            sx={{
              borderRadius: "16px",
              overflow: "hidden",
              border: `1px solid ${brand.inputBorder}`,
              backgroundColor: brand.cardBg,
              boxShadow: brand.shadowCard,
            }}
          >
            <MDBox
              p={3}
              sx={{
                borderBottom: `1px solid ${brand.inputBorder}`,
                background: `linear-gradient(180deg, ${brand.cardBg} 0%, ${brand.inputBg} 100%)`,
              }}
            >
              <MDBox
                display="flex"
                flexDirection={{ xs: "column", lg: "row" }}
                gap={2}
                alignItems={{ lg: "center" }}
              >
                <MDInput
                  placeholder="Rechercher par nom, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon fontSize="small" sx={{ color: brand.iconMuted }}>
                          search
                        </Icon>
                      </InputAdornment>
                    ),
                    sx: inputStyles,
                  }}
                  sx={{ maxWidth: { lg: 300 } }}
                />

                <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
                  <Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start" sx={{ ml: 0.5 }}>
                        <Icon fontSize="small" sx={{ color: brand.iconMuted }}>
                          badge
                        </Icon>
                      </InputAdornment>
                    }
                    sx={{ height: 42, borderRadius: "10px", ...inputStyles }}
                  >
                    <MenuItem value="all">Tous les rôles</MenuItem>
                    <MenuItem value="admin">Administrateur</MenuItem>
                    <MenuItem value="user">Utilisateur</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start" sx={{ ml: 0.5 }}>
                        <Icon fontSize="small" sx={{ color: brand.iconMuted }}>
                          flaky
                        </Icon>
                      </InputAdornment>
                    }
                    sx={{ height: 42, borderRadius: "10px", ...inputStyles }}
                  >
                    <MenuItem value="all">Tous les statuts</MenuItem>
                    <MenuItem value="actif">Actif</MenuItem>
                    <MenuItem value="inactif">Désactivé</MenuItem>
                  </Select>
                </FormControl>

                <MDBox display="flex" justifyContent="flex-end" flex={1}>
                  <MDButton
                    variant="contained"
                    onClick={handleOpenCreate}
                    sx={{ ...buttonGradientSx, whiteSpace: "nowrap", px: 2.5 }}
                  >
                    <Icon sx={{ mr: 0.5, fontSize: "1.1rem" }}>person_add</Icon>
                    Ajouter utilisateur
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>

            <MDBox p={{ xs: 2, md: 3 }} pt={2}>
              {loading ? (
                <MDBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  py={10}
                  gap={2}
                >
                  <CircularProgress sx={{ color: brand.accent }} size={36} />
                  <MDTypography variant="caption" sx={{ color: brand.textSecondary }}>
                    Chargement des utilisateurs depuis MongoDB...
                  </MDTypography>
                </MDBox>
              ) : apiError ? (
                <MDBox textAlign="center" py={8} px={3}>
                  <MDBox
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    width="4rem"
                    height="4rem"
                    borderRadius="16px"
                    mb={2}
                    sx={{ backgroundColor: "rgba(239, 68, 68, 0.12)" }}
                  >
                    <Icon sx={{ fontSize: 32, color: "#ef4444" }}>warning</Icon>
                  </MDBox>
                  <MDTypography variant="h5" fontWeight="bold" sx={{ color: brand.textPrimary }}>
                    Erreur de chargement des utilisateurs
                  </MDTypography>
                  <MDTypography
                    variant="body2"
                    sx={{ color: brand.textSecondary, mt: 1, mb: 3, maxWidth: 520, mx: "auto" }}
                  >
                    {apiError}
                  </MDTypography>
                  <MDButton variant="contained" onClick={loadUsers} sx={buttonGradientSx}>
                    <Icon sx={{ mr: 1 }}>refresh</Icon>
                    Réessayer la connexion
                  </MDButton>
                </MDBox>
              ) : filteredUsers.length === 0 ? (
                <MDBox textAlign="center" py={10}>
                  <MDBox
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    width="4rem"
                    height="4rem"
                    borderRadius="16px"
                    mb={2}
                    sx={{ backgroundColor: "rgba(176,42,70,0.08)" }}
                  >
                    <Icon sx={{ fontSize: 32, color: brand.accent }}>group</Icon>
                  </MDBox>
                  <MDTypography variant="h6" fontWeight="bold" sx={{ color: brand.textPrimary }}>
                    {users.length === 0
                      ? "Aucun utilisateur trouvé"
                      : "Aucun utilisateur ne correspond à la recherche"}
                  </MDTypography>
                  <MDTypography variant="body2" sx={{ color: brand.textSecondary, mt: 0.5 }}>
                    {users.length === 0
                      ? "Commencez par ajouter votre premier utilisateur."
                      : "Essayez de modifier vos filtres."}
                  </MDTypography>
                  {users.length === 0 && (
                    <MDButton
                      variant="contained"
                      onClick={handleOpenCreate}
                      sx={{ ...buttonGradientSx, mt: 3 }}
                    >
                      Ajouter un utilisateur
                    </MDButton>
                  )}
                </MDBox>
              ) : (
                <>
                  <TableContainer sx={{ overflowX: "auto", borderRadius: "12px" }}>
                    <Table sx={{ minWidth: 800, tableLayout: "fixed", width: "100%" }}>
                      <TableHead
                        sx={{
                          display: "table-header-group !important",
                          padding: "0 !important",
                          borderRadius: "0 !important",
                        }}
                      >
                        <TableRow
                          sx={{
                            display: "table-row !important",
                            "& th": {
                              borderBottom: `1px solid ${brand.inputBorder}`,
                              backgroundColor: brand.inputBg,
                              py: 1.75,
                              display: "table-cell !important",
                            },
                          }}
                        >
                          {COLUMNS.map((col) => (
                            <TableCell
                              key={col.name}
                              align={col.align}
                              sx={{
                                width: col.width,
                                minWidth: col.minWidth,
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                textTransform: "uppercase",
                                letterSpacing: 0.8,
                                color: brand.textSecondary,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {col.name}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedUsers.map((user, index) => {
                          const isSelf = user._id === currentUserId;
                          return (
                            <TableRow
                              key={user._id}
                              sx={{
                                transition: "background-color 0.2s ease",
                                animation: `fadeIn 0.35s ease ${index * 0.04}s both`,
                                "@keyframes fadeIn": {
                                  from: { opacity: 0, transform: "translateY(6px)" },
                                  to: { opacity: 1, transform: "translateY(0)" },
                                },
                                "&:hover": {
                                  backgroundColor: "rgba(176,42,70,0.03)",
                                },
                                "& td": {
                                  borderBottom: `1px solid ${brand.inputBorder}`,
                                  py: 2,
                                  display: "table-cell !important",
                                },
                              }}
                            >
                              <TableCell align={COLUMNS[0].align}>
                                <MDBox display="flex" alignItems="center" gap={1.5}>
                                  <MDBox
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    width="2.75rem"
                                    height="2.75rem"
                                    borderRadius="50%"
                                    sx={{
                                      backgroundColor:
                                        user.role === "admin"
                                          ? "rgba(176,42,70,0.12)"
                                          : "rgba(59,130,246,0.12)",
                                      flexShrink: 0,
                                    }}
                                  >
                                    <MDTypography
                                      variant="button"
                                      fontWeight="bold"
                                      sx={{ color: user.role === "admin" ? brand.accent : "#3b82f6" }}
                                    >
                                      {(user.prenom || "U")[0].toUpperCase()}
                                      {(user.nom || "U")[0].toUpperCase()}
                                    </MDTypography>
                                  </MDBox>
                                  <MDBox sx={{ minWidth: 0, width: "100%" }}>
                                    <MDTypography
                                      variant="button"
                                      fontWeight="bold"
                                      display="block"
                                      sx={{ color: brand.textPrimary }}
                                    >
                                      {user.prenom} {user.nom} {isSelf && "(Vous)"}
                                    </MDTypography>
                                    <MDTypography
                                      variant="caption"
                                      display="block"
                                      sx={{ color: brand.textSecondary }}
                                    >
                                      Créé le{" "}
                                      {new Date(user.createdAt || Date.now()).toLocaleDateString(
                                        "fr-FR"
                                      )}
                                    </MDTypography>
                                  </MDBox>
                                </MDBox>
                              </TableCell>

                              <TableCell align={COLUMNS[1].align}>
                                <MDTypography variant="button" sx={{ color: brand.textPrimary }}>
                                  {user.email}
                                </MDTypography>
                              </TableCell>

                              <TableCell align={COLUMNS[2].align}>
                                <MDTypography variant="button" sx={{ color: brand.textSecondary }}>
                                  {user.telephone || "—"}
                                </MDTypography>
                              </TableCell>

                              <TableCell align={COLUMNS[3].align}>
                                <RoleChip role={user.role} />
                              </TableCell>

                              <TableCell align={COLUMNS[4].align}>
                                <StatusChip estActif={user.estActif !== false} />
                              </TableCell>

                              <TableCell align={COLUMNS[5].align}>
                                <MDBox
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  gap={0.5}
                                >
                                  <Tooltip title="Modifier">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleOpenEdit(user)}
                                      sx={{
                                        color: brand.iconMuted,
                                        "&:hover": {
                                          color: brand.accent,
                                          backgroundColor: "rgba(176,42,70,0.08)",
                                        },
                                      }}
                                    >
                                      <Icon fontSize="small">edit</Icon>
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip
                                    title={
                                      user.estActif !== false
                                        ? "Désactiver le compte"
                                        : "Activer le compte"
                                    }
                                  >
                                    <span>
                                      <IconButton
                                        size="small"
                                        disabled={isSelf || statusLoadingId === user._id}
                                        onClick={() => handleToggleStatus(user)}
                                        sx={{
                                          color: user.estActif !== false ? "#ef4444" : "#10b981",
                                          "&:hover": {
                                            backgroundColor:
                                              user.estActif !== false
                                                ? "rgba(239, 68, 68, 0.08)"
                                                : "rgba(16, 185, 129, 0.08)",
                                          },
                                        }}
                                      >
                                        {statusLoadingId === user._id ? (
                                          <CircularProgress size={16} color="inherit" />
                                        ) : (
                                          <Icon fontSize="small">
                                            {user.estActif !== false ? "block" : "check_circle"}
                                          </Icon>
                                        )}
                                      </IconButton>
                                    </span>
                                  </Tooltip>

                                  <Tooltip title="Supprimer">
                                    <span>
                                      <IconButton
                                        size="small"
                                        disabled={isSelf}
                                        onClick={() => handleOpenDelete(user)}
                                        sx={{
                                          color: brand.status.error.color,
                                          "&:hover": { backgroundColor: brand.status.error.bg },
                                        }}
                                      >
                                        <Icon fontSize="small">delete</Icon>
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                </MDBox>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    currentPage={currentPage}
                    totalItems={filteredUsers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    itemLabel="utilisateurs"
                  />
                </>
              )}
            </MDBox>
          </Card>
        </Fade>

        {/* Dialog Formulaire Utilisateur */}
        <UserFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          formData={formData}
          onChange={handleFormChange}
          errors={formErrors}
          loading={formLoading}
          isEdit={Boolean(selectedUser)}
        />

        {/* Dialog Confirmation Suppression */}
        <DeleteConfirmDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          userName={selectedUser ? `${selectedUser.prenom} ${selectedUser.nom}` : ""}
          loading={deleteLoading}
        />

        {/* Toast Notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%", color: "white" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AdminDashboard;
