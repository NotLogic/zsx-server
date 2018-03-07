<template>
  <div>
    <script id="ueditor" type="text/plain"></script>
  </div>
</template>

<script>
  export default {
    name: 'ueditor',
    prop: {
      config: Object
    },
    data () {
      return {
        editor: null,
        defaultConfig: {
          // toolbars: [
          //   ['fullscreen', 'source','|', 'undo', 'redo','|','bold', 'italic', 'underline', 'fontborder', 'strikethrough',
          //     '|','superscript','subscript','|', 'forecolor', 'backcolor','|', 'removeformat','|', 'insertorderedlist', 'insertunorderedlist',
          //     '|','selectall', 'cleardoc','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify','|',
          //     'link','unlink']
          // ],
          // autoHeightEnabled: false,
          // autoFloatEnabled: true,　　//是否工具栏可浮动
          // initialContent:'请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
          // autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
          initialFrameWidth: null,
          initialFrameHeight: 300,
          // BaseUrl: '',
          // UEDITOR_HOME_URL: 'static/ueditor/'
        }
      }
    },
    methods: {
      getContent: function(){
        return this.editor.getContent()
      }
    },
    mounted () {
      this.editor = UE.getEditor('ueditor', this.defaultConfig)
      window.ue = this.editor
    },
    destoryed() {
      this.editor.destory()
    },
  }
</script>

<style scoped>

</style>
