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
      <el-table-column prop="createTime" label="创建时间" width="180">
      </el-table-column>
      <el-table-column label="是否处理" width="80">
        <template #default="scope">
          <div class="d-flex justify-content-center">
            <el-tag
              :type="scope.row.isRead === 1 ? 'success' : 'danger'"
              size="medium"
              >{{ scope.row.isRead == 1 ? "已处理" : "未处理" }}</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="120">
        <template #default="scope">
          <div class="d-flex align-items-center">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.picPath"
              fit="contain"
              :preview-src-list="[scope.row.picPath]"
            ></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="联系人" width="120"> </el-table-column>
      <el-table-column prop="content" label="内容"> </el-table-column>
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
      <!-- <el-button type="success" size="small" @click="openDialog('new')"
        >新增广告类型</el-button
      > -->
      <!-- <el-button type="danger" size="small">批量删除</el-button> -->
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
      ref="ruleFormRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="创建时间" prop="categoryName">
        {{ ruleForm.createTime }}
      </el-form-item>
      <el-form-item label="是否处理" prop="isRead">
        <span :class="ruleForm.isRead == 1 ? 'text-success' : 'text-danger'">{{
          ruleForm.isRead == 1 ? "已处理" : "未处理"
        }}</span>
      </el-form-item>
      <el-form-item label="联系人" prop="tel">
        {{ ruleForm.tel }}
      </el-form-item>
      <el-form-item label="内容" prop="content">
        {{ ruleForm.content }}
      </el-form-item>
      <el-form-item label="图片" prop="remark">
        <el-image
          style="width: 200px"
          :src="ruleForm.picPath"
          fit="contain"
          :preview-src-list="[ruleForm.picPath]"
        ></el-image>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleFormRef')"
          >更改处理状态</el-button
        >
        <el-button @click="resetForm('ruleFormRef')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { GoodsApi } from "@/api/goods";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "receiveGoods",
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
    });
    const deleteDeliverById = function (val) {
      GoodsApi.deleteDeliverById({
        id: val.id,
      }).then(() => {
        ElMessage.success("成功");
        getDeliverList();
      });
    };
    const getDeliverList = function () {
      GoodsApi.getDeliverList({
        page: D.currentPage,
        pageSize: D.pageSize,
      }).then((res) => {
        D.tableData = res.data.list;
        D.total = res.data.total;
      });
    };
    const submitForm = function (formName) {
      GoodsApi.changDeliverIsRead({
        id: D.ruleForm.id,
      }).then(() => {
        D.dialogVisible = false;
        ElMessage.success("成功");
        D.ruleForm = {};
        getDeliverList();
      });
    };
    const deleteFun = function (val) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDeliverById(val);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    };
    const openDialog = function (type, val) {
      D.dialogVisible = true;
      //   if (type == "new") {
      //     D.formType = "添加";
      //     D.ruleForm = {
      //       categoryName: "",
      //       height: null,
      //       width: null,
      //       remark: "",
      //       isRead: "0",
      //     };
      //   } else
      if (type == "edit") {
        D.formType = "编辑";
        D.ruleForm = {
          createTime: val.createTime,
          picPath: val.picPath,
          tel: val.tel,
          userId: val.userId,
          isRead: val.isRead,
          id: val.id,
          content: val.content,
        };
      }
    };
    const resetForm = function (formName) {
      this.$refs[formName].resetFields();
      D.ruleForm = {};
      D.dialogVisible = false;
    };
    const handleCurrentChange = function (number) {
      if (D.currentPage == number) {
        return;
      } else {
        D.currentPage = number;
        getDeliverList();
      }
    };
    const handleSizeChange = function (number) {
      if (D.pageSize == number) {
        return;
      } else {
        D.pageSize = number;
        getDeliverList();
      }
    };
    onMounted(() => {
      getDeliverList();
    });
    return {
      ...toRefs(D),
      submitForm,
      resetForm,
      handleCurrentChange,
      getDeliverList,
      openDialog,
      handleSizeChange,
      deleteDeliverById,
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
