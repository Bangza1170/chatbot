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
  console.log(req.body.events[0]);
  const message = req.body.events[0].message.text
  console.log("สูตรกระเพรา", message.split(" "))
  var dataString = {}
  if (message.split(" ")[0] === "คำถาม") {
    const axios = require('axios');
    let data = JSON.stringify({
      "prompt": {
        "text": message.split(" ")[1]
      }
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyC2pHjqBIZHbfqjAEVB4uhgWqcTWUvd3_A',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    try {
      const response = await axios.request(config)
      // const data_json = JSON.parse(response)
      console.log("result axios")
      const test_result = response.data.candidates[0].output
      dataString = JSON.stringify({
        "replyToken": req.body.events[0].replyToken,
        "messages":[
            {
                "type":"text",
                "text":test_result
            }
        ]
      })
      // console.log("token: ", TOKEN)
      const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer gpW6aqfrVCoBAyhSvPjIZoYYnOYfqYC/JhOSAXMVdYNpAtMOwf+o53maASzmQr0a8wQQTb8SEw3odehXybm7Cw2AfYzcBOqoHFWwJhKhKTzmTxSR0OOZbkA6t2gfnzaQS5w1GPjIG1pmLXRpw199agdB04t89/1O/w1cDnyilFU=",
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
      console.log("axios error: ", error)
    }

  } else if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ตารางคะแนน"
  ) {
    try {
      var listdata = await axios.get("https://cfgn3khv-1412.asse.devtunnels.ms/");
      // var listdata = await axios.get("https://nongfootball.onrender.com");
    } catch (error) {
      console.log("axios error: ", error)
    }
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
          altText: "ตารางคะแนนพรีเมียร์ลีคปัจจุบัน",
          contents: {
            type: "bubble",
            "hero": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "image",
                  "url": "https://ga.lnwfile.com/_/ga/_raw/e2/zk/v9.png",
                  "size": "full",
                  "aspectRatio": "15:10"
                }
              ]
            },
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
            },
              
            footer: {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "uri",
                        "label": "ตารางคะแนนลีคอื่นๆ",
                        "uri": "https://footballline.000webhostapp.com/point.html"
                      },
                      "color": "#6600FF",
                      "gravity": "center",
                      "style": "primary"
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
