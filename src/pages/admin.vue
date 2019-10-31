<template>
<div>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#24292E"
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-menu-item index="1" @click="changeUser" v-if="judge">用户管理</el-menu-item>
    <el-menu-item index="2" @click="changeSub">科目管理</el-menu-item>
    <el-menu-item index="3" @click="changeSubDetail">科目详细</el-menu-item>
    <el-submenu index="4" style="width: 70px; margin-right: 15px">
      <template slot="title"><img alt="user" :src = "userLogo" style="width: 100%"></template>
      <el-menu-item index="4-1">用户中心</el-menu-item>
      <el-menu-item index="4-2" @click="logout">注销</el-menu-item>
    </el-submenu>
  </el-menu>
  <component :is="comName"></component>
</div>
</template>
<script>
import subjectInfo from "../components/subjectInfo";
import userInfo from "../components/userInfo"
import userLogo from "../assets/images/userLogo1.png"
import {getPermission} from "../api/user";

export default {
    created(){
        //页面加载时调用该函数根据登录页面传递过来的用户名去后端查询该用户是什么权限，不同权限显示不一样
      this.setPermission()
    },
    data(){
        return{
            userLogo,
            comName:'',
            judge: undefined
        }
    },
    components:{
        subjectInfo,
        userInfo
    },
    methods:{
        setPermission(){
            // 获取登录页面传递给该页面的用户名
            const tempVar = {
                userName:this.$route.query.user
            }
            //获取该用户的权限，并且设置某些条目的显示与否，比如超级管理员可以管理用户和科目，普通管理员智能管理科目
            getPermission(tempVar).then(res=>{
                if(res === 1){
                    this.judge = true;
                    this.comName = 'userInfo'
                }
                else {
                    this.judge = false;
                    this.comName = 'subjectInfo'
                }
            })
        },
        //导航栏的点击事件，切换到用户管理
        changeUser(){
            this.comName = "userInfo"
        },
        //导航栏的点击事件，切换到科目管理
        changeSub(){
            this.comName = "subjectInfo"
        },
        // 科目详情管理，暂定
        changeSubDetail(){

        },
        //注销
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
    text-align: center;
  }
</style>
