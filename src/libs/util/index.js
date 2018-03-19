import { appRoutes } from '@/router/routes'
import http from '../http'
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
  http.get('/static/data/address.json').then(res => {
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
// export function 
// export function 
// export function 
