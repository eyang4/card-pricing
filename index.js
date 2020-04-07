/*
React.createElement(tag, properties, child elements);
<h1>Greetings, {this.props.name}!</h1>
React.createElement('h1', null, 'Greetings, ' + this.props.name + '!');
<Greetings name='Chris'></Greetings>
React.createElement(Greetings, { name : 'Chris' });
*/

class Greetings extends React.Component
{
  render()
  {
    return (
      React.createElement('h1', null, 'Greetings, ' + this.props.name + '!')
    );
  }
}

ReactDOM.render(
  React.createElement(Greetings, { name : 'Chris' }),
  document.getElementById('app')
);
