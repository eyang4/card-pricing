const set = "mb1";
const delay = 7500;
let page = 38;

const fs = require("fs");
const axios = require("axios");

const writeFile = (location, data) => {
  fs.writeFile(location, data, (err) => { // if a buffer is being returned, specify the encoding
    if (err) console.error(err);
  });
}

if (!fs.existsSync(set)){
  fs.mkdirSync(set);
}

const today = new Date().toDateString().replace(/ /g, '-');
if (!fs.existsSync(set + "/" + today)){
    fs.mkdirSync(set + "/" + today);
}

if (!fs.existsSync(set + "/" + today + "/pages")){
  fs.mkdirSync(set + "/" + today + "/pages");
}

// option + shift + f to format JSON
const begin = new Date();
console.log(begin.toLocaleTimeString() + ", " + begin.getMilliseconds() + " ms: start");

let endTime;
let uri = "https://api.scryfall.com/cards/search?order=set&unique=prints&q=in%3A" + set + "&page=" + page;
const storeCardInfo = () => {
  const startTime = new Date();
  console.log(startTime.toLocaleTimeString() + ", " + startTime.getMilliseconds() + "ms: " + set + " page " + page + " request" + (endTime ? ("; delay " + (startTime - endTime) + " ms") : "") + "; " + uri);
  axios.get(uri)
       .then(val => {
         endTime = new Date();
         process.stdout.write(endTime.toLocaleTimeString() + ", " + endTime.getMilliseconds() + "ms: " + set + " page " + page + " received");
         page++;
         if (val.status !== 429 && val.data.object === "list" && val.data.next_page) { // check for valid response, otherwise stop requesting
          // URI verbosely specifies include_extras and include_multilingual to false; default settings
           uri = val.data.next_page;
           setTimeout(storeCardInfo, delay);
         }
         const data = val.data;
         // requires directory to exist
         // overwrites existing file
         const location = set + "/" + today + "/pages/" + (page - 1) + ".json";
         writeFile(location, JSON.stringify(data));
         // console.log appends newline to end, stdout.write appends newline to beginning
         console.log("; " + location + " saved");
       })
       .catch(err => console.error(err));
}
storeCardInfo();
