const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/iridium', async (req, res) => {
  const data = req.body;

  // Reemplaza con tu URL real de Firebase
  const firebaseURL = `https://ertx-7199e-default-rtdb.firebaseio.com/iridium/${data.deviceID}.json`;

  try {
    await axios.post(firebaseURL, data);
    res.status(200).send('Datos recibidos y enviados a Firebase');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al enviar a Firebase');
  }
});

app.get('/', (req, res) => {
  res.send('Endpoint Iridium activo 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
