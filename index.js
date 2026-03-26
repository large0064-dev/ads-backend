import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* =========================
   🤖 GENERATE SCRIPT API
========================= */
app.post("/generate-script", async (req, res) => {
  try {
    const { title, description } = req.body;

    const prompt = `Write a high converting Facebook ad:
Product: ${title}
Description: ${description}
Make it catchy, short and persuasive.`;

    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return res.json({ script: "❌ HF_TOKEN missing in Render" });
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    const data = await response.json();
    console.log("HF Response:", data);

    let text = "❌ Script generate nahi hua";

    if (Array.isArray(data) && data[0]?.generated_text) {
      text = data[0].generated_text;
    }

    res.json({ script: text });

  } catch (err) {
    console.log("Server Error:", err);
    res.json({ script: "❌ Server error" });
  }
});

/* =========================
   🚀 SERVER START
========================= */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
