<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="groupName" label="组名"> </el-table-column>
    <el-table-column prop="configName" label="参数名"> </el-table-column>
    <el-table-column prop="description" label="描述"> </el-table-column>
    <el-table-column prop="keyValue" label="内容"> </el-table-column>
    <el-table-column fixed="right" label="操作" width="100">
      <template #default="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small"
          >编辑</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="编辑" v-model="dialogVisible" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="formRules">
      <el-form-item :label="form.description" prop="keyValue">
        <el-input type="text" v-model="form.keyValue"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('formRef')"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { VersionApi } from "@/api/version";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "appVersion",
  components: {},
  setup() {
    const D = reactive({
      form: {},
      formRules: {
        keyValue: [
          {
            required: true,
            message: "请输入版本号",
            trigger: "blur",
          },
        ],
      },
      tableData: [],
      dialogVisible: false,
    });
    const checkKeyValue = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("版本号不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        }
      }, 1000);
    };
    const submitForm = function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editConfig();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    const editConfig = function() {
      VersionApi.editConfig({
        groupName: D.form.groupName,
        configName: D.form.configName,
        keyValue: D.form.keyValue,
        id: D.form.id,
      }).then((res) => {
        if (res.success) {
          getGroupInfo();
          ElMessage.success("更新成功");
          D.dialogVisible = false;
        }
      });
    };
    const getGroupInfo = function() {
      D.tableData = [];
      VersionApi.getGroupInfo({
        groupName: "app_versions",
      }).then((res) => {
        D.tableData = D.tableData.concat(res.data);
      });
      VersionApi.getGroupInfo({
        groupName: "ios_check",
      }).then((res) => {
        D.tableData = D.tableData.concat(res.data);
      });
    };
    const handleClick = function(val) {
      D.dialogVisible = true;
      D.form = val;
    };
    const handleClose = function() {
      D.form = {};
      D.dialogVisible = false;
    };
    onMounted(() => {
      getGroupInfo();
    });
    return {
      ...toRefs(D),
      getGroupInfo,
      submitForm,
      checkKeyValue,
      editConfig,
      handleClick,
      handleClose,
    };
  },
});
</script>
<style scoped lang="scss">
.el-form {
}
</style>
