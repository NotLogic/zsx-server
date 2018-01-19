<template>
  <div class="home">
    home
    <router-link :to="{name: 'main'}">去主页</router-link>
    这里展示一些统计信息
  </div>
</template>

<script>
  export default {
    name: 'home'
  }
</script>

<style scoped>

</style>
