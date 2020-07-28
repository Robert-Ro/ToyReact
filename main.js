import { ToyReact, Component } from  './toy-react'
class Board extends Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
}
class Square extends Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}


class MyComponent extends Component{
  render(){
    return <div><span>hello</span><span>hello</span>
    <div>
      {true}
      {this.children}
    </div>
    </div>
  }
}


let b = <MyComponent id="b" name="idb">
  <div>a</div>
</MyComponent>

ToyReact.render(b, document.body)