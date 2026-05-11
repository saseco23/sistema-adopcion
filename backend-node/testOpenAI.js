const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

(async () => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hola, ¿puedes hablar conmigo?" }],
    });

    console.log("✅ Conexión exitosa. Respuesta:", response.choices[0].message.content);
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  }
})();


