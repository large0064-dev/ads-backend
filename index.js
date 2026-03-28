// VERSION FINAL PRO ADS (MULTI VIDEO + TIMED TEXT)

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

    console.log("Incoming:", { title, description, image });

    // 🧠 SAME STRUCTURE (3 STYLE TEXT)
    const scripts = [
      "STOP SCROLLING!",
      "Best Product For You",
      "Limited Time Offer"
    ];

    // 🖼 IMAGE FIX
    let imageUrl = image;

    if (!imageUrl) {
      console.log("⚠️ No image → using default");
      imageUrl =
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
    }

    const imgRes = await fetch(imageUrl);
    const buffer = await imgRes.arrayBuffer();
    fs.writeFileSync("input.jpg", Buffer.from(buffer));

    // 🎬 OUTPUT FILES
    const outputs = ["output1.mp4", "output2.mp4", "output3.mp4"];

    // 🎬 FFMPEG COMMANDS (PRO STYLE)
    const commands = scripts.map((text, i) => {
      return `ffmpeg -y -loop 1 -i input.jpg -vf "
scale=720:1280:force_original_aspect_ratio=increase,
crop=720:1280,

zoompan=z='min(zoom+0.002,1.6)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=125:s=720x1280,

drawbox=y=0:h=180:color=black@0.5:t=fill,
drawbox=y=1100:h=180:color=black@0.5:t=fill,

drawtext=text='🔥 ${text}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=80:enable='lt(t,1.5)',

drawtext=text='💡 Best Quality Product':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h/2-50):enable='between(t,1.5,3)',

drawtext=text='🎁 Limited Time Offer':fontcolor=yellow:fontsize=42:x=(w-text_w)/2:y=(h/2+20):enable='between(t,3,4)',

drawtext=text='👉 Order Now':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=h-120:enable='gte(t,4)'
" -t 5 -pix_fmt yuv420p ${outputs[i]}`;
    });

    // 🚀 RUN ALL VIDEOS
    for (let cmd of commands) {
      console.log("Running:", cmd);

      await new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
          if (err) {
            console.log("❌ FFMPEG ERROR:", err);
            console.log(stderr);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    // 📤 RETURN LINKS
    const videoLinks = outputs.map(
      (file) => `${req.protocol}://${req.get("host")}/${file}`
    );

    console.log("✅ Videos ready:", videoLinks);

    res.json({ videos: videoLinks });

  } catch (err) {
    console.log("🔥 ERROR:", err);
    res.json({ error: err.message });
  }
});

// 📂 STATIC FILE SERVE
app.use(express.static(process.cwd()));

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
