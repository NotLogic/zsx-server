<template>
  <!-- <div class="wrapper-pagination"> -->
    <Table :columns='columns' :data='data' :height='height' :size='size' @on-selection-change="onSelectionChange"></Table>
  <!-- </div>   -->
</template>

<script>
export default {
  name: 'mainTable',
  props: {
    columns: Array,
    data: Array,
    height: [Number, String],
    size: String
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
