import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.get("/", (req, res) => {
  res.send("CompraCerta IA backend ativo 🚀");
});

app.post("/analyze", async (req, res) => {
  try {
    const { title, price, site } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }

    const prompt = `
Você é um comprador experiente.

Analise o produto abaixo e responda EXATAMENTE neste formato:

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
(frase direta)

Produto: ${title}
Preço atual: ${price}
Site: ${site}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({ error: "IA sem resposta" });
    }

    // links afiliados (busca alternativa)
    const encoded = encodeURIComponent(title);

    const affiliates = {
      amazon: `https://www.amazon.com.br/s?k=${encoded}&tag=precafacil-20`,
      magalu: `https://www.magazinevoce.com.br/magazinepcvendedor/busca/${encoded}/`,
      shopee: `https://shopee.com.br/search?keyword=${encoded}`,
      mercadolivre: `https://www.mercadolivre.com.br/jm/search?as_word=${encoded}`
    };

    res.json({
      analysis: text,
      affiliates
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno IA" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
