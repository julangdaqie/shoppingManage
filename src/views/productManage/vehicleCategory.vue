<template>
  <div class="top mb-2">
    <el-button type="primary" size="small">导出Excel</el-button>
  </div>
  <div class="content">
    <el-table :data="carCategoryList" border style="width: 100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column label="名称" width="300">
        <template #default="scope">
          <el-button
            @click="jumpToVehicleList(scope.row.brandName)"
            type="text"
            size="small"
            style="padding:20px;"
            >{{ scope.row.brandName }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template #default="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.logo ? scope.row.logo : ''"
            :preview-src-list="scope.row.logo ? [scope.row.logo] : []"
            :alt="scope.row.brandName"
            fit="contain"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button
            @click="editCarCategory(scope.row)"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="deleteCarCategory(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="bottom">
    <div>
      <el-button type="success" size="small" @click="addCarCategory"
        >新增车辆</el-button
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
    :close-on-click-modal="false"
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
      <el-form-item label="产品主图:">
        <Upload
          :imgList="dataForm.logo?[
            {
              url: dataForm.logo,
            },
          ]:[]"
          :isSingle="true"
          @deleteImg="deleteImg"
          @getImgList="addImg"
        ></Upload>
      </el-form-item>
      <el-form-item label="产品名称:" prop="brandName">
        <el-input
          v-model="dataForm.brandName"
          placeholder="请输入产品名称"
        ></el-input>
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
import { defineComponent, onMounted, reactive, toRefs, unref } from "vue";
import { ProductApi } from "@/api/product";
import Upload from "@/components/Upload";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "vehicleCategory",
  components: {
    Upload,
  },
  setup() {
    const router = useRouter();
    const dataFormRules = {
      brandName: [
        { required: true, message: "请输入产品名称", trigger: "blur" },
      ],
    };
    const state = reactive({
      searchForm: {
        keyword: "",
        page: 1,
        pageSize: 10,
        total: 0,
      },
      carCategoryList: [],
      dataFormRef: null,
      dialogTitle: "",
      dialogVisible: false,
      dataForm: {
        brandName: "",
        logo: "",
      },
      optionData: [],
    });
    const handleCurrentChange = function(page) {
      state.searchForm.page = page;
      getProductCategory();
    };
    const getProductCategory = function() {
      ProductApi.getBrandList(state.searchForm).then((res) => {
        state.carCategoryList = res.data.list;
        state.searchForm.total = res.data.total;
      });
    };
    const addCarCategory = function() {
      state.dialogTitle = "添加车辆类型";
      state.dialogVisible = true;
    };
    const editCarCategory = function(row) {
      state.dialogTitle = "编辑车辆类型";
      state.dialogVisible = true;
      state.dataForm = Object.assign({}, row);
    };
    const clearForm = function() {
      state.dataForm = {}
    };

    const submitDataForm = function() {
      const form = unref(state.dataFormRef);
      if (!form) return;
      form
        .validate()
        .then(() => {
          //添加车辆
          ProductApi.editBrand(state.dataForm)
            .then(() => {
              state.dialogVisible = false;
              ElMessage.success("操作成功");
              getProductCategory();
            })
            .catch((err) => {});
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const deleteImg = function() {
      state.dataForm.logo = "";
    };
    const addImg = function(url) {
      state.dataForm.logo = url[0].url;
    };
    const deleteCarCategory = function(row) {
      ElMessageBox.confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ProductApi.deleteBrand({
            id: row.id,
          }).then(() => {
            ElMessage.success("删除成功");
            getProductCategory();
          });
        })
        .catch(() => {});
    };
    const jumpToVehicleList = function(val) {
      router.push({ name: "VehicleList", params: { brandName: val } });
    };
    onMounted(() => {
      getProductCategory();
    });
    return {
      ...toRefs(state),
      handleCurrentChange,
      addCarCategory,
      clearForm,
      submitDataForm,
      deleteImg,
      addImg,
      editCarCategory,
      deleteCarCategory,
      jumpToVehicleList,
      dataFormRules
    };
  },
});
</script>

<style scoped lang="scss">
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
