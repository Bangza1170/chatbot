const TOKENBARD = process.env.POST_GENERAT_KEY_BARD;
const { default: axios } = require("axios");



async function generateBardAIResponse(question) {
  try {
    let data = JSON.stringify({
      prompt: {
        text: question,
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${TOKENBARD}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);
    return response.data.candidates[0].output;
  } catch (error) {
    console.log("generateBardAIResponse error: ", error);
    return null;
  }
}

async function sendLineMessage(replyToken, messages) {
  try {
    const dataString = JSON.stringify({
      replyToken: replyToken,
      messages: messages,
    });

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    };

    const webhookOptions = {
      hostname: "api.line.me",
      path: "/v2/bot/message/reply",
      method: "POST",
      headers: headers,
      body: dataString,
    };

    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    request.on("error", (err) => {
      console.error(err);
    });

    request.write(dataString);
    request.end();
  } catch (error) {
    console.log("sendLineMessage error: ", error);
  }
}


function createNewDataScore(data) {
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

  for (let i = 0; i < data.length; i++) {
    // ... (create dataScore and push into newDataScore)
  }

  return newDataScore;
}

function createDataMessage(replyToken, newDataScore) {
  return {
    type: "flex",
    altText: "ตารางคะแนนพรีเมียร์ลีคปัจจุบัน",
    contents:[
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
    ]
  };
}

async function postGoogleBardAI(req, res, question) {
  res.send("HTTP POST request sent to the webhook URL!");

  if (question.includes("How To")) {
    const responseText = await generateBardAIResponse(question);

    if (responseText) {
      const messages = [
        {
          type: "text",
          text: responseText,
        },
      ];

      await sendLineMessage(req.body.events[0].replyToken, messages);
    }
  } else if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ตารางคะแนน"
  ) {
    try {
      const listData = await axios.get(
        "https://gaps-side-approaches-cuba.trycloudflare.com"
      );
      const data = listData.data.data;

      const newDataScore = createNewDataScore(data);
      const messages = [
        createDataMessage(req.body.events[0].replyToken, newDataScore),
      ];

      await sendLineMessage(req.body.events[0].replyToken, messages);
    } catch (error) {
      console.log("axios error: ", error);
    }
  }
}
module.exports = {
  postGoogleBardAI,
};




