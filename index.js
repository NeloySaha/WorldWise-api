const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const port = process.env.PORT || 7001;

const app = express();
app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "data", "cities.json");

app.get("/", (req, res) => {
  return res.send("Neloy's WorldWise API");
});

app.get("/getCities", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, jsonData) => {
    if (err) {
      console.error("Error while reading data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    try {
      const data = JSON.parse(jsonData);
      return res.json(data.cities);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

app.get("/getCities/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile(filePath, "utf-8", (err, jsonData) => {
    if (err) {
      console.error("Error while reading data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    try {
      const data = JSON.parse(jsonData);
      const city = data.cities.find((cityObj) => cityObj.id === Number(id));
      return res.json(city || {});
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

app.post("/addCity", (req, res) => {
  const { cityName, country, emoji, date, notes, position, id } = req.body;

  fs.readFile(filePath, "utf8", (err, jsonData) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    let cities;
    try {
      cities = JSON.parse(jsonData).cities;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ error: "Internal server error" });
    }

    cities.push({ cityName, country, emoji, date, notes, position, id });

    fs.writeFile(filePath, JSON.stringify({ cities }, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing file:", writeErr);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.json({ message: "City added successfully" });
    });
  });
});

app.post("/deleteCity", (req, res) => {
  const { cityId } = req.body;

  fs.readFile(filePath, "utf8", (err, jsonData) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    let cities;
    try {
      cities = JSON.parse(jsonData).cities;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ error: "Internal server error" });
    }

    const filteredCities = cities.filter(
      (cityObj) => cityObj.id !== Number(cityId)
    );

    fs.writeFile(
      filePath,
      JSON.stringify({ cities: filteredCities }, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Error writing file:", writeErr);
          return res.status(500).json({ error: "Internal server error" });
        }
        return res.json({ message: "City Deleted successfully" });
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
