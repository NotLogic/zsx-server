<template>
  <Table :columns='columns' :data='data'></Table>
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

</style>
