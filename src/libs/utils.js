const utils = {
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
      return ''
    }
  }
}
export default utils
