import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");

  // Si pas de token → rediriger vers Sign In
  if (!token) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  // Si un rôle est requis, vérifier le rôle dans le token
  if (requiredRole) {
    const payload = parseJwt(token);
    if (!payload || !payload.role || payload.role !== requiredRole) {
      // Rediriger vers la page Dashboard (utilisateur connecté sans droits admin)
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Si tout est OK → afficher la page demandée
  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

export default PrivateRoute;
