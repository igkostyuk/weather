// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/framework/ComponentFactory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ComponentFactory = {
  mappings: {},
  register: function register(componentClass) {
    return ComponentFactory.mappings[componentClass.name] = componentClass;
  },
  get: function get(componentClassName) {
    return ComponentFactory.mappings[componentClassName];
  }
};
var _default = ComponentFactory;
/*
 Every component will need:
  1) import ComponentFactory from "../framework/ComponentFactory";
  2) ComponentFactory.register(ComponentClass); // to register component class with factory
 */

exports.default = _default;
},{}],"js/utils/parser.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildDomFragment = exports.appendDomFragment = exports.clearDomChildren = exports.parseJsx = void 0;

var _ComponentFactory = _interopRequireDefault(require("../framework/ComponentFactory"));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var parseJsx = function parseJsx(string) {
  var template = document.createElement('template');
  var componentCount = 0;
  var idBase = new Date().getTime();
  var componentMap = {};
  string = string.trim().replace(/<([A-Z][A-Za-z]*)(.*)\/>/g, function (match, p1, p2, offset) {
    var id = "z".concat(idBase).concat(componentCount++); // extract props

    var props = {};
    var parsingResults;
    p2 = p2.trim();

    if (p2.length) {
      var paramsRegex = /(\S+)=["']?((?:(?!\/>|>|"|'|\s).)+)/g;

      while ((parsingResults = paramsRegex.exec(p2)) !== null) {
        var objectPropertyName = parsingResults[2].match(/{(.*)}/);
        console.log('parce', objectPropertyName);
        props[parsingResults[1]] = objectPropertyName ? _this[objectPropertyName[1].split('.').filter(function (segment) {
          return segment !== 'this';
        }).join('.')] : parsingResults[2];
      }
    }

    componentMap[id] = {
      name: p1,
      props: props
    };
    return "<div id=\"".concat(id, "\"></div>");
  });
  template.innerHTML = string; // manage event handlers

  var eventTypes = ['click', 'Submit'];
  var elementsWithListeners = template.content.querySelectorAll([eventTypes].map(function (eventType) {
    return "on-".concat(eventType);
  }));
  console.log('elementsWithListeners', elementsWithListeners);
  elementsWithListeners.forEach(function (element) {
    eventTypes.forEach(function (eventType) {
      if (element.hasAttribute("on-".concat(eventType))) {
        var handlerName = element.getAttribute("on-".concat(eventType)).match(/{(.*)}/)[1];
        handlerName = handlerName.split('.').filter(function (segment) {
          return segment !== 'this';
        }).join('.');
        element.addEventListener(eventType, _this[handlerName].bind(_this));
      }
    });
  }); // render mapped components

  Object.keys(componentMap).forEach(function (id) {
    var host = template.content.querySelector("#".concat(id));

    var cls = _ComponentFactory.default.get(componentMap[id].name);

    new cls(host, componentMap[id].props);
    console.log(host);
  });
  Object.keys(componentMap).forEach(function (id) {
    var host = template.content.querySelector("#".concat(id));
    host.parentNode.insertAdjacentHTML('beforeend', host.innerHTML);
    host.replaceWith('');
  });
  return template.content;
};

exports.parseJsx = parseJsx;

var clearDomChildren = function clearDomChildren(domElement) {
  domElement.innerHTML = '';
  return domElement;
};

exports.clearDomChildren = clearDomChildren;

var appendDomFragment = function appendDomFragment(domElement, domFragment) {
  if (Array.isArray(domFragment)) {
    domElement.append.apply(domElement, _toConsumableArray(domFragment));
  } else {
    domElement.append(domFragment);
  }

  return domElement;
};

exports.appendDomFragment = appendDomFragment;

var buildDomFragment = function buildDomFragment(host, elements) {
  elements.forEach(function (elementSpec) {
    var element = document.createElement(typeof elementSpec.tag === 'string' ? elementSpec.tag : 'div');

    if (elementSpec.innerHTML) {
      element.innerHTML = elementSpec.innerHTML;
    }

    if (elementSpec.classList) {
      var _element$classList;

      if (typeof elementSpec.classList === 'string') {
        elementSpec.classList = elementSpec.classList.split(' ');
      }

      (_element$classList = element.classList).add.apply(_element$classList, _toConsumableArray(elementSpec.classList));
    }

    if (typeof elementSpec.tag !== 'string') {
      new elementSpec.tag(element, elementSpec.props);
    }

    if (elementSpec.children) {
      buildDomFragment(element, elementSpec.children);
    }

    host.appendChild(element);
  });
  return host;
};

exports.buildDomFragment = buildDomFragment;
},{"../framework/ComponentFactory":"js/framework/ComponentFactory.js"}],"js/framework/Component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parser = require("../utils/parser");

