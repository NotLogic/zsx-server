<template>
  <Breadcrumb >
    <BreadcrumbItem v-for="item in currentPath" :to="{name: item.name}" :key="item.name">{{item.title}}</BreadcrumbItem>    
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
