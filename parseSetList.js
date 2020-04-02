let page = 1;
const date = "Wed-Apr-01-2020"
const totalCards = 7785;

const fs = require("fs");

const writeFile = (location, data) => {
  fs.writeFile(location, data, (err) => {
    if (err) console.error(err);
  });
}

const cardBank = {};
const maxPages = Math.ceil(totalCards / 175);
while (fs.existsSync("mb1/" + date + "/pages/" + page + ".json")) {
  console.log(`Processing page ${page} out of ${maxPages}`);
  fs.readFile("mb1/" + date + "/pages/" + page + ".json", function(err, buf) {
    if (err) console.error(err);
    const cardArray = JSON.parse(buf).data;

    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
      if (!cardBank[card.name]) {
        cardBank[card.name] = {
          [card.set_name]: { // computed property names from ES2015
            [card.collector_number]: {
              rarity: card.rarity,
              prices: card.prices
            }
          }
        };
      }
      else {
        if (!cardBank[card.name][card.set_name]) {
          cardBank[card.name][card.set_name] = {
            [card.collector_number]: {
              rarity: card.rarity,
              prices: card.prices
            }
          };
        }
        else {
          if (!cardBank[card.name][card.set_name][card.collector_number]) {
            cardBank[card.name][card.set_name][card.collector_number] = {
              rarity: card.rarity,
              prices: card.prices
            };
          }
          else {
            if (!cardBank[card.name][card.set_name][card.collector_number]["rarity"] && !cardBank[card.name][card.set_name][card.collector_number]["prices"]) {
              cardBank[card.name][card.set_name]["rarity"] = card.rarity;
              cardBank[card.name][card.set_name]["prices"] = card.prices;
            }
            else {
              console.log(`Unexpected error: ${card.name} - ${card.set_name} - ${card.rarity} - ${card.collector_number}`);
              console.log(card.prices);
              console.log(`Existing record:`);
              console.log(cardBank[card.name]);
            }
          }
        }
      }
    }

    if (page >= maxPages) writeFile("mb1/" + date + "/parsedPage.json", JSON.stringify(cardBank));

  });
  page++;
}
