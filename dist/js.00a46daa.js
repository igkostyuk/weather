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
})({"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"style.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"js/framework/ComponentFactory.js":[function(require,module,exports) {
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
exports.default = _default;
console.log(ComponentFactory);
/*
 Every component will need:
  1) import ComponentFactory from "../framework/ComponentFactory";
  2) ComponentFactory.register(ComponentClass); // to register component class with factory
 */
},{}],"js/utils/parser.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildDomFragment = exports.createDomFragment = exports.appendDomFragment = exports.clearDomChildren = exports.parseJsx = void 0;

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

var createDomFragment = function createDomFragment(string) {
  var template = document.createElement('template');
  template.innerHTML = string.trim();
  return template.content;
};

exports.createDomFragment = createDomFragment;

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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
      console.log('state', this.state);

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
      var componentRegex = /<[A-Z][A-Za-z].+?\/>/g; // <Component/>

      var componentNameRegex = /<([A-Z][A-Za-z]*)/;
      var paramsRegex = /(\S+)=["']?((?:(?!\/>|>|"|'|\s).)+)/g; // param=value

      string = string.trim().replace(componentRegex, function (parsingComponentResults) {
        var id = "z".concat(idBase).concat(componentCount++);
        var name = componentNameRegex.exec(parsingComponentResults)[1];
        var props = {};
        var parsingParamsResults;

        while ((parsingParamsResults = paramsRegex.exec(parsingComponentResults)) !== null) {
          var _parsingParamsResults = parsingParamsResults,
              _parsingParamsResults2 = _slicedToArray(_parsingParamsResults, 3),
              propsName = _parsingParamsResults2[1],
              propsValue = _parsingParamsResults2[2];

          var objectPropertyName = propsValue.match(/{(.*)}/);
          props[propsName] = objectPropertyName ? _this[objectPropertyName[1].split('.').filter(function (segment) {
            return segment !== 'this';
          }).join('.')] : propsValue;
        }

        componentMap[id] = {
          name: name,
          props: props
        };
        return "<div id=\"".concat(id, "\"></div>");
      });
      template.innerHTML = string; // manage event handlers

      var eventTag = [];
      var eventTypes = ['clicletkas', 'form', 'submit'];
      var elementsWithListeners = template.content.querySelectorAll([eventTypes].map(function (eventType) {
        return "on-".concat(eventType);
      }));
      elementsWithListeners.forEach(function (element) {
        eventTypes.forEach(function (eventType) {
          if (element.hasAttribute("on-".concat(eventType))) {
            var handlerName = element.getAttribute("on-".concat(eventType)).match(/{(.*)}/)[1];
            handlerName = handlerName.split('.').filter(function (segment) {
              return segment !== 'this';
            }).join('.');

            if (_this[handlerName]) {
              console.log('element', element, eventType, handlerName);
              element.addEventListener(eventType, _this[handlerName].bind(_this));
            }
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
},{"../utils/parser":"js/utils/parser.js","./ComponentFactory":"js/framework/ComponentFactory.js"}],"js/Services/WeatherDataService.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WeatherDataService =
/*#__PURE__*/
function () {
  function WeatherDataService() {
    _classCallCheck(this, WeatherDataService);

    this.geocoderBase = 'https://api.opencagedata.com/geocode/v1/json?q=';
    this.forecastBase = 'https://api.darksky.net/forecast/';
    this.currentLocationBase = 'https://ipapi.co/json';
    this.geocoderKey = '&key=39b7025dc04d4a47a61c8866819b5161';
    this.forecastKey = 'f5bcd9de3734de86a2d47a58d91793ab/';
    this.corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
    this.forecastData = {
      city: '',
      latitude: '',
      longitude: ''
    };
    this.subscribers = [];
  }

  _createClass(WeatherDataService, [{
    key: "setCity",
    value: function setCity() {
      var city = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Kiev';
      this.forecastData.city = city;
      this.getForwardGeocoding();
    }
  }, {
    key: "getCurrentLocation",
    value: function getCurrentLocation() {
      var _this = this;

      this.getData(this.currentLocationBase).then(function (response) {
        return _this.getWeatherForecast(response.latitude, response.longitude);
      });
    }
  }, {
    key: "getForwardGeocoding",
    value: function getForwardGeocoding() {
      var _this2 = this;

      return this.getData("".concat(this.geocoderBase).concat(this.forecastData.city).concat(this.geocoderKey)).then(function (response) {
        return response.results[0].geometry;
      }).then(function (response) {
        return _this2.getWeatherForecast(response.lat, response.lng);
      });
    }
  }, {
    key: "getWeatherForecast",
    value: function getWeatherForecast(lat, lng) {
      var _this3 = this;

      return this.getData("".concat(this.corsAnywhere).concat(this.forecastBase).concat(this.forecastKey).concat(lat, ",").concat(lng, "?units=ca")).then(function (response) {
        _this3.forecastData = Object.assign({}, _this3.forecastData, response);

        _this3.subscribers.forEach(function (subscriber) {
          return subscriber(_this3.forecastData);
        });
      });
    }
  }, {
    key: "subscribeForCurrentWeather",
    value: function subscribeForCurrentWeather(subscriber) {
      this.subscribers.push(subscriber);
    }
  }, {
    key: "getData",
    value: function getData(api) {
      return fetch("".concat(api)).then(function (response) {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      });
    }
  }]);

  return WeatherDataService;
}();

var _default = new WeatherDataService();

exports.default = _default;
},{}],"js/Services/AppState.js":[function(require,module,exports) {
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

var _ComponentFactory = _interopRequireDefault(require("../../framework/ComponentFactory"));

var _WeatherDataService = _interopRequireDefault(require("../../Services/WeatherDataService"));

var _AppState = _interopRequireDefault(require("../../Services/AppState"));

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

    _AppState.default.watch('CITY', _this.updateMyself); // window.addEventListener('submit', this.onSubmit.bind(this));


    return _this;
  }

  _createClass(SearchBar, [{
    key: "init",
    value: function init() {
      this.state = {};
    }
  }, {
    key: "updateMyself",
    value: function updateMyself(subState) {
      this.updateState(subState);
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(e) {
      e.preventDefault();
      var city = e.target.elements.city.value;

      if (city) {
        e.target.elements.city.value = '';

        _WeatherDataService.default.setCity(city);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return " <form on-Submit={this.onSubmit}>\n               <input class=\"search__input \" name=\"city\" placeholder=\"city\" type=\"text\" value=\"\" />\n               <button class=\"search__button\" type=\"submit\"/>search</button>\n             </form>";
    }
  }]);

  return SearchBar;
}(_Component2.default); //


exports.default = SearchBar;

_ComponentFactory.default.register(SearchBar); // to register component class with factory
},{"../../framework/Component":"js/framework/Component.js","../../framework/ComponentFactory":"js/framework/ComponentFactory.js","../../Services/WeatherDataService":"js/Services/WeatherDataService.js","../../Services/AppState":"js/Services/AppState.js"}],"js/Components/SearchBar/index.js":[function(require,module,exports) {
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
},{"./SearchBar":"js/Components/SearchBar/SearchBar.js"}],"icons/wi-fog.svg":[function(require,module,exports) {
module.exports = "/wi-fog.65af1738.svg";
},{}],"icons/wi-rain.svg":[function(require,module,exports) {
module.exports = "/wi-rain.dcdbd52f.svg";
},{}],"icons/wi-snow.svg":[function(require,module,exports) {
module.exports = "/wi-snow.36ff4f60.svg";
},{}],"icons/wi-strong-wind.svg":[function(require,module,exports) {
module.exports = "/wi-strong-wind.94710dde.svg";
},{}],"icons/wi-sleet.svg":[function(require,module,exports) {
module.exports = "/wi-sleet.f95112b1.svg";
},{}],"icons/wi-cloud.svg":[function(require,module,exports) {
module.exports = "/wi-cloud.2992b19c.svg";
},{}],"icons/wi-day-sunny.svg":[function(require,module,exports) {
module.exports = "/wi-day-sunny.9c3b25ac.svg";
},{}],"icons/wi-night-clear.svg":[function(require,module,exports) {
module.exports = "/wi-night-clear.13aed30e.svg";
},{}],"icons/wi-day-cloudy.svg":[function(require,module,exports) {
module.exports = "/wi-day-cloudy.8ee111ff.svg";
},{}],"icons/wi-night-alt-cloudy.svg":[function(require,module,exports) {
module.exports = "/wi-night-alt-cloudy.6dcffe5e.svg";
},{}],"icons/animated-fog.svg":[function(require,module,exports) {
module.exports = "/animated-fog.c9d83596.svg";
},{}],"icons/animated-rain.svg":[function(require,module,exports) {
module.exports = "/animated-rain.367bc039.svg";
},{}],"icons/animated-snow.svg":[function(require,module,exports) {
module.exports = "/animated-snow.54619640.svg";
},{}],"icons/animated-wind.svg":[function(require,module,exports) {
module.exports = "/animated-wind.1caaf726.svg";
},{}],"icons/animated-sleet.svg":[function(require,module,exports) {
module.exports = "/animated-sleet.9ac39f87.svg";
},{}],"icons/animated-cloudy.svg":[function(require,module,exports) {
module.exports = "/animated-cloudy.1df86445.svg";
},{}],"icons/animated-sunny.svg":[function(require,module,exports) {
module.exports = "/animated-sunny.e5dc119e.svg";
},{}],"icons/animated-clear-night.svg":[function(require,module,exports) {
module.exports = "/animated-clear-night.42d6e3b0.svg";
},{}],"icons/animated-partly-cloudy-day.svg":[function(require,module,exports) {
module.exports = "/animated-partly-cloudy-day.0e590461.svg";
},{}],"icons/animated-partly-cloudy-night.svg":[function(require,module,exports) {
module.exports = "/animated-partly-cloudy-night.571832d9.svg";
},{}],"js/utils/icons.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.animatedImageUrl = exports.imageUrl = void 0;

var _wiFog = _interopRequireDefault(require("../../icons/wi-fog.svg"));

var _wiRain = _interopRequireDefault(require("../../icons/wi-rain.svg"));

var _wiSnow = _interopRequireDefault(require("../../icons/wi-snow.svg"));

var _wiStrongWind = _interopRequireDefault(require("../../icons/wi-strong-wind.svg"));

var _wiSleet = _interopRequireDefault(require("../../icons/wi-sleet.svg"));

var _wiCloud = _interopRequireDefault(require("../../icons/wi-cloud.svg"));

var _wiDaySunny = _interopRequireDefault(require("../../icons/wi-day-sunny.svg"));

var _wiNightClear = _interopRequireDefault(require("../../icons/wi-night-clear.svg"));

var _wiDayCloudy = _interopRequireDefault(require("../../icons/wi-day-cloudy.svg"));

var _wiNightAltCloudy = _interopRequireDefault(require("../../icons/wi-night-alt-cloudy.svg"));

var _animatedFog = _interopRequireDefault(require("../../icons/animated-fog.svg"));

var _animatedRain = _interopRequireDefault(require("../../icons/animated-rain.svg"));

var _animatedSnow = _interopRequireDefault(require("../../icons/animated-snow.svg"));

var _animatedWind = _interopRequireDefault(require("../../icons/animated-wind.svg"));

var _animatedSleet = _interopRequireDefault(require("../../icons/animated-sleet.svg"));

var _animatedCloudy = _interopRequireDefault(require("../../icons/animated-cloudy.svg"));

var _animatedSunny = _interopRequireDefault(require("../../icons/animated-sunny.svg"));

var _animatedClearNight = _interopRequireDefault(require("../../icons/animated-clear-night.svg"));

var _animatedPartlyCloudyDay = _interopRequireDefault(require("../../icons/animated-partly-cloudy-day.svg"));

var _animatedPartlyCloudyNight = _interopRequireDefault(require("../../icons/animated-partly-cloudy-night.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var imageUrl = {
  'fog': _wiFog.default,
  'rain': _wiRain.default,
  'snow': _wiSnow.default,
  'wind': _wiStrongWind.default,
  'sleet': _wiSleet.default,
  'cloudy': _wiCloud.default,
  'clear-day': _wiDaySunny.default,
  'clear-night': _wiNightClear.default,
  'partly-cloudy-day': _wiDayCloudy.default,
  'partly-cloudy-night': _wiNightAltCloudy.default
};
exports.imageUrl = imageUrl;
var animatedImageUrl = {
  'fog': _animatedFog.default,
  'rain': _animatedRain.default,
  'snow': _animatedSnow.default,
  'wind': _animatedWind.default,
  'sleet': _animatedSleet.default,
  'cloudy': _animatedCloudy.default,
  'clear-day': _animatedSunny.default,
  'clear-night': _animatedClearNight.default,
  'partly-cloudy-day': _animatedPartlyCloudyDay.default,
  'partly-cloudy-night': _animatedPartlyCloudyNight.default
};
exports.animatedImageUrl = animatedImageUrl;
},{"../../icons/wi-fog.svg":"icons/wi-fog.svg","../../icons/wi-rain.svg":"icons/wi-rain.svg","../../icons/wi-snow.svg":"icons/wi-snow.svg","../../icons/wi-strong-wind.svg":"icons/wi-strong-wind.svg","../../icons/wi-sleet.svg":"icons/wi-sleet.svg","../../icons/wi-cloud.svg":"icons/wi-cloud.svg","../../icons/wi-day-sunny.svg":"icons/wi-day-sunny.svg","../../icons/wi-night-clear.svg":"icons/wi-night-clear.svg","../../icons/wi-day-cloudy.svg":"icons/wi-day-cloudy.svg","../../icons/wi-night-alt-cloudy.svg":"icons/wi-night-alt-cloudy.svg","../../icons/animated-fog.svg":"icons/animated-fog.svg","../../icons/animated-rain.svg":"icons/animated-rain.svg","../../icons/animated-snow.svg":"icons/animated-snow.svg","../../icons/animated-wind.svg":"icons/animated-wind.svg","../../icons/animated-sleet.svg":"icons/animated-sleet.svg","../../icons/animated-cloudy.svg":"icons/animated-cloudy.svg","../../icons/animated-sunny.svg":"icons/animated-sunny.svg","../../icons/animated-clear-night.svg":"icons/animated-clear-night.svg","../../icons/animated-partly-cloudy-day.svg":"icons/animated-partly-cloudy-day.svg","../../icons/animated-partly-cloudy-night.svg":"icons/animated-partly-cloudy-night.svg"}],"js/Components/CurrentWeather/CurrentWeather.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Component2 = _interopRequireDefault(require("../../framework/Component"));

var _AppState = _interopRequireDefault(require("../../Services/AppState"));

var _ComponentFactory = _interopRequireDefault(require("../../framework/ComponentFactory"));

var _WeatherDataService = _interopRequireDefault(require("../../Services/WeatherDataService"));

var _icons = require("../../utils/icons");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CurrentWeather =
/*#__PURE__*/
function (_Component) {
  _inherits(CurrentWeather, _Component);

  function CurrentWeather(host, props) {
    var _this;

    _classCallCheck(this, CurrentWeather);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CurrentWeather).call(this, host, props));
    _this.onServerResponse = _this.onServerResponse.bind(_assertThisInitialized(_this));

    _WeatherDataService.default.subscribeForCurrentWeather(_this.onServerResponse);

    return _this;
  }

  _createClass(CurrentWeather, [{
    key: "init",
    value: function init() {
      this.state = {
        temperature: '',
        icon: '',
        windSpeed: '',
        humidity: '',
        date: '',
        city: ''
      };

      if (this.state.city === '') {
        _WeatherDataService.default.getCurrentLocation();
      }
    }
  }, {
    key: "onServerResponse",
    value: function onServerResponse(weatherData) {
      var currently = weatherData.currently,
          city = weatherData.city;
      var units = weatherData.flags.units;

      if (currently) {
        currently.date = new Date(currently.time * 1000).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric'
        });
        currently.temperature = Math.round(currently.temperature);
        currently.city = city;
        currently.units = units;
        this.updateState(currently);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return "\n  <div class=\"temp\">\n  ".concat(this.state.temperature, "\n  ").concat((this.state.units = 'ca') ? '<span>C |<a>F</a></span>' : '<span>C|<a>F</a></span>', "\n  </div>\n  <div class=\"right\">\n    <div class=\"date\">").concat(this.state.date, "</div>\n    <div class=\"summary\">").concat(this.state.city, "</div>\n    <div class=\"date\">").concat(this.state.humidity, "</div>\n    <div class=\"date\">").concat(this.state.windSpeed, "</div>\n  </div>\n  <div class=\"weather-icon\">\n  <img src=\"").concat(_icons.animatedImageUrl[this.state.icon], "\" />\n  </div>");
    }
  }]);

  return CurrentWeather;
}(_Component2.default);

