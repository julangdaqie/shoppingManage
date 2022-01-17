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
      <el-table-column prop="baPrice" label="钯金金价"> </el-table-column>
      <el-table-column prop="boPrice" label="铂金金价"> </el-table-column>
      <el-table-column prop="laoPrice" label="铑金金价"> </el-table-column>
      <el-table-column prop="createTime" label="更新时间"> </el-table-column>
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
        >新增</el-button
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
      <el-form-item label="钯金金价" prop="baPrice">
        <el-input
          type="text"
          oninput="value=value.replace(/[^\d.]/g,'')"
          v-model="ruleForm.baPrice"
        ></el-input>
      </el-form-item>
      <el-form-item label="铂金金价" prop="boPrice">
        <el-input
          type="text"
          oninput="value=value.replace(/[^\d.]/g,'')"
          v-model="ruleForm.boPrice"
        ></el-input>
      </el-form-item>
      <el-form-item label="铑金金价" prop="laoPrice">
        <el-input
          type="text"
          oninput="value=value.replace(/[^\d.]/g,'')"
          v-model="ruleForm.laoPrice"
        ></el-input>
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
import { GoldApi } from "@/api/gold";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "goldValueManage",
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
        baPrice: [{ required: true, message: "请输入价格", trigger: "blur" }],
        boPrice: [{ required: true, message: "请输入价格", trigger: "blur" }],
        laoPrice: [{ required: true, message: "请输入价格", trigger: "blur" }],
      },
    });
    const deleteMetalPrice = function(val) {
      GoldApi.deleteMetalPrice({
        id: val.id,
      }).then(() => {
        ElMessage.success("成功");
        getMetalPriceList();
      });
    };
    const getMetalPriceList = function() {
      GoldApi.getMetalPriceList({
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
          GoldApi.editMetalPrice(D.ruleForm).then(() => {
            D.dialogVisible = false;
            ElMessage.success("成功");
            D.ruleForm = {};
            getMetalPriceList();
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
          deleteMetalPrice(val);
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
          baPrice: "",
          boPrice: "",
          laoPrice: "",
        };
      } else if (type == "edit") {
        D.formType = "编辑";
        D.ruleForm = {
          baPrice: val.baPrice,
          boPrice: val.boPrice,
          laoPrice: val.laoPrice,
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
        getMetalPriceList();
      }
    };
    const handleSizeChange = function(number) {
      if (D.pageSize == number) {
        return;
      } else {
        D.pageSize = number;
        getMetalPriceList();
      }
    };
    onMounted(() => {
      getMetalPriceList();
    });
    return {
      ...toRefs(D),
      submitForm,
      resetForm,
      handleCurrentChange,
      getMetalPriceList,
      openDialog,
      handleSizeChange,
      deleteMetalPrice,
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
