const express = require("express");
const cors = require("cors");
require('dotenv').config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
console.log("Routes utilisateurs et dashboard chargées");
connectDB();

// Seed: créer un admin si aucun admin n'existe
const seedAdmin = async () => {
    try {
        const adminCount = await User.countDocuments({ role: "admin" });
        if (adminCount === 0) {
            const prenom = process.env.ADMIN_FIRSTNAME || "Admin";
            const nom = process.env.ADMIN_LASTNAME || "User";
            const email = process.env.ADMIN_EMAIL || "admin@localhost";
            const telephone = process.env.ADMIN_PHONE || "0000000000";
            const motDePassePlain = process.env.ADMIN_PASSWORD || "admin123";

            const salt = await bcrypt.genSalt(10);
            const motDePasseHash = await bcrypt.hash(motDePassePlain, salt);

            const admin = new User({
                prenom,
                nom,
                email,
                telephone,
                motDePasse: motDePasseHash,
                role: "admin"
            });

            await admin.save();
            console.log(`Admin initial créé : ${email} (mot de passe par défaut si non défini par env)`);
        } else {
            console.log("Un administrateur existe déjà.");
        }
    } catch (error) {
        console.error("Erreur lors du seed admin:", error.message);
    }
};

seedAdmin();

app.get("/", (req, res) => {
        res.send("API Gestion Stock fonctionne");
});


app.listen(5000, () => {
        console.log("Serveur lancé sur le port 5000");
});