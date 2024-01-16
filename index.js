const https = require("https");
const express = require("express");
const { log } = require("console");
const { default: axios } = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;
const TOKENBARD = process.env.GENERAT_KEY_BARD;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendStatus(200);
});
// const message = 'How To Flutter';
// const message = req.body.events[0].message.text;
app.post("/webhook", async function (req, res) {
  // res.send("HTTP POST request sent to the webhook URL!");
  const message = req.body.events[0].message.text;
  var dataString = {};

  // const thToEn = await translateString(message, "th", "en");
  // console.log('thToEn Data : ' +thToEn);
  const enToTh = await translateString(message, "en", "th");
  console.log('enToTh Data : ' +enToTh);
  if (enToTh.includes("ปัญหา")) {
    try {
      const axios = require("axios");
      let data = JSON.stringify({
        prompt: {
          text: enToTh,
        },
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyCuh1IvOrWdg7EteFw6AmhiPgBoDvViOGQ",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      console.log("config Data : ", config);

      axios.request(config).then((response) => {
        console.log("replyToken console log : ", req.body);
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
                "Bearer gpW6aqfrVCoBAyhSvPjIZoYYnOYfqYC/JhOSAXMVdYNpAtMOwf+o53maASzmQr0a8wQQTb8SEw3odehXybm7Cw2AfYzcBOqoHFWwJhKhKTzmTxSR0OOZbkA6t2gfnzaQS5w1GPjIG1pmLXRpw199agdB04t89/1O/w1cDnyilFU=",
            };
            console.log("headers console log : ", headers);
            // Options to pass into the request
            const webhookOptions = {
              hostname: "api.line.me",
              path: "/v2/bot/message/reply",
              method: "POST",
              headers: headers,
              body: dataString,
            };
            console.log("webhookOptions console log : ", webhookOptions);
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
            return res.status(200).send(enToTh);
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
  } else if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ตารางคะแนน"
  ) {
    try {
      var listData = await axios.get(
        "https://karl-campaigns-viral-deck.trycloudflare.com"
      );
    } catch (error) {
      console.log("axios error: ", error);
    }
    // console.log(listData.data.data);
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
            align: "center",
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
    const data = listData.data.data;

    for (let i = 0; i < data.length; i++) {
      number = i + 1;
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
    // Message data, must be stringified
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

              // newDataScore
            },
          },
        },
      ],
    });

    console.log("show data_string: ", dataString);

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

async function translateString(message, from, to) {
  try {

    const options = {
      method: "POST",
      url: "https://microsoft-translator-text.p.rapidapi.com/translate",
      params: {
        "to[0]": to,
        "api-version": "3.0",
        from: from,
        profanityAction: "NoAction",
        textType: "plain",
      },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "e0a38da895msh20013849f02baacp165b04jsnd2f7724b6a3f",
        "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
      },
      data: [{ Text: message }],
    };
    const response = await axios.request(options);
    return response.data[0].translations[0].text;
  } catch (e) {
    console.log(e);
  }
}

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
