const https = require("https");
const express = require("express");
const { default: axios } = require("axios");
const line = require("./lineApi");
const translate = require("./translateApi");


// เป็นฟังชั่น ดึง api google bard 
async function bardAuthor(dataString,thToEn,req) {
  try {
    const axios = require("axios");
    let data = JSON.stringify({
      prompt: {
        text: thToEn,
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyCuh1IvOrWdg7EteFw6AmhiPgBoDvViOGQ"
        ,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then(async function (response) {
        console.log("response.data : ", response.data);
        const enToTh = await translate.translateString(
          response.data.candidates[0].output,
          "en",
          "th"
        );
        dataString = JSON.stringify({
          replyToken: req.body.events[0].replyToken,
          messages: [
            {
              type: "text",
              text: enToTh,
            },
          ],
        });
        line.lineApi(dataString);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log("axios error: ", error);
  }
}
module.exports = {
  bardAuthor,
};
