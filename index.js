import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});


// 👇 YAHAN SE START (IMPORTANT PART)
app.post("/generate-script", async (req, res) => {
  try {
    const { title, description } = req.body;

    const prompt = `Create high converting Facebook ad:
Product: ${title}
Description: ${description}
Make it attractive and policy safe`;

    const API_KEY = "AIzaSyCjBnDV7SZpFgrwhBGMISPadSl0AORHxbI";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
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
// 👆 YAHAN TAK


const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