var _ComponentFactory = _interopRequireDefault(require("./ComponentFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component =
/*#__PURE__*/
function () {
  function Component(host) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Component);

    this.host = host;
    this.props = props;
    this.init();

    this._render();
  }

  _createClass(Component, [{
    key: "init",
    value: function init() {}
  }, {
    key: "updateState",
    value: function updateState(stateDelta) {
      this.state = Object.assign({}, this.state, stateDelta);

      this._render();
    }
  }, {
    key: "_render",
    value: function _render() {
      var rendered = this.render();

      if (typeof rendered === 'string') {
        rendered = this._createDomFragment(rendered);
      }

      if (Array.isArray(rendered) && rendered[0].tag) {
        rendered = (0, _parser.buildDomFragment)(document.createDocumentFragment(), rendered);
      }

      (0, _parser.appendDomFragment)((0, _parser.clearDomChildren)(this.host), rendered);
    }
  }, {
    key: "_createDomFragment",
    value: function _createDomFragment(string) {
      var _this = this;

      var template = document.createElement('template');
      var componentCount = 0;
      var idBase = new Date().getTime();
      var componentMap = {};
      string = string.trim().replace(/<([A-Z][A-Za-z]*)(.*)\/>/g, function (match, p1, p2, offset) {
        var id = "z".concat(idBase).concat(componentCount++); // extract props

        var props = {};
        var parsingResults;
        p2 = p2.trim();

        if (p2.length) {
          var paramsRegex = /(\S+)=["']?((?:(?!\/>|>|"|'|\s).)+)/g;

          while ((parsingResults = paramsRegex.exec(p2)) !== null) {
            var objectPropertyName = parsingResults[2].match(/{(.*)}/);
            var propValue = objectPropertyName ? _this[objectPropertyName[1].split('.').filter(function (segment) {
              return segment !== 'this';
            }).join('.')] : parsingResults[2];
            props[parsingResults[1]] = propValue;
          }
        }

        componentMap[id] = {
          name: p1,
          props: props
        };
        return "<div id=\"".concat(id, "\"></div>");
      });
      template.innerHTML = string;
      console.log('string', string); // manage event handlers

      var eventTypes = ['click', 'mouseup', 'mousedown', 'mouseover', 'mousein', 'mouseout', 'change', 'input', 'keyup', 'keydown', 'focus', 'blur', 'submit', 'form'];
      var elementsWithListeners = template.content.querySelectorAll([eventTypes].map(function (eventType) {
        return "on-".concat(eventType);
      }));
      console.log('template.content', [eventTypes].map(function (eventType) {
        return "on-".concat(eventType);
      }));
      console.log('elementsWithListeners', elementsWithListeners);
      elementsWithListeners.forEach(function (element) {
        eventTypes.forEach(function (eventType) {
          if (element.hasAttribute("on-".concat(eventType))) {
            var handlerName = element.getAttribute("on-".concat(eventType)).match(/{(.*)}/)[1];
            handlerName = handlerName.split('.').filter(function (segment) {
              return segment !== 'this';
            }).join('.');
            element.addEventListener(eventType, _this[handlerName].bind(_this));
          }
        });
      }); // render mapped components

      Object.keys(componentMap).forEach(function (id) {
        var host = template.content.querySelector("#".concat(id));

        var cls = _ComponentFactory.default.get(componentMap[id].name);

        new cls(host, componentMap[id].props);
      });
      return template.content;
    }
  }]);

  return Component;
}();

exports.default = Component;
},{"../utils/parser":"js/utils/parser.js","./ComponentFactory":"js/framework/ComponentFactory.js"}],"js/Services/AppState.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AppState =
/*#__PURE__*/
function () {
  function AppState() {
    _classCallCheck(this, AppState);

    this.watchers = {// 'ENTITY': [ watcher1, watcher2 ],
    };
  }

  _createClass(AppState, [{
    key: "watch",
    value: function watch(entity, watcher) {
      if (this.watchers[entity]) {
        this.watchers[entity].push(watcher);
      } else {
        this.watchers[entity] = [watcher];
      }
    }
  }, {
    key: "update",
    value: function update(entity, newValue) {
      this.watchers[entity] && this.watchers[entity].forEach(function (watcher) {
        return watcher(newValue);
      });
    }
  }]);

  return AppState;
}();

