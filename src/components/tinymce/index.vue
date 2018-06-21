<template>
  <div>
    <textarea class='tinymce-textarea' :id="tinymceId"></textarea>
  </div>
</template>

<script>
import tinymce from 'tinymce'
export default {
  name: 'tinymce',
  props: {
    id: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      default: 300
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      hasInit: false,
      hasChange: false,
      tinymceId: this.id
    }
  },
  methods: {
    initTinymce () {
      let vm = this;
      vm.$nextTick(() => {
        tinymce.init({
          selector: `#${this.tinymceId}`,
          branding: false,
          elementpath: false,
          height: vm.height,
          language: 'zh_CN.GB2312',
          // menubar: 'edit insert view format table tools',
          menubar: 'file edit insert view format table',
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
          init_instance_callback: editor => {
            if (vm.value) {
              editor.setContent(vm.value)
            }
            vm.hasInit = true
            editor.on('NodeChange Change KeyUp SetContent', () => {
              vm.hasChange = true
              vm.$emit('updateContent', editor.getContent())
            })
          }
        });
      });
    },
    destroyTinymce () {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent({format: 'raw'})
    }
  },
  watch: {
    value (val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val))
      }
    }
  },
  mounted () {
    this.initTinymce()
  },
  activated() {
    this.initTinymce()
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed () {
    this.destroyTinymce()
  }
}
</script>