exports.default = CurrentWeather;

_ComponentFactory.default.register(CurrentWeather);
},{"../../framework/Component":"js/framework/Component.js","../../Services/AppState":"js/Services/AppState.js","../../framework/ComponentFactory":"js/framework/ComponentFactory.js","../../Services/WeatherDataService":"js/Services/WeatherDataService.js","../../utils/icons":"js/utils/icons.js"}],"js/Components/CurrentWeather/index.js":[function(require,module,exports) {
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
},{"./CurrentWeather":"js/Components/CurrentWeather/CurrentWeather.js"}],"js/Components/WeatherForecast/WeatherForecast.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Component2 = _interopRequireDefault(require("../../framework/Component"));

var _AppState = _interopRequireDefault(require("../../Services/AppState"));

var _ComponentFactory = _interopRequireDefault(require("../../framework/ComponentFactory"));

var _WeatherDataService = _interopRequireDefault(require("../../Services/WeatherDataService"));

var _icons = _interopRequireDefault(require("../../utils/icons"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var WeatherForecast =
/*#__PURE__*/
function (_Component) {
  _inherits(WeatherForecast, _Component);

  function WeatherForecast(host, props) {
    var _this;

    _classCallCheck(this, WeatherForecast);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WeatherForecast).call(this, host, props));
    _this.onServerResponse = _this.onServerResponse.bind(_assertThisInitialized(_this));

    _WeatherDataService.default.subscribeForCurrentWeather(_this.onServerResponse);

    return _this;
  }

  _createClass(WeatherForecast, [{
    key: "init",
    value: function init() {
      this.state = {
        data: [{
          temperatureHigh: '',
          temperatureLow: '',
          icon: ''
        }]
      };
    }
  }, {
    key: "onServerResponse",
    value: function onServerResponse(_ref) {
      var daily = _ref.daily;
      daily.data = daily.data.slice(1, 6);
      daily.data.map(function (day) {
        day.weekday = new Date(day.time * 1000).toLocaleDateString('en-US', {
          weekday: 'short'
        });
        day.temperatureHigh = Math.round(day.temperatureHigh);
        day.temperatureLow = Math.round(day.temperatureLow);
      });
      this.updateState(daily);
    }
  }, {
    key: "render",
    value: function render() {
      return this.state.data.map(function (day) {
        return "\n      <WeatherForecastItem weekday=".concat(day.weekday, " icon=").concat(day.icon, " temperatureHigh=").concat(day.temperatureHigh, " temperatureLow=").concat(day.temperatureLow, "/>");
      }).join(' ');
    }
  }]);

  return WeatherForecast;
}(_Component2.default);

