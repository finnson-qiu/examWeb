<template>
  <div id="rootBox" class="rootBox">
    <div id="tableBox" class="tableBox">
      <template>
        <el-table
          :data="userData"
          v-loading="loading"
          stripe
          border
          :cell-style="cellStyle"
          style="width: 100%;font-size: 15px">
          <el-table-column prop="userName" label="用户名" min-width="15%" align="center">
          </el-table-column>
          <el-table-column prop="password" label="密码" min-width="15%" align="center">
          </el-table-column>
          <el-table-column prop="name" label="姓名" min-width="10%" align="center">
          </el-table-column>
          <el-table-column prop="idNumber" label="身份证号" min-width="20%" align="center">
          </el-table-column>
          <el-table-column prop="subjectName" label="所教科目" min-width="15%" align="center">
          </el-table-column>
          <el-table-column prop="permission" label="权限" min-width="10%" align="center">
            <template slot-scope="scope">
              <span v-if='scope.row.permission===2'>管理员</span>
              <span v-if='scope.row.permission===3'>用户</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="15%" align="center">
            <template slot-scope="scope">
              <el-button @click="handleAuth(scope.row)" type="warning" size="small" v-if="scope.row.permission === 3">授权</el-button>
              <el-button @click="takeBack(scope.row)" plain size="small" v-else>收回</el-button>
              <el-button @click="handleDelete(scope.row)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 25px;">
          <el-pagination background layout="prev, pager, next, sizes, total, jumper" :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          :total="total"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange">
          </el-pagination>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import {getAllUser,updatePermission,deleteUser,getUserCount} from "../api/user";

  export default {
      created(){
          // 页面加载时调用函数加载用户信息表格
          this.getUserTable()
      },
      data(){
          return{
              userData:[],
              loading:false,
              total: 0,
              pageSize:10,
              currentPage:1
          }
      },
      methods:{
          //加载用户表格的函数实现，后端分页，前端传给后端页面号和页面大小就可以显示对应页的数据
          getUserTable(){
              this.loading = true
              getUserCount().then(res=>{
                  this.total = res
              })
              const tempVar = {
                  pageNo: this.currentPage,
                  pageSize: this.pageSize
              }
              getAllUser(tempVar).then(res=>{
                  this.userData = res
              })
              this.loading = false
          },
          // 页面号改变的事件，往后端发送请求获取表格数据并显示
          handleCurrentChange(pageNo){
              this.currentPage = pageNo
            this.getUserTable()
          },
          //页面大小发送改变的事件
          handleSizeChange(pageSize){
              this.pageSize = pageSize
            this.getUserTable()
          },
          // 超级管理员给普通用户授予管理员权限，询问是否确定
          handleAuth(row){
              this.$confirm('确定授予其管理员权限吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  this.authorization(row)
              })
          },
          //确定授权则往后端发送请求，改变该用户权限
          authorization(row){
              const tempVar = {
                  userName: row.userName,
                  permission: 2
              }
              updatePermission(tempVar).then(res=>{
                  if (res === 1){
                      this.$message({
                          message: '授权成功',
                          type: 'success',
                          center: true
                      });
                  }
                  else {
                      this.$message({
                          message:'授权失败',
                          type: 'error',
                          center: true
                      })
                  }
                  this.getUserTable()
              })
          },
          //超级管理员收回用户的管理员权限
          takeBack(row){
              const tempVar = {
                  userName: row.userName,
                  permission: 3
              }
              updatePermission(tempVar).then(res=>{
                      if (res === 1){
                          this.$message({
                              message: '收回权限成功',
                              type: 'success',
                              center: true
                          });
                      }
                      else {
                          this.$message({
                              message:'收回权限失败',
                              type: 'error',
                              center: true
                          })
                      }
                      this.getUserTable()
              })
          },
          //删除该用户，询问是否确定
          handleDelete(row){
              this.$confirm('是否确定删除该用户？','提示',{
                  confirmButtonText:'确定',
                  cancelButtonText: '取消',
                  type:'warning',
              }).then(()=>{
                  this.delete(row)
              })
          },
          //确定删除，往后端发送请求
          delete(row){
              const obj = {
                  userName: row.userName
              }
              deleteUser(obj).then(res=>{
                  if(res === 1){
                      this.$message({
                          message: '删除用户成功',
                          type: 'success',
                          center: true
                      });
                  }
                  else {
                      this.$message({
                          message: '删除用户失败',
                          type: 'error',
                          center: true
                      });
                  }
                  this.getUserTable()
              })
          },
          //表格样式
          cellStyle(){
              return 'padding:9px'
          }
      }
}
</script>
<style scoped>
  .rootBox{
    margin-top: 2%;
    width: 84%;
    margin-left: auto;
    margin-right: auto;
  }

</style>
