import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
class Square extends React.Component {

  render() {
    return (
      <button className="square"
        onClick={() => {this.props.onClick({value:'X'})} }
      >
        {this.props.value}
      </button>
    );
  }
}
*/

/* Function Component: If the component only has the method render
 * and doesn't have its own state, it can be writen in Function Component format
 * */
function Square(props){
  return (
    <button className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      stepNumber: 0,
      NextChar: 'X',
    }
  }
  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.NextChar;
    this.setState({
      history: history.concat([{
        squares: squares,
        location: i,
      }]),
      stepNumber: history.length,
      NextChar: (this.state.NextChar === 'X' ? 'O':'X'),
    });
  }
  jumpTo(step){
    this.setState({
      stepNumber: step,
      NextChar: ((step % 2) === 0 ? 'X':'O'),
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const row = Math.floor(step.location / 3);
      const column = (step.location % 3);
      const coord = " (" + row + ", " + column + ")"
      let font_style = {fontWeight: 'normal'};

      if (this.state.stepNumber === move) {
        font_style.fontWeight = 'bold';
      }

      const desc = move ?
        'Go to move #' + move + coord:
        'Go to Game Start';

      return (
        <li key={move}>
          <button style={font_style} onClick={() =>
              this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });
    let status;
    if (winner !== null) {
      status = 'Winner: ' + winner;
    } else if (isFull(current.squares) === true) {
      status = 'Game Tied!';
    } else {
      status = 'Next player: ' + this.state.NextChar;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function isFull(squares){
  for (let i = 0; i < squares.length; i++){
    if (squares[i] === null) return false;
  }
  return true;
}
function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}
