

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

app.post("/webhook", async function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!");
  const message = req.body.events[0].message.text;
  var dataString = {};
  if (message.includes("How To")) {
    handleHowToMessage(req, message,dataString);
  }
});

async function handleHowToMessage(req,message,dataString) {
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

        try {
          const headers = {
            "Content-Type": "application/json",
            Authorization:
              "Bearer "+ TOKEN,
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
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log("axios error: ", error);
  }
}
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});