<template>
  <!-- <div class="wrapper-pagination"> -->
    <Table :columns='columns' :data='data' :height='height' :size='size'></Table>
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
  }
}
</script>

<style scoped>
  /* .wrapper-pagination{
    padding: 15px 0;
  } */
</style>
