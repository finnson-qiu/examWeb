<template>
  <div id="root" class="rootContainer">
    <div style="width: 15%;margin-top: 1%">
      <el-button style="float: left;margin-top: 5px" type="primary" size="small" @click="handleGene">生成试卷<i class="el-icon-document-add el-icon--right"></i></el-button>
    </div>
    <div class="mainPaper">
      <el-card class="box-card">
        <div slot="header" style="margin-top: 5px;margin-bottom: 5px">
          <div style="font-size: 20px;text-align: center">{{paperName}}</div>
        </div>
        <br/>
        <div v-for="question in paperQuestions" :key="question.questionNo" style="margin-bottom: 10px;text-align: left;font-size: 14px">
          <div id="title" style="font-size: 18px;text-align: left" v-if="question.questionType === -1">
            {{question.questionContent}}
          </div>
          <div id="question" class="question" style="font-size: 16px" v-if="question.questionType !== -1">
            {{ question.questionContent }}
          </div>
          <div id="options" class="options" v-if="question.questionType === 1 || question.questionType === 2">
            <div style="display: flex">
              <div style="width: 48%;margin-left: 20px;margin-top: 5px;margin-bottom: 5px">
                A、{{question.choiceA}}
              </div>
              <div style="width: 48%;margin-left: 20px;margin-top: 5px;margin-bottom: 5px">
                B、{{question.choiceB}}
              </div>
            </div>
            <div style="display: flex">
              <div style="width: 48%;margin-left: 20px;margin-top: 5px;margin-bottom: 5px">
                C、{{question.choiceC}}
              </div>
              <div style="width: 48%;margin-left: 20px;margin-top: 5px;margin-bottom: 5px">
                D、{{question.choiceD}}
              </div>
            </div>
          </div>
          <div id="placeholder" class="placeholder" v-if="question.questionType !== 1 && question.questionType !== 2">
          </div>
        </div>
      </el-card>
    </div>
    <div style="width: 15%;margin-top: 1%">
      <el-button style="float: right;margin-top: 5px" type="primary" size="small" @click="exportPaper">导出Word<i class="el-icon-download el-icon--right"></i></el-button>
    </div>
    <el-dialog title="选择生成试卷" :visible.sync="dialogVisible" style="width: 100%;margin-left: auto;margin-right: auto" @close="cancel">
      <el-form :model="selectForm" ref="selectForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="科目选择：" prop="subjectNo" required>
          <el-select v-model="selectForm.subjectNo" placeholder="请选择要生成试卷的科目"  value="" style="float: left;width: 76%">
            <el-option v-for="item in subjectOption" :key="item.subjectNo" :label="item.subjectName"
                       :value="item.subjectNo" :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <div style="display: flex">
          <div style="width: 50%">
            <el-form-item label="试卷难度:" prop="difficulty" required>
              <el-input-number v-model="selectForm.difficulty" :min="2" :max="9" style="float: left"></el-input-number>
            </el-form-item>
          </div>
          <div style="width: 20%;font-size: 26px">
              <el-checkbox v-model="selectForm.diy" style="margin-left: 0">试卷自定义</el-checkbox>
          </div>
        </div>
        <div style="display: flex">
          <div style="width: 50%">
            <el-form-item label="单选题数量:" prop="choiceNum" v-if="selectForm.diy === true">
              <el-input-number v-model="selectForm.choiceNum" :min="0" :max="9" style="float: left"></el-input-number>
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item label="多选题数量:" prop="multiChoiceNum" v-if="selectForm.diy === true">
              <el-input-number v-model="selectForm.multiChoiceNum" :min="0" :max="9" style="float: left"></el-input-number>
            </el-form-item>
          </div>
        </div>
        <div style="display: flex">
          <div style="width: 50%">
            <el-form-item label="填空题数量:" prop="gfNum" v-if="selectForm.diy === true">
              <el-input-number v-model="selectForm.gfNum" :min="0" :max="9" style="float: left"></el-input-number>
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item label="判断题数量:" prop="judgeNum" v-if="selectForm.diy === true">
              <el-input-number v-model="selectForm.judgeNum" :min="0" :max="9" style="float: left"></el-input-number>
            </el-form-item>
          </div>
        </div>
        <div style="display: flex">
          <div style="width: 50%">
            <el-form-item label="简答题数量:" prop="SaqNum" v-if="selectForm.diy === true">
              <el-input-number v-model="selectForm.SaqNum" :min="0" :max="9" style="float: left"></el-input-number>
            </el-form-item>
          </div>
          <div style="width: 50%">
            <el-form-item label="计算题数量:" prop="calcNum" v-if="selectForm.diy === true">
              <el-input-number v-model="selectForm.calcNum" :min="0" :max="9" style="float: left"></el-input-number>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="getPaper" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {genePaper} from "../api/paper";
  import saveAs from "file-saver"
  import "../../static/js/jquery.wordexport"
  import {getAllSubject} from "../api/subject";
  export default {
    name: "genePaper",
    data(){
      return{
        ifGene:false,
        paperName: undefined,
        paperQuestions:undefined,
        dialogVisible: false,
        subjectOption:[],
        selectForm:{
          subjectNo:undefined,
          difficulty:2,
          choiceNum:0,
          multiChoiceNum:0,
          gfNum:0,
          judgeNum:0,
          SaqNum:0,
          calcNum:0,
          diy:false
        },

      }
    },
    created() {
      // this.getPaper()
      this.getSubject()
    },
    methods:{
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
      },
      getPaper(){
        genePaper().then(res => {
          this.paperQuestions = res
        }).catch(err=>{
          this.$message({
            message: err,
            type: 'error',
            center: true
          })
        });
        this.ifGene = true;
        this.cancel();
        this.dialogVisible = false
      },
      handleGene(){
        this.dialogVisible = true
      },
      cancel(){
        this.$refs["selectForm"].resetFields();
        this.selectForm.diy = false;
        this.dialogVisible = false
      },
      exportPaper(){
        if (this.ifGene) {
          $(".box-card").wordExport(this.paperName)
        }
        else {
          this.$message({
            message: '还未生成试卷，无法导出',
            type: 'warning',
            center: true
          })
        }
      }
    }

  }
</script>

<style scoped>
  .rootContainer{
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
  }
  .options{
    margin-top: 5px;
  }

  /*.box-card{*/
  /* */
  /*}*/
  .mainPaper{
    margin: 1% auto;
    width: 70%;
  }
  .placeholder{
    height: 20px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
