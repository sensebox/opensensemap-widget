/* global d3, MG*/

'use strict';

const widget = document.querySelector('[data-sensebox-id]');
const { senseboxId, initialTab } = widget.dataset;

const WIDGET_BASE_URL = 'https://sensebox.de/opensensemap-widget/';
const REFRESH_INTERVAL = 150000; // 2.5 minutes
const API_BASE_URL = `https://api.opensensemap.org/boxes/${senseboxId}`;
const DEPS_BASE_URL = 'https://unpkg.com/';

const userLang = navigator.language || navigator.userLanguage;

let currentInterval;
const clearCurrentInterval = function clearCurrentInterval() {
  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = undefined;
  }
};

const getWidgetHTML = function getWidgetHTML() {
  return fetch(
    new Request(`${WIDGET_BASE_URL}widget.html`, {
      method: 'GET',
      mode: 'cors'
    })
  ).then(res => res.text());
};

const initSensorArea = function initSensorArea() {
  fetchBox().then(sensorData => {
    const sensors = sensorData.sensors;
    if (
      document.querySelector('.widget-list[data-tab="sensors"]').innerHTML ===
      ''
    ) {
      createSensorDivs(sensors);
    }
    clearCurrentInterval();
    currentInterval = setInterval(updateCurrentSensorValues, REFRESH_INTERVAL);
  });
};

const appendTitle = function appendTitle(title) {
  const titleArea = document.querySelector('#titlearea');
  const titleTooltip = document.querySelector('.titletooltip');
  titleTooltip.innerHTML = title;
  titleArea.style.fontSize = setTitleFontSize(title);
  if (title.length > 30) {
    title = shortenTitle(title);
  }
  titleArea.innerHTML = title;
};

