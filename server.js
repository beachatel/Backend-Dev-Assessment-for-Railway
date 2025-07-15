import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

// Get __dirname working with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// ✅ Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

const baseApiUrl = "https://data.bus-data.dft.gov.uk/api/v1/datafeed/";
const apiKey = process.env.API_KEY;

app.get("/busdata", async (req, res) => {
  try {
    const boundingBox = req.query.boundingBox;
    const apiUrl = `${baseApiUrl}?boundingBox=${boundingBox}&api_key=${apiKey}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      throw new Error(
        `Failed to fetch data from the external API. Status: ${response.status}`
      );
    }
    res.header("Content-Type", "application/xml").send(await response.text());
  } catch (error) {
    console.error("Error fetching and proxying bus data:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch bus data", message: error.message });
  }
});

// ✅ Fallback to index.html (optional for SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
