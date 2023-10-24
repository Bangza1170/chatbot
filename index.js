const https = require("https");
const express = require("express");
const { log } = require("console");
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.post("/webhook", function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!");
  console.log(req.body.events[0].replyToken);
  // If the user sends a message to your bot, send a reply message
  if (
    req.body.events[0].type === "message" &&
    req.body.events[0].text === "ตาราง"
  ) {
    // Message data, must be stringified
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "buttons",
          thumbnailImageUrl: "https://picsum.photos/200/300",
          imageAspectRatio: "rectangle",
          imageSize: "cover",
          imageBackgroundColor: "#FFFFFF",
          title: "Menu",
          text: "Please select",
          defaultAction: {
            type: "uri",
            label: "View detail",
            uri: "https://picsum.photos/200/300",
          },
          actions: [
            {
              type: "postback",
              label: "Buy",
              data: "action=buy&itemid=123",
            },
            {
              type: "postback",
              label: "Add to cart",
              data: "action=add&itemid=123",
            },
            {
              type: "uri",
              label: "View detail",
              uri: "https://picsum.photos/200/300",
            },
          ],
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
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
