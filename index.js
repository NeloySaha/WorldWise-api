const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Welcome to Useless backend");
});

app.get("/getCities", (req, res) => {
  try {
    fs.readFile("./data/cities.json", "utf-8", (err, jsonData) => {
      if (err) throw new Error("Error while reading data");

      try {
        return new Promise((resolve, _) => {
          setTimeout(() => {
            resolve(res.json(JSON.parse(jsonData).cities));
          }, 0);
        });
      } catch (err) {
        throw new Error("Error while reading data");
      }
    });
  } catch (err) {
    console.log(err);

    return res.json(err);
  }
});

app.get("/getCities/:id", (req, res) => {
  const { id } = req.params;

  try {
    fs.readFile("./data/cities.json", "utf-8", (err, jsonData) => {
      if (err) throw new Error("Error while reading data");

      try {
        return new Promise((resolve, _) => {
          setTimeout(() => {
            const city = JSON.parse(jsonData).cities.find(
              (cityObj) => cityObj.id === Number(id)
            );

            resolve(res.json(city));
          }, 500);
        });
      } catch (err) {
        throw new Error("Error while reading data");
      }
    });
  } catch (err) {
    console.log(err);

    return res.json(err);
  }
});

app.post("/addCity", (req, res) => {
  const { cityName, country, emoji, date, notes, position, id } = req.body;

  fs.readFile("./data/cities.json", "utf8", (err, jsonData) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    let cities = [];
    try {
      cities = JSON.parse(jsonData).cities;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ error: "Internal server error" });
    }

    cities.push({
      cityName,
      country,
      emoji,
      date,
      notes,
      position,
      id,
    });

    const updatedData = JSON.stringify({ cities: cities }, null, 2);

    fs.writeFile("./data/cities.json", updatedData, (writeErr) => {
      if (writeErr) {
        console.error("Error writing file:", writeErr);
        return res.status(500).json({ error: "Internal server error" });
      }

      console.log("City added successfully:", cityName);

      return new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(res.json({ message: "City added successfully" }));
        }, 0);
      });
    });
  });
});

app.post("/deleteCity", (req, res) => {
  const { cityId } = req.body;

  fs.readFile("./data/cities.json", "utf8", (err, jsonData) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    let cities = [];
    try {
      cities = JSON.parse(jsonData).cities;
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ error: "Internal server error" });
    }

    const filteredCities = cities.filter(
      (cityObj) => cityObj.id !== Number(cityId)
    );

    const updatedData = JSON.stringify({ cities: filteredCities }, null, 2);

    fs.writeFile("./data/cities.json", updatedData, (writeErr) => {
      if (writeErr) {
        console.error("Error writing file:", writeErr);
        return res.status(500).json({ error: "Internal server error" });
      }

      console.log("City Deleted successfully");

      return new Promise((resolve, _) => {
        setTimeout(() => {
          resolve(res.json({ message: "City Deleted successfully" }));
        }, 0);
      });
    });
  });
});

app.listen(7001, () => {
  console.log("Listening on 7001 on localhost only");
});
