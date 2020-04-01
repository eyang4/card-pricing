const set = "mb1";
const cards = 1694;

const fs = require("fs");
const axios = require("axios");

const writeFile = (location, data) => {
  fs.writeFile(location, data, (err) => { // if a buffer is being returned, specify the encoding
    if (err) console.error(err);
    console.log("Successfully Written to File.");
  });
}

const readFile = location => {
  fs.readFile("temp.txt", function(err, buf) {
    if (err) console.error(err)
    console.log(buf.toString());
  });
}

if (!fs.existsSync(set)){
  fs.mkdirSync(set);
}

const today = new Date().toDateString().replace(/ /g, '-');
if (!fs.existsSync(set + "/" + today)){
    fs.mkdirSync(set + "/" + today);
}

// option + shift + f to format JSON
axios.get("https://api.scryfall.com/cards/mb1/1")
     .then(val => {
       const data = val.data;
       writeFile(set + "/" + today + "/" + data.collector_number + ".json", JSON.stringify(data)); // requires directory to exist
     })
     .catch(err => console.error(err));
