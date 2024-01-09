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

// Function to handle "How To" message
async function handleHowToMessage(req, message) {
  try {
    const axios = require("axios");
    var dataString = {};
    let data = JSON.stringify({
      prompt: {
        text: message,
      },
    });

    let config = {
      method: "post",
      url: `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${TOKENBARD}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    // const response = await axios(config);
    axios.request(config).then((response) => {
      dataString = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        messages: [
          {
            type: "text",
            text: response.data.candidates[0].output,
          },
        ],
      });
      sendLineMessage(dataString);
    });
  } catch (error) {
    console.log("Error handling How To message: ", error);
  }
}
// Function to handle "ตารางคะแนน" message
async function handleScoreTableMessage(req) {
  try {
    const listData = await axios.get(
      "https://pixel-screw-ensemble-incentives.trycloudflare.com"
    );
    const data = listData.data.data;

    const newDataScore = createNewDataScore(data);

    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "flex",
          altText: "ตารางคะแนนพรีเมียร์ลีคปัจจุบัน",
          contents: {
            type: "bubble",
            hero: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "image",
                  url: "https://ga.lnwfile.com/_/ga/_raw/e2/zk/v9.png",
                  size: "full",
                  aspectRatio: "15:10",
                },
              ],
            },
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "vertical",
                  margin: "lg",
                  spacing: "sm",
                  contents: newDataScore,
                },
              ],
            },
            footer: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "button",
                  action: {
                    type: "uri",
                    label: "ตารางคะแนนลีคอื่นๆ",
                    uri: "https://footballline.000webhostapp.com/point.html",
                  },
                  color: "#6600FF",
                  gravity: "center",
                  style: "primary",
                },
              ],
            },
          },
        },
      ],
    });

    sendLineMessage(dataString);
  } catch (error) {
    console.log("Error handling Score Table message: ", error);
  }
}

// Function to create newDataScore
function createNewDataScore(data) {
  const newDataScore = [
    {
      type: "box",
      layout: "baseline",
      contents: [
        { type: "text", text: "Pos.", size: "xxs", weight: "bold", flex: 2 },
        { type: "text", text: "L", flex: 1, size: "xxs", weight: "bold" },
        {
          type: "text",
          text: "Team",
          flex: 3,
          size: "xxs",
          weight: "bold",
          margin: "md",
        },
        {
          type: "text",
          text: "P",
          flex: 2,
          size: "xxs",
          weight: "bold",
          align: "center",
        },
        { type: "text", text: "W", flex: 1, size: "xxs", weight: "bold" },
        { type: "text", text: "D", flex: 1, size: "xxs", weight: "bold" },
        { type: "text", text: "L", flex: 1, size: "xxs", weight: "bold" },
        { type: "text", text: "+/-", size: "xxs", weight: "bold", flex: 2 },
        { type: "text", text: "Pt", size: "xxs", weight: "bold", flex: 1 },
      ],
    },
  ];

  for (let i = 0; i < data.length; i++) {
    const number = i + 1;
    const dataScore = {
      type: "box",
      layout: "baseline",
      spacing: "sm",
      contents: [
        {
          type: "text",
          text: `${number}`,
          color: "#000000",
          size: "xxs",
          flex: 2,
        },
        { type: "icon", url: data[i].icon, size: "xxs" },
        {
          type: "text",
          text: data[i].team,
          wrap: true,
          color: "#666666",
          size: "xxs",
          flex: 3,
        },
        {
          type: "text",
          text: data[i].pi,
          flex: 2,
          size: "xxs",
          margin: "xl",
          align: "center",
        },
        {
          type: "text",
          text: data[i].w,
          flex: 1,
          size: "xxs",
          color: "#01B54C",
        },
        {
          type: "text",
          text: data[i].d,
          flex: 1,
          size: "xxs",
          color: "#929684",
          margin: "none",
        },
        {
          type: "text",
          text: data[i].l,
          flex: 1,
          size: "xxs",
          color: "#FA1001",
          margin: "none",
        },
        {
          type: "text",
          text: data[i].gd,
          flex: 2,
          size: "xxs",
          color: "#000000",
        },
        {
          type: "text",
          text: data[i].pts,
          flex: 1,
          size: "xxs",
          color: "#000000",
        },
      ],
    };
    newDataScore.push(dataScore);
  }

  return newDataScore;
}

// Function to send Line message
function sendLineMessage(dataString) {

  

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + TOKEN,
  };

  const webhookOptions = {
    hostname: "api.line.me",
    path: "/v2/bot/message/reply",
    method: "POST",
    headers: headers,
    body: dataString,
  };

  const request = https.request(webhookOptions, (res) => {
    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  request.on("error", (err) => {
    console.error(err);
  });

  request.write(dataString);
  request.end();
}

// Handle POST request
app.post("/webhook", async function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!");
  const message = req.body.events[0].message.text;

  if (message.includes("How To")) {
    handleHowToMessage(req, res, message);
  } else if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ตารางคะแนน"
  ) {
    handleScoreTableMessage(req);
  }

  res.sendStatus(200);
});
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
