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
  // If the user sends a message to your bot, send a reply message
  console.log(req.body.events[0]);
  if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ตาราง"
  ) {
    // Message data, must be stringified
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "flex",
          altText: "this is a flex message",
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "vertical",
                  margin: "lg",
                  spacing: "sm",
                  contents: [
                    {
                      type: "box",
                      layout: "baseline",
                      contents: [
                        {
                          type: "text",
                          text: "Pos.",
                          size: "xxs",
                          weight: "bold",
                          flex: 2,
                        },
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
                          flex: 1,
                          size: "xxs",
                          weight: "bold",
                        },
                        {
                          type: "text",
                          text: "W",
                          flex: 1,
                          size: "xxs",
                          weight: "bold",
                        },
                        {
                          type: "text",
                          text: "D",
                          flex: 1,
                          size: "xxs",
                          weight: "bold",
                        },
                        {
                          type: "text",
                          text: "L",
                          flex: 1,
                          size: "xxs",
                          weight: "bold",
                        },
                        {
                          type: "text",
                          text: "+/-",
                          size: "xxs",
                          weight: "bold",
                          flex: 1,
                        },
                        {
                          type: "text",
                          text: "Pt",
                          size: "xxs",
                          weight: "bold",
                          flex: 1,
                        },
                      ],
                    },
                    {
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [
                        {
                          type: "text",
                          text: "1",
                          color: "#000000",
                          size: "xxs",
                          flex: 2,
                        },
                        // {
                        //   type: "icon",
                        //   url: "https://cms.dmpcdn.com/sportteam/2018/08/07/1a075904-192f-42d7-b46c-cbd9a0ef51a1.png",
                        // },
                        {
                          type: "text",
                          text: "ท็อตแน่ม ฮ็อทสเปอร์",
                          wrap: true,
                          color: "#666666",
                          size: "xxs",
                          flex: 3,
                        },
                        {
                          type: "text",
                          text: "7",
                          flex: 1,
                          size: "xxs",
                          margin: "xl",
                        },
                        {
                          type: "text",
                          text: "2",
                          flex: 1,
                          size: "xxs",
                          color: "#01B54C",
                        },
                        {
                          type: "text",
                          text: "0",
                          flex: 1,
                          size: "xxs",
                          color: "#929684",
                          margin: "none",
                        },
                        {
                          type: "text",
                          text: "+12",
                          flex: 1,
                          size: "xxs",
                          color: "#FA1001",
                          margin: "none",
                        },
                        {
                          type: "text",
                          text: "23",
                          flex: 1,
                          size: "xxs",
                          color: "#000000",
                        },
                        {
                          type: "text",
                          text: "23",
                          flex: 1,
                          size: "xxs",
                          color: "#000000",
                        },
                        {
                          type: "text",
                          text: "2",
                          color: "#000000",
                          size: "xxs",
                          flex: 2,
                        },
                      ],
                    },
                    {
                      type: "box",
                      layout: "baseline",
                      spacing: "sm",
                      contents: [
                        {
                          type: "text",
                          text: "1",
                          color: "#000000",
                          size: "xxs",
                          flex: 2,
                        },
                        // {
                        //   type: "icon",
                        //   url: "https://cms.dmpcdn.com/sportteam/2018/08/07/1a075904-192f-42d7-b46c-cbd9a0ef51a1.png",
                        // },
                        {
                          type: "text",
                          text: "ท็อตแน่ม ฮ็อทสเปอร์",
                          wrap: true,
                          color: "#666666",
                          size: "xxs",
                          flex: 3,
                        },
                        {
                          type: "text",
                          text: "7",
                          flex: 1,
                          size: "xxs",
                          margin: "xl",
                        },
                        {
                          type: "text",
                          text: "2",
                          flex: 1,
                          size: "xxs",
                          color: "#01B54C",
                        },
                        {
                          type: "text",
                          text: "0",
                          flex: 1,
                          size: "xxs",
                          color: "#929684",
                          margin: "none",
                        },
                        {
                          type: "text",
                          text: "+12",
                          flex: 1,
                          size: "xxs",
                          color: "#FA1001",
                          margin: "none",
                        },
                        {
                          type: "text",
                          text: "23",
                          flex: 1,
                          size: "xxs",
                          color: "#000000",
                        },
                        {
                          type: "text",
                          text: "23",
                          flex: 1,
                          size: "xxs",
                          color: "#000000",
                        },
                        {
                          type: "text",
                          text: "2",
                          color: "#000000",
                          size: "xxs",
                          flex: 2,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
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
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
