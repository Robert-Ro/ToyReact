let childrenSymbol = Symbol('children')
class ElementWrapper {
  constructor(type) {
    this.type = type
    this.props = Object.create(null)
    this.children = []
    this[childrenSymbol] = []
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(vchild) {
    this[childrenSymbol].push(vchild)
    this.children.push(vchild)
  }
  get vdom(){
    return this
  }

  mountTo(range) {
    this.range = range
    let placeholder = document.createComment('placeholder')
    let endRange = document.createRange()
    endRange.setStart(range.endContainer, range.endOffset)
    endRange.setEnd(range.endContainer, range.endOffset)
    endRange.insertNode(placeholder)

    range.deleteContents()
    let element = document.createElement(this.type)
    for(let name in this.props){
      let value = this.props[name]
      if(name.match(/^on([\s\S]+)$/)){
        let eventName = RegExp.$1.replace(/^[\s\S]/, s=>s.toLowerCase())
        element.addEventListener(eventName, value)
      }
      if(name ==='className'){
        element.setAttribute('class', value)
      }
      element.setAttribute(name, value)
    }
    for(let child of this.children){
      let childRange = document.createRange()
      if(element.children.length){
        childRange.setStartAfter(element.lastChild)
        childRange.setEndAfter(element.lastChild)
      }else{
        childRange.setStart(element, 0)
        childRange.setEnd(element, 0)
      }
      child.mountTo(childRange)
    }
    range.insertNode(element)
  }
}
class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
    this.type = '#text'
    this.children = []
    this.props = Object.create(null)
  }
  mountTo(range) {
    this.range = range
    range.deleteContents()
    range.insertNode(this.root)
  }
  get vdom() {
    return this
  }
}
export class Component {
  constructor() {
    this.props = Object.create(null)
    this.children = []
  }
  get type(){
    return this.constructor.name
  }
  setAttribute(name, value) {
    this.props[name] = value
    this[name]= value
  }
  mountTo(range) {
    this.range = range
    this.update()
  }
  update() {
    let vdom = this.vdom
    if(this.oldVdom){
      let isSameNode = (node1, node2)=>{
        if(!node2){
          return false
        }
        if(node1.type !== node2.type){
          return false
        }
        for(let name in node1.props){
          if(typeof node1.props[name] === 'object'&& typeof node2.props[name] === 'object'
          && JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name])
          ){
            continue
          }
          if(node1.props[name] !== node2.props[name]){
            return false
          }
        }
        if(Object.keys(node1.props).length!==Object.keys(node2.props).length){
          return false
        }
        return true
      }
      let isSameTree = (node1, node2)=>{
        if(!isSameNode(node1, node2)){
          return false
        }
        if(node1.children.length!==node2.children.length){
          return false
        }
        for(let i=0,l=node1.children.length;i<l;i++){
          if(!isSameTree(node1.children[i], node2.children[i])){
            return false
          }
        }
        return true
      }
      let replace = (newTree, oldTree, indent) => {
        if(isSameTree(newTree, oldTree)){
          return
        }
        if(!isSameNode(newTree, oldTree)){
          newTree.mountTo(oldTree.range)
        }else{
          for(let i=0,l=newTree.children.length;i<l;i++){
            replace(newTree.children[i], oldTree.children[i], " " + indent)
          }
        }
      }
      replace(vdom, this.oldVdom, "")
    }else{
      vdom.mountTo(this.range)
    }
    this.oldVdom = vdom
  }
  get vdom(){
    return this.render().vdom
  }
  appendChild(vchild) {
    this.children.push(vchild)
  }
  setState(state) {
    const merge = (oldState, newState) => {
      for (let p in newState) {
        if (typeof newState[p] === "object") {
          if (typeof oldState[p] !== "object") {
            if(Array.isArray(newState[p])){
              oldState[p] = []
            }else{
              oldState[p] = {}
            }
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
    this.update()
  }
}
export let ToyReact = {
  createElement: function (type, attributes, ...children) {
    let element
    if (typeof type === "string") {
      element = new ElementWrapper(type)
    } else {
      element = new type
    }
    for (let name in attributes) {
      element.setAttribute(name, attributes[name])
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
