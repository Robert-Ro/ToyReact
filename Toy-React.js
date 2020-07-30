class ElementWrapper {
  constructor(type) {
    // FIXME 构造range
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      const eventName = RegExp.$1.replace(/^[\s\S]+/, (s) => s.toLowerCase())
      this.root.addEventListener(eventName, value)
    }
    this.root.setAttribute(name, value)
  }
  appendChild(vchild) {
    vchild.mountTo(this.range)
  }
  mountTo(range) {
    range.deleteContents()
    range.insertChildren(this.root)
  }
}
class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}
export class Component {
  constructor() {
    this.props = {
      children: [],
    }
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  mountTo(range) {
    this.range = range
    this.update()
  }
  update() {
    this.range.deleteContents()
    const vdom = this.render()
    vdom.mountTo(this.range)
  }
  appendChild(vchild) {
    this.props.children.push(vchild)
  }
  setState(state) {
    const merge = (oldState, newState) => {
      for (let p in newState) {
        if (typeof newState[p] === "object") {
          if (typeof oldState[p] !== "object") {
            oldState[p] = {}
          }
          merge(oldState[p], newState[p])
        } else {
          oldState[p] = newState[p]
        }
      }
    }
    if (!this.state && state) {
      this.state = {}
    }
    merge(this.state, state)
    console.log(this.state)
  }
}
export let ToyReact = {
  createElement: function (type, attributes, ...children) {
    let element
    console.log(arguments)
    if (typeof type === "string") {
      element = new ElementWrapper(type)
    } else {
      element = new type()
    }
    for (let name in attributes) {
      if (name === "className") {
        element.setAttribute("class", attributes[name])
      } else element.setAttribute(name, attributes[name])
    }
    let insertChildren = (children) => {
      for (let child of children) {
        if (typeof child === "object" && child instanceof Array) {
          insertChildren(child)
        } else {
          if (
            !(child instanceof Component) &&
            !(child instanceof ElementWrapper) &&
            !(child instanceof TextWrapper)
          ) {
            child = String(child)
          }
          if (typeof child === "string") {
            child = new TextWrapper(child)
          }
          element.appendChild(child)
        }
      }
    }
    insertChildren(children)
    return element
  },
  render(vdom, element) {
    let range = document.createRange() // 代理根元素
    if (element.children.length) {
      // 判断root节点是否有子元素
      range.setStartAfter(element.lastChild)
      range.setEndAfter(element.lastChild)
    } else {
      range.setStart(element, 0)
      range.setEnd(element, 0)
    }
    vdom.mountTo(range)
  },
}
