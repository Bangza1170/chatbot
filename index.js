const https = require("https");
const express = require("express");
const { log } = require("console");
const { default: axios } = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
const TOKEN = process.env.LINE_ACCESS_TOKEN;
const TOKENBARD = process.env.GENERAT_KEY_BARD;
const translate = require("./Services/translateApi");

const bardApi = require("./Services/bardAuthor");
const mockData = require("./Constants/mockData");
const line = require("./Services/lineApi");
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/guitar", (_, res) => {
  const axios = require("axios");

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://graph.sanook.com/?variables=%7B%22oppaChannel%22%3A%22sport%22%2C%22oppaCategorySlugs%22%3A%5B%5D%2C%22channels%22%3A%5B%22sport%22%5D%2C%22notInCategoryIds%22%3A%5B%5D%2C%22orderBy%22%3A%7B%22field%22%3A%22CREATED_AT%22%2C%22direction%22%3A%22DESC%22%7D%2C%22first%22%3A20%2C%22keyword%22%3A%22%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2298d212b4c53a3670ec293293f18296dc5472b97ab7cbbd7b429b9aa225b284d8%22%7D%7D",
    headers: {
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "keep-alive",
      Origin: "https://www.sanook.com",
      Referer: "https://www.sanook.com/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0",
      accept: "*/*",
      "content-type": "application/json",
      "sec-ch-ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Opera GX";v="106"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
    },
  };

  axios
    .request(config)
    .then((response) => {
      const result = response.data;
      let arrCard = [];

      result.data.entries.edges.forEach((item) => {
        const thumbnail = item.node.thumbnail.split("//s.isanook.com/")[1];
        const readMore = item.node.id;

        arrCard.push({
          type: "bubble",
          hero: {
            type: "image",
            size: "full",
            aspectRatio: "20:13",
            aspectMode: "cover",
            url: `https://s.isanook.com/${thumbnail}`,
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "text",
                text: item.node.title,
                wrap: true,
                weight: "bold",
                size: "lg",
              },
              {
                type: "box",
                layout: "baseline",
                contents: [],
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "button",
                style: "primary",
                action: {
                  type: "uri",
                  label: "อ่านเพิ่มเติม",
                  uri: `https://www.sanook.com/sport/${readMore}`,
                },
              },
            ],
          },
        });
      });

      res.status(200).json(arrCard);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

