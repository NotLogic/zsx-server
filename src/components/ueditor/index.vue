<template>
  <div class="ueditor">
    
  </div>
</template>

<script>
export default {
  name: 'ueditor',
  props: {
    id: String,
    content: String
  },
  data () {
    return {}
  },
  methods: {
    initUeditor () {
      let vm = this
    }
  },
  mounted () {
    this.initUeditor()
  }
}
</script>

<style scoped>

</style>
