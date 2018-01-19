<template>
  <Tree :data="treeData" show-checkbox></Tree>
</template>

<script>
export default {
  name: 'tree',
  props: {
    treeData: Array
  }
}
</script>

<style scoped>

</style>
