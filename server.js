import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;

// LINKS AFILIADOS
const amazon = (q) =>
  `https://www.amazon.com.br/s?k=${encodeURIComponent(q)}&tag=precafacil-20`;

const magalu = (q) =>
  `https://www.magazinevoce.com.br/magazinepcvendedor/busca/${encodeURIComponent(q)}/`;

const mercadoLivre = (q) =>
  `https://lista.mercadolivre.com.br/${encodeURIComponent(q)}`;

app.post("/analyze", async (req, res) => {
  const { title, price } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Produto inválido" });
  }

  const prompt = `
Analise o produto abaixo como um comprador experiente.

Produto: ${title}
Preço: ${price}

Responda EXATAMENTE neste formato:

RESUMO:
(frase curta)

PROS:
- item
- item
- item

CONTRAS:
- item
- item

VEREDITO:
(frase objetiva)
`;

  try {
    const ai = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4
      })
    });

    const json = await ai.json();
    const text = json.choices[0].message.content;

    res.json({
      analysis: text,
      offers: [
        { loja: "Amazon", url: amazon(title) },
        { loja: "Magalu", url: magalu(title) },
        { loja: "Mercado Livre", url: mercadoLivre(title) }
      ]
    });
  } catch (e) {
    res.status(500).json({ error: "Erro ao consultar IA" });
  }
});

app.listen(10000, () => {
  console.log("Servidor rodando na porta 10000");
});
