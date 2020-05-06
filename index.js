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
    this.state = Object.entries(cardBank);
  }
  render() {
    return (
      React.createElement('table', null,
        React.createElement('thead', null,
          React.createElement('th', null, 'Name'),
          React.createElement('th', {title: 'Set'}, 'Price'),
          React.createElement('th', {title: 'Set'}, 'Price'),
          React.createElement('th', {title: `Lowest: ${5-4}\nHighest: ${5-4}`}, 'Discount'),
        ),
        ...this.state.map(elem =>
          React.createElement('tr', null,
            React.createElement('td', null, elem[0]),
            React.createElement('td', {title: 'Set'}, elem[1]["lowPriceFromSet"]),
            React.createElement('td', {title: 'Set'}, elem[1]["lowPriceFromOtherSets"]),
            React.createElement('td', {title: `Lowest: ${5-4}\nHighest: ${5-4}`}, elem[1]["discount"] ? elem[1]["discount"]/100 : ""), // cannot perform arithmetic on an undefined value
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
