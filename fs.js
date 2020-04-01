const fs = require("fs");
const axios = require("axios");

const writeFile = data => {
  fs.writeFile("temp.txt", data, (err) => { // if a buffer is being returned, specify the encoding
    if (err) console.error(err);
    console.log("Successfully Written to File.");
  });
}

const readFile = data => {
  fs.readFile("temp.txt", function(err, buf) {
    if (err) console.error(err)
    console.log(buf.toString());
  });
}

axios.get("https://api.scryfall.com/cards/mb1/1")
     .then(val => {
       writeFile(JSON.stringify(val.data))
     })
     .catch(err => console.error(err));
