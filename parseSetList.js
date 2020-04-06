let page = 1;
const date = "Wed-Apr-01-2020";
// const date = new Date().toDateString().replace(/ /g, '-'); // for automated daily parsing
const totalCards = 7785;
const setName = "Mystery Booster";

const fs = require("fs");

const writeFile = (location, data) => {
  fs.writeFile(location, data, (err) => {
    if (err) console.error(err);
  });
}

const cardBank = {};
const maxPages = Math.ceil(totalCards / 175);
let completed = 0;
while (fs.existsSync("mb1/" + date + "/pages/" + page + ".json")) {
  console.log(`Queued page ${page} of ${maxPages}`);
  fs.readFile("mb1/" + date + "/pages/" + page + ".json", function(err, buf) {
    if (err) console.error(err);
    const response = JSON.parse(buf);
    const cardArray = response.data;

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
    completed++; // does not present a race condition in Node.js

    let currentPage;
    if (!response.next_page) currentPage = maxPages;
    else {
      const numbers = "0123456789";
      const startPosition = response.next_page.indexOf("page=") + 5;
      let endPosition = startPosition;
      while (numbers.includes(response.next_page[endPosition])) endPosition++;
      currentPage = parseInt(response.next_page.slice(startPosition, endPosition)) - 1;
    }
    console.log(`Processed page ${currentPage}; total of ${completed} pages`);

    if (completed >= maxPages) {
      for (const card in cardBank) {
        if (Object.keys(cardBank[card][setName]).length > 1) console.log(card); // checking for multiple versions of a card

        const cardPricesFromSet = Object.values(cardBank[card][setName])[0].prices;
        const setLowPrice = [];
        if (cardPricesFromSet.usd) setLowPrice.push(cardPricesFromSet.usd); // factor in null values
        if (cardPricesFromSet.usd_foil) setLowPrice.push(cardPricesFromSet.usd_foil);
        let lowPriceFromSet;
        if (setLowPrice.length === 0) lowPriceFromSet = null;
        else lowPriceFromSet = Math.min(...setLowPrice);

        const otherSetLowPrice = [];
        let lowPriceFromOtherSets;
        for (const set in cardBank[card]) {
          if (set !== setName) {
            for (const collectorNumber in cardBank[card][set]) {
              if (lowPriceFromOtherSets) otherSetLowPrice.push(lowPriceFromOtherSets);
              if (cardBank[card][set][collectorNumber].prices.usd) otherSetLowPrice.push(cardBank[card][set][collectorNumber].prices.usd);
              if (cardBank[card][set][collectorNumber].prices.usd_foil) otherSetLowPrice.push(cardBank[card][set][collectorNumber].prices.usd_foil);
              if (otherSetLowPrice.length !== 0) lowPriceFromOtherSets = Math.min(...otherSetLowPrice);
            }
          }
        }

        if (lowPriceFromSet) cardBank[card].lowPriceFromSet = lowPriceFromSet;
        if (lowPriceFromOtherSets) cardBank[card].lowPriceFromOtherSets = lowPriceFromOtherSets;
        if (lowPriceFromSet && lowPriceFromOtherSets) cardBank[card].discount = 100 * (lowPriceFromOtherSets - lowPriceFromSet) / lowPriceFromOtherSets;
      }

      writeFile("mb1/" + date + "/parsedPage.json", JSON.stringify(cardBank));
    }

  });
  page++;
}
