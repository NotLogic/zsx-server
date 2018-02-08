<template>
  <div>
    <!-- <textarea class='tinymce-textarea' :id="id"></textarea> -->
    <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
  </div>
</template>

<script>
import tinymce from 'tinymce'
export default {
  name: 'ueditor',
  props: {
    id: String,
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  methods: {
    initUeditor () {
      // http://localhost:8090/themes/modern/theme.js 该文件找不到
      let vm = this
      // let el = '#' + vm.id
      let height = 300
      tinymce.init({
        mode: 'textarea',
        // selector: el,
        selector: '#tinymceEditer',
        theme : 'advanced',
        branding: false,
        elementpath: false,
        height: 300,
        language: 'zh_CN.GB2312',
        menubar: 'edit insert view format table tools',
        plugins: [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
            'searchreplace visualblocks visualchars code fullpage',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons paste textcolor colorpicker textpattern imagetools codesample'
        ],
        toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
        autosave_interval: '20s',
        image_advtab: true,
        table_default_styles: {
            width: '100%',
            borderCollapse: 'collapse'
        },
        setup: function (editor) {
            editor.on('init', function (e) {
              // 设置内容
              let content = vm.content ? vm.content : ''
              tinymce.get(vm.id).setContent(content)
            });
            editor.on('keydown', function (e) {
              // 获取内容
              // tinymce.get(vm.id).getContent()
            });
        }
      })
    }
  },
  mounted () {
    let vm = this
    vm.$nextTick(() => {
      vm.initUeditor()
    })
  },
  destroyed () {
    let vm = this
    // tinymce.get(vm.id).destroy()
  }
}
</script>

<style scoped>

</style>
