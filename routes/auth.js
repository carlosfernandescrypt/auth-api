const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");
require("dotenv").config();

const router = express.Router();

// Criação do transportador de e-mail (utilizando o Nodemailer)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Registro de usuário
router.post("/register", async (req, res) => {
  const { username, email, password, cod } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("Usuário já existe com o e-mail:", email);
      return res.status(400).json({ message: "Usuário já existe!" });
    }

    console.log("Usuário não encontrado, prosseguindo com o registro.");

    // Gerar o hash da senha

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Senha criptografada:", hashedPassword);

    // Criar novo usuário
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      cod,
    });
    console.log("Novo usuário criado:", newUser);
    console.log("Senha do usuario criado: ", hashedPassword);

    // Salvar o usuário no banco de dados
    await newUser.save();
    console.log("Usuário salvo com sucesso.");

    // Gerar o token JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Token JWT gerado:", token);

    // Enviar a resposta com o token
    res.status(201).json({ token, message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar o usuário:", error);
    res.status(500).json({ message: "Erro ao registrar o usuário." });
  }
});

// Login de usuário
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Usuário não encontrado:", username);
      return res.status(400).json({ message: "Usuário não encontrado!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Senha inválida para usuário:", username);
      return res.status(400).json({ message: "Senha inválida!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, message: "Login bem-sucedido!" });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro no login." });
  }
});

// Solicitar redefinição de senha
router.post("/forgot-password", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Usuário não encontrado:", username);
      return res.status(400).json({ message: "Usuário não encontrado!" });
    }

    // Gerar token para redefinição de senha
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora para expiração
    await user.save();

    // Enviar o e-mail de redefinição de senha
    const resetUrl = `http://localhost:5000/api/auth/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Redefinição de Senha",
      text: `Você solicitou uma redefinição de senha. Clique no link abaixo para redefinir sua senha:\n\n${resetUrl}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erro ao enviar e-mail: ", error);
        return res.status(500).json({ message: "Erro ao enviar o e-mail." });
      }
      console.log("E-mail enviado: ", info);
      res.status(200).json({
        message: "Link de redefinição de senha enviado para o e-mail.",
      });
    });
  } catch (error) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    res.status(500).json({ message: "Erro no servidor." });
  }
});

// Redefinir senha
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Token inválido ou expirado:", token);
      return res.status(400).json({ message: "Token inválido ou expirado!" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    console.error("Erro ao redefinir a senha:", error);
    res.status(500).json({ message: "Erro ao redefinir a senha." });
  }
});

router.post("/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }

    res.status(200).json({ message: "Token válido.", userId: decoded.id });
  });
});

module.exports = router;
