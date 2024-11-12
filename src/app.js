const express = require("express");
const app = express();
const { Musician } = require("../models/index");
const { db } = require("../db/connection");

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/musicians", async (req, res) => {
  try {
    const musicians = await Musician.findAll();
    res.json(musicians);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/musicians/:id", async (req, res) => {
  try {
    const musician = await Musician.findByPk(req.params.id);
    if (musician) {
      res.json(musician);
    } else {
      res.status(404).send({ error: "Musician not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/musicians", async (req, res) => {
  try {
    const musician = await Musician.create(req.body);
    res.status(201).json(musician);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/musicians/:id", async (req, res) => {
  try {
    const musician = await Musician.findByPk(req.params.id);
    if (musician) {
      await musician.update(req.body);
      res.status(200).json(musician);
    } else {
      res.status(404).send({ error: "Musician not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/musicians/:id", async (req, res) => {
  try {
    const musician = await Musician.findByPk(req.params.id);
    if (musician) {
      await musician.destroy();
      res.status(200).send("Musician deleted");
    } else {
      res.status(404).send({ error: "Musician not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = app;
