import {clearDomChildren,
  appendDomFragment,
  buildDomFragment} from '../utils/parser';
import ComponentFactory from './ComponentFactory';

export default class Component {
  constructor(host, props = {}) {
    this.host = host;
    this.props = props;
    this.init();
    this._render();
  }

  init() {}

  updateState(stateDelta) {
    this.state = Object.assign({}, this.state, stateDelta);
    this._render();
  }

  _render() {
    let rendered = this.render();
    if (typeof rendered === 'string') {
      rendered = this._createDomFragment(rendered);
    }
    if (Array.isArray(rendered) && rendered[0].tag) {
      rendered = buildDomFragment(document.createDocumentFragment(), rendered);
    }
    appendDomFragment(clearDomChildren(this.host), rendered);
  }

  _createDomFragment(string) {
    const template = document.createElement('template');
    let componentCount = 0;
    const idBase = new Date().getTime();
    const componentMap = {};

    const componentRegex = /<[A-Z][A-Za-z].+?\/>/g; // <Component/>
    const componentNameRegex = /<([A-Z][A-Za-z]*)/;
    const paramsRegex = /(\S+)=["']?((?:(?!\/>|>|"|'|\s).)+)/g; // param=value

    string = string.trim().replace(componentRegex, (parsingComponentResults) => {
      const id = `z${  idBase  }${componentCount++}`;
      const name = componentNameRegex.exec(parsingComponentResults)[1];
      const props = {};
      let parsingParamsResults;
      while ((parsingParamsResults = paramsRegex.exec(parsingComponentResults)) !== null) {
        const [, propsName, propsValue] = parsingParamsResults;
        const objectPropertyName = propsValue.match(/{(.*)}/);
        props[propsName] =
          objectPropertyName ?
          this[objectPropertyName[1].split('.').filter(segment => segment !== 'this').join('.')] :
          propsValue;
      }
      componentMap[id] = {
        name,
        props,
      };
      return `<div id="${id}"></div>`;
    });
    template.innerHTML = string;

    // manage event handlers
    const eventTypes = ['click', 'mouseup', 'mousedown', 'mouseover', 'mousein', 'mouseout',
      'change', 'input', 'keyup', 'keydown',
      'focus', 'blur', 'form', 'submit'
    ];
    const elementsWithListeners = template.content.querySelectorAll([eventTypes].map(eventType => `on-${  eventType}`));
    elementsWithListeners.forEach(element => {
      eventTypes.forEach(eventType => {
        if (element.hasAttribute(`on-${  eventType}`)) {
          let handlerName = element.getAttribute(`on-${  eventType}`).match(/{(.*)}/)[1];
          handlerName = handlerName.split('.').filter(segment => segment !== 'this').join('.');
          if (this[handlerName]) {
            console.log('hm', element);
            element.addEventListener(eventType, this[handlerName].bind(this));
          }
        }
      });
    });
    // render mapped components
    Object.keys(componentMap).forEach(id => {
      const host = template.content.querySelector(`#${  id}`);
      const cls = ComponentFactory.get(componentMap[id].name);
      new cls(host, componentMap[id].props);
      // host.outerHTML = host.innerHTML;
    });

    return template.content;
  }
}
