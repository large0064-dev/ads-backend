import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/generate-script", async (req, res) => {
  try {
    const { title, description } = req.body;

    // 🔥 TEMP RESPONSE (test ke liye)
    const fakeScript = `🔥 Ad Script:
Buy ${title} now!
${description}
Limited Offer 🚀`;

    res.json({ script: fakeScript });

  } catch (err) {
    console.log(err);
    res.json({ script: "❌ Server error" });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port " + PORT);
});
