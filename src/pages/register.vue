<template>
  <div class="root">
    <div class="logoBox"><img alt="logo" :src="logo" style="width: 70%; height:8%"></div>
    <div class="registerBox">
      <div class="reLogoBox"><img alt="register" :src="registerLogo" style="width: 80%"></div>
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
      <el-form-item prop="comPassword">
        <el-col :span="8">
          <el-input id="comPassword" v-model="userForm.comPassword" type="password" show-password placeholder="请确认密码">
            <template slot="prepend">确认</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="name">
        <el-col :span="8">
          <el-input id="name" v-model="userForm.name" placeholder="请输入姓名">
            <template slot="prepend">姓名</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item prop="idNumber">
      <el-col :span="8">
        <el-input id="idNumber" v-model="userForm.idNumber" placeholder="请输入身份证号(用于找回密码)">
          <template slot="prepend">证件</template>
        </el-input>
      </el-col>
    </el-form-item>
      <el-form-item prop="subject">
        <el-col :span="2">
          <el-input disabled placeholder=" 科目" ></el-input>
        </el-col>
        <el-col :span="6">
        <el-select id="subSelect" v-model="userForm.subjectNo" placeholder="请选择所授科目">
          <el-option
            v-for="item in subOptions"
            :key="item.subjectNo"
            :label="item.subjectName"
            :value="item.subjectNo"
          >
          </el-option>
        </el-select>
        </el-col>
      </el-form-item>
      <el-row>
        <el-col :span="2" style="margin-right: 60px; margin-left: 5px">
          <el-button id="register" v-on:click="register" style="width:100%" type="primary">注册</el-button>
        </el-col>
        <el-col :span="2" style="margin-right: 10px; margin-left: 78px">
          <el-button id="cancel" v-on:click="cancel" style="width:100%" type="primary">取消</el-button>
        </el-col>
      </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
  import registerLogo from "../assets/images/reLogo.png"
  import logo from "../assets/images/logoblack.png"
  import {validateUser,register} from "../api/user";
  import {getAllSubject} from "../api/subject";

  export default {
    data(){
        // 规则，前端验证用户名是否合法，并且会向后端发送请求判断该用户是否存在
      const validateUserName = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请输入用户名'))
        }
        else if(value.length > 10){
          callback(new Error('用户名需要小于等于十个字符'))
        }
        else {
          const obj = {
            userName: this.userForm.userName
          }
          validateUser(obj).then( res=> {
            if(res === 1){
              callback(new Error('用户名已经存在'))
            }
            else {
              callback()
            }
          })
        }
      }
      //规则，判断输入的密码是否符合规则
      const validatePass = (rule, value, callback) => {
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
      };
      // 规则，判断确定密码是否和前面输入的密码一样
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      // 身份证规则
      const validateId = (rule, value, callback) => {
        if(value === ''){
          callback(new Error('请输入身份证号'));
        }else if(value.length !== 18){
          callback(new Error('身份证号码位数不正确'));
        }
        else{
          callback()
        }
      }
      // 教师的姓名的规则
      const validateName = (rule,value,callback) =>{
        if(value === ''){
          callback(new Error('请输入姓名'));
        }
        else if (value.length >16){
          callback(new Error('姓名小于等于16个字符'))
        }
        else {
          callback()
        }
      }
      // 所授科目需要选择
      const validateSubject = (rule,value,callback) => {
        if(value === ''){
          callback(new Error('请选择所授科目'))
        }
        else {
          callback()
        }
      }
      return{
        logo,
        registerLogo,
        subOptions:[],
        userForm: {
          userName: '',
          password: '',
          conPassword: '',
          name: '',
          idNumber: '',
          subjectNo: ''
        },
          //这是表单规则的声明，上面那些是定义
        rules: {
          userName: [
            { validator: validateUserName, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          comPassword: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          idNumber: [
            {validator: validateId, trigger: 'blur'}
          ],
          name: [
            {validator: validateName, trigger: 'blur'}
          ],
          subjectNo: [
            {validator: validateSubject, trigger: 'blur'}
          ]
        }
      }
    },
    created(){
        //在该页面创建时调用该函数获取数据库里已经存在的科目放到下拉框
      this.getSubject()
    },
    methods:{
        //获取所有科目的函数
      getSubject(){
        getAllSubject().then(res=>{
          this.subOptions = res
        }).catch(err=>{
          alert(err)
        })
      },
        //注册功能，只有表单通过规定的规则才会向后端发起请求，注册成功会返回到登录页面
      register(){
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            register(this.userForm).then(res=> {
              if (res === 1) {
                this.$message({
                  message: '注册成功',
                  type: 'success',
                  center: true
                });
                this.$router.go(-1)
              } else {
                this.$message({
                  message: '注册失败',
                  type: 'error',
                  center: true
                });
            }
            })
          } else {
            this.$message({
              message: '注册失败,请填写完整注册信息',
              type: 'error',
              center: true
            });
            return false;
          }
        });
      },
        //取消按钮行为，路由回退1，返回到登录页面
      cancel(){
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped>
  .registerBox{
    margin-left: 35%;
    margin-top: 2%;
  }
  .el-row {
    margin-top: 20px;
    margin-left: 10%;
  }
  .reLogoBox{
    margin-left: 11%;
    margin-bottom: 30px;
  }
  .logoBox{
    margin-left: 23%;
    margin-top: 3%;
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
