require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const router = express.Router();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


let chatMemory = {};

const temasPermitidos = [
  "animal",
  "animales",
  "mascota",
  "mascotas",
  "perro",
  "perros",
  "gato",
  "gatos",
  "cachorro",
  "cachorros",
  "adopcion",
  "adopción",
  "adoptar",
  "adoptado",
  "adoptada",
  "refugio",
  "hogar",
  "cuidador",
  "veterinario",
  "veterinaria",
  "vacuna",
  "vacunas",
  "esterilizacion",
  "esterilización",
  "comida",
  "alimento",
  "raza",
  "razas",
  "paseo",
  "collar",
  "correa",
  "arena",
  "maullido",
  "ladrido",
  "pulgas",
  "garrapatas"
];

function esTemaPermitido(mensaje) {
  const texto = mensaje.toLowerCase();

  return temasPermitidos.some((palabra) => texto.includes(palabra));
}


router.post("/chatbot", async (req, res) => {
  try {
    const { message, userId = "anonimo" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Falta el mensaje del usuario." });
    }

    if (!esTemaPermitido(message)) {
      return res.json({
        reply:
          "Solo puedo responder preguntas relacionadas con animales, mascotas, cuidados y procesos de adopción.",
      });
    }


    if (!chatMemory[userId]) {
      chatMemory[userId] = [
        {
          role: "system",
          content:
            "Eres un asistente amable y experto únicamente en adopción de mascotas, animales domésticos, bienestar animal y cuidado de perros y gatos. Si el usuario pregunta sobre un tema diferente, responde educadamente que solo puedes ayudar con temas relacionados con animales, mascotas y adopción. Ayuda a los usuarios a encontrar la mascota ideal según su estilo de vida, preferencias y espacio disponible. Habla siempre de forma empática y clara.",
        },
      ];
    }


    chatMemory[userId].push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMemory[userId],
    });

    const reply = completion.choices[0].message.content;


    chatMemory[userId].push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (error) {
    console.error("Error en chatbot:", error);
    res.status(500).json({ error: "Error interno del chatbot." });
  }
});

module.exports = router;
