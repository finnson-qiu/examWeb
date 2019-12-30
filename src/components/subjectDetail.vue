<template>
<div class="rootContainer">
  <div class="textBox"><el-tooltip class="item" effect="light" :content="nowSubName" placement="top">
    <el-button size="small" type="info">Tip</el-button>
  </el-tooltip></div>
  <div class="buttonBox">
    <el-button type="primary" @click="openDialog" size="small">选择科目</el-button>
    <el-button type="primary" @click="handleAdd" size="small">增加知识点</el-button>
  </div>
  <div id="tableBox" class="tableBox">
    <el-table
      :data="subjectData"
      v-loading="loading"
      stripe
      border
      :cell-style="cellStyle"
      style="width: 100%;font-size: 15px">
      <el-table-column prop="knowPointNo" label="知识点编号" min-width="20%" align="center">
      </el-table-column>
      <el-table-column prop="knowPointName" label="知识点" min-width="30%" align="center">
      </el-table-column>
      <el-table-column prop="significance" label="重要度" min-width="15%" align="center">
      </el-table-column>
      <el-table-column prop="difficulty" label="难度系数" min-width="15%" align="center">
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

  <el-dialog title="科目" :visible.sync="dialogVisible" width="60%" @close="cancel">
    <el-form :model="selectForm" ref="selectForm" label-width="100px" class="demo-ruleForm" :inline="true">
      <el-form-item label="科目详细：" prop="subjectNo">
        <el-select v-model="selectForm.subjectNo" placeholder="请选择科目"  value="selectForm.subjectNo">
          <el-option
            v-for="item in subjectOptions"
            :key="item.subjectNo"
            :label="item.subjectName"
            :value="item.subjectNo"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button @click="selectIt" type="primary">确 定</el-button>
  </span>
  </el-dialog>

  <el-dialog title="科目详细" :visible.sync="detailVisible" width="60%" @close="detailCancel">
    <el-form :model="detailForm" ref="detailForm" :rules="detailRule" label-width="100px" class="demo-ruleForm">
      <el-form-item label="知识点名称" prop="knowPointName" style="margin-bottom: 50px; margin-top: 30px">
        <el-col :span = '21'>
          <el-input v-model="detailForm.knowPointName" placeholder="请输入知识点名称"></el-input>
        </el-col>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="重要程度" prop="significance">
              <el-select v-model="detailForm.significance" placeholder="请选择该知识点的重要度"  value="detailForm.significance">
                <el-option v-for="item in coefficientOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="难度系数" prop="difficulty">
              <el-select v-model="detailForm.difficulty" placeholder="请选择该知识点的难度系数"  value="detailForm.difficulty">
                <el-option v-for="item in coefficientOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                </el-option>
              </el-select>
        </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
          <el-button @click="detailCancel">取 消</el-button>
          <el-button @click="addIt" type="primary" v-if="this.judgeButton === 1">确 定</el-button>
          <el-button @click="editIt" type="primary" v-else>确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import {getAllSubject} from "../api/subject";
  import {addKnowPoint,getKPointList,getTotal,deleteOneKPoint,updateOneKPoint} from "../api/subjectDetail";

  export default {
        name: "subjectDetail",
        data(){
            const validateKPN = (rule,value,callback) => {
                if(value === undefined || value === ''){
                    callback(new Error('知识点名称不能为空'))
                }
                else {
                    callback()
                }
            };
            const validateSign = (rule,value,callback) => {
                if (value === undefined || value === ''){
                    callback(new Error('重要程度不能为空'))
                }
                else {
                    callback()
                }
            };
            const validateDiff = (rule,value,callback) => {
                if (value === undefined || value === ''){
                    callback(new Error('难度系数不能为空'))
                }
                else {
                    callback()
                }
            };
            return {
                dialogVisible: true,
                detailVisible: false,
                selectForm: {
                    subjectNo: undefined
                },
                detailForm: {
                    knowPointNo: undefined,
                    knowPointName: undefined,
                    significance: undefined,
                    difficulty: undefined
                },
                subjectOptions: [],
                coefficientOptions: [
                    {value: 1, label: '1'},
                    {value: 2, label: '2'},
                    {value: 3, label: '3'},
                    {value: 4, label: '4'},
                    {value: 5, label: '5'},
                    {value: 6, label: '6'},
                    {value: 7, label: '7'},
                    {value: 8, label: '8'},
                    {value: 9, label: '9'},
                    {value: 10, label: '10'},
                ],
                detailRule: {
                    knowPointName:[
                        {validator: validateKPN, trigger: 'blur'}
                    ],
                    significance:[
                        {validator: validateSign, trigger: 'blur'}
                    ],
                    difficulty:[
                        {validator: validateDiff, trigger: 'blur'}
                    ]
                },
                subjectData:[],
                nowSubjectNo: undefined,
                nowSubName: '未选择',
                total: 0,
                pageSize:10,
                currentPage:1,
                judgeButton:undefined,
                loading:false
            }
        },
        created(){
          this.getSubject()
        },
        methods:{
            getSubject(){
              getAllSubject().then(res=>{
                  this.subjectOptions = res
              }).catch(err=>{
                  this.$message({
                      message: err,
                      type: 'error',
                      center: true
                  })
              })
            },
            getTotal(){
                const myVar = {
                    subjectNo: this.nowSubjectNo
                };
                getTotal(myVar).then(res=>{
                    this.total = res
                }).catch(err=>{
                    this.$message({
                        message: err,
                        type: 'error',
                        center: true
                    })
                })
            },
            getKPointList(){
                this.getTotal();
                const myVar = {
                    subjectNo: this.nowSubjectNo,
                    pageNo: this.currentPage,
                    pageSize: this.pageSize
                };
                getKPointList(myVar).then(res=>{
                    this.subjectData = res
                }).catch(err=>{
                    this.$message({
                        message: err,
                        type: 'error',
                        center: true
                    })
                })
            },
            openDialog(){
                this.selectForm.subjectNo = this.nowSubjectNo;
                this.dialogVisible = true
            },
            selectIt(){
                this.$refs['selectForm'].validate(valid=>{
                    if(valid){
                        this.nowSubjectNo = this.selectForm.subjectNo;
                        this.setTitle();
                        this.getKPointList();
                        this.cancel()
                    }
                    else {
                        this.$message({
                            message: '请选择科目',
                            type: 'error',
                            center: true
                        })
                    }
                })
            },
            setTitle(){
                this.subjectOptions.map(item=>{
                    if(item.subjectNo === this.nowSubjectNo){
                        this.nowSubName = '当前科目：' + item.subjectName
                    }
                })
            },
            cancel(){
                this.dialogVisible = false;
                if(this.$refs['selectForm']){
                    this.$refs['selectForm'].resetFields()
                }
                this.selectForm.subjectNo = undefined
            },
            handleAdd(){
                if(this.nowSubjectNo === undefined){
                    this.$message({
                        message: '请选择要添加知识点的科目',
                        type: 'warning',
                        center: true
                    })
                }
                else {
                    this.judgeButton = 1;
                    this.detailVisible = true
                }
            },
            addIt(){
                const myVar = {
                    subjectNo: this.nowSubjectNo,
                    knowPointNo: this.detailForm.knowPointNo,
                    knowPointName: this.detailForm.knowPointName,
                    significance: this.detailForm.significance,
                    difficulty: this.detailForm.difficulty
                };
                this.$refs['detailForm'].validate(valid =>{
                    if(valid){
                        addKnowPoint(myVar).then(res=>{
                            if(res === 1){
                                this.$message({
                                    message: '添加成功',
                                    type: 'success',
                                    center: true
                                })
                            }
                            else{
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
                        });
                        this.detailCancel();
                        setTimeout(()=>{   //设置延迟执行
                            this.getKPointList()
                        },200);
                    }
                    else {
                        this.$message({
                            message: '请完整填写知识点信息',
                            type: 'error',
                            center: true
                        })
                    }
                });

            },
            handleCurrentChange(pageNo){
                this.currentPage = pageNo;
                this.getKPointList()
            },
            handleSizeChange(pageSize){
                this.pageSize = pageSize;
                this.getKPointList()
            },
            handleEdit(row){
                this.judgeButton = 2;
                this.detailForm.knowPointName = row.knowPointName;
                this.detailForm.significance = row.significance;
                this.detailForm.difficulty = row.difficulty;
                this.detailForm.knowPointNo = row.knowPointNo;
                this.detailVisible = true
            },
            editIt(){
                const myVar = {
                    subjectNo: this.nowSubjectNo,
                    knowPointNo: this.detailForm.knowPointNo,
                    knowPointName: this.detailForm.knowPointName,
                    significance: this.detailForm.significance,
                    difficulty: this.detailForm.difficulty
                };
                this.$refs['detailForm'].validate(valid =>{
                    if(valid) {
                        updateOneKPoint(myVar).then(res => {
                            if (res === 1) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success',
                                    center: true
                                })
                            } else {
                                this.$message({
                                    message: '修改失败',
                                    type: 'error',
                                    center: true
                                })
                            }
                        }).catch(err => {
                            this.$message({
                                message: err,
                                type: 'error',
                                center: true
                            })
                        });
                        this.detailCancel();
                        setTimeout(() => {
                            this.getKPointList()
                        }, 200)
                    }
                    else {
                        this.$message({
                            message: '请完整填写知识点信息',
                            type: 'error',
                            center: true
                        })
                    }
                })
            },
            handleDelete(row){
                this.$confirm('确定删除该知识点吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteIt(row)
                })
            },
            deleteIt(row){
                const myVar = {
                    subjectNo: this.nowSubjectNo,
                    knowPointNo: row.knowPointNo
                };
                deleteOneKPoint(myVar).then(res=>{
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
                    this.getKPointList()
                },200);
            },
            detailCancel(){
                this.detailVisible = false;
                if(this.$refs['detailForm']){
                    this.$refs['detailForm'].resetFields()
                }
                this.detailForm.knowPointName = undefined;
                this.detailForm.difficulty = undefined;
                this.detailForm.significance = undefined
            },
            cellStyle(){
                return 'padding:9px'
            }
        }
    }
</script>

<style scoped>
      .rootContainer{
        margin-top: 1%;
        width: 70%;
        margin-left: auto;
        margin-right: auto;
      }
      .textBox{
        float: left;
        margin-left: 48%;
        margin-bottom: 10px;
      }
      .buttonBox{
        margin-bottom: 10px;
        float: right;
        margin-right: 2%;
      }
      .el-select{
        float: left;
      }
</style>
