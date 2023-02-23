<template>
  <div id="HomeContainer">
    <el-button type="info" @click="exit">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    exit () {
      // 清空token
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
