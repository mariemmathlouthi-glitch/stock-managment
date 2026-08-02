const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// Inscription utilisateur
// =======================
const registerUser = async (req, res) => {
  try {
    const { prenom, nom, email, telephone, motDePasse, role } = req.body;

    // Vérifier les champs obligatoires
    if (!prenom || !nom || !email || !telephone || !motDePasse) {
      return res.status(400).json({
        message: "Veuillez remplir tous les champs."
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const userExiste = await User.findOne({ email });

    if (userExiste) {
      return res.status(400).json({
        message: "Cet email existe déjà."
      });
    }  

    // Si on essaie de créer un admin, vérifier qu'il n'en existe pas déjà
    if (role === "admin") {
      const adminExiste = await User.findOne({ role: "admin" });
      if (adminExiste) {
        return res.status(403).json({
          message: "Un administrateur existe déjà. Impossible de créer un second admin."
        });
      }
    }

    // Chiffrer le mot de passe
    const salt = await bcrypt.genSalt(10);
    const motDePasseHash = await bcrypt.hash(motDePasse, salt);

    // Créer un nouvel utilisateur
    const nouvelUtilisateur = new User({
      prenom,
      nom,
      email,
      telephone,
      motDePasse: motDePasseHash,
      role
    });

    // Enregistrer dans MongoDB
    await nouvelUtilisateur.save();

    res.status(201).json({
      message: "Utilisateur créé avec succès."
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// =======================
// Connexion utilisateur
// =======================
const loginUser = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifier les champs
    if (!email || !motDePasse) {
      return res.status(400).json({
        message: "Veuillez saisir votre email et votre mot de passe."
      });
    }

    // Vérifier si l'utilisateur existe
    const utilisateur = await User.findOne({ email });

    if (!utilisateur) {
      return res.status(404).json({
        message: "Utilisateur introuvable."
      });
    }

    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateur.motDePasse
    );

    if (!motDePasseValide) {
      return res.status(401).json({
        message: "Mot de passe incorrect."
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      {
        id: utilisateur._id,
        role: utilisateur.role
      },
      process.env.JWT_SECRET || "secret123",
      {
        expiresIn: "1d"
      }
    );

    // Réponse
    res.status(200).json({
      message: "Connexion réussie.",
      token,
      utilisateur: {
        id: utilisateur._id,
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
        email: utilisateur.email,
        telephone: utilisateur.telephone,
        role: utilisateur.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Export des fonctions
module.exports = {
  registerUser,
  loginUser,
};