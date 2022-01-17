<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h3 class="mb-0">角色列表</h3>
      <el-button type="success" size="small" @click="addRole"
        >新增角色</el-button
      >
    </div>
    <el-table :data="roleList" border style="width: 100%" max-height="300">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="roleName" label="角色"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="editRolePermission(scope.row)"
            >菜单权限</el-button
          >
          <el-button type="text" size="small" @click="editRole(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteRole(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="mt-3">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h3 class="mb-0">后台用户列表</h3>
      <el-button type="success" size="small" @click="addUser"
        >新增用户</el-button
      >
    </div>
    <el-table :data="userList" border style="width: 100%" max-height="500">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="userName" label="用户名称"> </el-table-column>
      <el-table-column label="所属角色">
        <template #default="scope">
          {{ scope.row.roleId }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button type="text" size="small" @click="editUser(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteUser(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="30%"
    @close="clearForm"
  >
    <el-form
      label-position="left"
      size="small"
      :model="roleForm"
      ref="roleFormRef"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item
        prop="roleName"
        label="角色名称"
        :rules="[
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ]"
      >
        <el-input v-model="roleForm.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    :title="userDialogTitle"
    v-model="userDialogVisible"
    width="30%"
    @close="clearUserForm"
  >
    <el-form
      label-position="left"
      size="small"
      :model="userForm"
      ref="userFormRef"
      :rules="userFormRules"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item prop="userName" label="用户名称">
        <el-input v-model="userForm.userName"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="用户密码">
        <el-input v-model="userForm.password"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select
          v-model="userForm.roleId"
          placeholder="请选择用户角色"
          style="width: 100%"
        >
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="userForm.isDisable">
          <el-radio :label="1">禁用</el-radio>
          <el-radio :label="0">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUserForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <PermissionMenu
    v-show="showMenu"
    :editRolePermissionIdlist="editRolePermissionIdlist"
    @closeMenu="showMenu = false"
    @saveMenu="saveMenu"
  ></PermissionMenu>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs, unref } from "vue";
import { AuthApi } from "@/api/auth";
import { ElMessage, ElMessageBox } from "element-plus";
import PermissionMenu from "@/components/PermissionMenu";
export default defineComponent({
  name: "RolePermission",
  components: {
    PermissionMenu,
  },
  setup() {
    const userFormRules = {
      userName: [
        { required: true, message: "请输入用户名称", trigger: "blur" },
      ],
      password: [
        { required: true, message: "请输入用户密码", trigger: "blur" },
      ],
      roleId: [{ required: true, message: "请选择用户角色", trigger: "blur" }],
    };
    const state = reactive({
      showMenu: false,
      roleList: [],
      userList: [],
      dialogTitle: "",
      dialogVisible: false,
      editRoleId: "",
      editRolePermissionIdlist: [],
      roleForm: {
        roleName: "",
      },
      roleFormRef: null,
      userDialogTitle: "",
      userDialogVisible: false,
      userForm: {
        userName: "",
        password: "",
        isDisable: 0,
        roleId: "",
      },
      userFormRef: null,
    });
    const clearForm = function () {
      const form = unref(state.roleFormRef);
      form.resetFields();
      state.roleForm = {
        roleName: "",
      };
    };
    const clearUserForm = function () {
      const form = unref(state.userFormRef);
      form.resetFields();
      state.userForm = {
        userName: "",
        password: "",
        isDisable: 0,
        roleId: "",
      };
    };
    const addRole = function () {
      state.dialogTitle = "新增角色";
      state.dialogVisible = true;
    };
    const deleteRole = function (row) {
      this.$confirm(
        "此操作将删除该角色,此角色下的所有用户都将失去所有权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          //删除角色
          AuthApi.deleteRole({
            roleId: row.id,
          }).then(() => {
            ElMessage.success("删除成功");
            getRoleList();
          });
        })
        .catch(() => {});
    };

    const editRolePermission = function (row) {
      state.editRoleId = row.id;
      AuthApi.getRoleInfo({
        roleId: row.id,
      }).then((res) => {
        state.editRolePermissionIdlist = [];
        res.data.auths.forEach((item) => {
          state.editRolePermissionIdlist.push(item.id);
        });
        state.showMenu = true;
      });
    };

    const editRole = function (row) {
      state.roleForm = Object.assign({}, row);
      state.dialogTitle = "编辑角色";
      state.dialogVisible = true;
    };
    const submitRoleForm = function () {
      const form = unref(state.roleFormRef);
      if (!form) return;
      form
        .validate()
        .then((res) => {
          AuthApi.editRole(state.roleForm).then(() => {
            state.dialogVisible = false;
            ElMessage.success("操作成功");
            getRoleList();
          });
        })
        .catch((err) => {});
    };
    const getRoleList = function () {
      AuthApi.getRoleList().then((res) => {
        state.roleList = res.data;
      });
    };
    const getUserList = function () {
      AuthApi.getUserList({
        page: 1,
        pageSize: 10000,
      }).then((res) => {
        state.userList = res.data;
      });
    };

    const addUser = function () {
      state.userDialogTitle = "新增用户";
      state.userDialogVisible = true;
    };

    const editUser = function (row) {
      state.userForm = Object.assign({}, row);
      state.userForm.password = "";
      state.userDialogTitle = "编辑用户";
      state.userDialogVisible = true;
    };

    const deleteUser = function () {
      this.$confirm("此操作将删除该用户,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除用户
          getUserList();
        })
        .catch(() => {});
    };

    const saveMenu = function (list) {
      AuthApi.doAuth({
        roleId: state.editRoleId,
        authIdList: list,
      }).then(() => {
        ElMessage.success("授权成功");
      });
    };

    const submitUserForm = function () {
      const form = unref(state.userFormRef);
      if (!form) return;
      form
        .validate()
        .then(() => {
          AuthApi.editUser(state.userForm).then(() => {
            state.userDialogVisible = false;
            ElMessage.success("操作成功");
            getUserList();
          });
        })
        .catch((err) => {});
    };
    onMounted(() => {
      getRoleList();
      getUserList();
    });
    return {
      ...toRefs(state),
      addRole,
      submitRoleForm,
      clearForm,
      deleteRole,
      editRole,
      clearUserForm,
      submitUserForm,
      userFormRules,
      addUser,
      editUser,
      editRolePermission,
      saveMenu,
      deleteUser,
    };
  },
});
</script>
<style scoped lang="scss">
</style>
