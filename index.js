// VERSION FINAL - STATIC FIX + HTTPS + REEL VIDEOS

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ STATIC FIX (VERY IMPORTANT)
app.use(express.static(path.resolve()));

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🔥 MAIN API
app.post("/generate-ads", async (req, res) => {
  try {
    const { title, description, image } = req.body;

    // 🛡️ IMAGE FIX
    let imageUrl = image;
    if (!imageUrl) {
      console.log("⚠️ Image missing → using default image");
      imageUrl =
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
    }

    // 🖼 DOWNLOAD IMAGE
    const imgRes = await fetch(imageUrl);
    const buffer = await imgRes.arrayBuffer();
    fs.writeFileSync("input.jpg", Buffer.from(buffer));

    // 🎬 OUTPUT FILES
    const outputs = ["output1.mp4", "output2.mp4", "output3.mp4"];

    // 🎬 VIDEO COMMANDS (REEL STYLE)
    const commands = [

      // 🎥 VIDEO 1
      `ffmpeg -y -loop 1 -i input.jpg -vf "
      scale=720:1280:force_original_aspect_ratio=increase,
      crop=720:1280,
      zoompan=z='min(zoom+0.004,1.6)':d=125:s=720x1280,
      drawtext=text='🔥 STOP SCROLLING':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=100:enable='lt(t,1.5)',
      drawtext=text='💡 Best Quality Product':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h/2):enable='between(t,1.5,3)',
      drawtext=text='🎁 Limited Offer':fontcolor=yellow:fontsize=42:x=(w-text_w)/2:y=h-150:enable='gte(t,3)'
      " -t 5 -pix_fmt yuv420p ${outputs[0]}`,

      // 🎥 VIDEO 2
      `ffmpeg -y -loop 1 -i input.jpg -vf "
      scale=720:1280:force_original_aspect_ratio=increase,
      crop=720:1280,
      zoompan=z='1.1':d=125:s=720x1280,
      drawtext=text='🔥 Don’t Miss This':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=100:enable='lt(t,1.5)',
      drawtext=text='💡 Premium Quality':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h/2):enable='between(t,1.5,3)',
      drawtext=text='👉 Buy Now':fontcolor=yellow:fontsize=44:x=(w-text_w)/2:y=h-150:enable='gte(t,3)'
      " -t 5 -pix_fmt yuv420p ${outputs[1]}`,

      // 🎥 VIDEO 3
      `ffmpeg -y -loop 1 -i input.jpg -vf "
      scale=720:1280:force_original_aspect_ratio=increase,
      crop=720:1280,
      zoompan=z='if(lte(zoom,1.0),1.5,max(zoom-0.002,1.0))':d=125:s=720x1280,
      drawtext=text='🔥 Trending Product':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=100:enable='lt(t,1.5)',
      drawtext=text='💡 Loved by Users':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h/2):enable='between(t,1.5,3)',
      drawtext=text='🎁 Order Today':fontcolor=yellow:fontsize=44:x=(w-text_w)/2:y=h-150:enable='gte(t,3)'
      " -t 5 -pix_fmt yuv420p ${outputs[2]}`
    ];

    // ▶️ RUN ALL COMMANDS
    for (let cmd of commands) {
      await new Promise((resolve, reject) => {
        exec(cmd, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // 📤 RETURN LINKS (HTTPS FIX)
    res.json({
      videos: outputs.map(
        (file) => `https://${req.get("host")}/${file}`
      ),
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
