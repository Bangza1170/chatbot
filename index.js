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

app.post("/webhook", async function(req, res) {
  
    res.send("HTTP POST request sent to the webhook URL!")
  // If the user sends a message to your bot, send a reply message
  if (req.body.events[0].type === "message"&&req.body.events[0].message.text!=="ถามคำถามกับNongFootBall") {
    // Message data, must be stringified

    const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
          prompt: req.body.events[0].message.text+" ให้ตอบเกี่ยวกับฟุตบอลเท่านั้น",
          max_tokens: maxTokens,
          temperature: temperature
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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' // แทนค่า YOUR_API_KEY ด้วย API key ของคุณ
          }
        }
      );
    
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          "type": "text",
          "text": response.data.choices[0].text
        },
        // {
        //   "type": "text",
        //   "text": "May I help you?"
        // }
      ]
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