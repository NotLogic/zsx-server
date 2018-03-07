import { appRoutes } from '@/router/routes'
import http from './http'
const util = {
  extend (data) {
    if (data.length && typeof data !== 'string' || data.length == 0) {
      return [].concat(data)
    } else if (typeof data === 'object') {
      let obj = {}
      for (let key in data) {
        obj[key] = data[key]
      }
      return obj
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
  getProvinceDataByData(chinaData) {
    let provinceData = []
    let util = this
    let _chinaData = util.extend(chinaData)
    _chinaData.forEach(item => {
      item.children = []
    })
    provinceData = _chinaData
    return provinceData
  },
  getCityDataByData (chinaData) {
    let cityData = []
    let _chinaData = util.extend(chinaData)
    _chinaData.forEach(item => {
      item.children.forEach(child => {
        child.children = []
      })
    })
    cityData = _chinaData
    return cityData
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
  },
  // 将省市区数据存入sessionStorage
  initChinaDataAndJson() {
    http.get('/static/data/address.json').then(res => {
      let chinaJson = util.extend(res.data)
      let chinaData = util.getChinaDataByJson(util.extend(res.data))
      sessionStorage.chinaJson = JSON.stringify(chinaJson)
      sessionStorage.chinaData = JSON.stringify(chinaData)
    })
  },
  // 获取省市区文字
  getProvinceCityArea(addressCodeArr, chinaJson, getAll) {
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
  },
  // 更新面包屑
  setCurrentPath (vm, name) {
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
  },
  // 更新快捷导航
  openNewPage (vm, name) {
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
  },
  toDefaultPage () {},
  // 通过子路由name获取父路由name
  getParentRouterNameByName (childName) {
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
  },
  // 过滤请求提交的数据
  pagingFiltData(obj) {
    for (let key in obj) {
      if (typeof obj[key] === 'string' && obj[key].trim() === '') {
        delete obj[key]
      }
    }
    if (obj.data) {
      delete obj.data
    }
    if (obj.url || obj.url === '') {
      delete obj.url
    }
    if (obj.method) {
      delete obj.method
    }
    if (obj.total) {
      delete obj.total
    }
    return obj
  },
  // 编辑和新增提交的数据不同，新增时不提交id
  editAddAjaxData (vm) {
    let ajaxData = {}
    if (vm.currDialog === 'add') {
      for (let key in vm.formDialog) {
        if (key != 'id') {
          ajaxData[key] = vm.formDialog[key]
        }
      }
    } else if (vm.currDialog === 'edit') {
      for (let key in vm.formDialog) {
        ajaxData[key] = vm.formDialog[key]
      }
    }
    return ajaxData
  },
  // 请求页面table数据
  paging (vm) {
    let util = this
    // vm.$http({
    //   url: vm.pager.url,
    //   method: vm.pager.method,
    //   data: util.pagingFiltData(util.extend(vm.pager))
    // }).then(res => {
    //   if (res.data.code == 1) {
    //     let _data = util.extend(res.data.data)
    //     vm.pager.data = _data.data
    //     vm.pager.total = _data.total
    //   }
    // })
  },
  // 修改 pager 请求提交的数据
  changePager (vm, data) {
    let util = this
    let _data = util.extend(data)
    for (let key in _data) {
      vm.pager[key] = _data[key]
    }
    util.paging(vm)
  },
  // ---------- 提交弹窗表单   -----------------
  submitDialogForm (vm, name) {
    vm.$refs[name].validate(function (valid) {
      if (valid) {
        if (vm.initPostDialog) {
          vm.initPostDialog(vm.formDialog)
        }
        let ajaxData = vm.util.editAddAjaxData(vm)
        let ajaxUrl = vm.url[vm.currDialog]
        console.log("ajaxData: ",ajaxData)
        console.log("ajaxUrl: ",ajaxUrl)
        vm.$store.dispatch('submitDialogForm', {
          'vm': vm,
          'name': name
        })
      }
    })
  }
}
export default util
