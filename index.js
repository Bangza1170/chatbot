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

app.get("/test", async (req, res) => {
  const textmessage = "คำถาม: อยากรู้ว่ากะเพราทำยังไง";
  var dataString = {};
  const response = await translateString(res, textmessage);
  if (response.includes("คำถาม")) {
    handelHowToMessage(req, res, translatedMessage, dataString);
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

    const newDataScore = createNewDataScore();
    const data = listData.data.data;
    for (let i = 0; i < data.length; i++) {
      const number = i + 1;
      const dataScoreItem = createDataScoreItem(number, data[i]);
      newDataScore.push(dataScoreItem);
    }
    const dataString = await dataString(newDataScore);

    console.log("show data_string: ", dataString);
    authoriZation(dataString);
  }
});

app.post("/webhook", async function (req, res) {
  
  res.send("HTTP POST request sent to the webhook URL!");
  const message = req.body.events[0].message.text;
  // const textmessage = "คำถาม: อยากรู้ว่ากะเพราทำยังไง";
  
  var dataString = {};
  const response = await translateString(res, message);
  const responseText = response.translations[0].text;
  console.log('responseText'+responseText);

  if (responseText.includes("ตำถาม")) {
  await  handelHowToMessage(req, res, responseText, dataString);
  } 
  
  // else if (
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
  //   const newDataStrings = await newDataString(newDataScore);

  //   console.log("show data_string: ", newDataStrings);
  //   authoriZation(dataString);
  // }
});

async function handelHowToMessage(req, res, message, dataString) {
  try {
    let data = JSON.stringify({
      prompt: {
        text: message,
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyC2pHjqBIZHbfqjAEVB4uhgWqcTWUvd3_A",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        dataString = JSON.stringify({
          replyToken: req.body.events[0].replyToken,
          messages: [
            {
              type: "text",
              text: response.data.candidates[0].output,
            },
          ],
        });

        authoriZation(dataString);
      })
      .catch((error) => {
        console.log("Error authoriZation" + error);
      });
  } catch (error) {
    console.log("axios error: ", error);
  }
}
async function authoriZation(dataString) {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization:
        "Bearer gpW6aqfrVCoBAyhSvPjIZoYYnOYfqYC/JhOSAXMVdYNpAtMOwf+o53maASzmQr0a8wQQTb8SEw3odehXybm7Cw2AfYzcBOqoHFWwJhKhKTzmTxSR0OOZbkA6t2gfnzaQS5w1GPjIG1pmLXRpw199agdB04t89/1O/w1cDnyilFU=",
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
  } catch (error) {
    console.log("error reply: ", error);
  }
}
async function translateString(res, textmessage) {
  try {
    const options = {
      method: "POST",
      url: "https://microsoft-translator-text.p.rapidapi.com/translate",
      params: {
        "to[0]": "en",
        "api-version": "3.0",
        from: "th",
        profanityAction: "NoAction",
        textType: "plain",
      },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "3869ac740fmsh5c1de103ef19a6ap149d92jsna8ba63ae66c2",
        "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
      },
      data: [{ Text: textmessage }],
    };
    const response = await axios.request(options);
    console.log(response.data);
    return res.status(200).send(response.data);
  } catch (e) {
    console.log(e);
  }
}

function createNewDataScore() {
  return [
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
}

function createDataScoreItem(number, item) {
  return {
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
      { type: "icon", url: item.icon, size: "xxs" },
      {
        type: "text",
        text: item.team,
        wrap: true,
        color: "#666666",
        size: "xxs",
        flex: 3,
      },
      {
        type: "text",
        text: item.pi,
        flex: 2,
        size: "xxs",
        margin: "xl",
        align: "center",
      },
      { type: "text", text: item.w, flex: 1, size: "xxs", color: "#01B54C" },
      {
        type: "text",
        text: item.d,
        flex: 1,
        size: "xxs",
        color: "#929684",
        margin: "none",
      },
      {
        type: "text",
        text: item.l,
        flex: 1,
        size: "xxs",
        color: "#FA1001",
        margin: "none",
      },
      { type: "text", text: item.gd, flex: 2, size: "xxs", color: "#000000" },
      { type: "text", text: item.pts, flex: 1, size: "xxs", color: "#000000" },
    ],
  };
}
async function newDataString(newDataScore) {
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
  return dataString;
}

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
