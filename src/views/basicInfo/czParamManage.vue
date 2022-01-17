<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="description" label="描述"> </el-table-column>
    <el-table-column prop="keyValue" label="值"> </el-table-column>
    <el-table-column fixed="right" label="操作" width="100">
      <template #default="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small"
          >编辑</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-dialog :title="form.description" v-model="dialogVisible">
    <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
      <el-form-item label="值" prop="keyValue">
        <el-input
          type="text"
          oninput="value=value.replace(/[^\d.]/g,'')"
          v-model="form.keyValue"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
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
  name: "czParamManage",
  components: {},
  setup() {
    const D = reactive({
      form: {},
      formRules: {
        keyValue: [
          {
            required: true,
            message: "请输入值",
            trigger: "blur",
          },
        ],
      },
      tableData: [],
      linkData: [],
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
        }
      });
    };
    const getGroupInfo = function() {
      VersionApi.getGroupInfo({
        groupName: "metal_rate",
      }).then((res) => {
        D.tableData = res.data;
        D.dialogVisible = false;
      });
    };
    const handleClick = function(val) {
      D.dialogVisible = true;
      D.form = {
        keyValue: val.keyValue,
        id: val.id,
        description: val.description,
        configName: val.configName,
        groupName: val.groupName,
      };
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
    };
  },
});
</script>
<style scoped lang="scss">
.el-form {
  width: 300px;
}
</style>
