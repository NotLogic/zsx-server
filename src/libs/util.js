const util = {
  extend (data) {
    if (data.length && typeof data !== 'string') {
      return [].concat(data)
    } else if (typeof data === 'object') {
      let obj = {}
      for (let key in data) {
        obj[key] = data[key]
      }
      return obj
    } else {
      console.log('扩展数据不是数组或对象')
      return null
    }
  },
  arrDiff (a1, a2) {
    let a = []
    let diff = []
    for (let i = 0; i < a1.length; i++) {
      a[a1[i]] = true
    }
    for (let i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]]
      } else {
        a[a2[i]] = true
      }
    }
    for (var k in a) {
      diff.push(k)
    }
    return diff
  },
  str_repeat (str, num) {
    return new Array(num + 1).join(str)
  },
  isNumber (obj) {
    return obj === +obj
  },
  isString (obj) {
    return obj === obj + ''
  },
  // 前置扩展某方法
  prependFn (fn, prevfn) {
    return function () {
      prevfn.apply(this, arguments)
      return fn.apply(this, arguments)
    }
  },
  // 后置扩展某方法
  appendFn (fn, nextfn) {
    return function () {
      fn.apply(this, arguments)
      return nextfn.apply(this, arguments)
    }
  },
  getChinaJsonByData (chinaData) {
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
  },
  getChinaDataByJson (chinaJson) {
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
  },
  getAddrByCityId (chinaJson, cityId) {
    return [
      chinaJson[cityId.toString().slice(0, 2) + '0000'],
      chinaJson.cityId
    ]
  },
  getAddrByAreaId (chinaJson, areaId) {
    return [
      chinaJson[areaId.toString().slice(0, 2) + '0000'],
      chinaJson[areaId.toString().slice(0, 4) + '00'],
      chinaJson.areaId
    ]
  }
}
export default util