var _default = new AppState();

exports.default = _default;
},{}],"js/Components/SearchBar/SearchBar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Component2 = _interopRequireDefault(require("../../framework/Component"));

var _AppState = _interopRequireDefault(require("../../Services/AppState"));

var _ComponentFactory = _interopRequireDefault(require("../../framework/ComponentFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SearchBar =
/*#__PURE__*/
function (_Component) {
  _inherits(SearchBar, _Component);

  function SearchBar(host, props) {
    var _this;

    _classCallCheck(this, SearchBar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchBar).call(this, host, props));

    _AppState.default.watch('COUNT', _this.updateMyself);

    return _this;
  }

  _createClass(SearchBar, [{
    key: "init",
    value: function init() {
      this.onSubmit = this.onSubmit.bind(this);
      this.state = {
        value: this.props.value * 2,
        quantifier: 7
      };
    }
  }, {
    key: "updateMyself",
    value: function updateMyself(subState) {
      // .... transform response
      console.log('PNumber in CountControls', subState); // do update

      this.updateState(subState);
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(e) {
      console.log('onSubmit run');
      e.preventDefault();
      var city = e.target.elements.city.value;
      this.props.onSubmit(city);
    }
  }, {
    key: "render",
    value: function render() {
      return " <form on-Submit={this.onSubmit}>\n               <input class=\"search__input \" name=\"city\" placeholder=\"city\" type=\"text\" value=\"\" />\n               <button class=\"search__button\" type=\"submit\" on-Click={this.onSubmit} />search</button>\n             </form>";
    }
  }]);

  return SearchBar;
}(_Component2.default); //


exports.default = SearchBar;

_ComponentFactory.default.register(SearchBar); // to register component class with factory
},{"../../framework/Component":"js/framework/Component.js","../../Services/AppState":"js/Services/AppState.js","../../framework/ComponentFactory":"js/framework/ComponentFactory.js"}],"js/Components/SearchBar/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SearchBar", {
  enumerable: true,
  get: function () {
    return _SearchBar.default;
  }
});

