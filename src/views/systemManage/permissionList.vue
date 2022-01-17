<template>
  <el-tabs tab-position="left" type="border-card" style="height: 800px;overflow-y: auto;">
    <el-tab-pane label="页面权限">
      <el-button
        type="primary"
        size="small"
        class="mb-2"
        @click="addPagePermission"
        >新增页面权限</el-button
      >
      <el-table :data="pagePermissionData" stripe style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="authorityName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="url" label="权限路径">
        </el-table-column>
        <el-table-column width="110"
          prop="authType"
          label="权限类型(1代表页面权限,0代表接口权限)"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button
              @click="editPagePermission(scope.row)"
              type="text"
              size="small"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="deletePermission(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="接口权限">
      <el-button
        type="primary"
        size="small"
        class="mb-2"
        @click="addApiPermission"
        >新增接口权限</el-button
      >
      <el-table :data="apiPermissionData" stripe style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="authorityName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="url" label="权限路径" width="180">
        </el-table-column>
        <el-table-column
          prop="authType"
          label="权限类型(1代表页面权限,0代表接口权限)"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button
              @click="editApiPermission(scope.row)"
              type="text"
              size="small"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="deletePermission(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>

  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="30%"
    @close="clearForm"
  >
    <el-form
      label-position="left"
      size="small"
      label-width="100px"
      :model="permissionForm"
      :rules="permissionRules"
      ref="permissionFormRef"
    >
      <el-form-item label="权限名称" prop="authorityName">
        <el-input v-model="permissionForm.authorityName"></el-input>
      </el-form-item>
      <el-form-item label="权限路径" prop="url">
        <el-input v-model="permissionForm.url"></el-input>
      </el-form-item>
      <el-form-item label="权限类型" prop="authType">
        <el-radio-group v-model="permissionForm.authType">
          <el-radio :label="1">页面权限</el-radio>
          <el-radio :label="0">接口权限</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPermissionForm"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, toRefs, unref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { AuthApi } from "@/api/auth";

export default defineComponent({
  name: "permissionList",
  setup() {
    const permissionRules = {
      authorityName: [
        { required: true, message: "请输入权限名称", trigger: "blur" },
      ],
      url: [{ required: true, message: "请输入权限链接", trigger: "blur" }],
      authType: [
        { required: true, message: "请选择权限类型", trigger: "blur" },
      ],
    };
    const state = reactive({
      permissionFormRef: null,
      pagePermissionData: [],
      apiPermissionData: [],
      dialogVisible: false,
      permissionForm: {
        authorityName: "",
        url: "",
        isManage: 1,
        authType: "",
      },
      dialogTitle: "",
    });
    const clearForm = function () {
      const form = unref(state.permissionFormRef);
      form.resetFields();
      state.permissionForm = {
        authorityName: "",
        url: "",
        isManage: 1,
        authType: "",
      };
    };
    const addPagePermission = function () {
      state.dialogTitle = "新增页面权限";
      state.dialogVisible = true;
      state.permissionForm.authType = 1;
    };
    const addApiPermission = function () {
      state.dialogTitle = "新增接口权限";
      state.dialogVisible = true;
      state.permissionForm.authType = 0;
    };
    const editPagePermission = function (row) {
      state.dialogTitle = "编辑页面权限";
      state.dialogVisible = true;
      state.permissionForm = Object.assign({}, row);
    };
    const editApiPermission = function (row) {
      state.dialogTitle = "编辑接口权限";
      state.dialogVisible = true;
      state.permissionForm = Object.assign({}, row);
    };
    const deletePermission = function (row) {
      ElMessageBox.confirm("此操作将删除此权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          AuthApi.deleteAuth({
            authId: row.id,
          }).then(() => {
            ElMessage.success("删除成功");
            getAllPageAuth();
            getAllApiAuth();
          });
        })
        .catch(() => {});
    };
    const submitPermissionForm = function () {
      const form = unref(state.permissionFormRef);
      if (!form) return;
      form
        .validate()
        .then(() => {
          AuthApi.editAuth(state.permissionForm).then((res) => {
            state.dialogVisible = false;
            ElMessage.success("操作成功");
            getAllPageAuth();
            getAllApiAuth();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getAllApiAuth = function () {
      AuthApi.getAllApiAuth().then((res) => {
        state.apiPermissionData = res.data;
      });
    };
    const getAllPageAuth = function () {
      AuthApi.getAllPageAuth().then((res) => {
        state.pagePermissionData = res.data;
      });
    };
    onMounted(() => {
      getAllPageAuth();
      getAllApiAuth();
    });
    return {
      ...toRefs(state),
      clearForm,
      addPagePermission,
      addApiPermission,
      submitPermissionForm,
      getAllPageAuth,
      getAllApiAuth,
      permissionRules,
      editPagePermission,
      editApiPermission,
      deletePermission,
    };
  },
});
</script>
<style scoped lang="scss">
</style>