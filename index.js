const https = require("https");
const express = require("express");
const { log } = require("console");
const { default: axios } = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;
const TOKENBARD = process.env.GENERAT_KEY_BARD;
const translate = require("./Services/translateApi");

const bardApi = require("./Services/bardAuthor");
const mockData = require("./Constants/mockData");
const line = require("./Services/lineApi");
const sanook = require("./Services/sanookApi");
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/guitar", (_, res) => {
  const axios = require("axios");
  //return config
  var data = sanook.sanook();
  axios
    .request(data)
    .then(async (response) => {
      const result = response.data;
      let arrCard = [];
      await mockData.cardData(arrCard, result);
      res.status(200).json(arrCard);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

app.get("/", (req, res) => {
  res.sendStatus(200);
});
app.post("/webhook", async function (req, res) {
  const message = req.body.events[0].message.text;
  var dataString = {};

  const thToEn = await translate.translateString(message, "th", "en");

  if (message.includes("คำถาม")) {
    bardApi.bardAuthor(dataString, thToEn, req);
  } else if (message == "ข่าว") {
    const axios = require("axios");

    var data = sanook.sanook();
    axios
      .request(data)
      .then(async (response) => {
        const result = response.data;
        let arrCard = [];

        await mockData.cardData(arrCard, result);
        console.log(arrCard);

        const dataString = JSON.stringify({
          replyToken: req.body.events[0].replyToken,
          messages: [
            {
              type: "flex",
              altText: "ข่าวสารฟุตบอลล่าสุด",
              contents: {
                type: "carousel",
                contents: arrCard,
              },
            },
          ],
        });

        // Request header
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + TOKEN,
        };
        // Options to pass into the request
        const webhookOptions = {
          hostname: "api.line.me",
          path: "/v2/bot/message/reply",
          method: "POST",
          headers: headers,
          body: dataString,
        };

        // Define request
        const request = https.request(webhookOptions, (res) => {
          res.on("data", (d) => {
            process.stdout.write(d);
          });
        });

        // Handle error
        request.on("error", (err) => {
          console.error(err);
        });

        // Send data
        request.write(dataString);
        request.end();
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ตารางคะแนน"
  ) {
    try {
      var listData = await axios.get(
        "https://less-ice-challenges-sunshine.trycloudflare.com"
      );
    } catch (error) {
      console.log("axios error: ", error);
    }

    const newDataScore = mockData.createNewDataScore();
    const data = listData.data.data;

    for (let i = 0; i < data.length; i++) {
      number = i + 1;

      let dataScore = mockData.createDataScoreItem(number, data, i);
      newDataScore.push(dataScore);
    }
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: mockData.newDataString(newDataScore),
    });
    line.lineApi(dataString);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
