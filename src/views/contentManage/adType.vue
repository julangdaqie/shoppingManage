<template>
  <div class="searchWrap">
    <el-form :inline="true" :model="searchForm" size="small">
      <el-form-item>
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索关键词"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <div style="color: red">
      注：当前内容，仅由开发人员维护，其他人不可随意修改数据
    </div>
  </div>
  <div class="content">
    <el-table ref="multipleTable" :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="categoryName" label="分类名" width="120">
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <div class="d-flex justify-content-center">
            <el-tag
              :type="scope.row.status == 1 ? 'success' : 'danger'"
              size="medium"
              >{{ scope.row.status == 1 ? "启用" : "禁用" }}</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="width" label="宽" width="120"> </el-table-column>
      <el-table-column prop="height" label="高" width="120"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
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
        >新增广告类型</el-button
      >
      <el-button type="danger" size="small">批量删除</el-button>
    </div>
    <div>
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
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="ruleForm.categoryName"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="status">
        <el-switch
          active-value="1"
          inactive-value="0"
          v-model="ruleForm.status"
        ></el-switch>
      </el-form-item>
      <el-form-item label="宽" prop="width">
        <el-input
          type="text"
          oninput="value=value.replace(/[^\d.]/g,'')"
          v-model="ruleForm.width"
        ></el-input>
      </el-form-item>
      <el-form-item label="高" prop="height">
        <el-input
          type="text"
          oninput="value=value.replace(/[^\d.]/g,'')"
          v-model="ruleForm.height"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
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
import { AdvertisingApi } from "@/api/advertising";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "adType",
  setup() {
    const D = reactive({
      searchForm: {
        keyword: "",
        startTime: "",
        endTime: "",
        memberCategory: 0,
      },
      total: 0,
      currentPage: 1,
      pageSize: 5,
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      selectedId: "",
      formType: "",
      ruleForm: {},
      rules: {
        categoryName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        width: [
          { required: true, message: "请输入宽度", trigger: "blur" },
          { type: "number", message: "宽度必须为数字值" },
        ],
        height: [
          { required: true, message: "请输入高度", trigger: "blur" },
          { type: "number", message: "高度必须为数字值" },
        ],
      },
    });
    const deleteAdvertisingCategory = function(val) {
      AdvertisingApi.deleteAdvertisingCategory({
        id: val.id,
      }).then(() => {
        ElMessage.success("成功");
        getAdvertisingCategoryList();
      });
    };
    const getAdvertisingCategoryList = function() {
      AdvertisingApi.getAdvertisingCategoryList({
        page: D.currentPage,
        pageSize: D.pageSize,
      }).then((res) => {
        D.tableData = res.data.list;
        D.total = res.data.total;
      });
    };
    const submitForm = function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          AdvertisingApi.editaAdvertisingCategory(D.ruleForm).then(() => {
            D.dialogVisible = false;
            ElMessage.success("成功");
            D.ruleForm = {};
            getAdvertisingCategoryList();
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
          deleteAdvertisingCategory(val);
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
          categoryName: "",
          height: null,
          width: null,
          remark: "",
          status: "0",
        };
      } else if (type == "edit") {
        D.formType = "编辑";
        D.ruleForm = {
          categoryName: val.categoryName,
          height: val.height,
          width: val.width,
          remark: val.remark,
          status: val.status,
          id: val.id,
        };
      }
    };
    const resetForm = function(formName) {
      this.$refs[formName].resetFields();
      D.ruleForm = {};
      D.dialogVisible = false;
    };
    const handleCurrentChange = function(number) {
      if (D.currentPage == number) {
        return;
      } else {
        D.currentPage = number;
        getAdvertisingCategoryList();
      }
    };
    const handleSizeChange = function(number) {
      if (D.pageSize == number) {
        return;
      } else {
        D.pageSize = number;
        getAdvertisingCategoryList();
      }
    };
    onMounted(() => {
      getAdvertisingCategoryList();
    });
    return {
      ...toRefs(D),
      submitForm,
      resetForm,
      handleCurrentChange,
      getAdvertisingCategoryList,
      openDialog,
      handleSizeChange,
      deleteAdvertisingCategory,
      deleteFun,
    };
  },
});
</script>
<style scoped lang="scss">
.searchWrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  :deep .el-input {
    width: 150px;
  }
  :deep .el-form-item {
    margin-right: 5px;
  }
}
</style>
