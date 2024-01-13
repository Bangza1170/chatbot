async function translateString(message, from, to) {
    try {
      const options = {
        method: "POST",
        url: "https://microsoft-translator-text.p.rapidapi.com/translate",
        params: {
          "to[0]": to,
          "api-version": "3.0",
          from: from,
          profanityAction: "NoAction",
          textType: "plain",
        },
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "e0a38da895msh20013849f02baacp165b04jsnd2f7724b6a3f",
          "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
        },
        data: [{ Text: message }],
      };
      const response = await axios.request(options);
      return response.data[0].translations[0].text;
    } catch (e) {
      console.log(e);
    }
  }
  module.exports = {
    translateString,  
  };
  