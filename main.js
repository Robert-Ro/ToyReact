import { ToyReact, Component } from "./toy-react"

class Board extends Component {
  render() {
    return (
      <div className="board">
        {new Array(9).fill(0).map((item, index) => (
          <Square
            value={index + 1}
            onClick={() => this.setState({ value: "X" })}
          />
        ))}
      </div>
    )
  }
}
class Square extends Component {
  render() {
    const { onClick, value } = this.props
    return (
      <button className="square" onClick={() => onClick(value)}>
        {value}
      </button>
    )
  }
}

class Game extends Component {
  render() {
    return (
      <div className="game">
        <p>Next Player: </p>
        <Board />
      </div>
    )
  }
}

const game = <Game />

ToyReact.render(game, document.body)
