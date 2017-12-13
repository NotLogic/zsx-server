<template>
  <div class="zsx-main" id="main">
    主页
    <router-link :to="{name: 'login'}">去登陆</router-link>
    <router-link :to="{name: 'resource'}">资源管理</router-link>
    <router-link :to="{name: 'role'}">role</router-link>
    <router-link :to="{name: 'user'}">user</router-link>
    <router-link :to="{name: 'workClass'}">workClass</router-link>
    <router-link :to="{name: 'workMatter'}">workMatter</router-link>
    <router-link :to="{name: 'policy_child'}">policy</router-link>
    <router-link :to="{name: 'gover_child'}">gover</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>

</style>
