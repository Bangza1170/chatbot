const TOKEN = process.env.LINE_ACCESS_TOKEN;
const https = require("https");


// เป็นฟังชั่น ดึง api line 
async function lineApi(dataString) {
  try {
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
  } catch (error) {
    console.log("error reply: ", error);
  }
}

module.exports = {
    lineApi,
  };
  