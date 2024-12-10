const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((error) => console.error("Erro ao conectar ao MongoDB:", error));

// Middlewares
app.use(cors());
app.use(express.json()); // Para permitir o envio de JSON no corpo da requisição

// Rotas
app.use("/api/auth", authRoutes);

// Inicializar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
