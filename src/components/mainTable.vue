<template>
  <!-- <div class="wrapper-pagination"> -->
    <Table :columns='columns' :data='data'></Table>
  <!-- </div>   -->
</template>

<script>
export default {
  name: 'mainTable',
  props: {
    columns: Array,
    data: Array
  }
}
</script>

<style scoped>
  /* .wrapper-pagination{
    padding: 15px 0;
  } */
</style>
