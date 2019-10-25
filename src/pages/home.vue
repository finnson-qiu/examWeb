<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#24292E"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1">科目</el-menu-item>
      <el-submenu index="2" style="width: 70px; margin-right: 15px">
        <template slot="title"><img alt="user" :src = "userLogo" style="width: 100%"></template>
        <el-menu-item index="2-1">用户中心</el-menu-item>
        <el-menu-item index="2-2" @click="logout">注销</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
  import userLogo from "../assets/images/userLogo1.png"
  export default {
    data(){
      return{
        userLogo
      }
    },
    methods: {
      logout(){
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped>
  .el-menu{
    display: flex;
    justify-content: flex-end;
  }
  .el-menu-item{
    width: 80px;
  }
</style>
