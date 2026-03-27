import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🔥 MAIN API
app.post("/generate-ad", async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return res.json({ error: "HF_TOKEN missing" });
    }

    // 🧠 STEP 1: SCRIPT
    const prompt = `Write a short Facebook ad:
Product: ${title}
Description: ${description}`;

    const aiRes = await fetch(
      "https://router.huggingface.co/hf-inference/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const aiText = await aiRes.text();

    let script = "Best product for you!";
    try {
      const data = JSON.parse(aiText);
      if (Array.isArray(data) && data[0]?.generated_text) {
        script = data[0].generated_text;
      }
    } catch {}

    // 🖼 STEP 2: IMAGE DOWNLOAD
    const imgRes = await fetch(image);
    const buffer = await imgRes.arrayBuffer();
    fs.writeFileSync("input.jpg", Buffer.from(buffer));

    // 🎬 STEP 3: VIDEO
    const output = "output.mp4";

    const cmd = `ffmpeg -y -loop 1 -i input.jpg -vf "drawtext=text='${script}':fontcolor=white:fontsize=24:x=10:y=H-th-10" -t 5 -pix_fmt yuv420p ${output}`;

    await new Promise((resolve, reject) => {
      exec(cmd, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // 📤 STEP 4: SEND VIDEO
    res.sendFile(`${process.cwd()}/${output}`);

  } catch (err) {
    console.log("ERROR:", err);
    res.json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
