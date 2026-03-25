import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/generate-script", async (req, res) => {
  try {
    const { title, description } = req.body;

    // ✅ PROMPT DEFINE KARO (IMPORTANT)
    const prompt = `Create high converting Facebook ad:
Product: ${title}
Description: ${description}
Make it attractive and policy safe`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCnRMfHDEWhsaXX7XgvDj_bl_2gep-PqVY",
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
    console.log("Server Error:", err);
    res.json({ script: "❌ Server error" });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
