const express = require("express");
const router = express.Router();
const { Musician } = require("../models");
const { check, validationResult } = require("express-validator");

router.get("/", async (req, res) => {
  try {
    const musicians = await Musician.findAll();
    res.json(musicians);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
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

router.post(
  "/",
  [
    check("name").trim().notEmpty().withMessage("Name cannot be empty"),
    check("instrument")
      .trim()
      .notEmpty()
      .withMessage("Instrument cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const musician = await Musician.create(req.body);
      res.status(201).json(musician);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.put(
  "/:id",
  [
    check("name").trim().notEmpty().withMessage("Name cannot be empty"),
    check("instrument")
      .trim()
      .notEmpty()
      .withMessage("Instrument cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
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
  }
);

router.delete("/:id", async (req, res) => {
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

module.exports = router;
