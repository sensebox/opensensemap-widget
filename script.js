'use strict';var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break}}catch(err){_d=true;_e=err}finally{try{if(!_n&&_i['return'])_i['return']()}finally{if(_d)throw _e}}return _arr}return function(arr,i){if(Array.isArray(arr)){return arr}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i)}else{throw new TypeError('Invalid attempt to destructure non-iterable instance')}}}();var widget=document.querySelector('[data-sensebox-id]');var senseboxId=widget.dataset.senseboxId;var WIDGET_BASE_URL='https://sensebox.de/opensensemap-widget/';var REFRESH_INTERVAL=150000;var API_BASE_URL='https://api.opensensemap.org/boxes/'+senseboxId;var DEPS_BASE_URL='https://unpkg.com/';var getWidgetHTML=function getWidgetHTML(){return fetch(new Request(WIDGET_BASE_URL+'widget.html',{method:'GET',mode:'cors'})).then(function(res){return res.text()})};var initSensorArea=function initSensorArea(){fetchBox().then(function(sensorData){var sensors=sensorData.sensors;if(document.querySelector('#sensors').innerHTML===''){createSensorDivs(sensors)}setInterval(updateCurrentSensorValues,REFRESH_INTERVAL)})};var appendTitle=function appendTitle(title){var titleArea=document.querySelector('#titlearea');var titleTooltip=document.querySelector('.titletooltip');titleTooltip.innerHTML=title;titleArea.style.fontSize=setTitleFontSize(title);if(title.length>30){title=shortenTitle(title)}titleArea.innerHTML=title};var setTitleFontSize=function setTitleFontSize(title){var widgetHeight=document.querySelector('.widget-wrapper').offsetHeight;if(widgetHeight>=300){if(title.length>15){return'16px'}return'25px'}if(title.length>15){return'12px'}return'15px'};var shortenTitle=function shortenTitle(title){return title.substring(0,27)+'...'};var appendDescription=function appendDescription(description){var tooltip=document.querySelector('.tooltip');tooltip.innerHTML=description?'<p>'+description+'</p>':'<p>Keine Beschreibung verf\xFCgbar.</p>'};var fetchBox=function fetchBox(){return fetchJSON(API_BASE_URL).then(function(box){appendTitle(box.name);appendDescription(box.description);return box})};var fetchJSON=function fetchJSON(url){return fetch(url).then(function(res){return res.json()})};var createSensorDivs=function createSensorDivs(sensors){var sensorTab=document.querySelector('#sensors');var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=sensors[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var sensor=_step.value;var newDiv=document.createElement('div');newDiv.className='innerDiv';newDiv.id='widget-sensor-'+sensor._id;fillDiv(newDiv,sensor);sensorTab.appendChild(newDiv)}}catch(err){_didIteratorError=true;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}};var fillDiv=function fillDiv(element,data){if(data.lastMeasurement){element.innerHTML='<h3>'+data.title+': </h3><p><i>'+formatDates(new Date(data.lastMeasurement.createdAt))+'</i>: <span class="sensorValue">'+data.lastMeasurement.value+' '+data.unit+'</span></p>'}else{element.innerHTML='<h3>'+data.title+': </h3><p>Keine Daten verf\xFCgbar...</p>'}};var updateCurrentSensorValues=function updateCurrentSensorValues(){fetchBox().then(function(sensorData){var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=sensorData.sensors[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var sensor=_step2.value;var requiredID='widget-sensor-'+sensor._id;fillDiv(document.getElementById(requiredID),sensor)}}catch(err){_didIteratorError2=true;_iteratorError2=err}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return()}}finally{if(_didIteratorError2){throw _iteratorError2}}}})};var initHistoryArea=function initHistoryArea(){fetchBox().then(function(sensorData){var select=document.getElementById('currentsensorhistory');if(select.innerHTML===''){var sensors=sensorData.sensors;createAndInsertOptions(sensors,select)}if(document.getElementById('history-entries').innerHTML===''){insertOldEntries(sensorData).then(function(){return setInterval(checkForNewMeasurements,REFRESH_INTERVAL)})}else{setInterval(checkForNewMeasurements,REFRESH_INTERVAL)}}).catch(function(err){console.log(err);document.getElementById('history-entries').innerHTML='Es ist ein Fehler aufgetreten: '+err})};var createAndInsertOptions=function createAndInsertOptions(optionArray,select){var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=optionArray[Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){var option=_step3.value;var newOption=document.createElement('option');var currentOption=option;newOption.value=currentOption._id;newOption.innerHTML=currentOption.title;select.appendChild(newOption)}}catch(err){_didIteratorError3=true;_iteratorError3=err}finally{try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return()}}finally{if(_didIteratorError3){throw _iteratorError3}}}};var insertOldEntries=function insertOldEntries(sensorObject){document.getElementById('history-entries').innerHTML='';var sensorID=getSelectedValue('currentsensorhistory');var currentSensor=searchSensorinArray(sensorID,sensorObject.sensors);return fetchJSON(API_BASE_URL+'/data/'+sensorID).then(function(measurements){if(measurements.length!==0){var i=4;while(i>=0){if(measurements[i])addHistoryEntry(formatDates(new Date(measurements[i].createdAt)),measurements[i].value,currentSensor.unit);i--}}else{document.getElementById('history-entries').innerHTML='<p>Leider gibt es hierf\xFCr keine aktuellen Messwerte.</p>'}}).catch(function(err){console.log(err);document.getElementById('history-entries').innerHTML='<p>Ein Fehler ist aufgetreten: '+err+'</p>'})};var getSelectedValue=function getSelectedValue(elementID){var select=document.getElementById(elementID);return select.options[select.selectedIndex].value};var searchSensorinArray=function searchSensorinArray(id,arr){return arr.find(function(s){return s._id===id})};var addHistoryEntry=function addHistoryEntry(date,value,unit){var newDiv=document.createElement('div');newDiv.className='innerDiv-history';newDiv.innerHTML='<p><i>'+date+'</i>: <b>'+value+unit+'</b></p>';var historyEntries=document.getElementById('history-entries');historyEntries.insertBefore(newDiv,historyEntries.firstChild)};var formatDates=function formatDates(date){var monthNames=['Januar','Februar','M\xE4rz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];var day=date.getDate();var monthIndex=date.getMonth();return day+'. '+monthNames[monthIndex]+', '+fillWithZero(date.getHours())+':'+fillWithZero(date.getMinutes())};var fillWithZero=function fillWithZero(number){return String(number).length===1?'0'+number:number};var checkForNewMeasurements=function checkForNewMeasurements(){fetchBox().then(function(sensorData){var sensorID=getSelectedValue('currentsensorhistory');var currentSensor=searchSensorinArray(sensorID,sensorData.sensors);if(currentSensor.lastMeasurement){var parsedDate=formatDates(new Date(currentSensor.lastMeasurement.createdAt));var firstChild=document.getElementById('history-entries').firstChild;if(!firstChild||firstChild===null||!firstChild.innerHTML.startsWith('<p><i>'+parsedDate)){if(firstChild&&firstChild!==null&&firstChild.innerHTML.startsWith('Leider'))firstChild.innerHTML='';addHistoryEntry(parsedDate,currentSensor.lastMeasurement.value,currentSensor.unit)}}})};var initGraphArea=function initGraphArea(){Promise.all([fetchBox(),insertStylesheetWithOnloadListener(DEPS_BASE_URL+'metrics-graphics@2.11.0/dist/metricsgraphics.css'),loadJSsync(['d3@4.9.1','metrics-graphics@2.11.0'])]).then(function(results){var _results=_slicedToArray(results,1),sensorData=_results[0];var select=document.getElementById('currentsensorgraph');if(select.innerHTML===''){var sensors=sensorData.sensors;createAndInsertOptions(sensors,select)}if(document.getElementById('graph-target').innerHTML===''){drawGraph(sensorData)}}).catch(function(err){document.querySelector('#graph-target').innerHTML='Ein Fehler ist aufgetreten: '+err})};var drawGraph=function drawGraph(sensorObject){var graphArea=document.getElementById('graph-target');graphArea.innerHTML='';var selectedSensor=document.getElementById('currentsensorgraph');var sensorID=selectedSensor.options[selectedSensor.selectedIndex].value;var currentSensor=searchSensorinArray(sensorID,sensorObject.sensors);var url=API_BASE_URL+'/data/'+sensorID;d3.json(url,function(err,data){if(err||!data||data===null){document.querySelector('#graph-target').innerHTML='Ein Fehler ist aufgetreten: '+err}data=reduceAmountOfDrawnData(data);if(data.length!==0){data=MG.convert.date(data,'createdAt',d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ'));MG.data_graphic({data:data,full_width:true,full_height:true,right:40,target:'#graph-target',area:false,backgroundColor:'#8C001A',title:currentSensor.title+' in '+currentSensor.unit,xax_count:3,color:'#8C001A',x_accessor:'createdAt',y_accessor:'value',max_y:setMaxGraphValue(data),min_y:setMinGraphValue(data),mouseover:function mouseover(d){var formattedDate=formatDates(new Date(d.createdAt));var measurement=formattedDate+' -> '+d.value+' '+currentSensor.unit;d3.select('#graph-target svg .mg-active-datapoint').text(measurement)}})}else{graphArea.innerHTML='<p>Leider gibt es hierf\xFCr keine aktuellen Messwerte.</p>'}})};var setMaxGraphValue=function setMaxGraphValue(data){var maximum=0;for(var i=0;i<data.length;i++){if(parseFloat(data[i].value)>maximum){maximum=parseFloat(data[i].value)}}return maximum>0?maximum*1.2:maximum-maximum*0.2};var setMinGraphValue=function setMinGraphValue(data){var minimum=data[0].value;for(var i=1;i<data.length;i++){if(parseFloat(data[i].value)<minimum){minimum=parseFloat(data[i].value)}}return minimum<0?minimum*1.2:minimum-minimum*0.2};var adjustMarginTopWithParentHeight=function adjustMarginTopWithParentHeight(parent,child,margin){var elementHeight=parent.offsetHeight;if(margin.top)child.style.marginTop=margin.top*elementHeight+'px';if(margin.bottom)child.style.marginBottom=margin.bottom*elementHeight+'px'};var adjustPaddingTopWithParentHeight=function adjustPaddingTopWithParentHeight(parent,child,padding){var elementHeight=parent.offsetHeight;if(padding.top)child.style.paddingTop=padding.top*elementHeight+'px';if(padding.bottom)child.style.paddingBottom=padding.bottom*elementHeight+'px'};var insertStylesheetWithOnloadListener=function insertStylesheetWithOnloadListener(url){return new Promise(function(resolve){var style=document.createElement('style');style.textContent='@import "'+url+'"';document.head.appendChild(style);var onload=setInterval(function(){try{style.sheet.cssRules;clearInterval(onload);resolve()}catch(e){}},10)})};var applyStylesToWidgetWithJS=function applyStylesToWidgetWithJS(){var widgetLists=['#graph','#sensors','#history'];var _iteratorNormalCompletion4=true;var _didIteratorError4=false;var _iteratorError4=undefined;try{for(var _iterator4=widgetLists[Symbol.iterator](),_step4;!(_iteratorNormalCompletion4=(_step4=_iterator4.next()).done);_iteratorNormalCompletion4=true){var _widget=_step4.value;var currentWidgetList=document.querySelector(_widget);adjustMarginTopWithParentHeight(document.querySelector('.widget'),currentWidgetList,{top:0.12})}}catch(err){_didIteratorError4=true;_iteratorError4=err}finally{try{if(!_iteratorNormalCompletion4&&_iterator4.return){_iterator4.return()}}finally{if(_didIteratorError4){throw _iteratorError4}}}adjustPaddingTopWithParentHeight(document.querySelector('.widget-header'),document.querySelector('.widget-header img'),{top:0.1,bottom:0.1});setFooterLinkHref();setFooterFontSize()};var loadJSsync=function loadJSsync(urls){var head=document.head||document.getElementsByTagName('head')[0];var currIndex=0;return new Promise(function(resolve){var next=function next(){var scr=document.createElement('script');scr.src=''+DEPS_BASE_URL+urls[currIndex];scr.async=false;currIndex=currIndex+1;scr.addEventListener('load',function(){if(currIndex!==urls.length){return next()}return resolve()});head.insertBefore(scr,head.firstChild)};next()})};var reduceAmountOfDrawnData=function reduceAmountOfDrawnData(data){var resarr=[];if(data.length>=1000){var dataLengthString=String(data.length);var steps=dataLengthString.substring(0,dataLengthString.length-3)*2;for(var i=0;i<data.length;i=i+steps){resarr.push(data[i])}}else{resarr=data}return resarr};var setFooterLinkHref=function setFooterLinkHref(){var footerLink=document.querySelector('.widget-footer').firstElementChild;footerLink.href='https://opensensemap.org/explore/'+senseboxId};var setFooterFontSize=function setFooterFontSize(){document.querySelector('.widget-footer').style.fontSize=document.querySelector('.widget').offsetHeight>=400?'14px':'11px'};var initArea=function initArea(){var hash=window.location.hash;switch(hash){case'#graph':initGraphArea();break;case'#history':initHistoryArea();break;case'#sensors':initSensorArea();break;default:initSensorArea();}};Promise.all([getWidgetHTML(),insertStylesheetWithOnloadListener(WIDGET_BASE_URL+'style.css')]).then(function(results){var _results2=_slicedToArray(results,1),content=_results2[0];widget.innerHTML=content;applyStylesToWidgetWithJS();initArea()}).catch(function(err){console.log(err);document.querySelector('.widget').innerHTML='Es ist ein Fehler aufgetreten: '+err});window.onhashchange=initArea;