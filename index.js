import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/generate-script", async (req, res) => {
  try {
    const { title, description } = req.body;

    const prompt = `Write a high converting Facebook ad:
Product: ${title}
Description: ${description}
Make it catchy, short and persuasive.`;

    const HF_TOKEN = process.env.HF_TOKEN;

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

    // 🔥 IMPORTANT FIX
    const textResponse = await response.text();
    console.log("RAW RESPONSE:", textResponse);

    let data;
    try {
      data = JSON.parse(textResponse);
    } catch {
      return res.json({ script: "❌ API response error" });
    }

    let result = "❌ Script generate nahi hua";

    if (Array.isArray(data) && data[0]?.generated_text) {
      result = data[0].generated_text;
    }

    res.json({ script: result });

  } catch (err) {
    console.log("Server Error:", err);
    res.json({ script: "❌ Server error" });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