app.get("/", (req, res) => {
  res.sendStatus(200);
});
// const message = 'How To Flutter';
// const message = req.body.events[0].message.text;
app.post("/webhook", async function (req, res) {
  // res.send("HTTP POST request sent to the webhook URL!");
  const message = req.body.events[0].message.text;
  var dataString = {};

  const thToEn = await translate.translateString(message, "th", "en");

  if (message.includes("คำถาม")) {
    bardApi.bardAuthor(dataString, thToEn, req);
  } else if (message == "ข่าว") {
    const axios = require("axios");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://graph.sanook.com/?variables=%7B%22oppaChannel%22%3A%22sport%22%2C%22oppaCategorySlugs%22%3A%5B%5D%2C%22channels%22%3A%5B%22sport%22%5D%2C%22notInCategoryIds%22%3A%5B%5D%2C%22orderBy%22%3A%7B%22field%22%3A%22CREATED_AT%22%2C%22direction%22%3A%22DESC%22%7D%2C%22first%22%3A20%2C%22keyword%22%3A%22%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2298d212b4c53a3670ec293293f18296dc5472b97ab7cbbd7b429b9aa225b284d8%22%7D%7D",
      headers: {
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
        Origin: "https://www.sanook.com",
        Referer: "https://www.sanook.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0",
        accept: "*/*",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Not_A Brand";v="8", "Chromium";v="120", "Opera GX";v="106"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },
    };

    axios
      .request(config)
      .then((response) => {
        const result = response.data;
        let arrCard = [];
        
        for (let index = 0; index < 5; index++) {
          const item = result.data.entries.edges.length[index];
          const thumbnail = item.node.thumbnail.split("//s.isanook.com/")[1];
          const readMore = item.node.id;
  
          arrCard.push({
            type: "bubble",
            hero: {
              type: "image",
              size: "full",
              aspectRatio: "20:13",
              aspectMode: "cover",
              url: `https://s.isanook.com/${thumbnail}`,
            },
            body: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: item.node.title,
                  wrap: true,
                  weight: "bold",
                  size: "lg",
                },
                {
                  type: "box",
                  layout: "baseline",
                  contents: [],
                },
              ],
            },
            footer: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  action: {
                    type: "uri",
                    label: "อ่านเพิ่มเติม",
                    uri: `https://www.sanook.com/sport/${readMore}`,
                  },
                },
              ],
            },
          });
        };

        console.log(arrCard);

        const dataString = JSON.stringify({
          replyToken: req.body.events[0].replyToken,
          messages: [
            {
              type: "flex",
              altText: "ข่าวสารฟุตบอลล่าสุด",
              contents: {
                type: "carousel",
                contents: arrCard,
              },
            },
          ],
        });

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
        // prefix = https://s.isanook.com/
        // //s.isanook.com/
        // sp/0/ud/303/1517815/ew(1).jpg

        // https://www.sanook.com/sport/
        // 1517815/
        // https://www.sanook.com/sport/1517815
      })
      .catch((error) => {
        console.log(error);
      });
  }
  // else if(    req.body.events[0].message.type === "text" &&
  // req.body.events[0].message.text === "ข่าว") {
  //   const xmlData = fs.readFileSync('path/to/your/xml/file.xml', 'utf-8');
  //   xml2js.parseString(xmlData, (err, result) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       // ทำอะไรกับข้อมูล JSON ที่ได้ที่นี่
  //       const data = result.data;

  //       // เข้าถึงข้อมูลต่าง ๆ
  //       const approval = data.$.approval;
  //       const baseUrl = data.$.base_url;
  //       const gotoEmbed = data.gotoEmbed[0];
  //       const rssDIY = data.rssDIY[0];
  //       const widgetIndex = data.widgetIndex[0];

  //       // ตัวอย่างการเข้าถึงข้อมูลใน setting
  //       const sizeX = data.setting[0].sizeX[0];
  //       const sizeY = data.setting[0].sizeY[0];
  //       const displayType = data.setting[0].displayType[0];
  //       const theme = data.setting[0].theme[0];
  //       const topic = data.setting[0].topic[0];
  //       const totalTopic = data.setting[0].totalTopic[0];

  //       // ตัวอย่างการเข้าถึงข้อมูลใน feedsUrl
  //       const items = data.setting[0].feedsUrl[0].item;

  //       console.log('Approval:', approval);
  //       console.log('Base URL:', baseUrl);
  //       console.log('Goto Embed:', gotoEmbed);
  //       console.log('RSS DIY:', rssDIY);
  //       console.log('Widget Index:', widgetIndex);

  //       console.log('Size X:', sizeX);
  //       console.log('Size Y:', sizeY);
  //       console.log('Display Type:', displayType);
  //       console.log('Theme:', theme);
  //       console.log('Topic:', topic);
  //       console.log('Total Topic:', totalTopic);

  //       // ตัวอย่างการวนลูปเข้าถึงข้อมูลใน feedsUrl
  //       items.forEach((item, index) => {
  //         console.log(`\nItem ${index + 1}:`);
  //         console.log('Title:', item.title[0]);
  //         console.log('Link:', item.link[0]);
  //         console.log('Description:', item.description[0]);
  //         console.log('PubDate:', item.pubDate[0]);
  //         console.log('Header:', item.header[0]);
  //       });
  //     }
  //   });
  //   const flexMessage = {
  //     "type": "flex",
  //     "altText": "This is a Flex Message",
  //     "contents": {
  //       "type": "bubble",
  //       "header": {
  //         "type": "box",
  //         "layout": "vertical",
  //         "contents": [
  //           {
  //             "type": "text",
  //             "text": "Header Text",
  //             "weight": "bold",
  //             "size": "xl"
  //           }
  //         ]
  //       },
  //       "body": {
  //         "type": "box",
  //         "layout": "vertical",
  //         "contents": [
  //           {
  //             "type": "text",
  //             "text": "Body Text 1",
  //             "margin": "md"
  //           },
  //           {
  //             "type": "text",
  //             "text": "Body Text 2"
  //           }
  //         ]
  //       },
  //       "footer": {
  //         "type": "box",
  //         "layout": "vertical",
  //         "contents": [
  //           {
  //             "type": "text",
  //             "text": "Footer Text",
  //             "align": "center"
  //           }
  //         ]
  //       }
  //     }
  //   };

  //   // ตัวอย่างการใช้ Flex Message ในการส่งไปยัง Line
  //   const lineMessage = {
  //     type: 'flex',
  //     altText: 'This is a Flex Message',
  //     contents: flexMessage.contents,
  //   };

  //   // ส่ง Flex Message ไปยัง Line
  //   axios.post('https://api.line.me/v2/bot/message/push', {
  //     to: 'userId', // แทนที่ด้วย userId ที่คุณต้องการส่ง
  //     messages: [lineMessage],
  //   }, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer gpW6aqfrVCoBAyhSvPjIZoYYnOYfqYC/JhOSAXMVdYNpAtMOwf+o53maASzmQr0a8wQQTb8SEw3odehXybm7Cw2AfYzcBOqoHFWwJhKhKTzmTxSR0OOZbkA6t2gfnzaQS5w1GPjIG1pmLXRpw199agdB04t89/1O/w1cDnyilFU=', // แทนที่ด้วย Channel Access Token ของคุณ
  //     },
  //   })
  //     .then(response => {
  //       console.log('Flex Message sent successfully:', response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error sending Flex Message:', error.response.data);
  //     });
  // }
  else if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text === "ตารางคะแนน"
  ) {
    try {
      var listData = await axios.get(
        "https://inquiries-ash-ph-cathedral.trycloudflare.com"
      );
    } catch (error) {
      console.log("axios error: ", error);
    }

    const newDataScore = mockData.createNewDataScore();
    const data = listData.data.data;

    for (let i = 0; i < data.length; i++) {
      number = i + 1;
      let dataScore = mockData.createDataScoreItem(number, data, i);
      newDataScore.push(dataScore);
    }
    // Message data, must be stringified
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: mockData.newDataString(newDataScore),
    });
    line.lineApi(dataString);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
