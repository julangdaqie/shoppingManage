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
      <el-table-column prop="categoryName" label="类型名称"> </el-table-column>
      <el-table-column prop="keyword" label="关键字"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column label="图片">
        <template #default="scope">
          <div class="d-flex align-items-center">
            <el-image
              style="max-width: 100%"
              :src="scope.row.picPath"
              fit="contain"
              :preview-src-list="[scope.row.picPath]"
            ></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="description" label="描述"> </el-table-column>
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
        >新增文章类型</el-button
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
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input v-model="ruleForm.keyword"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="picPath">
        <Upload
          :isSingle="true"
          :imgList="
            ruleForm.picPath
              ? [
                  {
                    url: ruleForm.picPath,
                  },
                ]
              : []
          "
          @deleteImg="deleteImg"
          @getImgList="addImg"
        ></Upload>
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
import { ArticleApi } from "@/api/article";
import { ElMessage } from "element-plus";
import Upload from "@/components/Upload";
export default defineComponent({
  name: "articleType",
  components: {
    Upload,
  },
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
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        keyword: [{ required: true, message: "请输入关键字", trigger: "blur" }],
        picPath: [{ required: true, message: "请上传图片", trigger: "blur" }],
      },
    });
    const deleteArticleCategory = function(val) {
      ArticleApi.deleteArticleCategory({
        id: val.id,
      }).then(() => {
        ElMessage.success("成功");
        getArticleCategoryList();
      });
    };
    const getArticleCategoryList = function() {
      ArticleApi.getArticleCategoryList({
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
          ArticleApi.editaArticleCategory(D.ruleForm).then(() => {
            D.dialogVisible = false;
            ElMessage.success("成功");
            D.ruleForm = {};
            getArticleCategoryList();
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
          deleteArticleCategory(val);
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
          title: "",
          keyword: "",
          remark: "",
          description: "",
          picPath: "",
        };
      } else if (type == "edit") {
        D.formType = "编辑";
        D.ruleForm = {
          categoryName: val.categoryName,
          title: val.title,
          keyword: val.keyword,
          remark: val.remark,
          description: val.description,
          picPath: val.picPath,
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
        getArticleCategoryList();
      }
    };
    const handleSizeChange = function(number) {
      if (D.pageSize == number) {
        return;
      } else {
        D.pageSize = number;
        getArticleCategoryList();
      }
    };
    const deleteImg = function() {
      D.ruleForm.picPath = "";
    };
    const addImg = function(picPath) {
      D.ruleForm.picPath = picPath[0].url;
    };
    onMounted(() => {
      getArticleCategoryList();
    });
    return {
      ...toRefs(D),
      submitForm,
      resetForm,
      handleCurrentChange,
      getArticleCategoryList,
      openDialog,
      handleSizeChange,
      deleteArticleCategory,
      deleteFun,
      deleteImg,
      addImg,
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
