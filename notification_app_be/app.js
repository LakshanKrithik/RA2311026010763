require("dotenv").config();
const express = require("express");
const Log = require("./middleware/logger");

const app = express();
app.use(express.json());

app.get("/test", async (req, res) => {
  await Log("backend", "info", "route", "Test route hit");
  res.send("Working");
});

app.get("/error", async (req, res) => {
  try {
    throw new Error("Something broke");
  } catch (err) {
    await Log("backend", "error", "handler", err.message);
    res.status(500).send("Error occurred");
  }
});

app.listen(3000, async () => {
  console.log("Server running on port 3000");
  await Log("backend", "info", "service", "App started");
});