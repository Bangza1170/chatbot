
// เป็นฟังชั่นที่ ดึงข้อมูลจากตาราง web sanook
const sanook = () => {
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
  return config;
};


module.exports = {
    sanook,
}
