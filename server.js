const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Compra Fácil IA - Backend OK");
});

app.post("/analyze", (req, res) => {
  const { title, price } = req.body;

  res.json({
    result: `
RESUMO:
Produto bem avaliado no mercado.

PRÓS:
- Boa reputação
- Preço competitivo

CONTRAS:
- Existem alternativas similares

VEREDITO:
Vale comparar antes de comprar.
`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
