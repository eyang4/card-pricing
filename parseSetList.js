let page = 1
const date = "Wed-Apr-01-2020"

const fs = require("fs");

while (fs.existsSync("mb1/" + date + "/pages/" + page + ".json")) {
  const readFile = location => {
    fs.readFile("mb1/" + date + "/pages/" + page + ".json", function(err, buf) {
      if (err) console.error(err);
      console.log(buf.toString());
    });
  }
  page++;
}
