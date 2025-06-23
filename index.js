const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const firebaseBase = "https://ertx-7199e-default-rtdb.firebaseio.com";

// Middleware
app.use(bodyParser.json());

app.post("/iridium", async (req, res) => {
  try {
    const data = req.body;
    const device = data.imei || "desconocido";

    // Generar timestamp compatible con Firebase
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

    console.log("📡 Datos recibidos:", data);

    // Guardar en Firebase
    await axios.put(`${firebaseBase}/iridium/${device}/${timestamp}.json`, data);

    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error procesando datos:", err.message);
    res.status(400).send("Error interno");
  }
});

app.get("/", (req, res) => {
  res.send("🛰️ Webhook activo.");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
