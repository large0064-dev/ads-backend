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

    const data = await response.json();
    console.log("HF Response:", data);

    let text = "❌ Script generate nahi hua";

    if (data?.[0]?.generated_text) {
      text = data[0].generated_text;
    }

    res.json({ script: text });

  } catch (err) {
    console.log(err);
    res.json({ script: "❌ Server error" });
  }
});
