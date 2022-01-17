<template>
  <div class="content">
    <el-table ref="multipleTable" :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="会员等级" prop="levelName"> </el-table-column>
      <el-table-column prop="discount" label="折扣"> </el-table-column>
      <el-table-column prop="priceForMouth" label="会员价格"> </el-table-column>
      <el-table-column prop="priceForMouth" label="是否收费">
        <template #default="scope">
          {{ scope.row.isCharge == 1 ? "是" : "否" }}
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
        >新增等级</el-button
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
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="等级名称" prop="levelName">
        <el-input v-model="ruleForm.levelName"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="priceForMouth">
        <el-input
          type="text"
          oninput="value=value.replace(/[^\d.]/g,'')  "
          v-model="ruleForm.priceForMouth"
        ></el-input>
      </el-form-item>
      <el-form-item label="优惠" prop="discount">
        <el-input
          type="text"
          oninput="value=value.replace(/[^\d.]/g,'')  "
          v-model="ruleForm.discount"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否收费" prop="isCharge">
        <el-switch
          v-model="ruleForm.isCharge"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
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
  name: "userLevelManage",
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
      ruleForm: {},
      rules: {
        levelName: [
          { required: true, message: "请输入等级名称", trigger: "blur" },
        ],
        priceForMouth: [
          { required: true, message: "请输入会员价格", trigger: "blur" },
        ],
        discount: [
          { required: true, message: "请输入优惠比例", trigger: "blur" },
        ],
      },
    });
    const deleteLevel = function(val) {
      MemberApi.deleteLevel({
        id: val.id,
      }).then(() => {
        ElMessage.success("成功");
        getMemberUserLevel();
      });
    };
    const getMemberUserLevel = function() {
      MemberApi.getMemberUserLevel({
        page: D.currentPage,
        pageSize: D.pageSize,
      }).then((res) => {
        D.tableData = res.data;
        // D.total = res.data.total;
      });
    };
    const submitForm = function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          MemberApi.editLevel(D.ruleForm).then(() => {
            D.dialogVisible = false;
            ElMessage.success("成功");
            D.ruleForm = {};
            getMemberUserLevel();
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
          deleteLevel(val);
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
          levelName: "",
          priceForMouth: "",
          discount: "",
          isCharge: "",
        };
      } else if (type == "edit") {
        D.formType = "编辑";
        D.ruleForm = {
          levelName: val.levelName,
          priceForMouth: val.priceForMouth,
          discount: val.discount,
          id: val.id,
          isCharge: val.isCharge,
        };
      }
    };
    const resetForm = function(formName) {
      this.$refs[formName].resetFields();
      D.ruleForm = {};
      D.dialogVisible = false;
    };
    // const handleCurrentChange = function (number) {
    //   if (D.currentPage == number) {
    //     return;
    //   } else {
    //     D.currentPage = number;
    //     getMemberUserLevel();
    //   }
    // };
    // const handleSizeChange = function (number) {
    //   if (D.pageSize == number) {
    //     return;
    //   } else {
    //     D.pageSize = number;
    //     getMemberUserLevel();
    //   }
    // };
    onMounted(() => {
      getMemberUserLevel();
    });
    return {
      ...toRefs(D),
      submitForm,
      resetForm,
      //   handleCurrentChange,
      getMemberUserLevel,
      openDialog,
      //   handleSizeChange,
      deleteLevel,
      deleteFun,
    };
  },
});
</script>
<style scoped lang="scss"></style>
