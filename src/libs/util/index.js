import { appRoutes } from '@/router/routes'
import http from '../http'
import axios from 'axios'
export function deepcopy (source) {
  if (!source) {
    return source;
  }
  let sourceCopy = source instanceof Array ? [] : {};
  for (let item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item];
  }
  return sourceCopy;
}
export function extend (source) {
  if (!source) {
    return source;
  }
  let sourceCopy = source instanceof Array ? [] : {};
  for (let item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? extend(source[item]) : source[item];
  }
  return sourceCopy;
}
export function isNumber (data) {
  return typeof data === 'number' ? true : false
}
export function isString (data) {
  return typeof data === 'string' ? true : false
}
// 前置扩展某方法
export function prependFn (fn, prevfn) {
  return function () {
    prevfn.apply(this, arguments)
    return fn.apply(this, arguments)
  }
}
// 后置扩展某方法
export function appendFn (fn, nextfn) {
  return function () {
    fn.apply(this, arguments)
    return nextfn.apply(this, arguments)
  }
}
export function getChinaJsonByData (chinaData) {
  var data = {
    '100000': {}
  }
  for (var i = 0; i < chinaData.length; i++) {
    data['100000'][chinaData[i].value] = chinaData[i].label
    var cityMap = {}
    for (var j = 0; j < chinaData[i].children.length; j++) {
      cityMap[chinaData[i].children[j].value] = chinaData[i].children[j].label
      var areaMap = {}
      for (var k = 0; k < chinaData[i].children[j].children.length; k++) {
        areaMap[chinaData[i].children[j].children[k].value] = chinaData[i].children[j].children[k].label
      }
      data[chinaData[i].children[j].value] = areaMap
    }
    data[chinaData[i].value] = cityMap
  }
  return data
}
export function getChinaDataByJson (chinaJson) {
  var data = []
  for (var province in chinaJson['100000']) {
    data.push({
      'value': province,
      'label': chinaJson['100000'][province],
      children: []
    })
    for (var city in chinaJson[province]) {
      for (var i = 0; i < data.length; i++) {
        if (city.toString().slice(0, 2) + '0000' === data[i].value) {
          data[i].children.push({
            'value': city,
            'label': chinaJson[province][city],
            children: []
          })
        }
      }
      for (var area in chinaJson[city]) {
        for (var j = 0; j < data.length; j++) {
          for (var k = 0; k < data[j].children.length; k++) {
            if (area.toString().slice(0, 4) + '00' === data[j].children[k].value) {
              data[j].children[k].children.push({
                'value': area,
                'label': chinaJson[city][area],
                children: []
              })
            }
          }
        }
      }
    }
  }
  return data
}
export function getProvinceDataByData(chinaData) {
  let provinceData = []
  let _chinaData = extend(chinaData)
  _chinaData.forEach(item => {
    item.children = []
  })
  provinceData = _chinaData
  return provinceData
}
export function getCityDataByData (chinaData) {
  let cityData = []
  let _chinaData = extend(chinaData)
  _chinaData.forEach(item => {
    item.children.forEach(child => {
      child.children = []
    })
  })
  cityData = _chinaData
  return cityData
}
export function getAddrByCityId (chinaJson, cityId) {
  return [
    chinaJson[cityId.toString().slice(0, 2) + '0000'],
    chinaJson.cityId
  ]
}
export function getAddrByAreaId (chinaJson, areaId) {
  return [
    chinaJson[areaId.toString().slice(0, 2) + '0000'],
    chinaJson[areaId.toString().slice(0, 4) + '00'],
    chinaJson.areaId
  ]
}
// 将省市区数据存入sessionStorage
export function initChinaDataAndJson() {
  axios.get('/static/data/address.json').then(res => {
    let chinaJson = extend(res.data)
    let chinaData = getChinaDataByJson(extend(res.data))
    sessionStorage.chinaJson = JSON.stringify(chinaJson)
    sessionStorage.chinaData = JSON.stringify(chinaData)
  })
}
// 获取省市区文字
export function getProvinceCityArea(addressCodeArr, chinaJson, getAll) {
  let provinceTxt = '',
    cityTxt = '',
    areaTxt = '',
    returnTxt = ''
  if (addressCodeArr.length == 3) {
    provinceTxt = chinaJson['100000'][addressCodeArr[0]]
    cityTxt = chinaJson[addressCodeArr[0]][addressCodeArr[1]]
    areaTxt = chinaJson[addressCodeArr[1]][addressCodeArr[2]]
    returnTxt = getAll ? provinceTxt + cityTxt + areaTxt : areaTxt
  } else if (addressCodeArr.length == 2) {
    provinceTxt = chinaJson['100000'][addressCodeArr[0]]
    cityTxt = chinaJson[addressCodeArr[0]][addressCodeArr[1]]
    returnTxt = getAll ? provinceTxt + cityTxt : cityTxt
  } else {
    returnTxt = chinaJson['100000'][addressCodeArr[0]]
  }
  return returnTxt
}
// 更新面包屑
export function setCurrentPath (vm, name) {
  let currentPathArr = []
  if (name === 'home' || name === 'main') {
    currentPathArr = [{
      title: '首页',
      path: '/',
      name: 'home'
    }]
  } else {
    // 默认属于mainRoutes
    let isMainRoutes = true
    vm.$store.state.routers.forEach(item => {
      if (item.name === 'main') {
        // mainRoutes
        item.children.forEach(child => {
          if (child.name === name) {
            isMainRoutes = true
          }
        })
      } else {
        // appRoutes
        item.children.forEach(child => {
          if (child.name === name) {
            isMainRoutes = false
          }
        })
      }
    })
    if (isMainRoutes) {
      // mainRoutes
      vm.$store.state.routers.forEach(item => {
        if (item.name === 'main') {
          item.children.forEach(child => {
            if (child.name === name) {
              currentPathArr = [{
                title: '首页',
                path: '/',
                name: 'home'
              }, {
                title: child.meta.title,
                path: child.path,
                name: child.name
              }]
            }
          })
        }
      })
    } else {
      // appRoutes
      vm.$store.state.routers.forEach(item => {
        if (item.name !== 'main') {
          item.children.forEach(child => {
            if (child.name === name) {
              currentPathArr = [{
                title: '首页',
                path: '/',
                name: 'home'
              }, {
                title: item.meta.title,
                path: item.path,
                name: item.name
              }, {
                title: child.meta.title,
                path: child.path,
                name: child.name
              }]
            }
          })
        }
      })
    }
  }
  vm.$store.commit('setCurrentPath', currentPathArr)
  sessionStorage.currentPath = JSON.stringify(currentPathArr)
}
// 更新快捷导航
export function openNewPage (vm, name) {
  let isOpened = false
  for (let i = 0; i < vm.$store.state.pageOpenedList.length; i++) {
    if (vm.$store.state.pageOpenedList[i].name === name) {
      isOpened = true
      break
    }
  }
  if (isOpened) {
    // 打开过了
  } else {
    // 未打开: 创建一个标签
    let tag = vm.$store.state.tagsList.filter(item => {
      return item.name === name
    })[0]
    vm.$store.commit('increateTag', tag)
  }
  vm.$store.commit('setCurrentPageName', name)
}
export function toDefaultPage () {}
// 通过子路由name获取父路由name
export function getParentRouterNameByName (childName) {
  let parentName = ''
  if (childName !== 'home') {
    appRoutes.forEach(item => {
      item.children.forEach(child => {
        if (child.name === childName) {
          parentName = item.name
        }
      })
    })
  }
  return parentName
}
// 将扁平的无序的无限分类数据整理成：
// “多维树状（data.unflat）”和“扁平树状（data.flat）”两种数据
export function genTreeData (data, opt) {
    var opt = opt || { idField: 'id', parentField: 'pid', textField: 'name' };
    var idField, textField, parentField, tmpMap = {};
    idField = opt.idField || 'id';
    textField = opt.textField || 'name';
    var unflatten = function () {
      if (opt.parentField) {
        parentField = opt.parentField;
        var i, l, treeData = [];
        for (i = 0, l = data.length; i < l; i++) {
          data[i].label = data[i][textField];
          data[i].value = data[i][idField];
          tmpMap[data[i][idField]] = data[i];
        }
        for (i = 0, l = data.length; i < l; i++) {
          if (tmpMap[data[i][parentField]] && data[i][idField] != data[i][parentField]) {
            if (!tmpMap[data[i][parentField]]['children']) {
              tmpMap[data[i][parentField]]['children'] = [];
            }
            data[i]['text'] = data[i][textField];
            var hasEle = (function () {
              var ret = false;
              tmpMap[data[i][parentField]]['children'].forEach(ele=> {
                if (ele[idField] == data[i][idField]) {
                  ret = true;
                  return false;
                }
              })
              return ret;
            })();
            if (hasEle == false) {
              tmpMap[data[i][parentField]]['children'].push(data[i]);
            }
          } else {
            data[i]['text'] = data[i][textField];
            treeData.push(data[i]);
          }
        }
        return treeData;
      }
      return data;
    };
    // console.log('转换为Select处理的数据unflatten(): ',unflatten())
    var flatten = function () {
      var arr = [];
      var flattenIt = function (data, _level) {
        for (var i = 0; i < data.length; i++) {
          var _levelSub = _level + 1;
          var ele = tmpMap[data[i][idField]];
          ele.level = _level;
          arr.push(ele);
          if ('children' in data[i] && data[i].children.length > 0) {
            flattenIt(data[i].children, _levelSub);
          }
        }
      };
      flattenIt(unflatten(), 0);
      return arr;
    };
    return {
      flat: flatten(),
      unflat: unflatten()
    };
}

