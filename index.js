const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// URL base de tu Firebase
const firebaseBase = "https://ertx-7199e-default-rtdb.firebaseio.com";

// Middleware para parsear JSON
app.use(bodyParser.json());

// Ruta para recibir datos de Iridium
app.post("/iridium", async (req, res) => {
  try {
    const data = req.body;
    const device = data.imei || "desconocido";
    const timestamp = new Date().toISOString();

    // Guarda en Firebase bajo /iridium/[device]/[timestamp]
    await axios.put(`${firebaseBase}/iridium/${device}/${timestamp}.json`, data);

    console.log("✅ Datos de Iridium recibidos y reenviados.");
    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error procesando datos:", err.message);
    res.status(500).send("Error interno");
  }
});

app.get("/", (req, res) => {
  res.send("🛰️ ERTX Webhook activo.");
});

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
