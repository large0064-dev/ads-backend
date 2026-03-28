// VERSION 5 REEL PERFECT VIDEO

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

    // 🎬 STEP 3: VIDEO (🔥 REEL PERFECT)
    const output = "output.mp4";

    const safeText = script.replace(/'/g, "").substring(0, 80);

    const cmd = `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='min(zoom+0.002,1.5)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=125:s=720x1280,drawbox=color=black@0.4:t=fill,drawtext=text='${safeText}':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=(h-text_h)/2" -t 5 -pix_fmt yuv420p ${output}`;

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
