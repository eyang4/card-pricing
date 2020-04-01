const fs = require("fs");

const data = "New File Contents";

fs.writeFile("temp.txt", data, (err) => { // if a buffer is being returned, specify the encoding
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});

fs.readFile("temp.txt", function(err, buf) {
  if (err) console.log(err)
  console.log(buf.toString());
});
