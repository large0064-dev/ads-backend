const response = await fetch(
  "https://router.huggingface.co/hf-inference/models/gpt2",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 120,
        temperature: 0.7,
      },
    }),
  }
);

const data = await response.json();
console.log("HF Response:", data);

// 👇 Safe extraction
let text = "❌ Script generate nahi hua";

if (Array.isArray(data) && data[0]?.generated_text) {
  text = data[0].generated_text;
} else if (data?.error) {
  console.log("HF Error:", data.error);
}

res.json({ script: text });
