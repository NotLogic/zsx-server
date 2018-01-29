<template>
  <Breadcrumb >
    <template v-for="(item, index) in currentPath">
      <BreadcrumbItem v-if="currentPath.length === 3 && index === 1" :key="item.name">{{item.title}}</BreadcrumbItem>
      <BreadcrumbItem v-else :to="{name: item.name}" :key="item.name">{{item.title}}</BreadcrumbItem>
    </template>
  </Breadcrumb>
</template>

<script>
export default {
  name: 'breadcrumbNav',
  props: {
    currentPath: Array
  }
}
</script>

<style scoped>

</style>
