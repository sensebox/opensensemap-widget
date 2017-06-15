(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* global d3, MG*/


require('core-js/modules/es6.typed.array-buffer');

require('core-js/modules/es6.typed.int8-array');

require('core-js/modules/es6.typed.uint8-array');

require('core-js/modules/es6.typed.uint8-clamped-array');

require('core-js/modules/es6.typed.int16-array');

require('core-js/modules/es6.typed.uint16-array');

require('core-js/modules/es6.typed.int32-array');

require('core-js/modules/es6.typed.uint32-array');

require('core-js/modules/es6.typed.float32-array');

require('core-js/modules/es6.typed.float64-array');

require('core-js/modules/es6.map');

require('core-js/modules/es6.set');

require('core-js/modules/es6.weak-map');

require('core-js/modules/es6.weak-set');

require('core-js/modules/es6.reflect.apply');

require('core-js/modules/es6.reflect.construct');

require('core-js/modules/es6.reflect.define-property');

require('core-js/modules/es6.reflect.delete-property');

require('core-js/modules/es6.reflect.get');

require('core-js/modules/es6.reflect.get-own-property-descriptor');

require('core-js/modules/es6.reflect.get-prototype-of');

require('core-js/modules/es6.reflect.has');

require('core-js/modules/es6.reflect.is-extensible');

require('core-js/modules/es6.reflect.own-keys');

require('core-js/modules/es6.reflect.prevent-extensions');

require('core-js/modules/es6.reflect.set');

require('core-js/modules/es6.reflect.set-prototype-of');

require('core-js/modules/es6.promise');

require('core-js/modules/es6.symbol');

require('core-js/modules/es6.object.assign');

require('core-js/modules/es6.object.is');

require('core-js/modules/es6.object.set-prototype-of');

require('core-js/modules/es6.function.name');

require('core-js/modules/es6.string.raw');

require('core-js/modules/es6.string.from-code-point');

require('core-js/modules/es6.string.code-point-at');

require('core-js/modules/es6.string.repeat');

require('core-js/modules/es6.string.starts-with');

require('core-js/modules/es6.string.ends-with');

require('core-js/modules/es6.string.includes');

require('core-js/modules/es6.regexp.flags');

require('core-js/modules/es6.regexp.match');

require('core-js/modules/es6.regexp.replace');

require('core-js/modules/es6.regexp.split');

require('core-js/modules/es6.regexp.search');

require('core-js/modules/es6.array.from');

require('core-js/modules/es6.array.of');

require('core-js/modules/es6.array.copy-within');

require('core-js/modules/es6.array.find');

require('core-js/modules/es6.array.find-index');

require('core-js/modules/es6.array.fill');

require('core-js/modules/es6.array.iterator');

require('core-js/modules/es6.number.is-finite');

require('core-js/modules/es6.number.is-integer');

require('core-js/modules/es6.number.is-safe-integer');

require('core-js/modules/es6.number.is-nan');

require('core-js/modules/es6.number.epsilon');

require('core-js/modules/es6.number.min-safe-integer');

require('core-js/modules/es6.number.max-safe-integer');

require('core-js/modules/es6.math.acosh');

require('core-js/modules/es6.math.asinh');

require('core-js/modules/es6.math.atanh');

require('core-js/modules/es6.math.cbrt');

require('core-js/modules/es6.math.clz32');

require('core-js/modules/es6.math.cosh');

require('core-js/modules/es6.math.expm1');

require('core-js/modules/es6.math.fround');

require('core-js/modules/es6.math.hypot');

require('core-js/modules/es6.math.imul');

require('core-js/modules/es6.math.log1p');

require('core-js/modules/es6.math.log10');

require('core-js/modules/es6.math.log2');

require('core-js/modules/es6.math.sign');

require('core-js/modules/es6.math.sinh');

require('core-js/modules/es6.math.tanh');

require('core-js/modules/es6.math.trunc');

require('core-js/modules/es7.array.includes');

require('core-js/modules/es7.object.values');

require('core-js/modules/es7.object.entries');

require('core-js/modules/es7.object.get-own-property-descriptors');

require('core-js/modules/es7.string.pad-start');

require('core-js/modules/es7.string.pad-end');

require('core-js/modules/web.timers');

require('core-js/modules/web.immediate');

require('core-js/modules/web.dom.iterable');

require('regenerator-runtime/runtime');

'use strict';

var widget = document.querySelector('[data-sensebox-id]');
var _widget$dataset = widget.dataset,
    senseboxId = _widget$dataset.senseboxId,
    initialTab = _widget$dataset.initialTab;

var selectedTab = void 0;

var WIDGET_BASE_URL = 'http://localhost:8000/';
var REFRESH_INTERVAL = 150000; // 2.5 minutes
var API_BASE_URL = 'https://api.opensensemap.org/boxes/' + senseboxId;
var DEPS_BASE_URL = 'https://unpkg.com/';

var userLang = navigator.language || navigator.userLanguage;

var currentIntervals = {};
var clearCurrentInterval = function clearCurrentInterval(target) {
  if (currentIntervals[target]) {
    clearInterval(currentIntervals[target]);
    currentIntervals[target] = undefined;
  }
};

var startInterval = function startInterval(target, func) {
  clearCurrentInterval(target);
  currentIntervals[target] = setInterval(func, REFRESH_INTERVAL);
};

var getWidgetHTML = function getWidgetHTML() {
  return fetch(new Request(WIDGET_BASE_URL + 'widget.html', {
    method: 'GET',
    mode: 'cors'
  })).then(function (res) {
    return res.text();
  });
};

var initSensorArea = function initSensorArea() {
  fetchBox().then(function (sensorData) {
    var sensors = sensorData.sensors;
    if (document.querySelector('.widget-list[data-tab="sensors"]').innerHTML === '') {
      createSensorDivs(sensors);
    }
  });
};

var appendTitle = function appendTitle(title) {
  var titleArea = document.querySelector('#titlearea');
  var titleTooltip = document.querySelector('.titletooltip');
  titleTooltip.innerHTML = title;
  titleArea.style.fontSize = setTitleFontSize(title);
  if (title.length > 30) {
    title = shortenTitle(title);
  }
  titleArea.innerHTML = title;
};

var setTitleFontSize = function setTitleFontSize(title) {
  var widgetHeight = document.querySelector('.widget-wrapper').offsetHeight;
  if (widgetHeight >= 300) {
    if (title.length > 15) {
      return '16px';
    }

    return '25px';
  }
  if (title.length > 15) {
    return '12px';
  }

  return '15px';
};

var shortenTitle = function shortenTitle(title) {
  return title.substring(0, 27) + '...';
};

var appendDescription = function appendDescription(description) {
  var tooltip = document.querySelector('.tooltip');
  tooltip.innerHTML = description ? '<p>' + description + '</p>' : '<p>Keine Beschreibung verfügbar.</p>';
};

var fetchBox = function fetchBox() {
  return fetchJSON(API_BASE_URL).then(function (box) {
    appendTitle(box.name);
    appendDescription(box.description);

    return box;
  });
};

var fetchJSONCache = Object.create(null);

var fetchJSON = function fetchJSON(url) {
  if (fetchJSONCache[url] && fetchJSONCache[url].ts + 10000 > Date.now()) {
    return Promise.resolve(fetchJSONCache[url].json);
  }

  return fetch(url).then(function (res) {
    return res.json();
  }).then(function (json) {
    fetchJSONCache[url] = {
      ts: Date.now(),
      json: json
    };

    return json;
  });
};

var createSensorDivs = function createSensorDivs(sensors) {
  var sensorTab = document.querySelector('.widget-list[data-tab="sensors"]');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sensors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var sensor = _step.value;

      var newDiv = document.createElement('div');
      newDiv.className = 'innerDiv';
      newDiv.id = 'widget-sensor-' + sensor._id;
      fillDiv(newDiv, sensor);
      sensorTab.appendChild(newDiv);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var fillDiv = function fillDiv(element, data) {
  if (data.lastMeasurement) {
    element.innerHTML = '<h3>' + data.title + ': <span>' + formatDates(new Date(data.lastMeasurement.createdAt)) + '</span></h3><p><span class="sensorValue">' + data.lastMeasurement.value + ' ' + data.unit + '</span></p>';
  } else {
    element.innerHTML = '<h3>' + data.title + ': </h3><p>Keine Daten verf\xFCgbar...</p>';
  }
};

var updateSensorValues = function updateSensorValues(sensorData) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = sensorData.sensors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var sensor = _step2.value;

      var requiredID = 'widget-sensor-' + sensor._id;
      fillDiv(document.getElementById(requiredID), sensor);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
};

//Der folgende Code wird nur initiiert, wenn der "History"-Button im Widget angeklickt wird.

var initHistoryArea = function initHistoryArea() {
  fetchBox().then(function (sensorData) {
    var select = document.getElementById('currentsensorhistory');
    if (select.innerHTML === '') {
      var sensors = sensorData.sensors;
      createAndInsertOptions(sensors, select);
    }
    if (document.getElementById('history-entries').innerHTML === '') {
      //Für den Fall, dass man zum Tab zurückkehrt, nachdem man ihn schon einmal aufgerufen hat
      insertOldEntries(sensorData);
    }
  }).catch(function (err) {
    console.log(err);
    document.getElementById('history-entries').innerHTML = 'Es ist ein Fehler aufgetreten: ' + err;
  });
};

var createAndInsertOptions = function createAndInsertOptions(optionArray, select) {
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = optionArray[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var option = _step3.value;

      var newOption = document.createElement('option');
      var currentOption = option;
      newOption.value = currentOption._id;
      newOption.innerHTML = currentOption.title;
      select.appendChild(newOption);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
};

var insertOldEntries = function insertOldEntries(sensorObject) {
  document.getElementById('history-entries').innerHTML = '';
  var sensorID = getSelectedValue('currentsensorhistory');
  var currentSensor = searchSensorinArray(sensorID, sensorObject.sensors);

  return fetchJSON(API_BASE_URL + '/data/' + sensorID).then(function (measurements) {
    if (measurements.length !== 0) {
      var i = 4;
      while (i >= 0) {
        if (measurements[i]) addHistoryEntry(formatDates(new Date(measurements[i].createdAt)), measurements[i].value, currentSensor.unit);
        i--;
      }
    } else {
      document.getElementById('history-entries').innerHTML = '<p>Leider gibt es hierfür keine aktuellen Messwerte.</p>';
    }
  }).catch(function (err) {
    console.log(err);
    document.getElementById('history-entries').innerHTML = '<p>Ein Fehler ist aufgetreten: ' + err + '</p>';
  });
};

var getSelectedValue = function getSelectedValue(elementID) {
  var select = document.getElementById(elementID);

  return select.options[select.selectedIndex].value;
};

var searchSensorinArray = function searchSensorinArray(id, arr) {
  return arr.find(function (s) {
    return s._id === id;
  });
};

var addHistoryEntry = function addHistoryEntry(date, value, unit) {
  var newDiv = document.createElement('div');
  newDiv.className = 'innerDiv-history';
  newDiv.innerHTML = '<p><i>' + date + '</i>: <b>' + value + unit + '</b></p>';
  var historyEntries = document.getElementById('history-entries');
  historyEntries.insertBefore(newDiv, historyEntries.firstChild);
};

var timespanTranslations = {
  'de-DE': {
    prefix: 'vor',
    s: 'Sekunden',
    min: 'Minuten',
    h: 'Stunden',
    d: 'Tagen',
    m: 'Monaten',
    y: 'Jahren'
  },
  default: {
    suffix: 'ago',
    s: 'seconds',
    min: 'minutes',
    h: 'hours',
    d: 'days',
    m: 'months',
    y: 'years'
  }
};

var getTimespanTranslation = function getTimespanTranslation(key, timespan) {
  var strings = timespanTranslations[userLang];
  if (!strings) {
    strings = timespanTranslations.default;
  }

  if (strings.suffix) {
    return timespan + ' ' + strings[key] + ' ' + strings.suffix;
  }

  return strings.prefix + ' ' + timespan + ' ' + strings[key];
};

var formatDates = function formatDates(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return getTimespanTranslation('y', interval);
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return getTimespanTranslation('m', interval);
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return getTimespanTranslation('d', interval);
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return getTimespanTranslation('h', interval);
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return getTimespanTranslation('min', interval);
  }

  return getTimespanTranslation('s', Math.floor(seconds));
};

var updateHistory = function updateHistory(sensorData) {
  var sensorID = getSelectedValue('currentsensorhistory');
  var currentSensor = searchSensorinArray(sensorID, sensorData.sensors);
  if (currentSensor.lastMeasurement) {
    var parsedDate = formatDates(new Date(currentSensor.lastMeasurement.createdAt));
    var firstChild = document.getElementById('history-entries').firstChild;
    if (!firstChild || firstChild === null || !firstChild.innerHTML.startsWith('<p><i>' + parsedDate)) {
      if (firstChild && firstChild !== null && firstChild.innerHTML.startsWith('Leider')) firstChild.innerHTML = '';
      addHistoryEntry(parsedDate, currentSensor.lastMeasurement.value, currentSensor.unit);
    }
  }
};

//Diese Funktionen werden aufgerufen, wenn der Graphen-Tab angeklickt wird.

var initGraphArea = function initGraphArea() {
  Promise.all([fetchBox(), insertStylesheetWithOnloadListener(DEPS_BASE_URL + 'metrics-graphics@2.11.0/dist/metricsgraphics.css'), loadJSsync(['d3@4.9.1', 'metrics-graphics@2.11.0'])]).then(function (results) {
    var _results = _slicedToArray(results, 1),
        sensorData = _results[0];

    var select = document.getElementById('currentsensorgraph');
    if (select.innerHTML === '') {
      var sensors = sensorData.sensors;
      createAndInsertOptions(sensors, select);
    }
    if (document.getElementById('graph-target').innerHTML === '') {
      drawGraph(sensorData);
    }
  }).catch(function (err) {
    document.querySelector('#graph-target').innerHTML = 'Ein Fehler ist aufgetreten: ' + err;
  });
};

var drawGraph = function drawGraph(sensorObject) {
  var graphArea = document.getElementById('graph-target');
  graphArea.innerHTML = '';
  var selectedSensor = document.getElementById('currentsensorgraph');
  var sensorID = selectedSensor.options[selectedSensor.selectedIndex].value;
  var currentSensor = searchSensorinArray(sensorID, sensorObject.sensors);
  var url = API_BASE_URL + '/data/' + sensorID;
  d3.json(url, function (err, data) {
    if (err || !data || data === null) {
      document.querySelector('#graph-target').innerHTML = 'Ein Fehler ist aufgetreten: ' + err;
    }
    data = reduceAmountOfDrawnData(data);
    if (data.length !== 0) {
      data = MG.convert.date(data, 'createdAt', d3.utcParse('%Y-%m-%dT%H:%M:%S.%L%Z'));
      MG.data_graphic({
        data: data,
        full_width: true,
        full_height: true,
        right: 40,
        target: '#graph-target',
        area: false,
        backgroundColor: '#8C001A',
        title: currentSensor.title + ' in ' + currentSensor.unit,
        xax_count: 3,
        color: '#4EAF47',
        x_accessor: 'createdAt',
        y_accessor: 'value',
        max_y: setMaxGraphValue(data),
        min_y: setMinGraphValue(data),
        mouseover: function mouseover(d) {
          var formattedDate = formatDates(new Date(d.createdAt));
          var measurement = formattedDate + ' -> ' + d.value + ' ' + currentSensor.unit;
          d3.select('#graph-target svg .mg-active-datapoint').text(measurement);
        }
      });
    } else {
      graphArea.innerHTML = '<p>Leider gibt es hierfür keine aktuellen Messwerte.</p>';
    }
  });
};

var setMaxGraphValue = function setMaxGraphValue(data) {
  var maximum = 0;
  for (var i = 0; i < data.length; i++) {
    if (parseFloat(data[i].value) > maximum) {
      maximum = parseFloat(data[i].value);
    }
  }

  return maximum > 0 ? maximum * 1.2 : maximum - maximum * 0.2;
};

var setMinGraphValue = function setMinGraphValue(data) {
  var minimum = data[0].value;
  for (var i = 1; i < data.length; i++) {
    if (parseFloat(data[i].value) < minimum) {
      minimum = parseFloat(data[i].value);
    }
  }

  return minimum < 0 ? minimum * 1.2 : minimum - minimum * 0.2;
};

var adjustMarginTopWithParentHeight = function adjustMarginTopWithParentHeight(parent, child, margin) {
  var elementHeight = parent.offsetHeight;
  if (margin.top) child.style.marginTop = margin.top * elementHeight + 'px';
  if (margin.bottom) child.style.marginBottom = margin.bottom * elementHeight + 'px';
};

var adjustPaddingTopWithParentHeight = function adjustPaddingTopWithParentHeight(parent, child, padding) {
  var elementHeight = parent.offsetHeight;
  if (padding.top) child.style.paddingTop = padding.top * elementHeight + 'px';
  if (padding.bottom) child.style.paddingBottom = padding.bottom * elementHeight + 'px';
};

var insertStylesheetWithOnloadListener = function insertStylesheetWithOnloadListener(url) {
  return new Promise(function (resolve) {
    var style = document.createElement('style');
    style.textContent = '@import "' + url + '"';
    document.head.appendChild(style);
    var onload = setInterval(function () {
      try {
        style.sheet.cssRules;
        clearInterval(onload);
        resolve();
      } catch (e) {
        /*eslint-disable no-empty */
        /*eslint-enable no-empty */
      }
    }, 10);
  });
};

var applyStylesToWidgetWithJS = function applyStylesToWidgetWithJS() {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = document.querySelectorAll('.widget-list[data-tab]')[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var _widget = _step4.value;

      adjustMarginTopWithParentHeight(document.querySelector('.widget'), _widget, {
        top: 0.12
      });
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  adjustPaddingTopWithParentHeight(document.querySelector('.widget-header'), document.querySelector('.widget-header img'), {
    top: 0.1,
    bottom: 0.1
  });
  setFooterLinkHref();
  setFooterFontSize();
};

var loadJSsync = function loadJSsync(urls) {
  var head = document.head || document.getElementsByTagName('head')[0];
  var currIndex = 0;

  return new Promise(function (resolve) {
    var next = function next() {
      var scr = document.createElement('script');

      scr.src = '' + DEPS_BASE_URL + urls[currIndex];
      scr.async = false;
      currIndex = currIndex + 1;

      scr.addEventListener('load', function () {
        if (currIndex !== urls.length) {
          return next();
        }

        return resolve();
      });

      head.insertBefore(scr, head.firstChild);
    };

    next();
  });
};

var reduceAmountOfDrawnData = function reduceAmountOfDrawnData(data) {
  if (data.length <= 1000) {
    return data;
  }

  var resarr = [];
  var dataLengthString = String(data.length);
  var steps = dataLengthString.substring(0, dataLengthString.length - 3) * 2;
  for (var i = 0; i < data.length; i = i + steps) {
    resarr.push(data[i]);
  }

  return resarr;
};

var setFooterLinkHref = function setFooterLinkHref() {
  var footerLink = document.querySelector('.widget-footer').firstElementChild;
  footerLink.href = 'https://opensensemap.org/explore/' + senseboxId;
};

var setFooterFontSize = function setFooterFontSize() {
  document.querySelector('.widget-footer').style.fontSize = document.querySelector('.widget').offsetHeight >= 400 ? '14px' : '11px';
};

var toggleTab = function toggleTab(_ref) {
  var target = _ref.target;
  var tabId = target.dataset.tabId;

  var tab = document.querySelector('.widget-list[data-tab="' + tabId + '"]');

  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = document.querySelectorAll('.selected-tab')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var elem = _step5.value;

      elem.classList.remove('selected-tab');
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  tab.classList.add('selected-tab');
  target.classList.add('selected-tab');
  selectedTab = tabId;

  switch (tabId) {
    case 'graph':
      initGraphArea();
      break;
    case 'history':
      initHistoryArea();
      break;
    case 'sensors':
      initSensorArea();
      break;
    default:
      initSensorArea();
  }
};

var initTabs = function initTabs() {
  var tabs = document.querySelectorAll('.widget-tab');
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = tabs[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var tab = _step6.value;

      tab.addEventListener('click', toggleTab);
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }
};

Promise.all([getWidgetHTML(), insertStylesheetWithOnloadListener(WIDGET_BASE_URL + 'style.css')]).then(function (results) {
  var _results2 = _slicedToArray(results, 1),
      content = _results2[0];

  widget.innerHTML = content;

  applyStylesToWidgetWithJS();
  initTabs();
  toggleTab({
    target: document.querySelector('[data-tab-id=' + (initialTab || 'sensors') + ']')
  });

  startInterval('datarefresh', function () {
    fetchBox().then(function (box) {
      if (selectedTab === 'history') updateHistory(box);else if (selectedTab === 'sensors') updateSensorValues(box);
    });
  });
}).catch(function (err) {
  console.log(err);
  document.querySelector('.widget').innerHTML = 'Es ist ein Fehler aufgetreten: ' + err;
});

require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=script.js.map