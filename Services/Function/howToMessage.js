

const express = require("express");

const { default: axios } = require("axios");

async function handelHowToMessage(req, message, dataString) {
    try {
      let data = JSON.stringify({
        prompt: {
          text: message,
        },
      });
  
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyC2pHjqBIZHbfqjAEVB4uhgWqcTWUvd3_A",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
  
      axios
        .request(config)
        .then(async function (response) {
          dataString = JSON.stringify({
            replyToken: req.body.events[0].replyToken,
            messages: [
              {
                type: "text",
                text: response,
              },
            ],
          });
  
          await bardAuthori.authoriZation(dataString);
        })
        .catch((error) => {
          console.log("Error authoriZation" + error);
        });
    } catch (error) {
      console.log("axios error: ", error);
    }
  }

  module.exports ={
    handelHowToMessage
  }