var _SearchBar = _interopRequireDefault(require("./SearchBar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./SearchBar":"js/Components/SearchBar/SearchBar.js"}],"js/Components/CurrentWeather/CurrentWeather.js":[function(require,module,exports) {
// // clear sky
// // import star from '../../../animated/day.svg';
// // import Component from '../../framework/Component';
// // import 01n from '../../../animated/night.svg';
// // //few clouds
// // import 02d from "../../../animated/day.svg";
// // import 02n from './';
// // //scattered clouds
// // import 03d from "../../../animated/day.svg";
// // import 03n from './';
// // //broken clouds
// // import 04d from "../../../animated/day.svg";
// // import 04n from './';
// // //shower rain
// // import 09d from "../../../animated/day.svg";
// // import 09n from './';
// // //rain
// // import 10d from "../../../animated/day.svg";
// // import 10n from './';
// // //thunderstorm
// // import 11d from "../../../animated/day.svg";
// // import 11n from './';
// // //snow
// // import 13d from "../../../animated/day.svg";
// // import 13n from './';
// // //mist
// // import 50d from "../../../animated/day.svg";
// // import 50n from './';
// // import WeatherDataService from '../../../Services/WeatherDataService'
// export default class CurrentWeather extends Component {
//   constructor(host, props) {
//     super(host, props);
//     // WeatherDataService.subscribeForCurrentWeather(this.onServerResponse);
//   }
//   // onServerResponse(weatherData) {
//   //   // ensure weatherData is properly rendered
//   //   // this.props.weather = weatherData;
//   //   // console.log('CurrentWeather', this.props.weather.main.temp);
//   //
//   render() {
//     return [{
//         tag: 'div',
//         classList: ['temp'],
//         content: Math.round(this.props.forcast ? this.props.forcast.main.temp : null),
//       },
//       {
//         tag: 'div',
//         classList: ['right'],
//         children: [{
//             tag: 'div',
//             classList: ['summary'],
//             content: this.props.forcast ? this.props.forcast.name : null,
//           },
//           {
//             tag: 'div',
//             classList: ['date'],
//             content: `${this.props.forcast ?this.props.forcast.wind.speed:null}km/h`,
//           },
//           {
//             tag: 'div',
//             classList: ['date'],
//             content: `${this.props.forcast ?this.props.forcast.main.humidity:null}%`,
//           },
//         ],
//       },
//       {
//         tag: 'div',
//         classList: ['weather-icon'],
//         content: `<img src="${img['01n']}" />`,
//       },
//     ];
//   }
// }
},{}],"js/Components/CurrentWeather/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CurrentWeather", {
  enumerable: true,
  get: function () {
    return _CurrentWeather.default;
  }
});

var _CurrentWeather = _interopRequireDefault(require("./CurrentWeather"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./CurrentWeather":"js/Components/CurrentWeather/CurrentWeather.js"}],"js/Components/WeatherForecastItem/WeatherForecastItem.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Component2 = _interopRequireDefault(require("../../framework/Component.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var WeatherForecastItem =
/*#__PURE__*/
function (_Component) {
  _inherits(WeatherForecastItem, _Component);

  function WeatherForecastItem(host, props) {
    _classCallCheck(this, WeatherForecastItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(WeatherForecastItem).call(this, host, props));
  }

  _createClass(WeatherForecastItem, [{
    key: "render",
    value: function render() {
      return [{
        tag: 'li',
        children: [{
          tag: 'h4',
          content: 'mon'
        }, {
          tag: 'i',
          content: 'rain'
        }, {
          tag: 'p',
          content: '22'
        }, {
          tag: 'p',
          content: '12'
        }]
      }];
    }
  }]);

  return WeatherForecastItem;
}(_Component2.default);

exports.default = WeatherForecastItem;
},{"../../framework/Component.js":"js/framework/Component.js"}],"js/Components/WeatherForecastItem/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "WeatherForecastItem", {
  enumerable: true,
  get: function () {
    return _WeatherForecastItem.default;
  }
});

var _WeatherForecastItem = _interopRequireDefault(require("./WeatherForecastItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./WeatherForecastItem":"js/Components/WeatherForecastItem/WeatherForecastItem.js"}],"js/Components/WeatherForecast/WeatherForecast.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Component2 = _interopRequireDefault(require("../../framework/Component.js"));

