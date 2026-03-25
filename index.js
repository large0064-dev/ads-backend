app.post("/generate-script", async (req, res) => {
  try {
    const { title, description } = req.body;

    const prompt = `Create high converting Facebook ad:
Product: ${title}
Description: ${description}
Make it attractive and policy safe`;

    // 👇 YAHAN paste karna hai (OLD FETCH DELETE karke)
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent?key=AIzaSyCjBnDV7SZpFgrwhBGMISPadSl0AORHxbI",
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

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "❌ Script generate nahi hua";

    res.json({ script: text });

  } catch (err) {
    res.json({ script: "❌ Server error" });
  }
});
