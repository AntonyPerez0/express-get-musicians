const express = require("express");
const app = express();

app.use(express.json());

const musiciansRouter = require("../routes/musicians");
app.use("/musicians", musiciansRouter);

module.exports = app;