const setTitleFontSize = function setTitleFontSize(title) {
  const widgetHeight = document.querySelector('.widget-wrapper').offsetHeight;
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

const shortenTitle = function shortenTitle(title) {
  return `${title.substring(0, 27)}...`;
};

const appendDescription = function appendDescription(description) {
  const tooltip = document.querySelector('.tooltip');
  tooltip.innerHTML = description
    ? `<p>${description}</p>`
    : '<p>Keine Beschreibung verfügbar.</p>';
};

const fetchBox = function fetchBox() {
  return fetchJSON(API_BASE_URL).then(function(box) {
    appendTitle(box.name);
    appendDescription(box.description);

    return box;
  });
};

const fetchJSONCache = Object.create(null);

const fetchJSON = function fetchJSON(url) {
  if (fetchJSONCache[url] && fetchJSONCache[url].ts + 10000 > Date.now()) {
    return Promise.resolve(fetchJSONCache[url].json);
  }

  return fetch(url).then(res => res.json()).then(json => {
    fetchJSONCache[url] = {
      ts: Date.now(),
      json
    };

    return json;
  });
};

const createSensorDivs = function createSensorDivs(sensors) {
  const sensorTab = document.querySelector('.widget-list[data-tab="sensors"]');
  for (const sensor of sensors) {
    const newDiv = document.createElement('div');
    newDiv.className = 'innerDiv';
    newDiv.id = `widget-sensor-${sensor._id}`;
    fillDiv(newDiv, sensor);
    sensorTab.appendChild(newDiv);
  }
};

const fillDiv = function fillDiv(element, data) {
  if (data.lastMeasurement) {
    element.innerHTML = `<h3>${data.title}: <span>${formatDates(new Date(data.lastMeasurement.createdAt))}</span></h3><p><span class="sensorValue">${data.lastMeasurement.value} ${data.unit}</span></p>`;
  } else {
    element.innerHTML = `<h3>${data.title}: </h3><p>Keine Daten verfügbar...</p>`;
  }
};

const updateCurrentSensorValues = function updateCurrentSensorValues() {
  fetchBox().then(sensorData => {
    for (const sensor of sensorData.sensors) {
      const requiredID = `widget-sensor-${sensor._id}`;
      fillDiv(document.getElementById(requiredID), sensor);
    }
  });
};

//Der folgende Code wird nur initiiert, wenn der "History"-Button im Widget angeklickt wird.

const initHistoryArea = function initHistoryArea() {
  fetchBox()
    .then(sensorData => {
      const select = document.getElementById('currentsensorhistory');
      if (select.innerHTML === '') {
        const sensors = sensorData.sensors;
        createAndInsertOptions(sensors, select);
      }
      if (document.getElementById('history-entries').innerHTML === '') {
        //Für den Fall, dass man zum Tab zurückkehrt, nachdem man ihn schon einmal aufgerufen hat
        insertOldEntries(sensorData).then(() => {
          clearCurrentInterval();
          currentInterval = setInterval(
            checkForNewMeasurements,
            REFRESH_INTERVAL
          );
        });
      } else {
        clearCurrentInterval();
        currentInterval = setInterval(
          checkForNewMeasurements,
          REFRESH_INTERVAL
        );
      }
    })
    .catch(err => {
      console.log(err);
      document.getElementById(
        'history-entries'
      ).innerHTML = `Es ist ein Fehler aufgetreten: ${err}`;
    });
};

const createAndInsertOptions = function createAndInsertOptions(
  optionArray,
  select
) {
  for (const option of optionArray) {
    const newOption = document.createElement('option');
    const currentOption = option;
    newOption.value = currentOption._id;
    newOption.innerHTML = currentOption.title;
    select.appendChild(newOption);
  }
};

const insertOldEntries = function insertOldEntries(sensorObject) {
  document.getElementById('history-entries').innerHTML = '';
  const sensorID = getSelectedValue('currentsensorhistory');
  const currentSensor = searchSensorinArray(sensorID, sensorObject.sensors);

  return fetchJSON(`${API_BASE_URL}/data/${sensorID}`)
    .then(measurements => {
      if (measurements.length !== 0) {
        let i = 4;
        while (i >= 0) {
          if (measurements[i])
            addHistoryEntry(
              formatDates(new Date(measurements[i].createdAt)),
              measurements[i].value,
              currentSensor.unit
            );
          i--;
        }
      } else {
        document.getElementById('history-entries').innerHTML =
          '<p>Leider gibt es hierfür keine aktuellen Messwerte.</p>';
      }
    })
    .catch(err => {
      console.log(err);
      document.getElementById(
        'history-entries'
      ).innerHTML = `<p>Ein Fehler ist aufgetreten: ${err}</p>`;
    });
};

const getSelectedValue = function getSelectedValue(elementID) {
  const select = document.getElementById(elementID);

  return select.options[select.selectedIndex].value;
};

const searchSensorinArray = function searchSensorinArray(id, arr) {
  return arr.find(s => s._id === id);
};

const addHistoryEntry = function addHistoryEntry(date, value, unit) {
  const newDiv = document.createElement('div');
  newDiv.className = 'innerDiv-history';
  newDiv.innerHTML = `<p><i>${date}</i>: <b>${value}${unit}</b></p>`;
  const historyEntries = document.getElementById('history-entries');
  historyEntries.insertBefore(newDiv, historyEntries.firstChild);
};

const timespanTranslations = {
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

const getTimespanTranslation = function getTimespanTranslation(key, timespan) {
  let strings = timespanTranslations[userLang];
  if (!strings) {
    strings = timespanTranslations.default;
  }

  if (strings.suffix) {
    return `${timespan} ${strings[key]} ${strings.suffix}`;
  }

  return `${strings.prefix} ${timespan} ${strings[key]}`;
};

const formatDates = function formatDates(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
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

const checkForNewMeasurements = function checkForNewMeasurements() {
  fetchBox().then(sensorData => {
    const sensorID = getSelectedValue('currentsensorhistory');
    const currentSensor = searchSensorinArray(sensorID, sensorData.sensors);
    if (currentSensor.lastMeasurement) {
      const parsedDate = formatDates(
        new Date(currentSensor.lastMeasurement.createdAt)
      );
      const firstChild = document.getElementById('history-entries').firstChild;
      if (
        !firstChild ||
        firstChild === null ||
        !firstChild.innerHTML.startsWith(`<p><i>${parsedDate}`)
      ) {
        if (
          firstChild &&
          firstChild !== null &&
          firstChild.innerHTML.startsWith('Leider')
        )
          firstChild.innerHTML = '';
        addHistoryEntry(
          parsedDate,
          currentSensor.lastMeasurement.value,
          currentSensor.unit
        );
      }
    }
  });
};

//Diese Funktionen werden aufgerufen, wenn der Graphen-Tab angeklickt wird.

const initGraphArea = function initGraphArea() {
  Promise.all([
    fetchBox(),
    insertStylesheetWithOnloadListener(
      `${DEPS_BASE_URL}metrics-graphics@2.11.0/dist/metricsgraphics.css`
    ),
    loadJSsync(['d3@4.9.1', 'metrics-graphics@2.11.0'])
  ])
    .then(results => {
      const [sensorData] = results;
      const select = document.getElementById('currentsensorgraph');
      if (select.innerHTML === '') {
        const sensors = sensorData.sensors;
        createAndInsertOptions(sensors, select);
      }
      if (document.getElementById('graph-target').innerHTML === '') {
        drawGraph(sensorData);
      }
    })
    .catch(err => {
      document.querySelector(
        '#graph-target'
      ).innerHTML = `Ein Fehler ist aufgetreten: ${err}`;
    });
};

const drawGraph = function drawGraph(sensorObject) {
  const graphArea = document.getElementById('graph-target');
  graphArea.innerHTML = '';
  const selectedSensor = document.getElementById('currentsensorgraph');
  const sensorID = selectedSensor.options[selectedSensor.selectedIndex].value;
  const currentSensor = searchSensorinArray(sensorID, sensorObject.sensors);
  const url = `${API_BASE_URL}/data/${sensorID}`;
  d3.json(url, function(err, data) {
    if (err || !data || data === null) {
      document.querySelector(
        '#graph-target'
      ).innerHTML = `Ein Fehler ist aufgetreten: ${err}`;
    }
    data = reduceAmountOfDrawnData(data);
    if (data.length !== 0) {
      data = MG.convert.date(
        data,
        'createdAt',
        d3.utcParse('%Y-%m-%dT%H:%M:%S.%L%Z')
      );
      MG.data_graphic({
        data: data,
        full_width: true,
        full_height: true,
        right: 40,
        target: '#graph-target',
        area: false,
        backgroundColor: '#8C001A',
        title: `${currentSensor.title} in ${currentSensor.unit}`,
        xax_count: 3,
        color: '#4EAF47',
        x_accessor: 'createdAt',
        y_accessor: 'value',
        max_y: setMaxGraphValue(data),
        min_y: setMinGraphValue(data),
        mouseover: function(d) {
          const formattedDate = formatDates(new Date(d.createdAt));
          const measurement = `${formattedDate} -> ${d.value} ${currentSensor.unit}`;
          d3.select('#graph-target svg .mg-active-datapoint').text(measurement);
        }
      });
    } else {
      graphArea.innerHTML =
        '<p>Leider gibt es hierfür keine aktuellen Messwerte.</p>';
    }
  });
};

const setMaxGraphValue = function setMaxGraphValue(data) {
  let maximum = 0;
  for (let i = 0; i < data.length; i++) {
    if (parseFloat(data[i].value) > maximum) {
      maximum = parseFloat(data[i].value);
    }
  }

  return maximum > 0 ? maximum * 1.2 : maximum - maximum * 0.2;
};

const setMinGraphValue = function setMinGraphValue(data) {
  let minimum = data[0].value;
  for (let i = 1; i < data.length; i++) {
    if (parseFloat(data[i].value) < minimum) {
      minimum = parseFloat(data[i].value);
    }
  }

  return minimum < 0 ? minimum * 1.2 : minimum - minimum * 0.2;
};

const adjustMarginTopWithParentHeight = function adjustMarginTopWithParentHeight(
  parent,
  child,
  margin
) {
  const elementHeight = parent.offsetHeight;
  if (margin.top) child.style.marginTop = `${margin.top * elementHeight}px`;
  if (margin.bottom)
    child.style.marginBottom = `${margin.bottom * elementHeight}px`;
};

const adjustPaddingTopWithParentHeight = function adjustPaddingTopWithParentHeight(
  parent,
  child,
  padding
) {
  const elementHeight = parent.offsetHeight;
  if (padding.top) child.style.paddingTop = `${padding.top * elementHeight}px`;
  if (padding.bottom)
    child.style.paddingBottom = `${padding.bottom * elementHeight}px`;
};

const insertStylesheetWithOnloadListener = function insertStylesheetWithOnloadListener(
  url
) {
  return new Promise(resolve => {
    const style = document.createElement('style');
    style.textContent = `@import "${url}"`;
    document.head.appendChild(style);
    const onload = setInterval(function() {
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

const applyStylesToWidgetWithJS = function applyStylesToWidgetWithJS() {
  for (const widget of document.querySelectorAll('.widget-list[data-tab]')) {
    adjustMarginTopWithParentHeight(document.querySelector('.widget'), widget, {
      top: 0.12
    });
  }
  adjustPaddingTopWithParentHeight(
    document.querySelector('.widget-header'),
    document.querySelector('.widget-header img'),
    {
      top: 0.1,
      bottom: 0.1
    }
  );
  setFooterLinkHref();
  setFooterFontSize();
};

const loadJSsync = function loadJSsync(urls) {
  const head = document.head || document.getElementsByTagName('head')[0];
  let currIndex = 0;

  return new Promise(function(resolve) {
    const next = function() {
      const scr = document.createElement('script');

      scr.src = `${DEPS_BASE_URL}${urls[currIndex]}`;
      scr.async = false;
      currIndex = currIndex + 1;

      scr.addEventListener('load', function() {
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

const reduceAmountOfDrawnData = function reduceAmountOfDrawnData(data) {
  if (data.length <= 1000) {
    return data;
  }

  const resarr = [];
  const dataLengthString = String(data.length);
  const steps = dataLengthString.substring(0, dataLengthString.length - 3) * 2;
  for (let i = 0; i < data.length; i = i + steps) {
    resarr.push(data[i]);
  }

  return resarr;
};

const setFooterLinkHref = function setFooterLinkHref() {
  const footerLink = document.querySelector('.widget-footer').firstElementChild;
  footerLink.href = `https://opensensemap.org/explore/${senseboxId}`;
};

const setFooterFontSize = function setFooterFontSize() {
  document.querySelector(
    '.widget-footer'
  ).style.fontSize = document.querySelector('.widget').offsetHeight >= 400
    ? '14px'
    : '11px';
};

const initSelectedArea = function initSelectedArea(tabId) {
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

const toggleTab = function toggleTab({ target }) {
  const { tabId } = target.dataset;
  const tab = document.querySelector(`.widget-list[data-tab="${tabId}"]`);

  for (const elem of document.querySelectorAll('.selected-tab')) {
    elem.classList.remove('selected-tab');
  }

  tab.classList.add('selected-tab');
  target.classList.add('selected-tab');
  initSelectedArea(tabId);
};

const initTabs = function initTabs() {
  const tabs = document.querySelectorAll('.widget-tab');
  for (const tab of tabs) {
    tab.addEventListener('click', toggleTab);
  }
};

Promise.all([
  getWidgetHTML(),
  insertStylesheetWithOnloadListener(`${WIDGET_BASE_URL}style.css`)
  //insertStylesheetWithOnloadListener(`./style.css`)
])
  .then(results => {
    const [content] = results;
    widget.innerHTML = content;

    applyStylesToWidgetWithJS();
    initTabs();
    toggleTab({ target: document.querySelector(`[data-tab-id=${initialTab}]`) });
  })
  .catch(err => {
    console.log(err);
    document.querySelector(
      '.widget'
    ).innerHTML = `Es ist ein Fehler aufgetreten: ${err}`;
  });
