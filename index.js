const bardAuthori = require("./Services/bardAuthori");
const tranSlate = require("./Services/translateApi");
const mockDatas = require("./Constants/mockData");
const howToMessage = require("./Services/Function/howToMessage");

const https = require("https");
const express = require("express");
const { log } = require("console");
const { default: axios } = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;
const TOKENBARD = process.env.GENERAT_KEY_BARD;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.post("/test", async (req, res) => {
  const textmessage = "คำถาม: อยากรู้ว่ากะเพราทำยังไง";
  //  const message = req.body.events[0].message.text;
  var dataString = {};
  const response = await translateString(res, textmessage);
  // if (response.includes("คำถาม")) {
  //   handelHowToMessage(req, res, translatedMessage, dataString);
  // } else if (
  //   req.body.events[0].message.type === "text" &&
  //   req.body.events[0].message.text === "ตารางคะแนน"
  // ) {
  //   try {
  //     var listData = await axios.get(
  //       "https://rally-finances-proceeds-recreational.trycloudflare.com"
  //     );
  //   } catch (error) {
  //     console.log("axios error: ", error);
  //   }
  //   console.log(listData.data.data);

  //   const newDataScore = createNewDataScore();
  //   const data = listData.data.data;
  //   for (let i = 0; i < data.length; i++) {
  //     const number = i + 1;
  //     const dataScoreItem = createDataScoreItem(number, data[i]);
  //     newDataScore.push(dataScoreItem);
  //   }
  //   const dataString = await dataString(newDataScore);

  //   console.log("show data_string: ", dataString);
  //   authoriZation(dataString);
  // }
});

app.post("/webhook", async function (req, res) {
  // const message = "คำถาม: รถอะไรแรงที่สุดในโลก";
  const message = req.body.events[0].message.text;
  var dataString = {};
  const thToEn = await tranSlate.translateString(message, "th", "en");
  const enToTh = await tranSlate.translateString(thToEn, "en", "th");
  if (enToTh.includes("คำถาม")) {
    howToMessage.handelHowToMessage(req, res, enToTh, dataString);
  } else if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ตารางคะแนน"
  ) {
    try {
      var listData = await axios.get(
        "https://rally-finances-proceeds-recreational.trycloudflare.com"
      );
    } catch (error) {
      console.log("axios error: ", error);
    }
    console.log(listData.data.data);

    const newDataScore = mockDatas.createNewDataScore();
    const data = listData.data.data;
    for (let i = 0; i < data.length; i++) {
      const number = i + 1;
      const dataScoreItem = mockDatas.createDataScoreItem(number, data[i]);
      newDataScore.push(dataScoreItem);
    }
    const dataString = mockDatas.newDataString(newDataScore);

    console.log("show data_string: ", dataString);
    await bardAuthori.authoriZation(dataString);
  }
  return res.status(200).send(enToTh);
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
