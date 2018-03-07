<template>
  <div>
    <textarea class='tinymce-textarea' id="tinymceEditer"></textarea>
    <!-- <Spin fix v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载组件中...</div>
    </Spin> -->
  </div>
</template>

<script>
import tinymce from 'tinymce'
export default {
  name: 'ueditor',
  data () {
    return {
      // spinShow: true
      spinShow: false
    }
  },
  methods: {
    init () {
      let vm = this;
      vm.$nextTick(() => {
        let height = 300;
        tinymce.init({
          selector: '#tinymceEditer',
          branding: false,
          elementpath: false,
          height: height,
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
            // editor.on('init', function (e) {})
            editor.on('keyup', function (e) {
              let content = tinymce.get('tinymceEditer').getContent({format: 'raw'})
              vm.$emit('updateContent', content)
            })
          }
        });
      });
    }
  },
  created () {

  },
  mounted () {
    this.init()
  },
  watch: {},
  computed: {},
  destroyed () {
    tinymce.get('tinymceEditer').destroy();
  }
}
</script>

<style scoped>
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
</style>
