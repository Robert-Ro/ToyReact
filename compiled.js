const flatten = arr => {
  return Array.prototype.concat.apply([], arr);
};

const h = (tag, props, ...children) => {
  return {
    tag,
    props: props || {},
    children: flatten(children) || []
  };
};

const render = parent => {
  const vDom = view();
  const element = createElement(vDom);
  parent.appendChild(element);
};

const createElement = vdom => {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom);
  }

  const {
    tag,
    props,
    children
  } = vdom;
  const ele = document.createElement(tag);
  setProps(ele, props);
  children.map(createElement).forEach(ele.appendChild.bind(ele));
  return ele;
};

const setProps = (element, props) => {
  for (let key in props) {
    element.setAttribute(key, props[key]);
  }

  return element;
};

const view = () => {
  return h("div", null, "hello world", h("ul", null, h("li", {
    id: "1",
    class: "li-1"
  }, " \u7B2C1 ")));
};
