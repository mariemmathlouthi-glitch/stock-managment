const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// Inscription utilisateur (Public)
// =======================
const registerUser = async (req, res) => {
  try {
    const { prenom, nom, email, telephone, motDePasse, role } = req.body;

    if (!prenom || !nom || !email || !telephone || !motDePasse) {
      return res.status(400).json({
        message: "Veuillez remplir tous les champs."
      });
    }

    const userExiste = await User.findOne({ email });
    if (userExiste) {
      return res.status(400).json({
        message: "Cet email existe déjà."
      });
    }  

    const userRole = role === "admin" ? "admin" : "user";
    if (userRole === "admin") {
      const adminExiste = await User.findOne({ role: "admin" });
      if (adminExiste) {
        return res.status(403).json({
          message: "Un administrateur existe déjà. Impossible d'inscrire un second admin."
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const motDePasseHash = await bcrypt.hash(motDePasse, salt);

    const nouvelUtilisateur = new User({
      prenom,
      nom,
      email,
      telephone,
      motDePasse: motDePasseHash,
      role: userRole,
      estActif: true
    });

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

    if (!email || !motDePasse) {
      return res.status(400).json({
        message: "Veuillez saisir votre email et votre mot de passe."
      });
    }

    const utilisateur = await User.findOne({ email });

    if (!utilisateur) {
      return res.status(404).json({
        message: "Utilisateur introuvable."
      });
    }

    // Vérifier si le compte est actif
    if (utilisateur.estActif === false) {
      return res.status(403).json({
        message: "Votre compte a été désactivé. Veuillez contacter un administrateur."
      });
    }

    const motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateur.motDePasse
    );

    if (!motDePasseValide) {
      return res.status(401).json({
        message: "Mot de passe incorrect."
      });
    }

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

    res.status(200).json({
      message: "Connexion réussie.",
      token,
      utilisateur: {
        id: utilisateur._id,
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
        email: utilisateur.email,
        telephone: utilisateur.telephone,
        role: utilisateur.role,
        estActif: utilisateur.estActif !== false
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// =======================
// Fonctions réservées aux Administrateurs
// =======================

// Liste de tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-motDePasse").sort({ createdAt: -1 });
    console.log(`[Backend API] ${users.length} utilisateur(s) récupéré(s) depuis MongoDB`);
    res.status(200).json({ users });
  } catch (error) {
    console.error("[Backend API] Erreur lors de la récupération des utilisateurs:", error.message);
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs depuis MongoDB: " + error.message,
    });
  }
};

// Création d'un utilisateur par l'admin
const createUserByAdmin = async (req, res) => {
  try {
    const { prenom, nom, email, telephone, motDePasse, role, estActif } = req.body;

    if (!prenom || !nom || !email || !telephone || !motDePasse) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires." });
    }

    const emailFormatted = email.trim().toLowerCase();
    const userExiste = await User.findOne({ email: emailFormatted });
    if (userExiste) {
      return res.status(400).json({ message: "Cet email est déjà utilisé par un autre utilisateur." });
    }

    const salt = await bcrypt.genSalt(10);
    const motDePasseHash = await bcrypt.hash(motDePasse, salt);

    const nouvelUtilisateur = new User({
      prenom: prenom.trim(),
      nom: nom.trim(),
      email: emailFormatted,
      telephone: telephone.trim(),
      motDePasse: motDePasseHash,
      role: role || "user",
      estActif: estActif !== undefined ? estActif : true
    });

    await nouvelUtilisateur.save();

    const userSansMdp = await User.findById(nouvelUtilisateur._id).select("-motDePasse");

    res.status(201).json({
      message: "Utilisateur créé avec succès par l'administrateur.",
      user: userSansMdp
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Cet email est déjà utilisé par un autre utilisateur." });
    }
    res.status(500).json({ message: error.message });
  }
};

// Modification d'un utilisateur par l'admin
const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { prenom, nom, email, telephone, role, estActif, motDePasse } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (email && email.toLowerCase() !== user.email) {
      const emailExistant = await User.findOne({ email: email.toLowerCase(), _id: { $ne: id } });
      if (emailExistant) {
        return res.status(400).json({ message: "Cet email est déjà utilisé par un autre utilisateur." });
      }
      user.email = email.toLowerCase().trim();
    }

    if (prenom) user.prenom = prenom.trim();
    if (nom) user.nom = nom.trim();
    if (telephone) user.telephone = telephone.trim();
    if (role) user.role = role;
    if (estActif !== undefined) user.estActif = estActif;

    if (motDePasse && motDePasse.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.motDePasse = await bcrypt.hash(motDePasse.trim(), salt);
    }

    await user.save();

    const updatedUser = await User.findById(id).select("-motDePasse");

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès.",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Activer / Désactiver un utilisateur
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user && req.user.id === id) {
      return res.status(400).json({ message: "Vous ne pouvez pas désactiver votre propre compte." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    user.estActif = !user.estActif;
    await user.save();

    const updatedUser = await User.findById(id).select("-motDePasse");

    res.status(200).json({
      message: `Utilisateur ${user.estActif ? "activé" : "désactivé"} avec succès.`,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suppression d'un utilisateur par l'admin
const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user && req.user.id === id) {
      return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "Utilisateur supprimé avec succès."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  createUserByAdmin,
  updateUserByAdmin,
  toggleUserStatus,
  deleteUserByAdmin
};