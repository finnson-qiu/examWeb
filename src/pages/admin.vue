<template>
<div>
  <el-menu
    class="el-menu-demo"
    mode="horizontal"
    background-color="#24292E"
    text-color="#fff"
    active-text-color="#ffd04b"
    :default-active="myIndex">
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
import subjectInfo from "../components/subjectInfo"
import userInfo from "../components/userInfo"
import subjectDetail from "../components/subjectDetail";
import userLogo from "../assets/images/userLogo1.png"
import {getOneUserInfo} from "../api/user"

export default {
    created(){
        //页面加载时调用该函数根据登录页面传递过来的用户名去后端查询该用户是什么权限，不同权限显示不一样
      this.setPermission()
    },
    mounted(){
    },
    data(){
        return{
            userLogo,
            comName:'',
            judge: undefined,
            myIndex:'',
            nowPermission: undefined
        }
    },
    components:{
        subjectInfo,
        userInfo,
        subjectDetail
    },
    methods:{
        setPermission(){
            // 获取登录页面传递给该页面的用户名
            const tempVar = {
                userName:this.$route.query.user
            };
            //获取该用户的权限，并且设置某些条目的显示与否，比如超级管理员可以管理用户和科目，普通管理员智能管理科目
            getOneUserInfo(tempVar).then(res=>{
                this.nowPermission = res.permission
                if(res.permission === 1){
                    this.judge = true;
                    this.comName = 'userInfo';
                    this.myIndex = '1'
                }
                else {
                    this.judge = false;
                    this.comName = 'subjectInfo';
                    this.myIndex = '2'
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
            this.comName = "subjectDetail"
        },
        //注销
        logout(){
            if(this.nowPermission === 1) {
                this.$router.go(-1)
            }
            else {
                this.$router.go(-2)
            }
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
