export function GoogleBardAI(question){
    const axios = require('axios');
    let data = JSON.stringify({
      "prompt": {
        "text": "สูตรกะเพราต้องทำยังไงบ้าง"
        // "text": question
      }
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=AIzaSyC2pHjqBIZHbfqjAEVB4uhgWqcTWUvd3_A',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}
// export function TranEntoTh(){
//     const bot = new LineBotSdk.client(ACCESS_TOKEN);

// function doPost(e) { bot.call(e, callback) };
// function callback(e) {
//   if (e.message.type == "text" ) {
//      bot.replyMessage(e, [bot.textMessage(bard(e.message.text, 'en', 'th'))]);
//   }
// };

// function bard(prompt) {
//   var promptEN = LanguageApp.translate(prompt, 'th', 'en'); // เพิ่มจุดที่ 1
//   var api_key = "AIzaSyC2pHjqBIZHbfqjAEVB4uhgWqcTWUvd3_A"; //bard2 api
//   var url = "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=" + api_key;

//   var headers = {

//     "Content-Type": "application/json"
//   };

//   var requestBody = {
//     "prompt": {
//     "text": promptEN
//     }
//   }
  
//   var options = {
//     "method" : "POST",
//     "headers": headers,
//     "payload": JSON.stringify(requestBody)
//   }

//   var response = UrlFetchApp.fetch(url,options);
//   var data = JSON.parse(response.getContentText());
//   var output = data.candidates[0].output;
//   return  LanguageApp.translate(output, 'en', 'th'); // เพิ่มจุดที่ 2
// }
// }