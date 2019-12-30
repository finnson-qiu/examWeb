<template>
    <div class="rootContain">
      <div class="buttonBox">
        <el-button @click="handleAdd" type="primary" size="small">添加科目</el-button>
      </div>
      <div id="tableBox" class="tableBox">
        <el-table
          :data="subjectData"
          v-loading="loading"
          stripe
          border
          :cell-style="cellStyle"
          style="width: 100%;font-size: 15px">
          <el-table-column prop="subjectNo" label="科目编号" min-width="15%" align="center">
          </el-table-column>
          <el-table-column prop="subjectName" label="科目名" min-width="25%" align="center">
          </el-table-column>
          <el-table-column prop="grade" label="所属年级" min-width="25%" align="center">
          </el-table-column>
          <el-table-column prop="knowPointAmount" label="知识点总数" min-width="15%" align="center">
          </el-table-column>
          <el-table-column label="操作" min-width="20%" align="center">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="warning" size="small" >编辑</el-button>
              <el-button @click="handleDelete(scope.row)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 15px;">
          <el-pagination background layout="prev, pager, next, sizes, total, jumper" :page-sizes="[5, 10, 15, 20]"
                         :page-size="pageSize"
                         :total="total"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         @size-change="handleSizeChange">
          </el-pagination>
        </div>
      </div>
      <el-dialog title="添加科目" :visible.sync="dialogVisible" width="60%" @close="resetForm">
        <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm" :inline="true">
          <el-form-item label="科目名称" prop="subjectName">
            <el-input v-model="addForm.subjectName"></el-input>
          </el-form-item>
          <el-form-item label="所属年级" prop="grade">
            <el-select v-model="addForm.grade" placeholder="请选择年级" >
              <el-option
                v-for="item in gradeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="addIt" v-if="this.dialogKey === 1">确 定</el-button>
          <el-button type="primary" @click="editIt" v-else>编辑</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
  import {getSubjectList,getSubjectCount,addSubject,updateSubject,deleteSubject} from "../api/subject";

  export default {
        name: "subjectInfo",
        created(){
            this.getList()
        },
        data(){
            const validateSubjectName = (rule,value,callback) => {
                if(value === ''){
                    callback(new Error('请输入科目名'))
                }
                else {
                    callback()
                }
            }
            const validateGrade = (rule,value,callback) => {
                if(value === ''){
                    callback(new Error('请选择年级'))
                }
                else {
                    callback()
                }
            };
            return{
                subjectData:[],
                loading:false,
                total: 0,
                pageSize:10,
                currentPage:1,
                dialogVisible: false,
                dialogKey: '',
                nowRow: '',
                addForm:{
                    subjectName: '',
                    grade: '',
                },
                rules:{
                    subjectName: [
                        {validator: validateSubjectName, trigger: 'blur'}
                    ],
                    grade:[
                        {validator: validateGrade, trigger: 'blur'}
                    ]
                },
                gradeOptions:[
                    {value: '小学一年级', label: '小学一年级'},
                    {value: '小学二年级', label: '小学二年级'},
                    {value: '小学三年级', label: '小学三年级'},
                    {value: '小学四年级', label: '小学四年级'},
                    {value: '小学五年级', label: '小学五年级'},
                    {value: '小学六年级', label: '小学六年级'},
                    {value: '初中一年级', label: '初中一年级'},
                    {value:' 初中二年级', label: '初中二年级'},
                    {value:' 初中三年级', label: '初中三年级'},
                    {value:' 高中一年级', label: '高中一年级'},
                    {value:' 高中二年级', label: '高中二年级'},
                    {value:' 高中三年级', label: '高中三年级'},
                    {value:' 大学一年级', label: '大学一年级'},
                    {value:' 大学二年级', label: '大学二年级'},
                    {value:' 大学三年级', label: '大学三年级'},
                    {value:' 大学四年级', label: '大学四年级'},
                ]

            }
        },
        methods:{
            getList(){
                this.loading = true
                getSubjectCount().then(res=>{
                    this.total = res
                }).catch(err=>{
                    this.$message({
                        message: err,
                        type: 'error',
                        center: true
                    })
                })
                const myPage = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize
                }
                getSubjectList(myPage).then(res => {
                    this.subjectData = res;
                }).catch(err => {
                    this.$message({
                        message: err,
                        type: 'error',
                        center: true
                    });
                })
                this.loading = false
            },
            handleCurrentChange(pageNo){
                this.currentPage = pageNo
                this.getList()
            },
            //页面大小发送改变的事件
            handleSizeChange(pageSize){
                this.pageSize = pageSize
                this.getList()
            },
            handleAdd(){
                this.dialogKey = 1
                this.dialogVisible = true
            },
            addIt(){
                const myVar = {
                    subjectName: this.addForm.subjectName,
                    grade: this.addForm.grade
                }
                this.$refs['addForm'].validate((valid) => {
                    if(valid){
                        addSubject(myVar).then(res=>{
                            if(res === 1){
                                this.$message({
                                    message: '添加成功',
                                    type: 'success',
                                    center: true
                                })
                            }
                            else {
                                this.$message({
                                    message: '添加失败',
                                    type: 'error',
                                    center: true
                                })
                            }
                        }).catch(err=>{
                            this.$message({
                                message: err,
                                type: 'error',
                                center: true
                            })
                        })
                        this.cancel()

                        setTimeout(()=>{   //设置延迟执行
                            this.getList()
                        },200);

                    }
                    else {
                        this.$message({
                            message: '请完整填写科目信息',
                            type: 'error',
                            center: true
                        })
                    }
                })
            },
            handleEdit(row){
                this.addForm.subjectName = row.subjectName
                this.addForm.grade = row.grade
                this.nowRow = row
                this.dialogKey = 2
                this.dialogVisible = true
            },
            editIt(){
              const myVar = {
                  subjectNo: this.nowRow.subjectNo,
                  subjectName: this.addForm.subjectName,
                  grade: this.addForm.grade
              }
                this.$refs['addForm'].validate((valid) => {
                    if(valid){
                        updateSubject(myVar).then(res=>{
                            if(res === 1){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success',
                                    center: true
                                })
                            }
                            else {
                                this.$message({
                                    message: '修改失败',
                                    type: 'error',
                                    center: true
                                })
                            }
                        }).catch(err=>{
                            this.$message({
                                message: err,
                                type: 'error',
                                center: true
                            })
                        })
                        this.cancel()

                        setTimeout(()=>{   //设置延迟执行
                            this.getList()
                        },200);

                    }
                    else {
                        this.$message({
                            message: '请填写完整信息',
                            type: 'error',
                            center: true
                        })
                    }
                })
            },
            handleDelete(row){
                this.$confirm('确定删除该科目吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteIt(row)
                })
            },
            deleteIt(row){
                const myVar = {
                    subjectNo: row.subjectNo
                };
                deleteSubject(myVar).then(res=>{
                    if(res === 1){
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                            center: true
                        })
                    }
                    else {
                        this.$message({
                            message: '删除失败',
                            type: 'error',
                            center: true
                        })
                    }
                }).catch(err=>{
                    this.$message({
                        message: err,
                        type: 'error',
                        center: true
                    })
                });

                setTimeout(()=>{   //设置延迟执行
                    this.getList()
                },200);
            },
            cancel(){
                this.resetForm();
                this.dialogVisible = false
            },
            resetForm(){
                if(this.$refs['addForm']){
                    this.$refs['addForm'].resetFields()
                }

                this.addForm.subjectName = '';
                this.addForm.grade = ''
            },
            cellStyle(){
                return 'padding:9px'
            }
        }
    }
</script>

<style scoped>
  .rootContain{
    margin-top: 1%;
    width: 64%;
    margin-left: auto;
    margin-right: auto;
  }
  .buttonBox{
    margin-bottom: 10px;
    float: right;
    margin-right: 2%;
  }
</style>
