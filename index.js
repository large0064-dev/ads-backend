// STEP 6 - MULTI SCENE AD VIDEO

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

    let imageUrl =
      image ||
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff";

    const safeTitle = (title || "Amazing Product").substring(0, 30);
    const safeDesc = (description || "Best quality product")
      .split(" ")
      .slice(0, 6)
      .join(" ");

    // DOWNLOAD IMAGE
    const imgRes = await fetch(imageUrl);
    const imgBuffer = await imgRes.arrayBuffer();
    fs.writeFileSync("input.jpg", Buffer.from(imgBuffer));

    // 🎬 SCENE 1 - HOOK
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280,zoompan=z='zoom+0.002',d=50,
drawtext=text='🔥 ${safeTitle}':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=200" -t 2 scene1.mp4`,
        (err) => (err ? reject(err) : resolve())
      );
    });

    // 🎬 SCENE 2 - INFO
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280,
drawtext=text='${safeDesc}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=600" -t 2 scene2.mp4`,
        (err) => (err ? reject(err) : resolve())
      );
    });

    // 🎬 SCENE 3 - CTA
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -loop 1 -i input.jpg -vf "scale=720:1280,
drawtext=text='👉 Order Now':fontcolor=yellow:fontsize=45:x=(w-text_w)/2:y=1000" -t 2 scene3.mp4`,
        (err) => (err ? reject(err) : resolve())
      );
    });

    // 🎬 JOIN SCENES
    fs.writeFileSync(
      "list.txt",
      "file 'scene1.mp4'\nfile 'scene2.mp4'\nfile 'scene3.mp4'"
    );

    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -f concat -safe 0 -i list.txt -c copy output1.mp4`,
        (err) => (err ? reject(err) : resolve())
      );
    });

    res.json({
      videos: [`https://${req.get("host")}/output1.mp4`],
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
