const bardAuthori = require("./Services/bardAuthori");
const tranSlate = require("./Services/translateApi");
const mockDatas = require("./Constants/mockData");
const howToMessage = require("./Function/howToMessage");

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
  const message = req.body.events[0].message.text;
  var dataString = {};
  
  if (message.includes("how to")) {
   await handelHowToMessage(req, res, message, dataString);   
  } 
  

});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

async function handelHowToMessage(req, message, dataString) {
  try {
    let data = JSON.stringify({
      prompt: {
        text: message,
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${TOKENBARD}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then(async function (response) {
        dataString = JSON.stringify({
          replyToken: req.body.events[0].replyToken,
          messages: [
            {
              type: "text",
              text:  response.data.candidates[0].output,
            },
          ],
        });

        await authoriZation(dataString);
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
module.exports = {
  authoriZation,
};
