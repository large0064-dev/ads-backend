import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🔥 MAIN API
app.post("/generate-ads", async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return res.json({ error: "HF_TOKEN missing" });
    }

    // 🧠 AI SCRIPTS
    const prompts = [
      `Write a short Hindi catchy ad: ${title} - ${description}`,
      `Write a Hindi benefit ad: ${title} - ${description}`,
      `Write a Hindi offer ad: ${title} - ${description}`
    ];

    const scripts = [];

    for (let i = 0; i < 3; i++) {
      const aiRes = await fetch(
        "https://router.huggingface.co/hf-inference/models/google/flan-t5-large",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompts[i] }),
        }
      );

      const text = await aiRes.text();

      let script = "Best product for you!";
      try {
        const data = JSON.parse(text);
        script = data[0]?.generated_text || script;
      } catch {}

      scripts.push(script.replace(/'/g, "").substring(0, 60));
    }

    // 🖼 IMAGE
    const imgRes = await fetch(image);
    const buffer = await imgRes.arrayBuffer();
    fs.writeFileSync("input.jpg", Buffer.from(buffer));

    // 🎬 VIDEO CREATE
    const outputs = ["v1.mp4", "v2.mp4", "v3.mp4"];

    for (let i = 0; i < 3; i++) {
      const cmd = `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='min(zoom+0.002,1.5)':d=125,drawbox=color=black@0.4:t=fill,drawtext=text='${scripts[i]}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2" -t 5 -pix_fmt yuv420p ${outputs[i]}`;

      await new Promise((resolve, reject) => {
        exec(cmd, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // 🔥 RETURN URLS
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      videos: outputs.map((file) => `${baseUrl}/${file}`)
    });

  } catch (err) {
    console.log(err);
    res.json({ error: "Server error" });
  }
});

// 🔥 STATIC SERVE
app.use(express.static(process.cwd()));

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
