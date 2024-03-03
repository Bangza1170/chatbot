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

const createDataScoreItem = (number, data, i) => {
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
};

const newDataString = (newDataScore) => {
  return [
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
  ];
};

async function cardData(arrCard,result) {
  for (let index = 0; index < 5; index++) {
    const item = result.data.entries.edges[index];
    console.log(item);
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

}


module.exports = {
  createNewDataScore,
  createDataScoreItem,
  newDataString,
  cardData,
};
