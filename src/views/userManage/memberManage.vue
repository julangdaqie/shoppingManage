<template>
  <div class="searchWrap">
    <el-form
      :inline="true"
      :model="searchForm"
      size="small"
      @keyup.enter="getPagingAppMembers"
    >
      <el-form-item>
        <el-input
          v-model="searchForm.searchText"
          placeholder="搜索关键词"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.userLevel" placeholder="选择会员类别">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in memberLevelList"
            :key="item.id"
            :label="item.levelName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPagingAppMembers">查询</el-button>
        <el-button type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="content">
    <el-table
      ref="multipleTable"
      :data="memberData"
      border
      style="width: 100%"
      max-height="600"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="loginTel" label="登录手机号" width="120">
      </el-table-column>
      <el-table-column prop="userName" label="真实姓名"> </el-table-column>
      <el-table-column prop="nickName" label="昵称"> </el-table-column>
      <el-table-column label="会员级别">
        <template #default="scope">
          <span :style="filterLevelStyle(scope.row.userLevel)">{{
            scope.row.userLevelText
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="registrationTime" label="注册时间">
      </el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间">
      </el-table-column>
      <el-table-column prop="expirationTime" label="会员到期时间">
      </el-table-column>
      <el-table-column prop="location" label="地址">
        <template #default="scope">
          {{ filterLocation(scope.row.location) }}
        </template>
      </el-table-column>
      <el-table-column label="角色">
        <template #default="scope">
          {{ filterRole(scope.row.memberRoleId) }}
        </template>
      </el-table-column>
      <el-table-column label="推荐人"> </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          {{ scope.row.isDisable ? "禁用" : "正常" }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button @click="editMember(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="unPhone(scope.row.id)"
            >解绑手机</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="deleteMember([scope.row.id])"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="d-flex align-items-center mt-3 justify-content-between">
    <div class="flex-shrink-0">
      <el-button type="success" size="small" @click="addMember"
        >新增用户</el-button
      >
      <el-button
        type="danger"
        size="small"
        @click="deleteMember(selectedIdList)"
        >批量删除</el-button
      >
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      background
      :current-page="searchForm.page"
      :page-size="searchForm.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="searchForm.total"
    >
    </el-pagination>
  </div>

  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="600px"
    @close="clearForm"
  >
    <el-form
      label-position="left"
      size="small"
      label-width="100px"
      :model="dataForm"
      :rules="dataFormRules"
      ref="dataFormRef"
    >
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="dataForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="登录手机号" prop="loginTel">
        <el-input v-model="dataForm.loginTel"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" :prop="editStatus ? 'none' : 'password'">
        <el-input v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="dataForm.nickName"></el-input>
      </el-form-item>
      <el-form-item label="绑定的微信号">
        <el-input v-model="dataForm.wxId"></el-input>
      </el-form-item>
      <el-form-item label="身份证">
        <el-input v-model="dataForm.identityCard"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="dataForm.memberRoleId" placeholder="请选择角色">
          <el-option
            v-for="item in roleData"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="到期时间"
        :prop="dataForm.userLevel != 1 ? 'expirationTime' : 'none'"
      >
        <el-date-picker
          style="width: 100%"
          v-model="dataForm.expirationTime"
          type="date"
          placeholder="选择到期日期"
          format="YYYY 年 MM 月 DD 日"
          value-format="YYYY/MM/DD"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="会员类型">
        <el-radio-group v-model="dataForm.userLevel">
          <el-radio
            v-for="item in memberLevelList"
            :key="item.id"
            :label="item.id"
            >{{ item.levelName }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="dataForm.isDisable">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDataForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  unref,
  computed,
} from "vue";
import { MemberApi } from "@/api/member";
import { ElMessage, ElMessageBox } from "element-plus";

export default defineComponent({
  name: "memberManage",
  setup() {
    const dataFormRules = {
      userName: [
        { required: true, message: "请输入登录名称", trigger: "blur" },
      ],
      loginTel: [
        { required: true, message: "请输入登录手机号", trigger: "blur" },
      ],
      password: [
        { required: true, message: "请输入登录密码", trigger: "blur" },
      ],
      expirationTime: [
        { required: true, message: "请输入到期时间", trigger: "blur" },
      ],
    };
    const state = reactive({
      selectedIdList: [],
      editStatus: false,
      memberLevelList: [],
      dataFormRef: null,
      searchForm: {
        searchText: "",
        userLevel: "",
        page: 1,
        pageSize: 10,
        total: 0,
      },
      memberData: [],
      multipleSelection: [],
      dialogTitle: "",
      dialogVisible: false,
      dataForm: {
        userName: "",
        password: "",
        loginTel: "",
        wxId: "",
        deviceId: "",
        nickName: "",
        isDisable: 0,
        userLevel: 1,
        expirationTime: "",
        identityCard: "",
        memberRoleId: "",
      },
      roleData: [],
    });
    const addMember = function() {
      state.dialogTitle = "添加会员";
      state.dialogVisible = true;
    };

    const getPagingAppMembers = function() {
      MemberApi.getPagingAppMembers(state.searchForm).then((res) => {
        state.memberData = res.data.list;
        state.searchForm.total = res.data.total;
      });
    };
    const handleCurrentChange = function(page) {
      state.searchForm.page = page;
      getPagingAppMembers();
    };
    const handleSelectionChange = function(val) {
      let selectedIdList = [];
      val.forEach((item) => {
        selectedIdList.push(item.id);
      });
      state.selectedIdList = selectedIdList;
    };
    const editMember = function(row) {
      state.dataForm = Object.assign({}, row);
      state.dialogTitle = "编辑用户";
      state.dialogVisible = true;
      state.editStatus = true;
    };

    const deleteMember = function(idList) {
      ElMessageBox.confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          MemberApi.patchDeleteMember({
            idList,
          }).then(() => {
            ElMessage.success("删除成功");
            getPagingAppMembers();
          });
        })
        .catch(() => {});
    };

    const clearForm = function() {
      const form = unref(state.dataFormRef);
      form.resetFields();
      state.dataForm = {
        userName: "",
        password: "",
        loginTel: "",
        wxId: "",
        deviceId: "",
        nickName: "",
        isDisable: 0,
        userLevel: 1,
        expirationTime: "",
        identityCard: "",
        memberRoleId: "",
      };
      state.editStatus = false;
    };

    const getMemberRoleList = function() {
      MemberApi.getMemberRoleList({
        page: 1,
        pageSize: 9999,
      }).then((res) => {
        state.roleData = res.data;
      });
    };
    const submitDataForm = function() {
      const form = unref(state.dataFormRef);
      state.dataForm.expirationTime = state.dataForm.expirationTime.concat(
        " 00:00:00"
      );
      if (!form) return;
      form
        .validate()
        .then(() => {
          //添加会员
          MemberApi.editMember(state.dataForm)
            .then((res) => {
              state.dialogVisible = false;
              ElMessage.success("操作成功");
              getPagingAppMembers();
            })
            .catch((err) => {
              ElMessage.error("操作失败");
            });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getMemberUserLevel = function() {
      MemberApi.getMemberUserLevel(state.searchForm).then((res) => {
        state.memberLevelList = res.data;
      });
    };

    const filterLevelStyle = function(userLevel) {
      if (userLevel != 1) {
        return "color:red";
      }
    };
    const filterRole = function(val) {
      let res = state.roleData.find((x) => {
        return x.id == val;
      });
      return res.roleName;
    };
    const filterLocation = function(val) {
      if (val) {
        let res = JSON.parse(val);
        return res.city;
      } else {
        return "未知";
      }
    };
    const unPhone = function(id) {
      console.log(id);
      ElMessageBox.confirm("确认操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          MemberApi.unbindDevice({
            memberId: id,
          }).then(() => {
            getPagingAppMembers();
          });
        })
        .catch(() => {});
    };
    onMounted(() => {
      getPagingAppMembers();
      getMemberUserLevel();
      getMemberRoleList();
    });

    return {
      ...toRefs(state),
      handleCurrentChange,
      editMember,
      handleSelectionChange,
      getMemberRoleList,
      addMember,
      clearForm,
      submitDataForm,
      getPagingAppMembers,
      deleteMember,
      filterLevelStyle,
      filterRole,
      filterLocation,
      unPhone,
      dataFormRules,
    };
  },
});
</script>
<style scoped lang="scss">
.searchWrap {
  display: flex;
  align-items: center;

  :deep .el-input {
    width: 150px;
  }
}
</style>
