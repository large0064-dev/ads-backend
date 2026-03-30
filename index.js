// VERSION FIX - VIDEO + VOICE ONLY (STABLE)

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
    const { image } = req.body;

    let imageUrl = image;
    if (!imageUrl) {
      imageUrl =
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
    }

    // IMAGE DOWNLOAD
    const imgRes = await fetch(imageUrl);
    const imgBuffer = await imgRes.arrayBuffer();
    fs.writeFileSync("input.jpg", Buffer.from(imgBuffer));

    // VOICE DOWNLOAD
    const voiceText = encodeURIComponent("Ruk jao! Ye product aapki life badal dega! Aaj hi order karo!");
    const voiceUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${voiceText}`;

    const voiceRes = await fetch(voiceUrl);
    const voiceBuffer = await voiceRes.arrayBuffer();
    fs.writeFileSync("voice.mp3", Buffer.from(voiceBuffer));

    const outputs = ["output1.mp4", "output2.mp4", "output3.mp4"];

    const commands = [

      // VIDEO 1 (VOICE)
      `ffmpeg -y -loop 1 -i input.jpg -i voice.mp3 -vf "scale=720:1280,format=yuv420p,
drawbox=y=0:h=250:color=black@0.6:t=fill,
drawbox=y=1030:h=250:color=black@0.6:t=fill,
drawtext=text='🔥 STOP SCROLLING':fontcolor=white:fontsize=52:x=(w-text_w)/2:y=80,
drawtext=text='Premium Quality Product':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=(h/2),
drawtext=text='👉 Order Now':fontcolor=yellow:fontsize=46:x=(w-text_w)/2:y=h-120
" -shortest -t 5 -pix_fmt yuv420p ${outputs[0]}`,

      // VIDEO 2 (NO AUDIO)
      `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280,format=yuv420p,
drawtext=text='🔥 Limited Offer':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=100,
drawtext=text='💡 Premium Quality':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=500,
drawtext=text='👉 Buy Now':fontcolor=yellow:fontsize=45:x=(w-text_w)/2:y=1100
" -t 5 -pix_fmt yuv420p ${outputs[1]}`,

      // VIDEO 3 (NO AUDIO)
      `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280,format=yuv420p,
drawtext=text='🔥 Trending Now':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=100,
drawtext=text='💡 Loved by Users':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=500,
drawtext=text='🎁 Order Today':fontcolor=yellow:fontsize=45:x=(w-text_w)/2:y=1100
" -t 5 -pix_fmt yuv420p ${outputs[2]}`
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