var _WeatherForecastItem = require("../WeatherForecastItem");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var WeatherForecast =
/*#__PURE__*/
function (_Component) {
  _inherits(WeatherForecast, _Component);

  function WeatherForecast(host, props) {
    _classCallCheck(this, WeatherForecast);

    return _possibleConstructorReturn(this, _getPrototypeOf(WeatherForecast).call(this, host, props));
  }

  _createClass(WeatherForecast, [{
    key: "render",
    value: function render() {
      return [{
        tag: 'div',
        classList: ['forcast'],
        children: [{
          tag: 'ul',
          children: [{
            tag: _WeatherForecastItem.WeatherForecastItem,
            props: {
              temperature: 18,
              unit: 'C'
            }
          }, {
            tag: _WeatherForecastItem.WeatherForecastItem,
            props: {
              temperature: 18,
              unit: 'C'
            }
          }, {
            tag: _WeatherForecastItem.WeatherForecastItem,
            props: {
              temperature: 18,
              unit: 'C'
            }
          }, {
            tag: _WeatherForecastItem.WeatherForecastItem,
            props: {
              temperature: 18,
              unit: 'C'
            }
          }]
        }]
      }];
    }
  }]);

  return WeatherForecast;
}(_Component2.default);

exports.default = WeatherForecast;
},{"../../framework/Component.js":"js/framework/Component.js","../WeatherForecastItem":"js/Components/WeatherForecastItem/index.js"}],"js/Components/WeatherForecast/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "WeatherForecast", {
  enumerable: true,
  get: function () {
    return _WeatherForecast.default;
  }
});

var _WeatherForecast = _interopRequireDefault(require("./WeatherForecast"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./WeatherForecast":"js/Components/WeatherForecast/WeatherForecast.js"}],"js/Components/App/App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Component2 = _interopRequireDefault(require("../../framework/Component"));

var _ComponentFactory = _interopRequireDefault(require("../../framework/ComponentFactory"));

var _SearchBar = require("../SearchBar");

var _CurrentWeather = require("../CurrentWeather");

var _WeatherForecast = require("../WeatherForecast");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// import WeatherDataService from '../../../Services/WeatherDataService';
var App =
/*#__PURE__*/
function (_Component) {
  _inherits(App, _Component);

  function App(host) {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, host));
  }

  _createClass(App, [{
    key: "init",
    value: function init() {
      this.getCityForecast = this.getCityForecast.bind(this);
      this.updateState = this.updateState.bind(this);
      this.state = {
        inputValue: '',
        hasError: false,
        todayForecast: null,
        weekForecast: null
      };
    }
  }, {
    key: "getWeattherFromGeolocation",
    value: function getWeattherFromGeolocation() {
      var _this = this;

      if (!this.state.todayForecast) {
        WeatherDataService.getGeolocation().then(function (city) {
          return _this.getCityForecast(city);
        });
        console.log('geo.loc', city);
      }
    }
  }, {
    key: "getCityForecast",
    value: function getCityForecast(city) {
      console.log('fgfh'); // this.state.inputValue = city;
      // WeatherDataService.getForecast(city).then(([today, week]) => {
      //   return {
      //     todayForecast: today,
      //     weekForecast: week
      //   }
      // }).then(this.updateState)
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          todayForecast = _this$state.todayForecast,
          weekForecast = _this$state.weekForecast;
      return '<nav class="search__container"><SearchBar onSubmit={this.getCityForecast}/></nav>';
    }
  }]);

  return App;
}(_Component2.default);

exports.default = App;

_ComponentFactory.default.register(_SearchBar.SearchBar); // to register component class with factory
},{"../../framework/Component":"js/framework/Component.js","../../framework/ComponentFactory":"js/framework/ComponentFactory.js","../SearchBar":"js/Components/SearchBar/index.js","../CurrentWeather":"js/Components/CurrentWeather/index.js","../WeatherForecast":"js/Components/WeatherForecast/index.js"}],"js/Components/App/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "App", {
  enumerable: true,
  get: function () {
    return _App.default;
  }
});

var _App = _interopRequireDefault(require("./App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./App":"js/Components/App/App.js"}],"js/index.js":[function(require,module,exports) {
"use strict";

var _App = require("./Components/App");

// import {routes} from './routes/routes';
// import Router from './framework/Router'
new _App.App(document.getElementById('app')); // , routes, App)
// router.init();
},{"./Components/App":"js/Components/App/index.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62427" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map