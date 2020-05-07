/*
React.createElement(tag, properties, child elements);
<h1>Greetings, {this.props.name}!</h1>
React.createElement('h1', null, 'Greetings, ' + this.props.name + '!');
<Greetings name='Chris'></Greetings>
React.createElement(Greetings, { name : 'Chris' });
*/

class PriceTable extends React.Component
{
  constructor() {
    super();
    const cardBank = Object.entries(May062020); // main input
    for (const card of cardBank) {
      card.push(Apr012020[card[0]]) // aux input
    }

    this.state = cardBank;
    const compareByDiscount = (a, b) => {
      const aDiscount = a[1]["discount"];
      const bDiscount = b[1]["discount"];
      const aExist = (aDiscount !== undefined) ? true : false;
      const bExist = (bDiscount !== undefined) ? true : false;
      if (aExist && bExist) {
        if (aDiscount > bDiscount) return -1;
        if (aDiscount < bDiscount) return 1;
        return 0;
      }
      else if (aExist) return -1;
      else if (bExist) return 1;
      else {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
      }
    };
    this.state.sort(compareByDiscount);
  }
  render() {
    return (
      React.createElement('table', null,
        React.createElement('thead', null,
          React.createElement('th', null, 'Name'),
          ...new Array (this.state[0].length - 1).fill(
            [React.createElement('th', {title: 'Set'}, 'Price'),
            React.createElement('th', {title: 'Set'}, 'Price'),
            React.createElement('th', {title: `Lowest: ${5-4}\nHighest: ${5-4}`}, 'Discount')]
          ).flat(), // flattens nested arrays
        ),
        ...this.state.map(elem =>
          React.createElement('tr', null,
            React.createElement('td', null, elem[0]),
            ...elem.slice(1).map(dateData =>
              [React.createElement('td', {title: 'Set'}, dateData["lowPriceFromSet"]),
              React.createElement('td', {title: 'Set'}, dateData["lowPriceFromOtherSets"]),
              React.createElement('td',
                (dateData["discount"] !== undefined && dateData["discount"] > 0)
                  ? {title: `Lowest: ${5-4}\nHighest: ${5-4}`, className: "discount"}
                  : {title: `Lowest: ${5-4}\nHighest: ${5-4}`},
                (dateData["discount"] !== undefined)
                  ? dateData["discount"]/100
                  : "")] // cannot perform arithmetic on an undefined value
            ).flat(),
          )
        )
      )
    );
  }
}

ReactDOM.render(
  React.createElement(PriceTable),
  document.getElementById('app')
);
