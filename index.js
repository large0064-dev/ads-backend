// VERSION FINAL - IMAGE FIX + PRO VIDEO + DEBUG

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

// 🔥 MAIN API (3 VIDEOS)
app.post("/generate-ads", async (req, res) => {
  try {
    const { title, description, image } = req.body;

    console.log("Incoming:", { title, description, image });

    // 🧠 SIMPLE STATIC SCRIPTS (stable)
    const scripts = [
      "Best Product For You",
      "Limited Time Offer",
      "Buy Now & Save Big"
    ];

    // 🖼 IMAGE FIX (IMPORTANT)
    let imageUrl = image;

    if (!imageUrl) {
      console.log("⚠️ Image missing → using default image");

      imageUrl =
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
    }

    const imgRes = await fetch(imageUrl);
    const buffer = await imgRes.arrayBuffer();
    fs.writeFileSync("input.jpg", Buffer.from(buffer));

    // 🎬 VIDEO SETTINGS
    const outputs = ["output1.mp4", "output2.mp4", "output3.mp4"];

    const commands = scripts.map((text, i) => {
      return `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='min(zoom+0.002,1.6)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=125:s=720x1280,drawbox=y=0:h=200:color=black@0.5:t=fill,drawbox=y=1080:h=200:color=black@0.5:t=fill,drawtext=text='🔥 ${text}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=80,drawtext=text='👉 Order Now':fontcolor=yellow:fontsize=42:x=(w-text_w)/2:y=h-120" -t 5 -pix_fmt yuv420p ${outputs[i]}`;
    });

    // 🔥 RUN FFMPEG
    for (let cmd of commands) {
      console.log("Running:", cmd);

      await new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
          if (err) {
            console.log("❌ FFMPEG ERROR:", err);
            console.log("STDERR:", stderr);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    // 📤 SEND VIDEO LINKS
    const videoLinks = outputs.map(
      (file) => `${req.protocol}://${req.get("host")}/${file}`
    );

    console.log("Videos ready:", videoLinks);

    res.json({ videos: videoLinks });

  } catch (err) {
    console.log("🔥 FINAL ERROR:", err);
    res.json({ error: err.message });
  }
});

// 🟢 STATIC SERVE
app.use(express.static(process.cwd()));

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
