const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
console.log("Routes utilisateurs chargées");
connectDB();


app.get("/", (req, res) => {
    res.send("API Gestion Stock fonctionne");
});


app.listen(5000, () => {
    console.log("Serveur lancé sur le port 5000");
}); 