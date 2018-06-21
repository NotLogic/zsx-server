<template>
  <div class="wang-wrapper">
    <div id="wang"></div>
    <div id="wang_toolbar" style="border: 1px solid #ccc;background-color:#f1f1f1;"></div>
    <div id="wang_content" style="border: 1px solid #ccc;border-top:none;height: 500px;max-height: 500px;"></div>
  </div> 
</template>
<script>
import wang from 'wangeditor'
export default {
  name: 'wang',
  props: {
    // id: {
    //   type: String,
    //   required: true
    // },
    value: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      myWang: null,
      defaultSetting: {
        uploadImgShowBase64: true,
        zIndex: 100,
        colors: [
          '#000000',
          '#eeece0',
          '#1c487f',
          '#4d80bf',
          '#c24f4a',
          '#8baa4a',
          '#7b5ba1',
          '#46acc8',
          '#f9963b',
          '#ffffff'
        ],
        onchange: (html)=>{
          console.log('html: ',html)
          var vm = this
          vm.$emit('updateContent', html)
        }
      }
    }
  },
  methods: {
    initWang(){
      var vm = this,key
      vm.$nextTick(function(){
        // vm.myWang = new wang('#wang')
        vm.myWang = new wang('#wang_toolbar','#wang_content')
        for(key in vm.defaultSetting){
          vm.myWang.customConfig[key] = vm.defaultSetting[key]
        }
        vm.myWang.create()
      })
    },
    setContent(value) {
      console.log('value: ',value)
      vm.myWang&&vm.myWang.txt.html(value)
    },
    getHtmlContent() {
      vm.myWang&&vm.myWang.txt.html()
    },
    getTextContent() {
      vm.myWang&&vm.myWang.txt.text()
    },
  },
  computed: {

  },
  watch: {
    value (val) {
      console.log('value: ',val)
      var vm = this
      if (vm.myWang) {
        vm.$nextTick(() => {
          vm.setContent(val)
        })
      }
    }
  },
  created(){
    this.initWang()
  },
  mounted(){

  },
}
</script>
<style scoped>

</style>
