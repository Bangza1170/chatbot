const TOKENBARD = process.env.GENERAT_KEY_BARD;

export function getApiBard(){
    
app.get("/test", (req, res) => {
  const axios = require("axios");
  let data = JSON.stringify({
    prompt: {
      text: "history manchester united",
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
  axios
    .request(config)
    .then((response) => {
      const result = response.data.candidates[0].output;
      return res.status(200).send(result);
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json(error);
    });
});
}