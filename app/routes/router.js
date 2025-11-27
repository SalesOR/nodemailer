const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const validacaoContato = [
  body("nome")
    .notEmpty().withMessage("Nome é obrigatório")
    .isLength({ min: 3 }).withMessage("Nome deve ter no mínimo 3 caracteres"),
  body("email")
    .notEmpty().withMessage("E-mail é obrigatório")
    .isEmail().withMessage("E-mail inválido"),
  body("telefone")
    .notEmpty().withMessage("Telefone é obrigatório")
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/).withMessage("Telefone deve estar no formato (XX) XXXXX-XXXX"),
  body("assunto")
    .notEmpty().withMessage("Assunto é obrigatório")
    .isLength({ min: 5 }).withMessage("Assunto deve ter no mínimo 5 caracteres"),
  body("mensagem")
    .notEmpty().withMessage("Mensagem é obrigatória")
    .isLength({ min: 10 }).withMessage("Mensagem deve ter no mínimo 10 caracteres")
];

router.get("/", (req, res) => {
  res.render("pages/index", { erros: null, dados: null, sucesso: null });
});

router.post("/enviar", validacaoContato, async (req, res) => {
  const erros = validationResult(req);
  
  if (!erros.isEmpty()) {
    return res.render("pages/index", { 
      erros: erros.array(), 
      dados: req.body,
      sucesso: null 
    });
  }

  const { nome, email, telefone, assunto, mensagem } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Contato: ${assunto}`,
    html: `
      <h2>Nova mensagem de contato</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${telefone}</p>
      <p><strong>Assunto:</strong> ${assunto}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${mensagem}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.render("pages/index", { 
      erros: null, 
      dados: null, 
      sucesso: "E-mail enviado com sucesso!" 
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    res.render("pages/index", { 
      erros: [{ msg: "Erro ao enviar e-mail. Tente novamente." }], 
      dados: req.body,
      sucesso: null 
    });
  }
});

module.exports = router;