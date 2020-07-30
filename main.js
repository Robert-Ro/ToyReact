import { ToyReact, Component } from "./toy-react"

const data = new Array(9).fill(0)
class Board extends Component {
  render() {
    return (
      <div className="board">
        {data.map((item, index) => (
          <Square value={index + 1} />
        ))}
      </div>
    )
  }
}
class Square extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null,
    }
  }
  render() {
    return (
      <button className="square" onClick={() => this.setState({ value: "X" })}>
        {this.state.value ? this.state.value : this.props.value}
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
