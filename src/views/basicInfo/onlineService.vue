<template>
  <el-form ref="formRef" :model="formModel" label-width="auto">
    <el-form-item
      :label="formModel.description"
      prop="keyValue"
      :rules="[{ required: true, message: '请输入接口地址', trigger: 'blur' }]"
    >
      <el-input
        type="textarea"
        :rows="5"
        v-model="formModel.keyValue"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('formRef')">更新</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { VersionApi } from "@/api/version";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "onlineService",
  components: {},
  setup() {
    const D = reactive({
      formModel: {},
    });
    const submitForm = function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editConfig();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    const editConfig = function () {
      VersionApi.editConfig({
        groupName: "chat",
        configName: "url",
        keyValue: D.formModel.keyValue,
        id: D.formModel.id,
      }).then((res) => {
        if (res.success) {
          getGroupInfo();
          ElMessage.success("更新成功");
        }
      });
    };
    const getGroupInfo = function () {
      VersionApi.getGroupInfo({
        groupName: "chat",
      }).then((res) => {
        D.formModel = res.data[0];
      });
    };
    onMounted(() => {
      getGroupInfo();
    });
    return {
      ...toRefs(D),
      getGroupInfo,
      submitForm,
      editConfig,
    };
  },
});
</script>
<style scoped lang="scss">
.el-form {
  width: 500px;
}
</style>
