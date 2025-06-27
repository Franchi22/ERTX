const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const firebaseBase = "https://ertx-7199e-default-rtdb.firebaseio.com";

// Middleware para JSON y texto plano
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/plain' }));

// Ruta principal
app.get("/", (req, res) => {
  res.send("🛰️ Webhook activo.");
});

// Ruta para mensajes Iridium
app.post("/iridium", async (req, res) => {
  try {
    let data = req.body;

    // Si es texto plano, convertir a objeto
    if (typeof data === "string") {
      // Formato esperado: L:18.408304,N:-70.129234,V:1.3,A:5.1
      const match = data.match(/L:([\d\.-]+),N:([\d\.-]+),V:([\d\.]+),A:([\d\.]+)/);
      if (!match) throw new Error("Formato de mensaje inválido");

      data = {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
        vel: parseFloat(match[3]),
        acc: parseFloat(match[4])
      };
    }

    // IMEI o identificador por defecto
    const device = data.imei || "rockblock";

    // Timestamp para clave en Firebase
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