exports.default = WeatherForecast;

_ComponentFactory.default.register(WeatherForecast);
},{"../../framework/Component":"js/framework/Component.js","../../Services/AppState":"js/Services/AppState.js","../../framework/ComponentFactory":"js/framework/ComponentFactory.js","../../Services/WeatherDataService":"js/Services/WeatherDataService.js","../../utils/icons":"js/utils/icons.js"}],"js/Components/WeatherForecast/index.js":[function(require,module,exports) {
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
},{"./WeatherForecast":"js/Components/WeatherForecast/WeatherForecast.js"}],"js/Components/WeatherForecastItem/WeatherForecastItem.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Component2 = _interopRequireDefault(require("../../framework/Component"));

var _ComponentFactory = _interopRequireDefault(require("../../framework/ComponentFactory"));

var _icons = require("../../utils/icons");

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
      return "\n    <h4>".concat(this.props.weekday, "</h4>\n    <img src=\"").concat(_icons.animatedImageUrl[this.props.icon], "\" />\n    <p>").concat(this.props.temperatureHigh, "</p>\n    <p>").concat(this.props.temperatureLow, "</p>\n  ");
    }
  }]);

  return WeatherForecastItem;
}(_Component2.default);

exports.default = WeatherForecastItem;

_ComponentFactory.default.register(WeatherForecastItem);
},{"../../framework/Component":"js/framework/Component.js","../../framework/ComponentFactory":"js/framework/ComponentFactory.js","../../utils/icons":"js/utils/icons.js"}],"js/Components/WeatherForecastItem/index.js":[function(require,module,exports) {
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
},{"./WeatherForecastItem":"js/Components/WeatherForecastItem/WeatherForecastItem.js"}],"js/Components/App/App.js":[function(require,module,exports) {
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
    key: "render",
    value: function render() {
      return "\n    <nav class=\"search__container\">\n      <SearchBar/>\n    </nav>\n    <div id=\"card\" class=\"weather\">\n      <div class=\"details\">\n        <CurrentWeather/>\n        <div class=\"forcast\">\n          <WeatherForecast/>\n        </div>\n      </div>\n    </div>\n    ";
    }
  }]);

  return App;
}(_Component2.default); // to register component class with factory


exports.default = App;
},{"../../framework/Component":"js/framework/Component.js","../../framework/ComponentFactory":"js/framework/ComponentFactory.js","../SearchBar":"js/Components/SearchBar/index.js","../CurrentWeather":"js/Components/CurrentWeather/index.js","../WeatherForecast":"js/Components/WeatherForecast/index.js","../WeatherForecastItem":"js/Components/WeatherForecastItem/index.js"}],"js/Components/App/index.js":[function(require,module,exports) {
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

require("../style.scss");

var _App = require("./Components/App");

// import {routes} from './routes/routes';
// import Router from './framework/Router'
new _App.App(document.getElementById('app')); // , routes, App)
// router.init();
},{"../style.scss":"style.scss","./Components/App":"js/Components/App/index.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65037" + '/');

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