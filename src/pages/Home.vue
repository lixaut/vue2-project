<template>
  <div class="home-container">
    home 组件
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>