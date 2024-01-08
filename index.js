const googleBardAI = require("./Service/postBardAi");
const https = require("https");
const express = require("express");
const { log } = require("console");
const { default: axios } = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;
const TOKENBARD = process.env.GENERAT_KEY_BARD;
const translate = require('@vitalets/google-translate-api');



app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.get("/test", (req, res) => {
});

app.post("/webhook", async function (req, res) {
  res.send('HTTP POST request sent to the webhook URL!');
  const message = req.body.events[0].message.text;
  googleBardAI(message);
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});