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
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",
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

    const textData = await response.text(); // 👈 IMPORTANT FIX

    let result;

    try {
      result = JSON.parse(textData);
    } catch {
      console.log("Raw Response:", textData);
      return res.json({ script: "❌ API response error" });
    }

    console.log("HF Response:", result);

    let text = "❌ Script generate nahi hua";

    if (result?.[0]?.generated_text) {
      text = result[0].generated_text;
    }

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
