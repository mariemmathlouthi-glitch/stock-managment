import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";

import { setDarkMode, useMaterialUIController } from "context";
import { getBrand } from "assets/theme/base/brand";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const EMPTY_USER = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  role: "user",
  photoUrl: "",
};

const DEFAULT_PREFERENCES = {
  lowStock: true,
  outOfStock: true,
  newOrder: false,
  weeklyReport: true,
  email: true,
  browser: false,
  compact: false,
  animations: true,
};

const getStoredPreferences = () => {
  try {
    return {
      ...DEFAULT_PREFERENCES,
      ...JSON.parse(localStorage.getItem("profilePreferences") || "{}"),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

const getStoredActivity = () => {
  try {
    const activities = JSON.parse(localStorage.getItem("profileActivity") || "[]");
    return Array.isArray(activities) ? activities : [];
  } catch {
    return [];
  }
};

const getActivityMeta = (type) => {
  const meta = {
    created: { title: "Produit ajouté", icon: "add", color: "#34d399" },
    updated: { title: "Produit mis à jour", icon: "edit", color: "#818cf8" },
    deleted: { title: "Produit supprimé", icon: "delete_outline", color: "#f87171" },
  };
  return meta[type] || { title: "Activité", icon: "history", color: "#818cf8" };
};

const formatActivityDate = (date) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

const getStoredUser = () => {
  try {
    return { ...EMPTY_USER, ...JSON.parse(localStorage.getItem("utilisateur") || "{}") };
  } catch {
    return EMPTY_USER;
  }
};

const getFullName = (user) =>
  [user.prenom, user.nom].filter(Boolean).join(" ").trim() || "Utilisateur";

const getInitials = (user) =>
  [user.prenom, user.nom]
    .filter(Boolean)
    .map((value) => value.trim().charAt(0).toUpperCase())
    .join("")
    .slice(0, 2) || "U";

const getRoleLabel = (role) => (role === "admin" ? "Administrateur" : "Utilisateur");

function InfoItem({ icon, label, value, brand }) {
  return (
    <MDBox display="flex" alignItems="center" gap={1.5} py={1.25}>
      <MDBox
        display="grid"
        placeItems="center"
        width="2.4rem"
        height="2.4rem"
        borderRadius="10px"
        sx={{ backgroundColor: "rgba(176,42,70,0.1)", flexShrink: 0 }}
      >
        <Icon sx={{ color: brand.accent, fontSize: "1.15rem" }}>{icon}</Icon>
      </MDBox>
      <MDBox minWidth={0}>
        <MDTypography
          variant="caption"
          fontWeight="bold"
          sx={{ color: brand.textSecondary, textTransform: "uppercase", letterSpacing: 0.6 }}
        >
          {label}
        </MDTypography>
        <MDTypography
          variant="button"
          fontWeight="medium"
          display="block"
          sx={{ color: brand.textPrimary, overflowWrap: "anywhere" }}
        >
          {value || "Non renseigné"}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

InfoItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  brand: PropTypes.shape({
    accent: PropTypes.string.isRequired,
    textPrimary: PropTypes.string.isRequired,
    textSecondary: PropTypes.string.isRequired,
  }).isRequired,
};

InfoItem.defaultProps = {
  value: "",
};

function PreferenceRow({ icon, iconColor, title, description, checked, onChange, brand }) {
  return (
    <MDBox display="flex" alignItems="center" gap={1.5} py={1.75}>
      {icon && (
        <MDBox
          display="grid"
          placeItems="center"
          width="2.9rem"
          height="2.9rem"
          borderRadius="12px"
          sx={{
            backgroundColor: `${iconColor}20`,
            border: `1px solid ${iconColor}55`,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ color: iconColor }}>{icon}</Icon>
        </MDBox>
      )}
      <MDBox flex={1} minWidth={0}>
        <MDTypography
          variant="button"
          fontWeight="bold"
          display="block"
          sx={{ color: brand.textPrimary }}
        >
          {title}
        </MDTypography>
        <MDTypography variant="caption" display="block" sx={{ color: brand.textSecondary }}>
          {description}
        </MDTypography>
      </MDBox>
      <Switch
        checked={checked}
        onChange={onChange}
        inputProps={{ "aria-label": title }}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: "#ff2f6d" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#ff2f6d" },
          "& .MuiSwitch-track": { backgroundColor: brand.iconMuted },
        }}
      />
    </MDBox>
  );
}

PreferenceRow.propTypes = {
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  brand: PropTypes.shape({
    textPrimary: PropTypes.string.isRequired,
    textSecondary: PropTypes.string.isRequired,
    iconMuted: PropTypes.string.isRequired,
  }).isRequired,
};

PreferenceRow.defaultProps = {
  icon: "",
  iconColor: "#818cf8",
};

function Profile() {
  const [controller, dispatch] = useMaterialUIController();
  const { i18n } = useTranslation();
  const brand = getBrand(controller.darkMode);
  const [user, setUser] = useState(getStoredUser);
  const [draft, setDraft] = useState(user);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("information");
  const [preferences, setPreferences] = useState(getStoredPreferences);
  const [activities] = useState(getStoredActivity);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fullName = useMemo(() => getFullName(user), [user]);
  const initials = useMemo(() => getInitials(user), [user]);

  const inputSx = {
    backgroundColor: brand.inputBg,
    borderRadius: "10px",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: `${brand.inputBorder} !important` },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: `${brand.accent} !important` },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: `${brand.accent} !important` },
    "& input": { color: `${brand.textPrimary} !important` },
  };

  const closeEditor = () => {
    setDraft(user);
    setErrors({});
    setEditOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDraft((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    const nextUser = {
      ...user,
      prenom: draft.prenom.trim(),
      nom: draft.nom.trim(),
      email: draft.email.trim(),
      telephone: draft.telephone.trim(),
      photoUrl: draft.photoUrl.trim(),
    };
    const nextErrors = {};
    if (!nextUser.prenom) nextErrors.prenom = "Le prénom est requis.";
    if (!nextUser.nom) nextErrors.nom = "Le nom est requis.";
    if (!nextUser.email) nextErrors.email = "L’adresse e-mail est requise.";
    else if (!/^\S+@\S+\.\S+$/.test(nextUser.email))
      nextErrors.email = "L’adresse e-mail est invalide.";
    if (nextUser.photoUrl && !/^https?:\/\//i.test(nextUser.photoUrl)) {
      nextErrors.photoUrl = "Utilisez une URL commençant par http:// ou https://.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    localStorage.setItem("utilisateur", JSON.stringify(nextUser));
    setUser(nextUser);
    setSaving(false);
    setEditOpen(false);
    setNotification({
      open: true,
      message: "Informations du profil mises à jour.",
      severity: "success",
    });
  };

  const cardSx = {
    backgroundColor: brand.cardBg,
    border: `1px solid ${brand.inputBorder}`,
    borderRadius: "16px",
    boxShadow: brand.shadowCard,
  };

  const updatePreference = (key, value) => {
    const nextPreferences = { ...preferences, [key]: value };
    setPreferences(nextPreferences);
    localStorage.setItem("profilePreferences", JSON.stringify(nextPreferences));
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.setItem("profilePreferences", JSON.stringify(DEFAULT_PREFERENCES));
    setDarkMode(dispatch, true);
    setNotification({ open: true, message: "Préférences réinitialisées.", severity: "success" });
  };

  const changeLanguage = (event) => {
    const { value } = event.target;
    i18n.changeLanguage(value);
    localStorage.setItem("locale", value);
  };

  const tabs = [
    { id: "information", label: "Informations", icon: "person_outline" },
    { id: "history", label: "Historique", icon: "schedule" },
    { id: "notifications", label: "Notifications", icon: "notifications_none" },
    { id: "preferences", label: "Préférences", icon: "palette_outlined" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={4} pb={3}>
        <Card sx={{ ...cardSx, mb: 3, overflow: "hidden" }}>
          <MDBox display="flex" flexWrap="wrap" p={0.75} gap={0.5}>
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <MDButton
                  key={tab.id}
                  variant="text"
                  onClick={() => setActiveTab(tab.id)}
                  startIcon={<Icon fontSize="small">{tab.icon}</Icon>}
                  sx={{
                    flex: { xs: "1 1 45%", sm: 1 },
                    minHeight: 50,
                    borderRadius: "10px",
                    color: active ? "#ffb2c4 !important" : `${brand.textSecondary} !important`,
                    backgroundColor: active ? "rgba(121,8,42,0.78)" : "transparent",
                    border: active ? "1px solid rgba(255,47,109,0.48)" : "1px solid transparent",
                    "&:hover": { backgroundColor: active ? "rgba(121,8,42,0.9)" : brand.inputBg },
                  }}
                >
                  {tab.label}
                </MDButton>
              );
            })}
          </MDBox>
        </Card>

        {activeTab === "information" && (
          <>
            <MDBox mb={4}>
              <MDBox display="flex" alignItems="center" gap={1.5} mb={1}>
                <MDBox width="28px" height="2px" sx={{ backgroundColor: brand.accent }} />
                <MDTypography
                  variant="caption"
                  fontWeight="bold"
                  sx={{ color: brand.accent, letterSpacing: 1.2 }}
                >
                  MON ESPACE
                </MDTypography>
              </MDBox>
              <MDTypography variant="h3" fontWeight="bold" sx={{ color: brand.textPrimary }}>
                Mon profil
              </MDTypography>
              <MDTypography variant="body2" sx={{ color: brand.textSecondary, mt: 0.5 }}>
                Consultez et gérez les informations associées à votre compte.
              </MDTypography>
            </MDBox>

            <Card sx={{ ...cardSx, overflow: "hidden", mb: 3 }}>
              <MDBox
                height={{ xs: 105, sm: 145 }}
                sx={{
                  background: `radial-gradient(circle at 12% 30%, rgba(219,89,113,0.45), transparent 30%), ${brand.gradient}`,
                }}
              />
              <MDBox px={{ xs: 2, sm: 4 }} pb={3.5} mt={{ xs: -5, sm: -6 }}>
                <Grid container spacing={2.5} alignItems="flex-end">
                  <Grid item>
                    <Avatar
                      src={user.photoUrl || undefined}
                      alt={fullName}
                      sx={{
                        width: { xs: 84, sm: 104 },
                        height: { xs: 84, sm: 104 },
                        bgcolor: brand.cardBg,
                        color: brand.accent,
                        border: `4px solid ${brand.cardBg}`,
                        fontWeight: 700,
                        fontSize: { xs: "1.7rem", sm: "2.1rem" },
                        boxShadow: brand.shadowCardHover,
                      }}
                    >
                      {initials}
                    </Avatar>
                  </Grid>
                  <Grid item xs={12} sm>
                    <MDTypography variant="h4" fontWeight="bold" sx={{ color: brand.textPrimary }}>
                      {fullName}
                    </MDTypography>
                    <MDTypography variant="button" sx={{ color: brand.textSecondary }}>
                      {user.email || "Adresse e-mail non renseignée"}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <MDBox display="flex" gap={1.25} alignItems="center" flexWrap="wrap">
                      <Chip
                        icon={<Icon>verified_user</Icon>}
                        label={getRoleLabel(user.role)}
                        size="small"
                        sx={{
                          backgroundColor: brand.status.info.bg,
                          color: brand.status.info.color,
                          fontWeight: 700,
                          height: 30,
                        }}
                      />
                      <MDButton
                        variant="contained"
                        startIcon={<Icon>edit</Icon>}
                        onClick={() => setEditOpen(true)}
                        sx={{
                          background: brand.gradientButton,
                          color: "white !important",
                          borderRadius: "10px",
                          boxShadow: brand.shadowAccent,
                          "&:hover": { background: brand.gradientButtonHover },
                        }}
                      >
                        Modifier
                      </MDButton>
                    </MDBox>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card sx={{ ...cardSx, height: "100%" }}>
                  <MDBox p={3}>
                    <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <MDTypography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: brand.textPrimary }}
                      >
                        Informations personnelles
                      </MDTypography>
                      <Tooltip title="Modifier les informations">
                        <MDButton
                          iconOnly
                          onClick={() => setEditOpen(true)}
                          sx={{ color: brand.accent }}
                        >
                          <Icon>edit</Icon>
                        </MDButton>
                      </Tooltip>
                    </MDBox>
                    <Divider sx={{ borderColor: brand.inputBorder }} />
                    <Grid container columnSpacing={3}>
                      <Grid item xs={12} sm={6}>
                        <InfoItem
                          icon="person_outline"
                          label="Prénom"
                          value={user.prenom}
                          brand={brand}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InfoItem icon="badge" label="Nom" value={user.nom} brand={brand} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InfoItem
                          icon="mail_outline"
                          label="E-mail"
                          value={user.email}
                          brand={brand}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InfoItem
                          icon="phone_outlined"
                          label="Téléphone"
                          value={user.telephone}
                          brand={brand}
                        />
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card sx={{ ...cardSx, height: "100%" }}>
                  <MDBox p={3}>
                    <MDTypography variant="h6" fontWeight="bold" sx={{ color: brand.textPrimary }}>
                      Compte
                    </MDTypography>
                    <MDTypography variant="caption" sx={{ color: brand.textSecondary }}>
                      Informations de votre session active
                    </MDTypography>
                    <Divider sx={{ my: 2, borderColor: brand.inputBorder }} />
                    <InfoItem
                      icon="admin_panel_settings"
                      label="Rôle"
                      value={getRoleLabel(user.role)}
                      brand={brand}
                    />
                    <InfoItem
                      icon="shield_outlined"
                      label="Accès"
                      value="Compte authentifié"
                      brand={brand}
                    />
                    <MDBox
                      mt={1.5}
                      p={1.5}
                      borderRadius="10px"
                      sx={{
                        backgroundColor: "rgba(176,42,70,0.07)",
                        border: `1px solid ${brand.inputBorder}`,
                      }}
                    >
                      <MDTypography variant="caption" sx={{ color: brand.textSecondary }}>
                        Vos informations affichées sont liées à l’utilisateur actuellement connecté.
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {activeTab === "history" && (
          <Card sx={cardSx}>
            <MDBox p={{ xs: 2.5, sm: 3.5 }}>
              <MDTypography
                variant="caption"
                fontWeight="bold"
                sx={{ color: brand.textSecondary, letterSpacing: 0.8 }}
              >
                HISTORIQUE D’ACTIVITÉ
              </MDTypography>
              <Divider sx={{ my: 2, borderColor: brand.inputBorder }} />
              {/* prettier-ignore */}
              {activities.length === 0 ? (
                <MDBox py={5} textAlign="center">
                  <MDBox
                    display="inline-grid"
                    placeItems="center"
                    width="3.5rem"
                    height="3.5rem"
                    borderRadius="12px"
                    sx={{ backgroundColor: brand.inputBg }}
                  >
                    <Icon sx={{ color: brand.iconMuted, fontSize: "1.5rem" }}>schedule</Icon>
                  </MDBox>
                  <MDTypography
                    variant="h6"
                    fontWeight="bold"
                    mt={1.5}
                    sx={{ color: brand.textPrimary }}
                  >
                    Aucune activité récente
                  </MDTypography>
                  <MDTypography variant="caption" sx={{ color: brand.textSecondary }}>
                    Les créations, modifications et suppressions de produits apparaîtront ici.
                  </MDTypography>
                </MDBox>
              ) : (
                activities.map((activity, index) => {
                  const meta = getActivityMeta(activity.type);
                  return (
                    <MDBox key={activity.id}>
                      <MDBox display="flex" alignItems="center" gap={2} py={2}>
                        <MDBox
                          display="grid"
                          placeItems="center"
                          width="2.8rem"
                          height="2.8rem"
                          borderRadius="12px"
                          sx={{
                            backgroundColor: `${meta.color}1f`,
                            border: `1px solid ${meta.color}55`,
                            flexShrink: 0,
                          }}
                        >
                          <Icon sx={{ color: meta.color }}>{meta.icon}</Icon>
                        </MDBox>
                        <MDBox flex={1} minWidth={0}>
                          <MDTypography
                            variant="button"
                            fontWeight="bold"
                            display="block"
                            sx={{ color: brand.textPrimary }}
                          >
                            {meta.title}
                          </MDTypography>
                          <MDTypography variant="caption" sx={{ color: brand.textSecondary }}>
                            {activity.productName} — {activity.detail}
                          </MDTypography>
                        </MDBox>
                        <MDBox
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          sx={{ color: brand.textSecondary }}
                        >
                          <Icon sx={{ fontSize: "0.9rem" }}>schedule</Icon>
                          <MDTypography variant="caption">
                            {formatActivityDate(activity.createdAt)}
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                      {index < activities.length - 1 && (
                        <Divider sx={{ borderColor: brand.inputBorder }} />
                      )}
                    </MDBox>
                  );
                })
              )}
            </MDBox>
          </Card>
        )}

        {activeTab === "notifications" && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={cardSx}>
                <MDBox p={{ xs: 2.5, sm: 3.5 }}>
                  <MDTypography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ color: brand.textSecondary, letterSpacing: 0.8 }}
                  >
                    ALERTES PRODUITS
                  </MDTypography>
                  <Divider sx={{ my: 1.5, borderColor: brand.inputBorder }} />
                  <PreferenceRow
                    icon="warning_amber"
                    iconColor="#fbbf24"
                    title="Stock faible"
                    description="Alerte quand un produit passe sous le seuil"
                    checked={preferences.lowStock}
                    onChange={(event) => updatePreference("lowStock", event.target.checked)}
                    brand={brand}
                  />
                  <Divider sx={{ borderColor: brand.inputBorder }} />
                  <PreferenceRow
                    icon="inventory_2"
                    iconColor="#f87171"
                    title="Rupture de stock"
                    description="Notification immédiate à zéro unité"
                    checked={preferences.outOfStock}
                    onChange={(event) => updatePreference("outOfStock", event.target.checked)}
                    brand={brand}
                  />
                  <Divider sx={{ borderColor: brand.inputBorder }} />
                  <PreferenceRow
                    icon="shopping_cart"
                    iconColor="#818cf8"
                    title="Nouvelle commande"
                    description="Chaque commande entrante dans le système"
                    checked={preferences.newOrder}
                    onChange={(event) => updatePreference("newOrder", event.target.checked)}
                    brand={brand}
                  />
                  <Divider sx={{ borderColor: brand.inputBorder }} />
                  <PreferenceRow
                    icon="bar_chart"
                    iconColor="#a855f7"
                    title="Rapport hebdomadaire"
                    description="Résumé chaque lundi matin"
                    checked={preferences.weeklyReport}
                    onChange={(event) => updatePreference("weeklyReport", event.target.checked)}
                    brand={brand}
                  />
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={cardSx}>
                <MDBox p={{ xs: 2.5, sm: 3.5 }}>
                  <MDTypography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ color: brand.textSecondary, letterSpacing: 0.8 }}
                  >
                    CANAUX DE RÉCEPTION
                  </MDTypography>
                  <Divider sx={{ my: 1.5, borderColor: brand.inputBorder }} />
                  <PreferenceRow
                    icon="mail_outline"
                    iconColor="#ff2f6d"
                    title="E-mail"
                    description={user.email || "Adresse e-mail non renseignée"}
                    checked={preferences.email}
                    onChange={(event) => updatePreference("email", event.target.checked)}
                    brand={brand}
                  />
                  <Divider sx={{ borderColor: brand.inputBorder }} />
                  <PreferenceRow
                    icon="notifications_none"
                    iconColor="#818cf8"
                    title="Notifications navigateur"
                    description="Alertes affichées dans ce navigateur"
                    checked={preferences.browser}
                    onChange={(event) => updatePreference("browser", event.target.checked)}
                    brand={brand}
                  />
                  <MDBox
                    mt={2.5}
                    p={2}
                    borderRadius="12px"
                    sx={{
                      backgroundColor: brand.inputBg,
                      border: `1px solid ${brand.inputBorder}`,
                    }}
                  >
                    <MDTypography variant="caption" sx={{ color: brand.textSecondary }}>
                      Les réglages sont enregistrés pour votre compte sur cet appareil.
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === "preferences" && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={cardSx}>
                <MDBox p={{ xs: 2.5, sm: 3.5 }}>
                  <MDTypography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ color: brand.textSecondary, letterSpacing: 0.8 }}
                  >
                    AFFICHAGE
                  </MDTypography>
                  <Divider sx={{ my: 1.5, borderColor: brand.inputBorder }} />
                  <MDTypography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ color: brand.textSecondary, display: "block", mb: 0.75 }}
                  >
                    LANGUE DE L’INTERFACE
                  </MDTypography>
                  <MDInput
                    select
                    value={i18n.language || localStorage.getItem("locale") || "fr"}
                    onChange={changeLanguage}
                    fullWidth
                    InputProps={{ sx: inputSx }}
                  >
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </MDInput>
                  <MDTypography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ color: brand.textSecondary, display: "block", mt: 3, mb: 0.75 }}
                  >
                    THÈME
                  </MDTypography>
                  <MDBox display="flex" gap={1.5}>
                    <MDButton
                      variant="outlined"
                      onClick={() => setDarkMode(dispatch, true)}
                      sx={{
                        flex: 1,
                        borderColor: controller.darkMode ? brand.accent : brand.inputBorder,
                        color: brand.textPrimary,
                      }}
                    >
                      🌙 Sombre
                    </MDButton>
                    <MDButton
                      variant="outlined"
                      onClick={() => setDarkMode(dispatch, false)}
                      sx={{
                        flex: 1,
                        borderColor: !controller.darkMode ? brand.accent : brand.inputBorder,
                        color: brand.textPrimary,
                      }}
                    >
                      ☀️ Clair
                    </MDButton>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={cardSx}>
                <MDBox p={{ xs: 2.5, sm: 3.5 }}>
                  <MDTypography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ color: brand.textSecondary, letterSpacing: 0.8 }}
                  >
                    COMPORTEMENT
                  </MDTypography>
                  <Divider sx={{ my: 1.5, borderColor: brand.inputBorder }} />
                  <PreferenceRow
                    title="Vue compacte"
                    description="Réduit l’espacement dans les tableaux"
                    checked={preferences.compact}
                    onChange={(event) => updatePreference("compact", event.target.checked)}
                    brand={brand}
                  />
                  <Divider sx={{ borderColor: brand.inputBorder }} />
                  <PreferenceRow
                    title="Animations"
                    description="Transitions et effets visuels"
                    checked={preferences.animations}
                    onChange={(event) => updatePreference("animations", event.target.checked)}
                    brand={brand}
                  />
                  <Divider sx={{ my: 2, borderColor: brand.inputBorder }} />
                  <MDButton
                    variant="outlined"
                    fullWidth
                    onClick={resetPreferences}
                    sx={{ borderColor: brand.inputBorder, color: brand.textSecondary }}
                  >
                    Réinitialiser les préférences
                  </MDButton>
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        )}
      </MDBox>
      <Footer />

      <Dialog
        open={editOpen}
        onClose={closeEditor}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { ...cardSx, backgroundColor: brand.cardBg, m: 2 } }}
      >
        <MDBox component="form" onSubmit={handleSave} noValidate>
          <DialogTitle sx={{ color: brand.textPrimary, fontWeight: 700 }}>
            Modifier mon profil
          </DialogTitle>
          <DialogContent>
            <MDTypography
              variant="caption"
              sx={{ color: brand.textSecondary, display: "block", mb: 2.5 }}
            >
              Mettez à jour les informations affichées dans votre espace personnel.
            </MDTypography>
            <Grid container spacing={2}>
              {[
                ["prenom", "Prénom", "person_outline"],
                ["nom", "Nom", "badge"],
                ["email", "Adresse e-mail", "mail_outline"],
                ["telephone", "Téléphone", "phone_outlined"],
                ["photoUrl", "URL de la photo (optionnel)", "image_outlined"],
              ].map(([name, label, icon]) => (
                <Grid item xs={12} sm={name === "photoUrl" ? 12 : 6} key={name}>
                  <MDTypography
                    variant="caption"
                    fontWeight="bold"
                    sx={{ color: brand.textSecondary, display: "block", mb: 0.75 }}
                  >
                    {label.toUpperCase()}
                  </MDTypography>
                  <MDInput
                    name={name}
                    type={name === "email" ? "email" : "text"}
                    value={draft[name] || ""}
                    onChange={handleChange}
                    error={Boolean(errors[name])}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon sx={{ color: brand.iconMuted, fontSize: "1.1rem" }}>{icon}</Icon>
                        </InputAdornment>
                      ),
                      sx: inputSx,
                    }}
                  />
                  {errors[name] && (
                    <MDTypography variant="caption" color="error" mt={0.5} display="block">
                      {errors[name]}
                    </MDTypography>
                  )}
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <MDButton
              variant="outlined"
              onClick={closeEditor}
              disabled={saving}
              sx={{ borderColor: brand.inputBorder }}
            >
              Annuler
            </MDButton>
            <MDButton
              type="submit"
              variant="contained"
              disabled={saving}
              sx={{
                background: brand.gradientButton,
                color: "white !important",
                borderRadius: "10px",
              }}
            >
              {saving ? <CircularProgress size={18} color="inherit" /> : "Enregistrer"}
            </MDButton>
          </DialogActions>
        </MDBox>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((previous) => ({ ...previous, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default Profile;
