const createNewDataScore = () => {
    return [
      {
        type: "box",
        layout: "baseline",
        contents: [
          { type: "text", text: "Pos.", size: "xxs", weight: "bold", flex: 2 },
          { type: "text", text: "L", flex: 1, size: "xxs", weight: "bold" },
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
          { type: "text", text: "W", flex: 1, size: "xxs", weight: "bold" },
          { type: "text", text: "D", flex: 1, size: "xxs", weight: "bold" },
          { type: "text", text: "L", flex: 1, size: "xxs", weight: "bold" },
          { type: "text", text: "+/-", size: "xxs", weight: "bold", flex: 2 },
          { type: "text", text: "Pt", size: "xxs", weight: "bold", flex: 1 },
        ],
      },
    ];
  };
  
  const createDataScoreItem = (number, item) => {
    return {
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
        { type: "icon", url: item.icon, size: "xxs" },
        {
          type: "text",
          text: item.team,
          wrap: true,
          color: "#666666",
          size: "xxs",
          flex: 3,
        },
        {
          type: "text",
          text: item.pi,
          flex: 2,
          size: "xxs",
          margin: "xl",
          align: "center",
        },
        { type: "text", text: item.w, flex: 1, size: "xxs", color: "#01B54C" },
        {
          type: "text",
          text: item.d,
          flex: 1,
          size: "xxs",
          color: "#929684",
          margin: "none",
        },
        {
          type: "text",
          text: item.l,
          flex: 1,
          size: "xxs",
          color: "#FA1001",
          margin: "none",
        },
        { type: "text", text: item.gd, flex: 2, size: "xxs", color: "#000000" },
        { type: "text", text: item.pts, flex: 1, size: "xxs", color: "#000000" },
      ],
    };
  };
  
  const newDataString = (newDataScore) => {
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
            },
          },
        },
      ],
    });
    return dataString;
  };
  
  module.exports = {
    createNewDataScore,
    createDataScoreItem,
    newDataString,
  };
  