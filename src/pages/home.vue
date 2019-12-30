<template>
  <div>
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#24292E"
      text-color="#fff"
      active-text-color="#ffd04b"
      :default-active="myIndex">
      <el-menu-item index="1" @click="changeQuesManage">试题管理</el-menu-item>
      <el-menu-item index="2" @click="changeGenePaper">生成试卷</el-menu-item>
<!--      <el-menu-item index="3" @click="changePaper">试卷中心</el-menu-item>-->
      <el-submenu index="4" style="width: 70px; margin-right: 15px">
        <template slot="title"><img alt="user" :src = "userLogo" style="width: 100%"></template>
<!--        <el-menu-item index="4-1">用户中心</el-menu-item>-->
        <el-menu-item index="4-3" v-if="nowPermission === 2" @click="changeAdmin">管理员中心</el-menu-item>
        <el-menu-item index="4-2" @click="logout">注销</el-menu-item>
      </el-submenu>
    </el-menu>
    <component :is="comName" :data="nowSubjectNo"></component>
  </div>
</template>
<script>
  import userLogo from "../assets/images/userLogo1.png"
  import questionManage from "../components/questionManage";
  import genePaper from "../components/genePaper";
  import {getOneUserInfo} from "../api/user";

  export default {
      data(){
        return{
          userLogo,
          nowPermission: undefined,
          comName: undefined,
          nowSubjectNo: undefined,
          nowUser: undefined,
          myIndex: '1'
        }
      },
      //vue向动态组件传参
      components:{
        questionManage,
        genePaper
      },
      created(){
        this.setInfo()
      },
      methods: {
          setInfo(){
              this.nowUser = this.$route.query.user;
              // 获取登录页面传递给该页面的用户名
              const tempVar = {
                  userName:this.$route.query.user
              };
              //获取该用户所授科目
              getOneUserInfo(tempVar).then(res=>{
                  this.nowSubjectNo = res.subjectNo;
                  this.nowPermission = res.permission
              });
              setTimeout(()=>{
                  this.comName = 'questionManage'
              },200)
          },
          changeAdmin(){
              this.$router.push({path:'/admin',query: {user:this.nowUser}});
              this.$message({
                  message: '欢迎进入管理员界面',
                  type: 'success',
                  center: true
              })
          },
          changeQuesManage(){
              this.comName = 'questionManage'
          },
          changeGenePaper(){
              this.comName = 'genePaper'
          },
          changePaper(){

          },
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
