// VERSION 7 - VIDEO 1 UPGRADED (REEL STYLE)

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ STATIC SERVE
app.use(express.static(path.resolve()));

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🔥 MAIN API
app.post("/generate-ads", async (req, res) => {
  try {
    const { image } = req.body;

    // 🛡️ IMAGE FIX
    let imageUrl = image;
    if (!imageUrl) {
      console.log("⚠️ Using default image");
      imageUrl =
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
    }

    // 🖼 DOWNLOAD IMAGE
    const imgRes = await fetch(imageUrl);
    const buffer = await imgRes.arrayBuffer();
    fs.writeFileSync("input.jpg", Buffer.from(buffer));

    // 🎬 OUTPUT FILES
    const outputs = ["output1.mp4", "output2.mp4", "output3.mp4"];

    // 🎬 COMMANDS
    const commands = [

      // 🔥 VIDEO 1 (REEL STYLE - MULTI SCENE)
      `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280,format=yuv420p,drawbox=color=black@0.4:t=fill,
      drawtext=text='🔥 STOP SCROLLING':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=150:enable='lt(t,1.5)',
      drawtext=text='💡 Best Quality Product':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=(h/2):enable='between(t,1.5,3)',
      drawtext=text='🎁 Limited Offer 👉 Order Now':fontcolor=yellow:fontsize=44:x=(w-text_w)/2:y=h-200:enable='gte(t,3)'
      " -t 5 ${outputs[0]}`,

      // ✅ VIDEO 2 (STABLE)
      `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280,format=yuv420p,
      drawtext=text='🔥 Limited Offer':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=100,
      drawtext=text='💡 Premium Quality':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=500,
      drawtext=text='👉 Buy Now':fontcolor=yellow:fontsize=45:x=(w-text_w)/2:y=1100
      " -t 5 ${outputs[1]}`,

      // ✅ VIDEO 3 (STABLE)
      `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280,format=yuv420p,
      drawtext=text='🔥 Trending Now':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=100,
      drawtext=text='💡 Loved by Users':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=500,
      drawtext=text='🎁 Order Today':fontcolor=yellow:fontsize=45:x=(w-text_w)/2:y=1100
      " -t 5 ${outputs[2]}`
    ];

    // ▶️ RUN COMMANDS
    for (let cmd of commands) {
      await new Promise((resolve, reject) => {
        exec(cmd, (err) => {
          if (err) {
            console.log("FFMPEG ERROR:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    // 📤 RETURN LINKS
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
