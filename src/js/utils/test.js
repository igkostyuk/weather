const sample = '<nav class="search__container"><div><SearchBar onSubmit={this.AA}/></div><div><SearchBar onSubmit={this.getCityForecast}/></div></nav>';
const parseJsx = string => {
  const template = document.createElement('template');
  let componentCount = 0;
  const idBase = new Date().getTime();
  const componentMap = {};

  const componentRegex = /<[A-Z][A-Za-z].+?\/>/;
  console.log('arr', componentRegex.exec(string));
  let parsingComponentResults;
  // while ((parsingComponentResults = componentRegex.exec(string)) !== null) {
  //   console.log(parsingComponentResults);
  // }
  // console.log();
  string = string.trim().replace(/<([A-Z][A-Za-z]*)(.*)\/>/g, (match, p1, p2, offset) => {
    const id = `z${  idBase  }${componentCount++}`;
    //
    // extract props
    const props = {};
    let parsingParamsResults;
    p2 = p2.trim();
    if (p2.length) {
      const paramsRegex = /(\S+)=["']?((?:(?!\/>|>|"|'|\s).)+)/g;
      while ((parsingParamsResults = paramsRegex.exec(p2)) !== null) {
        const objectPropertyName = parsingParamsResults[2].match(/{(.*)}/);
        // console.log('parce', objectPropertyName);
        props[parsingParamsResults[1]] =
          // objectPropertyName ?
          //   this[objectPropertyName[1].split('.').filter(segment => segment !== 'this').join('.')] :
          parsingParamsResults[2];
      }
    }

    componentMap[id] = {
      name: p1,
      props,
    };
    console.log(componentMap[id]);
    // return `<div id="${id}"></div>`;
  });
  // template.innerHTML = string;

  // // manage event handlers
  // const eventTypes = ['click', 'Submit'];
  // const elementsWithListeners = template.content.querySelectorAll([eventTypes].map(eventType => `on-${  eventType}`));
  // console.log('elementsWithListeners', elementsWithListeners);
  // elementsWithListeners.forEach(element => {
  //   eventTypes.forEach(eventType => {
  //     if (element.hasAttribute(`on-${  eventType}`)) {
  //       let handlerName = element.getAttribute(`on-${  eventType}`).match(/{(.*)}/)[1];
  //       handlerName = handlerName.split('.').filter(segment => segment !== 'this').join('.');
  //       element.addEventListener(eventType, this[handlerName].bind(this));
  //     }
  //   });
  // });

  // // render mapped components
  // // Object.keys(componentMap).forEach(id => {
  // //   const host = template.content.querySelector(`#${  id}`);
  // //   const cls = ComponentFactory.get(componentMap[id].name);
  // //   new cls(host, componentMap[id].props);
  // //   console.log(host);
  // // });
  // // Object.keys(componentMap).forEach(id => {
  // //   const host = template.content.querySelector(`#${  id}`);
  // //   host.parentNode.insertAdjacentHTML('beforeend', host.innerHTML);
  // //   host.replaceWith('');
  // // });

  // return template.content;
}

// export const clearDomChildren = domElement => {
//   domElement.innerHTML = '';
//   return domElement;
// };

// export const appendDomFragment = (domElement, domFragment) => {
//   if (Array.isArray(domFragment)) {
//     domElement.append(...domFragment);
//   } else {
//     domElement.append(domFragment);
//   }
//   return domElement;
// };

// export const buildDomFragment = (host, elements) => {
//   elements.forEach(elementSpec => {
//     const element = document.createElement(typeof elementSpec.tag === 'string' ? elementSpec.tag : 'div');
//     if (elementSpec.innerHTML) {
//       element.innerHTML = elementSpec.innerHTML;
//     }
//     if (elementSpec.classList) {
//       if (typeof elementSpec.classList === 'string') {
//         elementSpec.classList = elementSpec.classList.split(' ');
//       }
//       element.classList.add(...elementSpec.classList);
//     }
//     if (typeof elementSpec.tag !== 'string') {
//       new elementSpec.tag(element, elementSpec.props);
//     }
//     if (elementSpec.children) {
//       buildDomFragment(element, elementSpec.children);
//     }
//     host.appendChild(element);
//   });
//   return host;
// };

parseJsx(sample);
