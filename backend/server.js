require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";
const RANGE = "Sheet1!A:E"; // Change based on your Google Sheet structure

async function getSheetData() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json", // Your Google Service Account JSON file
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE,
  });

  return response.data.values;
}

app.get("/lookup/:serial", async (req, res) => {
  const serialNumber = req.params.serial;
  try {
    const data = await getSheetData();
    const headers = data[0];
    const row = data.find((row) => row[0] === serialNumber);

    if (row) {
      const result = headers.reduce((acc, key, index) => {
        acc[key] = row[index] || "";
        return acc;
      }, {});

      res.json(result);
    } else {
      res.status(404).json({ error: "Serial number not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));


