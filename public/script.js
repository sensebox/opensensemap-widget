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
'use strict';var _slicedToArray=function(){function a(a,b){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{!d&&h['return']&&h['return']()}finally{if(e)throw f}}return c}return function(b,c){if(Array.isArray(b))return b;if(Symbol.iterator in Object(b))return a(b,c);throw new TypeError('Invalid attempt to destructure non-iterable instance')}}();require('core-js/modules/es6.typed.array-buffer'),require('core-js/modules/es6.typed.int8-array'),require('core-js/modules/es6.typed.uint8-array'),require('core-js/modules/es6.typed.uint8-clamped-array'),require('core-js/modules/es6.typed.int16-array'),require('core-js/modules/es6.typed.uint16-array'),require('core-js/modules/es6.typed.int32-array'),require('core-js/modules/es6.typed.uint32-array'),require('core-js/modules/es6.typed.float32-array'),require('core-js/modules/es6.typed.float64-array'),require('core-js/modules/es6.map'),require('core-js/modules/es6.set'),require('core-js/modules/es6.weak-map'),require('core-js/modules/es6.weak-set'),require('core-js/modules/es6.reflect.apply'),require('core-js/modules/es6.reflect.construct'),require('core-js/modules/es6.reflect.define-property'),require('core-js/modules/es6.reflect.delete-property'),require('core-js/modules/es6.reflect.get'),require('core-js/modules/es6.reflect.get-own-property-descriptor'),require('core-js/modules/es6.reflect.get-prototype-of'),require('core-js/modules/es6.reflect.has'),require('core-js/modules/es6.reflect.is-extensible'),require('core-js/modules/es6.reflect.own-keys'),require('core-js/modules/es6.reflect.prevent-extensions'),require('core-js/modules/es6.reflect.set'),require('core-js/modules/es6.reflect.set-prototype-of'),require('core-js/modules/es6.promise'),require('core-js/modules/es6.symbol'),require('core-js/modules/es6.object.assign'),require('core-js/modules/es6.object.is'),require('core-js/modules/es6.object.set-prototype-of'),require('core-js/modules/es6.function.name'),require('core-js/modules/es6.string.raw'),require('core-js/modules/es6.string.from-code-point'),require('core-js/modules/es6.string.code-point-at'),require('core-js/modules/es6.string.repeat'),require('core-js/modules/es6.string.starts-with'),require('core-js/modules/es6.string.ends-with'),require('core-js/modules/es6.string.includes'),require('core-js/modules/es6.regexp.flags'),require('core-js/modules/es6.regexp.match'),require('core-js/modules/es6.regexp.replace'),require('core-js/modules/es6.regexp.split'),require('core-js/modules/es6.regexp.search'),require('core-js/modules/es6.array.from'),require('core-js/modules/es6.array.of'),require('core-js/modules/es6.array.copy-within'),require('core-js/modules/es6.array.find'),require('core-js/modules/es6.array.find-index'),require('core-js/modules/es6.array.fill'),require('core-js/modules/es6.array.iterator'),require('core-js/modules/es6.number.is-finite'),require('core-js/modules/es6.number.is-integer'),require('core-js/modules/es6.number.is-safe-integer'),require('core-js/modules/es6.number.is-nan'),require('core-js/modules/es6.number.epsilon'),require('core-js/modules/es6.number.min-safe-integer'),require('core-js/modules/es6.number.max-safe-integer'),require('core-js/modules/es6.math.acosh'),require('core-js/modules/es6.math.asinh'),require('core-js/modules/es6.math.atanh'),require('core-js/modules/es6.math.cbrt'),require('core-js/modules/es6.math.clz32'),require('core-js/modules/es6.math.cosh'),require('core-js/modules/es6.math.expm1'),require('core-js/modules/es6.math.fround'),require('core-js/modules/es6.math.hypot'),require('core-js/modules/es6.math.imul'),require('core-js/modules/es6.math.log1p'),require('core-js/modules/es6.math.log10'),require('core-js/modules/es6.math.log2'),require('core-js/modules/es6.math.sign'),require('core-js/modules/es6.math.sinh'),require('core-js/modules/es6.math.tanh'),require('core-js/modules/es6.math.trunc'),require('core-js/modules/es7.array.includes'),require('core-js/modules/es7.object.values'),require('core-js/modules/es7.object.entries'),require('core-js/modules/es7.object.get-own-property-descriptors'),require('core-js/modules/es7.string.pad-start'),require('core-js/modules/es7.string.pad-end'),require('core-js/modules/web.timers'),require('core-js/modules/web.immediate'),require('core-js/modules/web.dom.iterable'),require('regenerator-runtime/runtime'),'use strict';var selectedTab,widget=document.querySelector('[data-sensebox-id]'),_widget$dataset=widget.dataset,senseboxId=_widget$dataset.senseboxId,initialTab=_widget$dataset.initialTab,WIDGET_BASE_URL='http://localhost:8000/',REFRESH_INTERVAL=1.5e5,API_BASE_URL='https://api.opensensemap.org/boxes/'+senseboxId,DEPS_BASE_URL='https://unpkg.com/',userLang=navigator.language||navigator.userLanguage,currentIntervals={},clearCurrentInterval=function(a){currentIntervals[a]&&(clearInterval(currentIntervals[a]),currentIntervals[a]=void 0)},startInterval=function(a,b){clearCurrentInterval(a),currentIntervals[a]=setInterval(b,REFRESH_INTERVAL)},getWidgetHTML=function(){return fetch(new Request(WIDGET_BASE_URL+'widget.html',{method:'GET',mode:'cors'})).then(function(a){return a.text()})},initSensorArea=function(){fetchBox().then(function(a){var b=a.sensors;''===document.querySelector('.widget-list[data-tab="sensors"]').innerHTML&&createSensorDivs(b)})},appendTitle=function(a){var b=document.querySelector('#titlearea'),c=document.querySelector('.titletooltip');c.innerHTML=a,b.style.fontSize=setTitleFontSize(a),30<a.length&&(a=shortenTitle(a)),b.innerHTML=a},setTitleFontSize=function(a){var b=document.querySelector('.widget-wrapper').offsetHeight;return 300<=b?15<a.length?'16px':'25px':15<a.length?'12px':'15px'},shortenTitle=function(a){return a.substring(0,27)+'...'},appendDescription=function(a){var b=document.querySelector('.tooltip');b.innerHTML=a?'<p>'+a+'</p>':'<p>Keine Beschreibung verf\xFCgbar.</p>'},fetchBox=function(){return fetchJSON(API_BASE_URL).then(function(a){return appendTitle(a.name),appendDescription(a.description),a})},fetchJSONCache=Object.create(null),fetchJSON=function(a){return fetchJSONCache[a]&&fetchJSONCache[a].ts+1e4>Date.now()?Promise.resolve(fetchJSONCache[a].json):fetch(a).then(function(a){return a.json()}).then(function(b){return fetchJSONCache[a]={ts:Date.now(),json:b},b})},createSensorDivs=function(a){var b=document.querySelector('.widget-list[data-tab="sensors"]'),c=!0,d=!1,e=void 0;try{for(var f,g=a[Symbol.iterator]();!(c=(f=g.next()).done);c=!0){var h=f.value,i=document.createElement('div');i.className='innerDiv',i.id='widget-sensor-'+h._id,fillDiv(i,h),b.appendChild(i)}}catch(a){d=!0,e=a}finally{try{!c&&g.return&&g.return()}finally{if(d)throw e}}},fillDiv=function(a,b){a.innerHTML=b.lastMeasurement?'<h3>'+b.title+': <span>'+formatDates(new Date(b.lastMeasurement.createdAt))+'</span></h3><p><span class="sensorValue">'+b.lastMeasurement.value+' '+b.unit+'</span></p>':'<h3>'+b.title+': </h3><p>Keine Daten verf\xFCgbar...</p>'},updateSensorValues=function(a){var b=!0,c=!1,d=void 0;try{for(var e,f=a.sensors[Symbol.iterator]();!(b=(e=f.next()).done);b=!0){var g=e.value,h='widget-sensor-'+g._id;fillDiv(document.getElementById(h),g)}}catch(a){c=!0,d=a}finally{try{!b&&f.return&&f.return()}finally{if(c)throw d}}},initHistoryArea=function(){fetchBox().then(function(a){var b=document.getElementById('currentsensorhistory');if(''===b.innerHTML){var c=a.sensors;createAndInsertOptions(c,b)}''===document.getElementById('history-entries').innerHTML&&insertOldEntries(a)}).catch(function(a){console.log(a),document.getElementById('history-entries').innerHTML='Es ist ein Fehler aufgetreten: '+a})},createAndInsertOptions=function(a,b){var c=!0,d=!1,e=void 0;try{for(var f,g=a[Symbol.iterator]();!(c=(f=g.next()).done);c=!0){var h=f.value,i=document.createElement('option'),j=h;i.value=j._id,i.innerHTML=j.title,b.appendChild(i)}}catch(a){d=!0,e=a}finally{try{!c&&g.return&&g.return()}finally{if(d)throw e}}},insertOldEntries=function(a){document.getElementById('history-entries').innerHTML='';var b=getSelectedValue('currentsensorhistory'),c=searchSensorinArray(b,a.sensors);return fetchJSON(API_BASE_URL+'/data/'+b).then(function(a){if(0!==a.length)for(var b=4;0<=b;)a[b]&&addHistoryEntry(formatDates(new Date(a[b].createdAt)),a[b].value,c.unit),b--;else document.getElementById('history-entries').innerHTML='<p>Leider gibt es hierf\xFCr keine aktuellen Messwerte.</p>'}).catch(function(a){console.log(a),document.getElementById('history-entries').innerHTML='<p>Ein Fehler ist aufgetreten: '+a+'</p>'})},getSelectedValue=function(a){var b=document.getElementById(a);return b.options[b.selectedIndex].value},searchSensorinArray=function(a,b){return b.find(function(b){return b._id===a})},addHistoryEntry=function(a,b,c){var d=document.createElement('div');d.className='innerDiv-history',d.innerHTML='<p><i>'+a+'</i>: <b>'+b+c+'</b></p>';var e=document.getElementById('history-entries');e.insertBefore(d,e.firstChild)},timespanTranslations={"de-DE":{prefix:'vor',s:'Sekunden',min:'Minuten',h:'Stunden',d:'Tagen',m:'Monaten',y:'Jahren'},default:{suffix:'ago',s:'seconds',min:'minutes',h:'hours',d:'days',m:'months',y:'years'}},getTimespanTranslation=function(a,b){var c=timespanTranslations[userLang];return c||(c=timespanTranslations.default),c.suffix?b+' '+c[a]+' '+c.suffix:c.prefix+' '+b+' '+c[a]},formatDates=function(a){var b=Math.floor,c=b((new Date-a)/1e3),d=b(c/31536000);return 1<d?getTimespanTranslation('y',d):(d=b(c/2592000),1<d)?getTimespanTranslation('m',d):(d=b(c/86400),1<d)?getTimespanTranslation('d',d):(d=b(c/3600),1<d)?getTimespanTranslation('h',d):(d=b(c/60),1<d?getTimespanTranslation('min',d):getTimespanTranslation('s',b(c)))},updateHistory=function(a){var b=getSelectedValue('currentsensorhistory'),c=searchSensorinArray(b,a.sensors);if(c.lastMeasurement){var d=formatDates(new Date(c.lastMeasurement.createdAt)),e=document.getElementById('history-entries').firstChild;e&&null!==e&&e.innerHTML.startsWith('<p><i>'+d)||(e&&null!==e&&e.innerHTML.startsWith('Leider')&&(e.innerHTML=''),addHistoryEntry(d,c.lastMeasurement.value,c.unit))}},initGraphArea=function(){Promise.all([fetchBox(),insertStylesheetWithOnloadListener(DEPS_BASE_URL+'metrics-graphics@2.11.0/dist/metricsgraphics.css'),loadJSsync(['d3@4.9.1','metrics-graphics@2.11.0'])]).then(function(a){var b=_slicedToArray(a,1),c=b[0],d=document.getElementById('currentsensorgraph');if(''===d.innerHTML){var e=c.sensors;createAndInsertOptions(e,d)}''===document.getElementById('graph-target').innerHTML&&drawGraph(c)}).catch(function(a){document.querySelector('#graph-target').innerHTML='Ein Fehler ist aufgetreten: '+a})},drawGraph=function(a){var b=document.getElementById('graph-target');b.innerHTML='';var c=document.getElementById('currentsensorgraph'),d=c.options[c.selectedIndex].value,e=searchSensorinArray(d,a.sensors);d3.json(API_BASE_URL+'/data/'+d,function(a,c){(a||!c||null===c)&&(document.querySelector('#graph-target').innerHTML='Ein Fehler ist aufgetreten: '+a),c=reduceAmountOfDrawnData(c),0===c.length?b.innerHTML='<p>Leider gibt es hierf\xFCr keine aktuellen Messwerte.</p>':(c=MG.convert.date(c,'createdAt',d3.utcParse('%Y-%m-%dT%H:%M:%S.%L%Z')),MG.data_graphic({data:c,full_width:!0,full_height:!0,right:40,target:'#graph-target',area:!1,backgroundColor:'#8C001A',title:e.title+' in '+e.unit,xax_count:3,color:'#4EAF47',x_accessor:'createdAt',y_accessor:'value',max_y:setMaxGraphValue(c),min_y:setMinGraphValue(c),mouseover:function mouseover(a){var b=formatDates(new Date(a.createdAt)),c=b+' -> '+a.value+' '+e.unit;d3.select('#graph-target svg .mg-active-datapoint').text(c)}}))})},setMaxGraphValue=function(a){for(var b=0,c=0;c<a.length;c++)parseFloat(a[c].value)>b&&(b=parseFloat(a[c].value));return 0<maximum?1.2*maximum:maximum-0.2*maximum},setMinGraphValue=function(a){for(var b=a[0].value,c=1;c<a.length;c++)parseFloat(a[c].value)<b&&(b=parseFloat(a[c].value));return 0>minimum?1.2*minimum:minimum-0.2*minimum},adjustMarginTopWithParentHeight=function(a,b,c){var d=a.offsetHeight;c.top&&(b.style.marginTop=c.top*d+'px'),c.bottom&&(b.style.marginBottom=c.bottom*d+'px')},adjustPaddingTopWithParentHeight=function(a,b,c){var d=a.offsetHeight;c.top&&(b.style.paddingTop=c.top*d+'px'),c.bottom&&(b.style.paddingBottom=c.bottom*d+'px')},insertStylesheetWithOnloadListener=function(a){return new Promise(function(b){var c=document.createElement('style');c.textContent='@import "'+a+'"',document.head.appendChild(c);var d=setInterval(function(){try{c.sheet.cssRules,clearInterval(d),b()}catch(a){}},10)})},applyStylesToWidgetWithJS=function(){var a=!0,b=!1,c=void 0;try{for(var d,e,f=document.querySelectorAll('.widget-list[data-tab]')[Symbol.iterator]();!(a=(d=f.next()).done);a=!0)e=d.value,adjustMarginTopWithParentHeight(document.querySelector('.widget'),e,{top:0.12})}catch(a){b=!0,c=a}finally{try{!a&&f.return&&f.return()}finally{if(b)throw c}}adjustPaddingTopWithParentHeight(document.querySelector('.widget-header'),document.querySelector('.widget-header img'),{top:0.1,bottom:0.1}),setFooterLinkHref(),setFooterFontSize()},loadJSsync=function(a){var b=document.head||document.getElementsByTagName('head')[0],c=0;return new Promise(function(d){var e=function(){var f=document.createElement('script');f.src=''+DEPS_BASE_URL+a[c],f.async=!1,++c,f.addEventListener('load',function(){return c===a.length?d():e()}),b.insertBefore(f,b.firstChild)};e()})},reduceAmountOfDrawnData=function(a){if(1e3>=a.length)return a;for(var b=[],c=a.length+'',d=2*c.substring(0,c.length-3),e=0;e<a.length;e+=d)b.push(a[e]);return resarr},setFooterLinkHref=function(){var a=document.querySelector('.widget-footer').firstElementChild;a.href='https://opensensemap.org/explore/'+senseboxId},setFooterFontSize=function(){document.querySelector('.widget-footer').style.fontSize=400<=document.querySelector('.widget').offsetHeight?'14px':'11px'},toggleTab=function(a){var b=a.target,c=b.dataset.tabId,d=document.querySelector('.widget-list[data-tab="'+c+'"]'),e=!0,f=!1,g=void 0;try{for(var h,i,j=document.querySelectorAll('.selected-tab')[Symbol.iterator]();!(e=(h=j.next()).done);e=!0)i=h.value,i.classList.remove('selected-tab')}catch(a){f=!0,g=a}finally{try{!e&&j.return&&j.return()}finally{if(f)throw g}}d.classList.add('selected-tab'),b.classList.add('selected-tab'),selectedTab=c;'graph'===c?initGraphArea():'history'===c?initHistoryArea():'sensors'===c?initSensorArea():initSensorArea()},initTabs=function(){var a=document.querySelectorAll('.widget-tab'),b=!0,c=!1,d=void 0;try{for(var e,f,g=a[Symbol.iterator]();!(b=(e=g.next()).done);b=!0)f=e.value,f.addEventListener('click',toggleTab)}catch(a){c=!0,d=a}finally{try{!b&&g.return&&g.return()}finally{if(c)throw d}}};Promise.all([getWidgetHTML(),insertStylesheetWithOnloadListener(WIDGET_BASE_URL+'style.css')]).then(function(a){var b=_slicedToArray(a,1),c=b[0];widget.innerHTML=c,applyStylesToWidgetWithJS(),initTabs(),toggleTab({target:document.querySelector('[data-tab-id='+(initialTab||'sensors')+']')}),startInterval('datarefresh',function(){fetchBox().then(function(a){'history'===selectedTab?updateHistory(a):'sensors'===selectedTab&&updateSensorValues(a)})})}).catch(function(a){console.log(a),document.querySelector('.widget').innerHTML='Es ist ein Fehler aufgetreten: '+a});

require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=script.js.map