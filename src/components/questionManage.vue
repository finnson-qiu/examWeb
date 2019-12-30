<template>
    <div id="root" class="rootContainer">
      <div class="controlBox">
        <div class="selectBox">
          <el-tooltip class="item" effect="light" :content="nowSubjectName" placement="top">
            <el-select size="small" style="width: 100px" value="" v-model="nowSubjectNo" placeholder="选择科目" @change="changeSubject">
              <el-option v-for="item in subjectOption" :key="item.subjectNo" :label="item.subjectName" :value="item.subjectNo" :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-tooltip>
          <el-tooltip class="item" effect="light" :content="nowKPName" placement="top">
            <el-select size="small" style="width: 100px" v-model="nowKPointNo" value="" placeholder="知识点" v-if="nowSubjectNo !== undefined" @change="changeKP">
              <el-option v-for="item in KPOption" :key="item.knowPointNo" :label="item.knowPointName" :value="item.knowPointNo" :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-tooltip>
      </div>
        <div class="tipBox">
          <el-tooltip class="item" effect="light" :content="nowTip" placement="top">
            <el-button size="small" type="info">Tip</el-button>
          </el-tooltip>
        </div>
        <div class="buttonBox">
          <el-select size="small" style="width: 100px" v-model="nowQuestionType" value="" placeholder="选择题型" v-if="nowSubjectNo !== undefined" @change="changeType">
            <el-option v-for="item in typeOption" :key="item.questionTypeNo" :label="item.questionTypeName" :value="item.questionTypeNo" :disabled="item.disabled">
            </el-option>
          </el-select>
          <el-button type="primary" @click="handleAdd" size="small" v-if="nowSubjectNo === userSubjectNo">添加试题</el-button>
        </div>
      </div>

      <div id="tableBox" class="tableBox">
        <el-table :data="choiceData" ref="CTable" @row-click="choiceRowClick" v-loading="loading" v-if="nowQuestionType === 1 || nowQuestionType === 2" stripe :cell-style="cellStyle" style="width: 100%;font-size: 15px">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="选项A:">
                  <span>{{ props.row.choiceA }}</span>
                </el-form-item>
                <el-form-item label="选项B:">
                  <span>{{ props.row.choiceB }}</span>
                </el-form-item>
                <el-form-item label="选项C:">
                  <span>{{ props.row.choiceC }}</span>
                </el-form-item>
                <el-form-item label="选项D:">
                  <span>{{ props.row.choiceD }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="questionContent" label="题目" min-width="28%" align="center">
          </el-table-column>
          <el-table-column prop="answer" label="答案" min-width="8%" align="center">
          </el-table-column>
          <el-table-column prop="significance" label="重要程度" min-width="6%" align="center">
          </el-table-column>
          <el-table-column prop="difficulty" label="难度系数" min-width="6%" align="center">
          </el-table-column>
          <el-table-column prop="knowPointNames" label="知识点" min-width="29%" align="center">
          </el-table-column>
          <el-table-column prop="createAt" label="创造时间" min-width="9%" align="center">
          </el-table-column>
          <el-table-column label="操作" min-width="14%" align="center" v-if="nowSubjectNo === userSubjectNo">
            <template slot-scope="scope" v-if="(nowQuestionType === 1 || nowQuestionType === 2)&&(nowSubjectNo === userSubjectNo)">
              <el-button @click="handleEdit(scope.row)" type="warning" size="small" >编辑</el-button>
              <el-button @click="handleDelete(scope.row)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table :data="questionData" ref="OTable" @row-click="otherRowClick" v-loading="loading" v-if="nowQuestionType !== 1 && nowQuestionType !== 2" stripe :cell-style="cellStyle" style="width: 100%;font-size: 15px">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="答案:">
                  <span>{{ props.row.answer }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="题目" prop="questionContent" min-width="33%" align="center">
          </el-table-column>
          <el-table-column label="知识点" prop="knowPointNames" min-width="32%" align="center">
          </el-table-column>
          <el-table-column label="重要程度" prop="significance" min-width="6%" align="center">
          </el-table-column>
          <el-table-column label="难度系数" prop="difficulty" min-width="6%" align="center">
          </el-table-column>
          <el-table-column label="创建时间" prop="createAt" min-width="9%" align="center">
          </el-table-column>
          <el-table-column label="操作" min-width="14%" align="center" v-if="nowSubjectNo === userSubjectNo">
            <template slot-scope="scope" v-if="(nowQuestionType !== 1 && nowQuestionType !== 2)&&(nowSubjectNo === userSubjectNo)">
              <el-button @click="handleEdit(scope.row)" type="warning" size="small" >编辑</el-button>
              <el-button @click="handleDelete(scope.row)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 20px;margin-bottom: 30px">
          <el-pagination background layout="prev, pager, next, sizes, total, jumper" :page-sizes="[5, 10, 15, 20]"
                         :page-size="pageSize"
                         :total="total"
                         :current-page="currentPage"
                         @current-change="handleCurrentChange"
                         @size-change="handleSizeChange">
          </el-pagination>
        </div>
      </div>

      <el-dialog title="添加试题" :visible.sync="dialogVisible" width="60%" @close="cancel">
        <el-form :model="questionForm" ref="questionForm" label-width="100px" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="科目选择：" prop="subjectNo" v-if="dialogState === 1">
                <el-select v-model="questionForm.subjectNo" placeholder="请选择要添加题目的科目"  value="" @change="changeFormSubject" style="float: left;width: 76%">
                  <el-option v-for="item in subjectOption" :key="item.subjectNo" :label="item.subjectName"
                             :value="item.subjectNo" :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="题型选择:" prop="questionType" v-if="dialogState === 1">
                <el-select v-model="questionForm.questionType" placeholder="请选择要添加的题型"  value=""  @change="changeFormType" style="float:left;width: 76%">
                  <el-option v-for="item in typeOption" :key="item.questionTypeNo" :label="item.questionTypeName"
                             :value="item.questionTypeNo" :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="题目内容:" prop="questionContent" v-if="questionForm.questionType !== undefined" required>
            <el-input type="textarea" v-model="questionForm.questionContent" :row="2" placeholder="请输入问题" maxlength="512" show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="选项A:" prop="choiceA" v-if="questionForm.questionType === 1 || questionForm.questionType === 2" required>
            <el-input v-model="questionForm.choiceA" placeholder="请输入选项A内容" style="float:left;width: 90%" maxlength="128" show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="选项B:" prop="choiceB" v-if="questionForm.questionType === 1 || questionForm.questionType === 2" required>
            <el-input v-model="questionForm.choiceB" placeholder="请输入选项B内容" style="float:left;width: 90%" maxlength="128" show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="选项C:" prop="choiceC" v-if="questionForm.questionType === 1 || questionForm.questionType === 2" required>
            <el-input v-model="questionForm.choiceC" placeholder="请输入选项C内容" style="float:left;width: 90%" maxlength="128" show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="选项D:" prop="choiceD" v-if="questionForm.questionType === 1 || questionForm.questionType === 2" required>
            <el-input v-model="questionForm.choiceD" placeholder="请输入选项D内容" style="float:left;width: 90%" maxlength="128" show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="正确答案:" prop="choiceAnswer" v-if="questionForm.questionType === 1" required>
            <el-radio-group v-model="questionForm.choiceAnswer" style="float: left">
              <el-radio label="A">选项A</el-radio>
              <el-radio label="B">选项B</el-radio>
              <el-radio label="C">选项C</el-radio>
              <el-radio label="D">选项D</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="正确答案:" prop="choiceArray" v-if="questionForm.questionType === 2" required>
            <el-checkbox-group v-model="questionForm.choiceArray" style="float: left">
              <el-checkbox label="A">选项A</el-checkbox>
              <el-checkbox label="B">选项B</el-checkbox>
              <el-checkbox label="C">选项C</el-checkbox>
              <el-checkbox label="D">选项D</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="题目答案:" prop="gfAnswer" v-if="questionForm.questionType === 3" required>
            <el-input v-model="questionForm.gfAnswer" placeholder="请输入填空题答案" style="float:left;width: 90%" maxlength="64" show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="正确答案:" prop="judgeAnswer" v-if="questionForm.questionType === 4" required>
            <el-radio-group v-model="questionForm.judgeAnswer" style="float: left">
              <el-radio label="1">对</el-radio>
              <el-radio label="0">错</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="题目答案:" prop="saqAnswer"  v-if="questionForm.questionType === 5" required>
            <el-input type="textarea" v-model="questionForm.saqAnswer" :row="4" placeholder="请输入简答题答案" maxlength="1024" show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="题目答案:" prop="calculationAnswer" v-if="questionForm.questionType === 6" required>
            <el-input type="textarea" v-model="questionForm.calculationAnswer" :row="4" placeholder="请输入计算题答案" maxlength="1024" show-word-limit>
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="重要程度:" prop="significance" v-if="questionForm.questionType !== undefined" required>
                <el-input-number v-model="questionForm.significance" :min="1" :max="10" style="float: left"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="难度系数:" prop="difficulty" v-if="questionForm.questionType !== undefined" required>
                <el-input-number v-model="questionForm.difficulty" :min="1" :max="10" style="float: left"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="知识点选择:" prop="knowPointArray" v-if="questionForm.questionType !== undefined" required>
            <el-select v-model="questionForm.knowPointArray" multiple placeholder="请选择包含的知识点" value-key="knowPointNo" value="" style="float: left;width: 90%;">
              <el-option v-for="item in formKPOption" :key="item.knowPointNo" :label="item.knowPointName" :value="item.knowPointNo" :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button @click="addIt" type="primary" v-if="judgeButton === 1">确 定</el-button>
          <el-button @click="editIt" type="primary" v-if="judgeButton ===2">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import {getQuestionType,addChoiceQuestion,addOtherQuestion,getChoiceList,getOtherList,updateChoiceQuestion,updateOtherQuestion,deleteOneQuestion,getTotal} from "../api/question";
  import {getAllSubject} from "../api/subject";
  import {getAllKPoint} from "../api/subjectDetail";

  export default {
      name: "questionManage",
      props:["data"],
      data(){
          return{
              userSubjectNo:undefined,
              pageSize: 10,
              total: 0,
              currentPage: 1,
              dialogState: undefined,
              nowQuestionType: 1,
              judgeButton: undefined,
              nowSubjectNo: undefined,
              nowKPointNo:undefined,
              nowTip: '',
              nowSubjectName: '',
              nowKPName: '无',
              loading: false,
              dialogVisible:false,
              nowAddQuestionType: undefined,
              typeOption:[],
              subjectOption:[],
              KPOption:[],
              formKPOption:[],
              questionForm:{
                  questionNo : undefined,
                  multiChoiceAnswer: undefined,
                  questionType: undefined,
                  subjectNo: undefined,
                  questionContent: undefined,
                  choiceA: undefined,
                  choiceB: undefined,
                  choiceC: undefined,
                  choiceD: undefined,
                  choiceAnswer: undefined,
                  choiceArray: [],
                  judgeAnswer: undefined,
                  gfAnswer: undefined,
                  saqAnswer: undefined,
                  calculationAnswer: undefined,
                  significance: 1,
                  difficulty: 1,
                  knowPointArray: [],
                  answer: undefined
              },
              choiceData:[],
              questionData:[]
          }
      },
      created(){
          this.getType();
          this.getSubject();
          this.getKPoint();
          setTimeout(()=>{
              this.getList();
              this.setNowTip()
          },500)
      },
      methods:{
          handleCurrentChange(pageNo){
              this.currentPage = pageNo;
              this.getList()
          },
          handleSizeChange(pageSize){
              this.pageSize = pageSize;
              this.getList()
          },
          getList(){
              this.loading = true;
              let tempVar;
              if(this.nowKPointNo === 0){
                  tempVar = {
                      subjectNo: this.nowSubjectNo,
                      questionType: this.nowQuestionType,
                      currIndex: this.currentPage,
                      pageSize: this.pageSize
                  }
              }
              else {
                  tempVar = {
                      subjectNo: this.nowSubjectNo,
                      questionType: this.nowQuestionType,
                      knowPointNo: this.nowKPointNo,
                      currIndex: this.currentPage,
                      pageSize: this.pageSize
                  }
              }
              this.getTotal(tempVar);
              if(this.nowQuestionType === 1 || this.nowQuestionType === 2){
                  getChoiceList(tempVar).then(res=>{
                      this.choiceData = res
                  }).catch(err=>{
                      this.$message({
                          message: err,
                          type: 'error',
                          center: true
                      })
                  })
              }
              else {
                  getOtherList(tempVar).then(res=>{
                      this.questionData = res
                  }).catch(err=>{
                      this.$message({
                          message: err,
                          type: 'error',
                          center: true
                      })
                  })
              }
              setTimeout(()=>{
                  this.loading = false
              },500)
          },
          getTotal(obj){
              getTotal(obj).then(res=>{
                  this.total = res
              }).catch(err=>{
                  this.$message({
                      message: err,
                      type: 'error',
                      center: true
                  })
              })
          },
          getType(){
              getQuestionType().then(res=>{
                  this.typeOption = res
              }).catch(err=>{
                  this.$message({
                      message: err,
                      type: 'error',
                      center: true
                  })
              })
          },
          getSubject(){
              getAllSubject().then(res=>{
                  this.subjectOption = res
              }).catch(err=>{
                  this.$message({
                      message: err,
                      type: 'error',
                      center: true
                  })
              });
              this.userSubjectNo = this.data
              this.nowSubjectNo = this.data
          },
          getKPoint(){
            const myVar = {
                subjectNo: this.nowSubjectNo
            };
            const tempVar = {
                knowPointNo: 0,
                knowPointName: '不限'
            };
            this.KPOption = [];
            getAllKPoint(myVar).then(res=>{
                this.KPOption.push(tempVar);
                res.map(item=>{
                    let myKP = {
                        knowPointNo: item.knowPointNo,
                        knowPointName: item.knowPointName
                    };
                    this.KPOption.push(myKP)
                })
            }).catch(err=>{
                this.$message({
                    message: err,
                    type: 'error',
                    center: true
                })
            })
          },
          setNowTip(){
              this.subjectOption.map(item=>{
                  if(item.subjectNo === this.nowSubjectNo){
                      this.nowTip = '当前科目：' + item.subjectName;
                      this.nowSubjectName = item.subjectName
                  }
              });
              if(this.nowKPointNo !== undefined && this.nowKPointNo !== 0) {
                  this.KPOption.map(item => {
                      if (item.knowPointNo === this.nowKPointNo) {
                          this.nowTip = this.nowTip + ' | 当前知识点：' + item.knowPointName;
                          this.nowKPName = item.knowPointName
                      }
                  });
              }
          },
          changeSubject(){
              this.getKPoint();
              this.nowKPointNo = 0;
              this.nowKPName = '无';
              this.resetPage();
              this.getList();
              setTimeout(()=>{
                  this.setNowTip()
              },200)
          },
          changeKP(){
              this.setNowTip();
              this.resetPage();
              this.getList();
          },
          changeType(){
              this.resetPage()
              this.getList()
          },
          resetPage(){
              this.choiceData = [];
              this.questionData = [];
              this.currentPage = 1;
              this.pageSize = 10
          },
          otherRowClick(row,index,e){
              this.$refs.OTable.toggleRowExpansion(row)
          },
          choiceRowClick(row,index,e){
              this.$refs.CTable.toggleRowExpansion(row)
          },
          setFinalForm(){
              if(this.questionForm.questionType === 1 || this.questionForm.questionType ===2){
                  if(this.questionForm.questionType === 1){
                      this.questionForm.answer = this.questionForm.choiceAnswer
                  }
              }
              else {
                  if(this.questionForm.questionType === 3){
                      this.questionForm.answer = this.questionForm.gfAnswer
                  }
                  else if(this.questionForm.questionType === 4){
                      if(this.questionForm.judgeAnswer === '0'){
                          this.questionForm.answer = '错'
                      }
                      else {
                          this.questionForm.answer = '对'
                      }
                  }
                  else if(this.questionForm.questionType === 5){
                      this.questionForm.answer = this.questionForm.saqAnswer
                  }
                  else {
                      this.questionForm.answer = this.questionForm.calculationAnswer
                  }
              }
          },
          changeFormSubject(){
              this.questionForm.knowPointArray = [];
              this.setFormKPoint()
          },
          setFormKPoint(){
              const myVar = {
                  subjectNo: this.questionForm.subjectNo
              };
              this.formKPOption = [];
              getAllKPoint(myVar).then(res=>{
                  this.formKPOption = res
              }).catch(err=>{
                  this.$message({
                      message: err,
                      type: 'error',
                      center: true
                  })
              })
          },
          changeFormType(){
              this.nowAddQuestionType = this.questionForm.questionType;
              this.clearFormData();
              this.$refs['questionForm'].resetFields();
              this.questionForm.questionType = this.nowAddQuestionType
          },
          handleAdd(){
            this.dialogState = 1;
            this.dialogVisible = true;
            this.judgeButton = 1;
            this.questionForm.subjectNo = this.nowSubjectNo;
            this.setFormKPoint()
          },
          addIt(){
              this.setFinalForm()
              this.$refs['questionForm'].validate(valid=>{
                  if(valid){
                      if(this.questionForm.questionType === 1 || this.questionForm.questionType === 2) {
                          addChoiceQuestion(this.questionForm).then(res=>{
                              if(res === 1){
                                  this.$message({
                                      message: '添加成功',
                                      type: 'success',
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
                      }
                      else {
                          addOtherQuestion(this.questionForm).then(res=>{
                              if(res === 1){
                                  this.$message({
                                      message: '添加成功',
                                      type: 'success',
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
                      }
                      setTimeout(()=>{
                          this.cancel();
                          this.getList()
                      },300)
                  }
                  else {
                      this.$message({
                          message: '请填写完整试题信息',
                          type: 'error',
                          center: true
                      })
                  }
              })
          },
          handleEdit(row){
              this.dialogState = 0;
              this.dialogVisible = true;
              this.judgeButton = 2;
              this.questionForm.questionType = this.nowQuestionType;
              this.questionForm.subjectNo = this.nowSubjectNo;
              this.setFormKPoint();
              this.questionForm.questionNo = row.questionNo;
              this.questionForm.knowPointArray = row.knowPointArray;
              this.questionForm.questionContent = row.questionContent;
              this.questionForm.difficulty = row.difficulty;
              this.questionForm.significance = row.significance;
              if(this.questionForm.questionType === 1 || this.questionForm.questionType === 2){
                  if(this.questionForm.questionType === 1){
                      this.questionForm.choiceAnswer = row.answer
                  }
                  else {
                      for(let i = 0; i < row.answer.length; i++){
                          this.questionForm.choiceArray.push(row.answer.charAt(i))
                      }
                  }
                  this.questionForm.choiceA = row.choiceA;
                  this.questionForm.choiceB = row.choiceB;
                  this.questionForm.choiceC = row.choiceC;
                  this.questionForm.choiceD = row.choiceD
              }
              else {
                  if(this.questionForm.questionType === 3){
                      this.questionForm.gfAnswer = row.answer
                  }
                  else if(this.questionForm.questionType === 4){
                      if(row.answer === '对'){
                          this.questionForm.judgeAnswer = '1'
                      }
                      else {
                          this.questionForm.judgeAnswer = '0'
                      }
                  }
                  else if (this.questionForm.questionType === 5){
                      this.questionForm.saqAnswer = row.answer
                  }
                  else {
                      this.questionForm.calculationAnswer = row.answer
                  }
              }
          },
          editIt(){
              this.setFinalForm();
              this.$refs['questionForm'].validate(valid => {
                  if (valid) {
                      if(this.questionForm.questionType === 1 || this.questionForm.questionType === 2) {
                          updateChoiceQuestion(this.questionForm).then(res => {
                              if (res === 1) {
                                  this.$message({
                                      message: '修改题目成功',
                                      type: 'success',
                                      center: true
                                  })
                              }
                          }).catch(err => {
                              this.$message({
                                  message: err,
                                  type: 'error',
                                  center: true
                              })
                          })
                      }
                      else {
                          updateOtherQuestion(this.questionForm).then(res => {
                              if (res === 1) {
                                  this.$message({
                                      message: '修改题目成功',
                                      type: 'success',
                                      center: true
                                  })
                              }
                          }).catch(err => {
                              this.$message({
                                  message: err,
                                  type: 'error',
                                  center: true
                              })
                          })
                      }
                      setTimeout(()=>{
                          this.cancel();
                          this.getList()
                      },300)
                  }
                  else {
                      this.$message({
                          message: '请填写完整题目信息',
                          type: 'error',
                          center: true
                      })
                  }
              });
          },
          handleDelete(row){
              this.$confirm('确定删除该题目吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  this.deleteIt(row)
              })
          },
          deleteIt(row){
            const myVar = {
                subjectNo : row.subjectNo,
                questionType : this.nowQuestionType,
                questionNo : row.questionNo
            };
            deleteOneQuestion(myVar).then(res=>{
                if (res === 1){
                    this.$message({
                        message: '删除题目成功',
                        type: 'success',
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
            setTimeout(()=>{
                this.getList()
            },300)
          },
          clearFormData(){
            this.questionForm.questionContent = undefined;
            this.questionForm.choiceA = undefined;
            this.questionForm.choiceB = undefined;
            this.questionForm.choiceC = undefined;
            this.questionForm.choiceD = undefined;
            this.questionForm.choiceAnswer = undefined;
            this.questionForm.gfAnswer = undefined;
            this.questionForm.judgeAnswer = undefined;
            this.questionForm.saqAnswer = undefined;
            this.questionForm.calculationAnswer = undefined;
            this.questionForm.multiChoiceAnswer = undefined;
              this.questionForm.choiceArray = [];
            this.questionForm.knowPointArray = [];
            this.questionForm.significance = 1;
            this.questionForm.difficulty = 1;
          },
          cancel(){
              this.dialogVisible = false;
              this.clearFormData();
              this.questionForm.questionType = undefined;
              this.questionForm.subjectNo = undefined;
              this.$refs['questionForm'].resetFields()
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
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  .controlBox{
    display: flex;
    flex-direction: row;
  }
  .buttonBox{
    margin-bottom: 10px;
    width: 16%;
  }
  .selectBox{
    margin-bottom: 10px;
    width: 16%;
  }
  .tipBox{
    flex: 1;
    margin-bottom: 10px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-radio-group{
    font-size: 30px;
  }
  .el-textarea{
    width: 90%;
    float: left;
  }
</style>
