const set = "mb1";
const cards = 1694;
const delay = 1000;
let currentCard = 1;

const fs = require("fs");
const axios = require("axios");

const writeFile = (location, data) => {
  fs.writeFile(location, data, (err) => { // if a buffer is being returned, specify the encoding
    if (err) console.error(err);
    // console.log("Write success");
  });
}

// const readFile = location => {
//   fs.readFile("temp.txt", function(err, buf) {
//     if (err) console.error(err);
//     console.log(buf.toString());
//   });
// }

if (!fs.existsSync(set)){
  fs.mkdirSync(set);
}

const today = new Date().toDateString().replace(/ /g, '-');
if (!fs.existsSync(set + "/" + today)){
    fs.mkdirSync(set + "/" + today);
}

// option + shift + f to format JSON
const begin = new Date()
console.log(begin.toLocaleTimeString() + ", " + begin.getMilliseconds() + " ms: start")

const storeCardInfo = () => {
  const startTime = new Date()
  console.log(startTime.toLocaleTimeString() + ", " + startTime.getMilliseconds() + "ms: " + set + " card " + currentCard + " request")
  axios.get("https://api.scryfall.com/cards/" + set + "/" + currentCard)
       .then(val => {
         const endTime = new Date()
         console.log(endTime.toLocaleTimeString() + ", " + endTime.getMilliseconds() + "ms: " + set + " card " + currentCard + " received")
         currentCard++;
         if (currentCard <= cards) {
           setTimeout(storeCardInfo, delay);
         }
         const data = val.data;
         // requires directory to exist
         // overwrites existing file
         writeFile(set + "/" + today + "/" + data.collector_number + ".json", JSON.stringify(data));
       })
       .catch(err => console.error(err));
}
storeCardInfo()