// 处理扁平树状数据，为iview的 Select组件 使用
export function formatSelectData (arr) {
  var _arr = [];
  arr.forEach(ele => {
    var _objItem = {};
    var label = ele.name || '';
    var nullStr = '　　';
    if (typeof(ele.level) != 'undefined' && isNaN(ele.level) == false) {
        // 生成多个全角空格
        label = str_repeat(nullStr, ele.level)  + label;
    }
    _objItem = {
        label: label,
        value: String(ele.id),
        id: String(ele.id),
        pId: ele.pId || ''
    };
    _arr.push(_objItem);
  })
  return _arr;
}

export function str_repeat (str, num) {
  return new Array(num + 1).join(str);
}
// 时间戳转时间
export function timestampToTime(timestamp) {
  var timeStr = '' + timestamp;
  var myTimestamp = timeStr.length == 10 ? timestamp*1000 : timestamp;
  var date = new Date(myTimestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = (date.getDate()<10 ? '0'+date.getDate() : date.getDate()) + ' ';
  var h = (date.getHours()<10 ? '0'+date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds()<10 ? '0'+date.getSeconds() : date.getSeconds());
  return Y+M+D+h+m+s;
}
export function isIOS9 () {
  //获取固件版本
  var getOsv = function () {
    var reg = /OS ((\d+_?){2,3})\s/;
    if (navigator.userAgent.match(/iPad/i) || navigator.platform.match(/iPad/i) || navigator.userAgent.match(/iP(hone|od)/i) || navigator.platform.match(/iP(hone|od)/i)) {
        var osv = reg.exec(navigator.userAgent);
        if (osv.length > 0) {
            return osv[0].replace('OS', '').replace('os', '').replace(/\s+/g, '').replace(/_/g, '.');
        }
    }
    return '';
  };
  var osv = getOsv();
  var osvArr = osv.split('.');
  //初始化显示ios9引导
  if (osvArr && osvArr.length > 0) {
      if (parseInt(osvArr[0]) >= 9) {
          return true
      }
  }
  return false
}
export function isWeiXin (){
  var ua = window.navigator.userAgent.toLowerCase();
  return ua.indexOf('micromessenger') != -1 ? true : false
}
export function isIos(){
  var ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/(iPhone|iPod|iPad);?/i) ? true : false
}
export function isAndroid(){
  var ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/android/i) ? true : false
}
export function isQQ(){
  var ua = window.navigator.userAgent.toLowerCase();
  if(ua.indexOf('qq') > -1){
    if(/nettype/i.test(ua)){
      if(/micromessenger/i.test(ua)){
        return true;
      }else{
        return true;
      }
    }else{
      return false;
    }
  }
  return false;
}
// export function 
// export function 
// export function 
// export function 
// export function 
// export function 
// export function 
// export function 
