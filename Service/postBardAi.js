const TOKENBARD = process.env.POST_GENERAT_KEY_BARD;
const { default: axios } = require("axios");


async function generateGoogleBardAIResponse(question) {
  try {
    const data = JSON.stringify({
      prompt: {
        text: question,
      },
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${TOKENBARD}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    const response = await axios.request(config);
    return response.data.candidates[0].output;
  } catch (error) {
    console.log('generateGoogleBardAIResponse error: ', error);
    return null;
  }
}

async function fetchAndProcessData(req) {
  try {
    const listData = await axios.get('https://gaps-side-approaches-cuba.trycloudflare.com');
    const data = listData.data.data;

    const newDataScore = createNewDataScore(data);
    const dataString = createDataString(req.body.events[0].replyToken, newDataScore);

    await sendLineMessage(dataString);
  } catch (error) {
    console.log('fetchAndProcessData error: ', error);
  }
}

function createNewDataScore(data) {
  const newDataScore = [
    {
      type: 'box',
      layout: 'baseline',
      contents: [
        // ... (contents definition)
      ],
    },
  ];

  for (let i = 0; i < data.length; i++) {
    // ... (create dataScore and push into newDataScore)
  }

  return newDataScore;
}

function createDataString(replyToken, newDataScore) {
  const dataString = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: 'ตารางคะแนนพรีเมียร์ลีคปัจจุบัน',
        contents: {
          // ... (contents definition)
        },
      },
    ],
  });

  return dataString;
}

async function sendLineMessage(dataString) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    };

    const webhookOptions = {
      hostname: 'api.line.me',
      path: '/v2/bot/message/reply',
      method: 'POST',
      headers: headers,
      body: dataString,
    };

    const request = https.request(webhookOptions, (res) => {
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });

    request.on('error', (err) => {
      console.error(err);
    });

    request.write(dataString);
    request.end();
  } catch (error) {
    console.log('sendLineMessage error: ', error);
  }
}

 async function postGoogleBardAI(req, res,question) {
  if (question.includes('How To')) {
    const responseText = await generateGoogleBardAIResponse(question);
    
    if (responseText) {
      const dataString = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        messages: [
          {
            type: 'text',
            text: responseText,
          },
        ],
      });
      await sendLineMessage(dataString);
    }
  } else if (req.body.events[0].message.type === 'text' && req.body.events[0].message.text === 'ตารางคะแนน') {
    await fetchAndProcessData(req);
  }
}

module.exports = {
  postGoogleBardAI
}

