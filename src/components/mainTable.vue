<template>
  <!-- <div class="wrapper-pagination"> -->
    <Table :loading="loading" :columns='columns' :data='data' :height='height' :size='size' @on-selection-change="onSelectionChange"></Table>
  <!-- </div>   -->
</template>

<script>
export default {
  name: 'mainTable',
  props: {
    columns: Array,
    data: Array,
    height: [Number, String],
    size: String,
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    onSelectionChange (selection) {
      this.$emit('updateSelect', selection)
    }
  }
}
</script>

<style scoped>
  /* .wrapper-pagination{
    padding: 15px 0;
  } */
</style>
