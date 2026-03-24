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

    const prompt = `Create high converting Facebook ad:
Product: ${title}
Description: ${description}
Make it attractive and policy safe`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini Response:", data);

    if (data.error) {
      return res.json({ script: "❌ Gemini error aa raha hai" });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "❌ Script generate nahi hua";

    res.json({ script: text });
  } catch (err) {
    console.log(err);
    res.json({ script: "❌ Server error" });
  }
});

app.listen(10000, () => console.log("Server running 🚀"));
