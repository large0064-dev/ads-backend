app.post("/generate-script", async (req, res) => {
  try {
    const { title, description } = req.body;

    const prompt = `Create high converting Facebook ad:
Product: ${title}
Description: ${description}
Make it catchy, emotional and persuasive`;

    const API_KEY = "AIzaSyDz5V1aYhvcx3CTWvoUa2DtTlYqIF-XgFY";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
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

    // 🔥 ERROR HANDLE
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
