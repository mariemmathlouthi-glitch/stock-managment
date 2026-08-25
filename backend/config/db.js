const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gestionstock";
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB connecté avec succès : ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("Erreur de connexion MongoDB :", error.message);
  }
};

module.exports = connectDB;