// VERSION FINAL - REEL STYLE ADS (3 VIDEOS)

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
app.post("/generate-ads", async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return res.json({ error: "HF_TOKEN missing" });
    }

    // 🧠 AI SCRIPT (optional short text)
    const prompt = `Write a short Hindi ad:
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

    let script = "Best Product";
    try {
      const data = await aiRes.json();
      if (Array.isArray(data) && data[0]?.generated_text) {
        script = data[0].generated_text;
      }
    } catch {}

    const safeText = script.replace(/'/g, "").substring(0, 50);

    // 🖼 IMAGE FIX (IMPORTANT)
    let imageUrl = image;

    if (!imageUrl) {
      console.log("⚠️ Image missing → using default");
      imageUrl =
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
    }

    const imgRes = await fetch(imageUrl);
    const buffer = await imgRes.arrayBuffer();
    fs.writeFileSync("input.jpg", Buffer.from(buffer));

    // 🎬 3 VIDEOS COMMAND
    const outputs = ["output1.mp4", "output2.mp4", "output3.mp4"];

    const commands = [
      // 🎥 VIDEO 1 (FAST ZOOM)
      `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='min(zoom+0.004,1.6)':d=125:s=720x1280,drawtext=text='🔥 STOP SCROLLING':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=100:enable='lt(t,1.5)',drawtext=text='💡 ${safeText}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h/2):enable='between(t,1.5,3)',drawtext=text='🎁 Order Now':fontcolor=yellow:fontsize=44:x=(w-text_w)/2:y=h-150:enable='gte(t,3)'" -t 5 -pix_fmt yuv420p output1.mp4`,

      // 🎥 VIDEO 2 (CLEAN STYLE)
      `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='1.1':d=125:s=720x1280,drawtext=text='🔥 Don’t Miss This':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=100:enable='lt(t,1.5)',drawtext=text='💡 ${safeText}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h/2):enable='between(t,1.5,3)',drawtext=text='👉 Buy Now':fontcolor=yellow:fontsize=44:x=(w-text_w)/2:y=h-150:enable='gte(t,3)'" -t 5 -pix_fmt yuv420p output2.mp4`,

      // 🎥 VIDEO 3 (ZOOM OUT)
      `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='if(lte(zoom,1.0),1.5,max(zoom-0.002,1.0))':d=125:s=720x1280,drawtext=text='🔥 Trending Product':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=100:enable='lt(t,1.5)',drawtext=text='💡 ${safeText}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h/2):enable='between(t,1.5,3)',drawtext=text='🎁 Limited Offer':fontcolor=yellow:fontsize=44:x=(w-text_w)/2:y=h-150:enable='gte(t,3)'" -t 5 -pix_fmt yuv420p output3.mp4`
    ];

    // 🎬 RUN COMMANDS
    for (let cmd of commands) {
      await new Promise((resolve, reject) => {
        exec(cmd, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // 📤 RETURN LINKS
    res.json({
      videos: outputs.map(
        (file) => `${req.protocol}://${req.get("host")}/${file}`
      ),
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.json({ error: "Server error" });
  }
});

// 🟢 STATIC FILE SERVE
app.use(express.static(process.cwd()));

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
