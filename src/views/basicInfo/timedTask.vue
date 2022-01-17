<template>
  <div class="content">
    <el-table ref="multipleTable" :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="cron表达式" prop="cron"> </el-table-column>
      <el-table-column prop="packageName" label="包名"> </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <div class="d-flex justify-content-center">
            <el-switch
              v-model="scope.row.isBegin"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @click="changeIsBeginFun(scope.row.id, scope.row.isBegin)"
            ></el-switch>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <!-- <el-button
            @click="openDialog('edit', scope.row)"
            type="text"
            size="small"
            >编辑</el-button
          > -->
          <el-button type="text" size="small" @click="deleteFun(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="d-flex align-items-center mt-3 justify-content-between">
    <div class="flex-shrink-0">
      <el-button type="success" size="small" @click="openDialog('new')"
        >新增</el-button
      >
    </div>
  </div>
  <el-dialog :title="formType" v-model="dialogVisible">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleFormRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="cron表达式" prop="cron">
        <el-input v-model="ruleForm.cron"></el-input>
      </el-form-item>
      <el-form-item label="包名" prop="packageName">
        <el-input v-model="ruleForm.packageName"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="isBegin">
        <el-radio-group v-model="ruleForm.isBegin">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleFormRef')"
          >确定</el-button
        >
        <el-button @click="resetForm('ruleFormRef')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { TimedTaskApi } from "@/api/timedTask";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "timedTask",
  setup() {
    const D = reactive({
      multipleSelection: [],
      dialogVisible: false,
      selectedId: "",
      formType: "",
      ruleForm: {},
      advertisingList: [],
      tableData: [],
      doChange: false,
      rules: {
        cron: [
          { required: true, message: "请输入cron表达式", trigger: "blur" },
        ],
        packageName: [
          { required: true, message: "请输入包名", trigger: "blur" },
        ],
        cron: [
          { required: true, message: "请输入cron表达式", trigger: "blur" },
        ],
        isBegin: [{ required: true, message: "是否启用", trigger: "change" }],
      },
    });
    const deleteTimedTask = function (val) {
      TimedTaskApi.deleteTimedTask({
        timedTaskId: val.id,
      }).then(() => {
        ElMessage.success("成功");
        getTimedTaskList();
      });
    };
    const getTimedTaskList = function () {
      TimedTaskApi.getTimedTaskList({}).then((res) => {
        D.tableData = res.data;
      });
    };
    const submitForm = function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          TimedTaskApi.addTimedTask(D.ruleForm).then(() => {
            D.dialogVisible = false;
            ElMessage.success("成功");
            D.ruleForm = {};
            getTimedTaskList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    const deleteFun = function (val) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTimedTask(val);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    };
    const changeIsBeginFun = function (id, isBegin) {
      if (isBegin) {
        TimedTaskApi.start({
          timedTaskId: id,
        }).then(() => {
          ElMessage.success("成功");
          getTimedTaskList();
        });
      } else {
        TimedTaskApi.stop({
          timedTaskId: id,
        }).then(() => {
          ElMessage.success("成功");
          getTimedTaskList();
        });
      }
    };
    const openDialog = function (type, val) {
      D.dialogVisible = true;
      if (type == "new") {
        D.formType = "添加";
        D.ruleForm = {
          cron: "",
          packageName: "",
          isBegin: "",
        };
      }
      //    else if (type == "edit") {
      //     D.formType = "编辑";
      //     D.ruleForm = {
      //       cron: val.cron,
      //       packageName: val.packageName,
      //       sort: val.sort,
      //       id: val.id,
      //       isBegin: val.isBegin,
      //     };
      //   }
    };
    const resetForm = function (formName) {
      this.$refs[formName].resetFields();
      D.ruleForm = {};
      D.dialogVisible = false;
    };
    const formatter = function (row, column) {
      const item = D.advertisingList.find((item) => {
        return item.id == row.categoryId;
      });
      if (item) {
        return item.categoryName;
      } else {
        return;
      }
    };
    onMounted(() => {
      getTimedTaskList();
    });
    return {
      ...toRefs(D),
      submitForm,
      resetForm,
      getTimedTaskList,
      openDialog,
      deleteTimedTask,
      deleteFun,
      formatter,
      changeIsBeginFun,
    };
  },
});
</script>
<style scoped lang="scss">
</style>
