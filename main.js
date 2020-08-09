import { ToyReact, Component } from "./toy-react"

const squares = Array(9).fill(null)
class Board extends Component {
  render() {
    return (
      <div className="board">
        {squares.map((item, index) => (
          <Square onClick={()=>this.props.onClick(index)} value={this.props.squares[index]} />
        ))}
      </div>
    )
  }
}
class Square extends Component {
  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        { this.props.value }
      </button>
    )
  }
}

class Game extends Component {
  constructor(props){
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill("")
        }
      ],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick (i){
    let {history} = this.state
    history.slice(0, this.state.stepNumber+1)
    const current = history[history.length-1]
    const squares = current.squares.slice()
    if(calcuateWinner(squares)||squares[i]){
      return
    }
    squares[i] = this.state.xIsNext ? "X" : "O"
    this.setState({
      history: history.concat([
        { squares: [...squares]}
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }
  jumpTo(step){
    this.setState({
      setpNumber: step,
      xIsNext : (step % 2) === 0
    })
  }
  render() {
    const { history, stepNumber, xIsNext } = this.state
    const current = history[stepNumber]
    const winner = calcuateWinner(current.squares)
    const moves = history.map((item, index) => {
      const desc = index ? 'Go to move #' + item : 'Go to game start'
      return <li key={index}>
        <button onClick={() => this.jumpTo(index)}>{desc}</button>
      </li>
    })
    let status
    if(winner){
      status = 'Winner: '+winner
    }else{
      status = 'Next player: ' + (xIsNext ? 'X' : 'O')
    }
    return (
      <div className="game">
        <Board squares={current.squares} onClick={i=>this.handleClick(i)} />
        <div>
          <p>{status}</p>
          <ul>
            {moves}
          </ul>
        </div>
      </div>
    )
  }
}

const calcuateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for(let i = 0;i<lines.length;i++){
    const [a, b, c] = lines[i]
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a]
    }
  }
  return null
}

ToyReact.render(<Game />, document.body)
