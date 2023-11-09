const https = require("https");
const express = require("express");
const { log } = require("console");
const { default: axios } = require("axios");
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

app.post("/webhook", async function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!");
  // If the user sends a message to your bot, send a reply message
  console.log(TOKEN);
  console.log(req.body.events[0]);
  if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ตาราง"
  ) {
    const listdata = await axios.get("http://localhost:1412/");
    console.log(listdata.data.data);
    const newDataScore = [
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
            text: "L",
            flex: 1,
            size: "xxs",
            weight: "bold",
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
            flex: 2,
            size: "xxs",
            weight: "bold",
            align: "center"
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
            flex: 2,
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
    ];
    const data = listdata.data.data;
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].pi);
      number = i+1
      let dataScore = {
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
          {
            type: "icon",
            url: data[i].icon,
            size: "xxs",
          },
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
            align: "center"
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
      newDataScore.push(dataScore)
    }
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
              contents:[
                {
                  type: "box",
                  layout: "vertical",
                  margin: "lg",
                  spacing: "sm",
                  contents: newDataScore
                }
              ] 
              
              // newDataScore
            },
          },
        },
      ],
    });

    console.log("show data_string: ", dataString)

    // Request header
    const headers = {
      "Content-Type": "application/json",
      // Authorization: "Bearer " + TOKEN,
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
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
