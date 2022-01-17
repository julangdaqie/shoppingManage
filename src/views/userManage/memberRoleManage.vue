<template>
  <div class="content">
    <el-table ref="multipleTable" :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="roleName" label="角色名"> </el-table-column>
      <el-table-column prop="rebateRate" label="反利率">
        <template #default="scope">
          {{ calculate(scope.row.rebateRate) }}%</template
        >
      </el-table-column>
      <el-table-column type="expand" label="任务" width="70">
        <template #default="props">
          <el-table :data="props.row.taskJson" style="width: 100%">
            <el-table-column prop="peopleNum" label="邀请人数">
            </el-table-column>
            <el-table-column prop="rebateRate" label="反利率">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button
            @click="openDialog('edit', scope.row)"
            type="text"
            size="small"
            >编辑</el-button
          >
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
        >新增角色</el-button
      >
      <el-button type="danger" size="small">批量删除</el-button>
    </div>
    <!-- <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :currentPage="currentPage"
        :page-sizes="[5, 15, 25, 100]"
      >
      </el-pagination>
    </div> -->
  </div>
  <el-dialog :title="formType" v-model="dialogVisible">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleFormRef"
      label-width="70px"
      class="demo-ruleForm"
    >
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="ruleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="反利率" prop="rebateRate">
        <el-input
          type="text"
          oninput="value=value.replace(/[^\d.]/g,'')"
          v-model="ruleForm.rebateRate"
        ></el-input>
      </el-form-item>
      <el-form-item label="任务" prop="rebateRate">
        <el-row :gutter="10">
          <el-col :span="10"> 邀请人数 </el-col>
          <el-col :span="10"> 反利率 </el-col>
          <el-col :span="4">
            <el-button type="text" @click="newInvitation">新增</el-button>
          </el-col>
        </el-row>
        <el-row
          :gutter="10"
          v-for="(item, index) in ruleForm.taskJson"
          :key="index"
        >
          <el-col :span="10">
            <el-input
              size="mini"
              placeholder="邀请人数"
              v-model="item.peopleNum"
              type="number"
            ></el-input>
          </el-col>
          <el-col :span="10">
            <el-input
              size="mini"
              placeholder="反利率"
              v-model="item.rebateRate"
              type="text"
              oninput="value=value.replace(/[^\d.]/g,'')"
            ></el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              size="mini"
              type="text"
              style="font-size: 14px"
              @click="deleteInvitation(index)"
              >删除</el-button
            >
          </el-col>
        </el-row>
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
import { MemberApi } from "@/api/member";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "memberRoleManage",
  setup() {
    const D = reactive({
      //   total: 0,
      //   currentPage: 1,
      //   pageSize: 5,
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      selectedId: "",
      formType: "",
      ruleForm: {
        taskJson: [],
      },
      invitationData: [
        {
          peopleNum: 1,
          rebateRate: 2,
        },
      ],
      rules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
        rebateRate: [
          {
            required: true,
            message: "请输入反利率",
            trigger: "blur",
          },
        ],
      },
    });
    const deleteInvitation = function(index) {
      D.ruleForm.taskJson.splice(index, 1);
    };
    const newInvitation = function() {
      D.ruleForm.taskJson.push({
        peopleNum: 0,
        rebateRate: 0,
      });
    };
    // const checkNumber = function (val) {
    //   content.val = val.match(/^\d*(\.?\d{0,2})/g)[0] || null;
    // };
    const calculate = function(val) {
      return (val * 100).toFixed(2);
    };
    const deleteMemberRole = function(val) {
      MemberApi.deleteMemberRole({
        id: val.id,
      }).then(() => {
        ElMessage.success("成功");
        getMemberRoleList();
      });
    };
    const getMemberRoleList = function() {
      MemberApi.getMemberRoleList({
        page: D.currentPage,
        pageSize: D.pageSize,
      }).then((res) => {
        D.tableData = res.data;
        D.tableData.forEach((item) => {
          if (!item.taskJson) {
            item.taskJson = [];
          } else {
            item.taskJson = JSON.parse(item.taskJson);
          }
        });
        // D.total = res.data.total;
      });
    };
    const submitForm = function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          D.ruleForm.taskJson = JSON.stringify(D.ruleForm.taskJson);
          MemberApi.editMemberRole(D.ruleForm).then(() => {
            D.dialogVisible = false;
            ElMessage.success("成功");
            D.ruleForm = {};
            getMemberRoleList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    const deleteFun = function(val) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteMemberRole(val);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    };
    const openDialog = function(type, val) {
      D.dialogVisible = true;
      if (type == "new") {
        D.formType = "添加";
        D.ruleForm = {
          rebateRate: "",
          roleName: "",
          taskJson: [],
        };
      } else if (type == "edit") {
        D.formType = "编辑";
        D.ruleForm = {
          rebateRate: val.rebateRate,
          roleName: val.roleName,
          id: val.id,
          taskJson: val.taskJson,
        };
      }
    };
    const resetForm = function(formName) {
      this.$refs[formName].resetFields();
      D.ruleForm = {
        taskJson: [],
      };
      D.dialogVisible = false;
    };
    // const handleCurrentChange = function (number) {
    //   if (D.currentPage == number) {
    //     return;
    //   } else {
    //     D.currentPage = number;
    //     getMemberRoleList();
    //   }
    // };
    // const handleSizeChange = function (number) {
    //   if (D.pageSize == number) {
    //     return;
    //   } else {
    //     D.pageSize = number;
    //     getMemberRoleList();
    //   }
    // };
    onMounted(() => {
      getMemberRoleList();
    });
    return {
      ...toRefs(D),
      submitForm,
      resetForm,
      //   handleCurrentChange,
      getMemberRoleList,
      openDialog,
      //   handleSizeChange,
      deleteMemberRole,
      deleteFun,
      calculate,
      // checkNumber,
      newInvitation,
      deleteInvitation,
    };
  },
});
</script>
<style scoped lang="scss"></style>
