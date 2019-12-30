<template>
  <div class="root">
    <div class="logoBox"><img alt="logo" :src="logo" style="width: 70%; height:8%"></div>
    <div class="loginMode">
        <div class="loginLogoBox"><img alt="login" :src="loginLogo"></div>
      <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="userName">
          <el-col :span="8">
            <el-input id="userName" v-model="userForm.userName" placeholder="请输入帐号">
              <template slot="prepend">帐号</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="password">
          <el-col :span="8">
            <el-input id="password" v-model="userForm.password" type="password" show-password placeholder="请输入密码">
              <template slot="prepend">密码</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="8">
            <el-button id="login" v-on:click="login" style="width:100%" type="primary">登录</el-button>
          </el-col>
        </el-form-item>
      <el-form-item>
        <el-col :span="6" style="text-align: left">&nbsp;<router-link  :to="{path:'/register'}" style="color: aquamarine" id="toRegister">现在注册</router-link>></el-col>
        <el-col :span="6" style="text-align: left">&nbsp;&nbsp;<router-link  :to="{path:'/forget'}" style="color: aquamarine" id="toChangePa">忘记密码</router-link>></el-col>
      </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {login} from "../api/user";
  import logo from "../assets/images/logoblack.png"
  import loginLogo from "../assets/images/loginLogoBlack.png"
export default {
  data(){
      // 规则，用于前端验证用户名是否合法
    const validateUserName = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请输入用户名'))
      }
      else if(value.length > 16){
        callback(new Error('用户名不大于16个字符'))
      }
      else {
        callback()
      }
    };
    //规则，用于前端验证密码是否合法
    const validatePassword = (rule, value, callback) => {
      if(value === ''){
        callback(new Error('请输入密码'))
      }
      else if(value.length > 16){
        callback(new Error('密码不大于16位字符'))
      }
      else {
        callback()
      }
    }
    return{
      logo,
      loginLogo,
      userForm:{
        userName: '',
        password: ''
      },
      rules:{
        userName: [
          {validator: validateUserName, trigger: 'blur'}
        ],
        password: [
          {validator: validatePassword, trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
      // 用户登录，后端返回数字，0代表用户不存在，1，2，3登录成功，并且1为超级管理员，2为管理员，3为普通用户
      login(){
          // 前端设置规则验证，只有前端规则验证通过才会向后端发送请求
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            login(this.userForm).then(res=> {
              if(res === 1 || res === 2 || res === 3){
                  if(res === 1) {
                      this.$message({
                          message: '欢迎您，超级管理员 ' + this.userForm.userName,
                          type: 'success',
                          center: true
                      });
                      this.$router.push({path:'/admin',query: {user:this.userForm.userName}});
                  }
                  else {
                      this.$message({
                          message: '登录成功，欢迎您 '+ this.userForm.userName,
                          type: 'success',
                          center: true
                      });
                      this.$router.push({path:'/home',query: {user:this.userForm.userName}})
                  }
              }
              else if(res === 0){
                this.$message({
                  message: '该用户不存在',
                  type: 'error',
                  center: true
                });
              }
              else {
                this.$message({
                  message: '用户名或密码错误',
                  type: 'error',
                  center: true
                });
              }
            })
          } else {
            this.$message({
              message: '登录失败,请填写完整登录信息',
              type: 'error',
              center: true
            });
            return false;
          }
        });
      }
  }
}
</script>

<style scoped>
.loginMode{
  margin-left: 35%;
  margin-top: 6%;
}
.textBox{
  margin-top: 5px;
  margin-left: 40%;
  margin-right: 40%;
  height: 20px;
}
  .logoBox{
    margin-left: 23%;
    margin-top: 3%;
  }
  .loginLogoBox{
    margin-left: 14%;
    margin-bottom: 40px;
  }
  .root{
    background: #1B253A url("../assets/images/beach.jpg") no-repeat;
    width: calc(100vw);
    height: calc(100vh);
    background-size: cover;
    overflow: hidden;
    position: relative;
  }
</style>
