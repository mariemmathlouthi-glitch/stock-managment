import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import PageLayout from "examples/LayoutContainers/PageLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import logo from "assets/images/Logo.png";

const inputStyles = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#cbd5e1",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b02a46", // primary color
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ef4444", // error red
    },
    "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f1f5f9",
    },
  },
  "& .MuiInputBase-input": {
    color: "#334155 !important",
    "&::placeholder": {
      color: "#94a3b8 !important",
      opacity: 1,
    },
    "&.Mui-disabled": {
      color: "#94a3b8 !important",
      WebkitTextFillColor: "#94a3b8 !important",
    },
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #f8fafc inset !important",
      WebkitTextFillColor: "#334155 !important",
      caretColor: "#334155",
    }
  }
};

function Cover() {
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("text");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageColor("text");

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom,
          nom,
          email,
          telephone,
          motDePasse,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Inscription réussie ! Redirection...");
        setMessageColor("success");
        setTimeout(() => navigate("/authentication/sign-in"), 1500);
      } else {
        setMessage(data.message || "Erreur lors de l'inscription");
        setMessageColor("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
      setMessageColor("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <MDBox
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1215",
          p: { xs: 1, md: 2 },
          backgroundImage: `linear-gradient(rgba(26, 18, 21, 0.8), rgba(26, 18, 21, 0.8)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Card
          sx={{
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            borderRadius: "24px",
            width: "100%",
            maxWidth: "1050px",
            display: "flex",
          }}
        >
          <Grid container>
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              background: "linear-gradient(135deg, #b02a46 0%, #751429 100%)",
              color: "white",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 4, md: 5 },
            }}
          >
            <MDBox display="flex" flexDirection="column" alignItems="center" mb={4} mt={1}>
              <MDBox 
                component="img" 
                src={logo} 
                alt="Logo" 
                sx={{ width: 110, height: 110, borderRadius: "50%", backgroundColor: "white", p: 1, mb: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }} 
              />
              <MDTypography variant="h3" fontWeight="bold" color="white" textTransform="uppercase" letterSpacing={1}>
                Stockflow
              </MDTypography>
              <MDTypography variant="button" fontWeight="regular" color="white" opacity={0.8} mt={1}>
                Gérez votre stock en toute simplicité.
              </MDTypography>
            </MDBox>

            <MDBox width="100%">
              <MDTypography variant="h5" fontWeight="bold" color="white" gutterBottom>
                Rejoignez-nous
              </MDTypography>
              <MDTypography variant="button" fontWeight="regular" color="white" opacity={0.8}>
                Créez votre compte pour accéder à votre espace de gestion de stock.
              </MDTypography>

              <MDBox display="flex" flexDirection="column" gap={1.5} mt={3}>
                <MDBox display="flex" alignItems="center" gap={2} p={2} sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon sx={{ color: "white" }}>verified_user</Icon>
                  <MDBox>
                    <MDTypography variant="button" color="white" fontWeight="bold" display="block">
                      Sécurité de niveau entreprise
                    </MDTypography>
                    <MDTypography variant="caption" color="white" opacity={0.7}>
                      Données chiffrées & accès contrôlé
                    </MDTypography>
                  </MDBox>
                </MDBox>
                <MDBox display="flex" alignItems="center" gap={2} p={2} sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon sx={{ color: "white" }}>bar_chart</Icon>
                  <MDBox>
                    <MDTypography variant="button" color="white" fontWeight="bold" display="block">
                      Analytiques en temps réel
                    </MDTypography>
                    <MDTypography variant="caption" color="white" opacity={0.7}>
                      Tableaux de bord et rapports live
                    </MDTypography>
                  </MDBox>
                </MDBox>
                <MDBox display="flex" alignItems="center" gap={2} p={2} sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon sx={{ color: "white" }}>bolt</Icon>
                  <MDBox>
                    <MDTypography variant="button" color="white" fontWeight="bold" display="block">
                      Flux de travail optimisés
                    </MDTypography>
                    <MDTypography variant="caption" color="white" opacity={0.7}>
                      Toutes vos actions clés en un clic
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </MDBox>
            </MDBox>
          </Grid>

          <Grid item xs={12} md={7} sx={{ backgroundColor: "white" }}>
            <MDBox p={{ xs: 4, md: 5 }} height="100%" display="flex" flexDirection="column" justifyContent="center">
              <MDBox mb={3}>
                <MDBox display="flex" alignItems="center" mb={1.5}>
                  <MDBox width="30px" height="2px" bgcolor="#b02a46" mr={2} />
                  <MDTypography variant="caption" fontWeight="bold" sx={{ color: "#b02a46", letterSpacing: 1 }}>
                    CRÉER UN COMPTE
                  </MDTypography>
                </MDBox>
                <MDTypography variant="h3" fontWeight="bold" color="dark" mb={0.5}>
                  Inscription
                </MDTypography>
                <MDTypography variant="button" color="text">
                  Rejoignez-nous pour gérer votre stock facilement.
                </MDTypography>
              </MDBox>
              
              <MDBox component="form" role="form" onSubmit={handleRegister}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <MDBox mb={2}>
                      <MDTypography variant="caption" fontWeight="bold" color="dark" textTransform="uppercase" mb={1} display="block">
                        Prénom
                      </MDTypography>
                      <MDInput
                        type="text"
                        placeholder="Jean"
                        fullWidth
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon fontSize="small" sx={{ color: "#a0aabe" }}>person_outline</Icon>
                            </InputAdornment>
                          ),
                          sx: inputStyles
                        }}
                        required
                      />
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MDBox mb={2}>
                      <MDTypography variant="caption" fontWeight="bold" color="dark" textTransform="uppercase" mb={1} display="block">
                        Nom
                      </MDTypography>
                      <MDInput
                        type="text"
                        placeholder="Dupont"
                        fullWidth
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon fontSize="small" sx={{ color: "#a0aabe" }}>badge_outlined</Icon>
                            </InputAdornment>
                          ),
                          sx: inputStyles
                        }}
                        required
                      />
                    </MDBox>
                  </Grid>
                </Grid>

                <MDBox mb={2}>
                  <MDTypography variant="caption" fontWeight="bold" color="dark" textTransform="uppercase" mb={1} display="block">
                    Adresse Email
                  </MDTypography>
                  <MDInput
                    type="email"
                    placeholder="vous@exemple.com"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon fontSize="small" sx={{ color: "#a0aabe" }}>email_outlined</Icon>
                        </InputAdornment>
                      ),
                      sx: inputStyles
                    }}
                    required
                  />
                </MDBox>

                <MDBox mb={2}>
                  <MDTypography variant="caption" fontWeight="bold" color="dark" textTransform="uppercase" mb={1} display="block">
                    Téléphone
                  </MDTypography>
                  <MDInput
                    type="text"
                    placeholder="+216 12 345 678"
                    fullWidth
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon fontSize="small" sx={{ color: "#a0aabe" }}>phone_outlined</Icon>
                        </InputAdornment>
                      ),
                      sx: inputStyles
                    }}
                    required
                  />
                </MDBox>

                <MDBox mb={2}>
                  <MDTypography variant="caption" fontWeight="bold" color="dark" textTransform="uppercase" mb={1} display="block">
                    Mot de passe
                  </MDTypography>
                  <MDInput
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    fullWidth
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon fontSize="small" sx={{ color: "#a0aabe" }}>lock_outlined</Icon>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff sx={{ color: "#a0aabe" }} /> : <Visibility sx={{ color: "#a0aabe" }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: inputStyles
                    }}
                    required
                  />
                </MDBox>

                <MDBox display="flex" alignItems="center" mb={3} ml={-1.5}>
                  <Checkbox 
                    sx={{
                      color: "#cbd5e1",
                      "&.Mui-checked": {
                        color: "#b02a46",
                      },
                      "& .MuiSvgIcon-root": {
                        borderRadius: "4px",
                      }
                    }} 
                  />
                  <MDTypography variant="button" fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none" }}>
                    J&apos;accepte les{" "}
                    <MDTypography
                      component="a"
                      href="#"
                      variant="button"
                      fontWeight="bold"
                      sx={{ color: "#b02a46" }}
                    >
                      Termes et Conditions
                    </MDTypography>
                  </MDTypography>
                </MDBox>

                <MDBox mt={1} mb={2}>
                  <MDButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    size="large"
                    sx={{
                      background: "linear-gradient(135deg, #b02a46 0%, #db5971 100%)",
                      color: "white",
                      borderRadius: "8px",
                      padding: "12px",
                      fontSize: "1rem",
                      boxShadow: "0 4px 14px 0 rgba(176, 42, 70, 0.39)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #8c1c34 0%, #c4405a 100%)",
                        boxShadow: "0 6px 20px 0 rgba(176, 42, 70, 0.39)",
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                        Inscription...
                      </>
                    ) : (
                      "S'INSCRIRE"
                    )}
                  </MDButton>
                </MDBox>
                
                {message && (
                  <MDBox mt={2} textAlign="center">
                    <MDTypography variant="button" color={messageColor}>
                      {message}
                    </MDTypography>
                  </MDBox>
                )}

                <MDBox mt={3} textAlign="center">
                  <MDTypography variant="button" color="text">
                    Vous avez déjà un compte ?{" "}
                    <MDTypography
                      component={Link}
                      to="/authentication/sign-in"
                      variant="button"
                      fontWeight="bold"
                      sx={{ color: "#b02a46", marginLeft: 0.5 }}
                    >
                      Se connecter
                    </MDTypography>
                  </MDTypography>
                </MDBox>
                
                <MDBox mt={4} textAlign="center">
                  <MDTypography variant="caption" color="text" sx={{ opacity: 0.6 }}>
                    © 2026 StockFlow · Tous droits réservés
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </Card>
    </MDBox>
    </PageLayout>
  );
}

export default Cover;
