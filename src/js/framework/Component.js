import {
  parseJsx,
  clearDomChildren,
  appendDomFragment,
  buildDomFragment
} from '../utils/parser';
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

    string = string.trim().replace(/<([A-Z][A-Za-z]*)(.*)\/>/g, (match, p1, p2, offset) => {
      const id = `z${  idBase  }${componentCount++}`;

      // extract props
      const props = {};
      let parsingResults;
      p2 = p2.trim();
      if (p2.length) {
        const paramsRegex = /(\S+)=["']?((?:(?!\/>|>|"|'|\s).)+)/g;
        while ((parsingResults = paramsRegex.exec(p2)) !== null) {
          const objectPropertyName = parsingResults[2].match(/{(.*)}/);
          const propValue = objectPropertyName ?
            this[objectPropertyName[1].split('.').filter(segment => segment !== 'this').join('.')] :
            parsingResults[2];
          props[parsingResults[1]] = propValue;
        }
      }

      componentMap[id] = {
        name: p1,
        props,
      };
      return `<div id="${id}"></div>`;
    });
    template.innerHTML = string;

    console.log('string', string);

    // manage event handlers
    const eventTypes = ['click', 'mouseup', 'mousedown', 'mouseover', 'mousein', 'mouseout',
      'change', 'input', 'keyup', 'keydown',
      'focus', 'blur', 'submit', 'form'
    ];
    const elementsWithListeners = template.content.querySelectorAll([eventTypes].map(eventType => `on-${eventType}`));
    console.log('template.content', [eventTypes].map(eventType => `on-${eventType}`));
    console.log('elementsWithListeners', elementsWithListeners);
    elementsWithListeners.forEach(element => {
      eventTypes.forEach(eventType => {
        if (element.hasAttribute(`on-${  eventType}`)) {
          let handlerName = element.getAttribute(`on-${  eventType}`).match(/{(.*)}/)[1];
          handlerName = handlerName.split('.').filter(segment => segment !== 'this').join('.');
          element.addEventListener(eventType, this[handlerName].bind(this));
        }
      });
    });

    // render mapped components
    Object.keys(componentMap).forEach(id => {
      const host = template.content.querySelector(`#${  id}`);
      const cls = ComponentFactory.get(componentMap[id].name);
      new cls(host, componentMap[id].props);
    });

    return template.content;
  }
}
