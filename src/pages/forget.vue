<template>
  <div class="rootBox">
    <div class="logoBox"><img alt="logo" :src="logo" style="width: 70%; height:8%"></div>
    <div class="forgetBox">
      <div class="forLogo"><img alt="register" :src="forLogo" style="width: 80%"></div>
      <el-form :model="forgetForm" status-icon :rules="rules" ref="forgetForm" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="userName">
          <el-col :span="9">
            <el-input id="userName" v-model="forgetForm.userName" placeholder="请输入帐号">
              <template slot="prepend">&nbsp;&nbsp;用户名&nbsp;&nbsp;</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="password">
          <el-col :span="9">
            <el-input id="password" v-model="forgetForm.password" placeholder="请输入新密码" type="password" show-password>
              <template slot="prepend">&nbsp;&nbsp;新密码&nbsp;&nbsp;</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="comPassword">
          <el-col :span="9">
            <el-input id="comPassword" v-model="forgetForm.comPassword" placeholder="请再次输入新密码" type="password" show-password>
              <template slot="prepend">确认密码</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="idNumber">
          <el-col :span="9">
            <el-input id="idNumber" v-model="forgetForm.idNumber" placeholder="请输入身份证号验证身份">
              <template slot="prepend">身份证号</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="2" style="margin-left: 3px">
            <el-button id="chPassword" v-on:click="change" style="width:100%" type="primary">修改</el-button>
          </el-col>
          <el-col :span="2" style="margin-right: 10px; margin-left: 180px">
            <el-button id="cancel" v-on:click="cancel" style="width:100%" type="primary">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import logo from "../assets/images/logoblack.png"
  import forLogo from "../assets/images/forLogoBlack.png"
  import {changePa} from "../api/user";

  export default {
    data(){
      const validateUserName = (rule,value,callback) =>{
        if(value === ''){
          callback(new Error('请输入用户名'))
        }
        else if(value.length > 16){
          callback(new Error('用户名不大于16个字符'))
        }
        else {
          callback()
        }
      }
      const validatePassword = (rule,value,callback) =>{
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if(value.length > 16){
            callback(new Error('密码不大于16个字符'))
          }
          else {
            callback();
          }
        }
      }
      const validateComPassword = (rule,value,callback) =>{
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.forgetForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      const validateId = (rule,value,callback) =>{
        if(value === ''){
          callback(new Error('请输入身份证号'));
        }else if(value.length !== 18){
          callback(new Error('身份证号码位数不正确'));
        }
        else{
          callback()
        }
      }
      return{
        logo,
        forLogo,
        forgetForm:{
          userName:'',
          password:'',
          comPassword:'',
          idNumber:''
        },
        rules:{
          userName:[
            {validator: validateUserName, trigger: 'blur'}
          ],
          password:[
            {validator: validatePassword, trigger: 'blur'}
          ],
          comPassword:[
            {validator: validateComPassword, trigger:'blur'}
          ],
          idNumber:[
            {validator: validateId, trigger:'blur'}
          ]
        }
      }
    },
    methods:{
      change(){
        this.$refs['forgetForm'].validate((valid) =>{
          if(valid){
            changePa(this.forgetForm).then(res =>{
              if (res === 1) {
                this.$message({
                  message: '修改密码成功',
                  type: 'success',
                  center: true
                });
                this.$router.go(-1)
              }else if(res === -2){
                this.$message({
                  message: '用户不存在',
                  type: 'error',
                  center: true
                });
              }else if (res === -1) {
                this.$message({
                  message: '身份证号与用户不匹配',
                  type: 'error',
                  center: true
                });
              }else {
                this.$message({
                  message: '修改失败',
                  type: 'error',
                  center: true
                });
              }
            })
          }else {
            this.$message({
              message: '修改失败,请填写完整修改信息',
              type: 'error',
              center: true
            });
            return false;
          }
        })
      },
      cancel(){
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped>
  .logoBox{
    margin-left: 22%;
    margin-top: 3%;
  }
  .forLogo{
    margin-left: 9%;
    margin-bottom: 40px;
  }
  .forgetBox{
    margin-left: 33%;
    margin-top: 4%;
  }
  .el-row {
    margin-top: 30px;
    margin-left: 10%;
  }
  .rootBox{
    background: #1B253A url("../assets/images/beach.jpg") no-repeat;
    width: calc(100vw);
    height: calc(100vh);
    background-size: cover;
    overflow: hidden;
    position: relative;
  }
</style>
