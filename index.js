import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // 👈 IMPORTANT

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const HF_TOKEN = process.env.HF_TOKEN;

app.post("/generate-script", async (req, res) => {
  try {
    const { title, description } = req.body;

    const prompt = `Write a high converting Facebook ad:
Product: ${title}
Description: ${description}`;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    const data = await response.json();
    console.log("HF Response:", data);

    const text =
      data?.[0]?.generated_text || "❌ Script generate nahi hua";

    res.json({ script: text });

  } catch (err) {
    console.log("Server Error:", err);
    res.json({ script: "❌ Server error" });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
