const https = require("https")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const TOKEN = process.env.LINE_ACCESS_TOKEN

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.sendStatus(200)
})

app.post("/webhook", function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!")
  // If the user sends a message to your bot, send a reply message
  if (req.body.events[0].type === "message" && req.body.events[0].text === "ตาราง") {
    // Message data, must be stringified
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      "type": "bubble",
      "size": "giga",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Premier league matchday 1",
            "size": "xl",
            "weight": "bold",
            "align": "center",
            "decoration": "none",
            "color": "#FFFFFF",
            "style": "normal",
            "gravity": "top"
          }
        ],
        "backgroundColor": "#472C84"
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "SATURDAY 11 MAY 2023",
            "size": "lg",
            "align": "center",
            "margin": "none",
            "weight": "bold"
          },
          {
            "type": "separator",
            "margin": "md",
            "color": "#000000"
          },
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "text",
                "text": "Liverpool",
                "size": "md",
                "weight": "regular"
              },
              {
                "type": "text",
                "text": "7 - 0",
                "align": "center",
                "size": "lg",
                "flex": 1,
                "margin": "xxl",
                "weight": "regular"
              },
              {
                "type": "text",
                "text": "Manchester united",
                "size": "md",
                "align": "end",
                "flex": 2
              }
            ],
            "spacing": "xs"
          },
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "text",
                "text": "Arsenal",
                "size": "md",
                "weight": "regular"
              },
              {
                "type": "text",
                "text": "3 - 1",
                "align": "center",
                "size": "lg",
                "flex": 1,
                "margin": "xxl",
                "weight": "regular"
              },
              {
                "type": "text",
                "text": "Manchester City",
                "size": "md",
                "align": "end",
                "flex": 2
              }
            ],
            "spacing": "xs"
          },
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "text",
                "text": "Aston Villa",
                "size": "md",
                "weight": "regular",
                "flex": 1
              },
              {
                "type": "text",
                "text": "2 - 0",
                "align": "center",
                "size": "lg",
                "flex": 1,
                "margin": "xxl",
                "weight": "regular"
              },
              {
                "type": "text",
                "text": "Fulham",
                "size": "md",
                "align": "end",
                "flex": 2
              }
            ],
            "spacing": "xs"
          },
          {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "text",
                "text": "Chelsea",
                "size": "md",
                "weight": "regular"
              },
              {
                "type": "text",
                "text": "1 - 4",
                "align": "center",
                "size": "lg",
                "flex": 1,
                "margin": "xxl",
                "weight": "regular"
              },
              {
                "type": "text",
                "text": "Brighton",
                "size": "md",
                "align": "end",
                "flex": 2
              }
            ],
            "spacing": "xs"
          }
        ],
        "margin": "none",
        "spacing": "md"
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "ข้อมูลเพิ่มเติม",
              "uri": "https://www.premierleague.com/news/3568527"
            },
            "style": "primary"
          }
        ]
      },
      "direction": "ltr"
    })

    // Request header
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + TOKEN
    }

    // Options to pass into the request
    const webhookOptions = {
      "hostname": "api.line.me",
      "path": "/v2/bot/message/reply",
      "method": "POST",
      "headers": headers,
      "body": dataString
    }

    // Define request
    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d)
      })
    })

    // Handle error
    request.on("error", (err) => {
      console.error(err)
    })

    // Send data
    request.write(dataString)
    request.end()
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})