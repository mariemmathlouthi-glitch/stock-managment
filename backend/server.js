const express = require("express");
const cors = require("cors");
require('dotenv').config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
console.log("Routes utilisateurs, dashboard et produits chargées");
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
                role: "admin",
                estActif: true
            });

            await admin.save();
            console.log(`Admin initial créé : ${email}`);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
