<template>
  <div class="content">
    <el-table ref="multipleTable" :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        label="文章分类"
        width="120"
        prop="categoryId"
        :formatter="formatter"
      >
      </el-table-column>
      <el-table-column prop="title" label="标题" width="120"> </el-table-column>
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
      <el-table-column prop="keyword" label="关键字"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="图片">
        <template #default="scope">
          <div class="d-flex align-items-center">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.picPath"
              fit="contain"
              :preview-src-list="[scope.row.picPath]"
            ></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
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
        >新增文章</el-button
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
      <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="ruleForm.categoryId" placeholder="请选择文章分类">
          <el-option
            v-for="(item, index) in articleCategoryList"
            :key="index"
            :label="item.categoryName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="status">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="ruleForm.status"
        ></el-switch>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input v-model="ruleForm.keyword"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <TinyEditor v-model:content="ruleForm.content"></TinyEditor>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="ruleForm.sort"></el-input>
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
import TinyEditor from "@/components/TinyEditor";
import { ElMessage } from "element-plus";
import Upload from "@/components/Upload";
export default defineComponent({
  name: "articleType",
  components: {
    Upload,
    TinyEditor,
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
      formType: "",
      ruleForm: {},
      articleCategoryList: [],
      rules: {
        categoryId: [
          { required: true, message: "请选择分类", trigger: "blur" },
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        keyword: [{ required: true, message: "请输入关键字", trigger: "blur" }],
        content: [{ required: true, message: "请输入", trigger: "blur" }],
        description: [
          { required: true, message: "请输入描述信息", trigger: "blur" },
        ],
        picPath: [
          { required: true, message: "请输入描述信息", trigger: "blur" },
        ],
      },
    });
    const deleteImg = function() {
      D.ruleForm.picPath = "";
    };
    const addImg = function(picPath) {
      D.ruleForm.picPath = picPath[0].url;
    };
    const deleteArticle = function(val) {
      ArticleApi.deleteArticle({
        id: val.id,
      }).then(() => {
        ElMessage.success("成功");
        getArticleList();
      });
    };
    const getArticleList = function() {
      ArticleApi.getArticleList({
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
          ArticleApi.editaArticle(D.ruleForm).then(() => {
            D.dialogVisible = false;
            ElMessage.success("成功");
            D.ruleForm = {};
            getArticleList();
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
          deleteArticle(val);
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
          categoryId: "",
          title: "",
          keyword: "",
          description: "",
          content: "",
          sort: "",
          picPath: "",
          status: 0,
        };
      } else if (type == "edit") {
        D.formType = "编辑";
        D.ruleForm = {
          id: val.id,
          categoryId: val.categoryId,
          title: val.title,
          keyword: val.keyword,
          description: val.description,
          content: val.content,
          sort: val.sort,
          picPath: val.picPath,
          status: val.status,
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
        getArticleList();
      }
    };
    const handleSizeChange = function(number) {
      if (D.pageSize == number) {
        return;
      } else {
        D.pageSize = number;
        getArticleList();
      }
    };
    const getArticleCategoryList = function() {
      ArticleApi.getArticleCategoryList({
        page: 1,
        pageSize: 10000,
      }).then((res) => {
        D.articleCategoryList = res.data.list;
      });
    };
    const formatter = function(row, column) {
      const item = D.articleCategoryList.find((item) => {
        return item.id == row.categoryId;
      });
      if (item) {
        return item.categoryName;
      } else {
        return;
      }
    };
    onMounted(() => {
      getArticleCategoryList();
      getArticleList();
    });
    return {
      ...toRefs(D),
      submitForm,
      resetForm,
      handleCurrentChange,
      getArticleList,
      getArticleCategoryList,
      openDialog,
      handleSizeChange,
      deleteArticle,
      deleteFun,
      addImg,
      deleteImg,
      formatter,
    };
  },
});
</script>
<style scoped lang="scss"></style>
