require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

//Crear cliente con la API Key desde .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//Memoria temporal para mantener contexto por usuario
let chatMemory = {};

//Ruta del chatbot
router.post("/chatbot", async (req, res) => {
  try {
    const { message, userId = "anonimo" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Falta el mensaje del usuario." });
    }

    // Inicializar historial si no existe
    if (!chatMemory[userId]) {
      chatMemory[userId] = [
        {
          role: "system",
          content:
            "Eres un asistente amable y experto en adopción de mascotas. Ayuda a los usuarios a encontrar la mascota ideal según su estilo de vida, preferencias y espacio disponible. Habla siempre de forma empática y clara.",
        },
      ];
    }

    // Añadir el mensaje del usuario
    chatMemory[userId].push({ role: "user", content: message });

    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // más económico y rápido
      messages: chatMemory[userId],
    });

    const reply = completion.choices[0].message.content;

    // Añadir la respuesta al historial
    chatMemory[userId].push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en chatbot:", error);
    res.status(500).json({ error: "Error interno del chatbot." });
  }
});

module.exports = router;


