// STEP 2 - ADD ZOOM EFFECT + BETTER STYLE

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve()));

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/generate-ads", async (req, res) => {
  try {
    const { image, title, description } = req.body;

    let imageUrl = image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff";

    const safeTitle = (title || "Amazing Product").substring(0, 30);
    const safeDesc = (description || "Best quality product")
      .split(" ")
      .slice(0, 6)
      .join(" ");

    // DOWNLOAD IMAGE
    const imgRes = await fetch(imageUrl);
    const imgBuffer = await imgRes.arrayBuffer();
    fs.writeFileSync("input.jpg", Buffer.from(imgBuffer));

    const outputs = ["output1.mp4", "output2.mp4"];

    const commands = [

      // 🎬 VIDEO 1 (ZOOM EFFECT + HOOK)
      `ffmpeg -y -loop 1 -i input.jpg -vf "scale=8000:-1,zoompan=z='min(zoom+0.0015,1.5)':d=125:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',scale=720:1280,format=yuv420p,
drawbox=y=0:h=180:color=black@0.6:t=fill,
drawbox=y=1100:h=180:color=black@0.6:t=fill,
drawtext=text='🔥 ${safeTitle}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=60,
drawtext=text='${safeDesc}':fontcolor=white:fontsize=34:x=(w-text_w)/2:y=520,
drawtext=text='👉 Order Now':fontcolor=yellow:fontsize=42:x=(w-text_w)/2:y=1120
" -t 5 -pix_fmt yuv420p ${outputs[0]}`,

      // 🎬 VIDEO 2 (SMOOTH CLEAN STYLE)
      `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280,format=yuv420p,
fade=t=in:st=0:d=1,
fade=t=out:st=4:d=1,
drawtext=text='${safeTitle}':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=300,
drawtext=text='${safeDesc}':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=650,
drawtext=text='Limited Offer':fontcolor=yellow:fontsize=40:x=(w-text_w)/2:y=1050
" -t 5 -pix_fmt yuv420p ${outputs[1]}`
    ];

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
