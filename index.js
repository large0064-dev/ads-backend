// VERSION 10 - PRO VIDEO (VOICE + MUSIC + REEL STYLE)

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// STATIC SERVE
app.use(express.static(path.resolve()));

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/generate-ads", async (req, res) => {
  try {
    const { image } = req.body;

    let imageUrl = image;
    if (!imageUrl) {
      imageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
    }

    // 🖼 DOWNLOAD IMAGE
    const imgRes = await fetch(imageUrl);
    const imgBuffer = await imgRes.arrayBuffer();
    fs.writeFileSync("input.jpg", Buffer.from(imgBuffer));

    // 🎵 DOWNLOAD MUSIC
    const musicRes = await fetch("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    const musicBuffer = await musicRes.arrayBuffer();
    fs.writeFileSync("music.mp3", Buffer.from(musicBuffer));

    // 🎙️ DOWNLOAD VOICE
    const voiceText = encodeURIComponent("Ruk jao! Ye product aapki life badal dega! Aaj hi order karo!");
    const voiceUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${voiceText}`;
    const voiceRes = await fetch(voiceUrl);
    const voiceBuffer = await voiceRes.arrayBuffer();
    fs.writeFileSync("voice.mp3", Buffer.from(voiceBuffer));

    const outputs = ["output1.mp4", "output2.mp4", "output3.mp4"];

    const commands = [

      // 🔥 VIDEO 1 (VOICE + MUSIC MIX)
      `ffmpeg -y -loop 1 -i input.jpg -i voice.mp3 -i music.mp3 -filter_complex "
[1:a]volume=1[a1];
[2:a]volume=0.3[a2];
[a1][a2]amix=inputs=2:duration=shortest[audio];

[0:v]scale=720:1280,format=yuv420p,
zoompan=z='min(zoom+0.001,1.2)':d=125:s=720x1280,
drawbox=y=0:h=250:color=black@0.6:t=fill,
drawbox=y=1030:h=250:color=black@0.6:t=fill,
drawtext=text='🔥 STOP SCROLLING':fontcolor=white:fontsize=52:x=(w-text_w)/2:y=80,
drawtext=text='Premium Quality Product':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=(h/2),
drawtext=text='👉 Order Now':fontcolor=yellow:fontsize=46:x=(w-text_w)/2:y=h-120
[video]
" -map "[video]" -map "[audio]" -t 5 -pix_fmt yuv420p ${outputs[0]}`,

      // VIDEO 2 (MUSIC ONLY)
      `ffmpeg -y -loop 1 -i input.jpg -i music.mp3 -vf "scale=720:1280,format=yuv420p,
drawtext=text='🔥 Limited Offer':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=100,
drawtext=text='💡 Premium Quality':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=500,
drawtext=text='👉 Buy Now':fontcolor=yellow:fontsize=45:x=(w-text_w)/2:y=1100
" -t 5 -shortest -pix_fmt yuv420p ${outputs[1]}`,

      // VIDEO 3 (MUSIC ONLY)
      `ffmpeg -y -loop 1 -i input.jpg -i music.mp3 -vf "scale=720:1280,format=yuv420p,
drawtext=text='🔥 Trending Now':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=100,
drawtext=text='💡 Loved by Users':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=500,
drawtext=text='🎁 Order Today':fontcolor=yellow:fontsize=45:x=(w-text_w)/2:y=1100
" -t 5 -shortest -pix_fmt yuv420p ${outputs[2]}`
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
