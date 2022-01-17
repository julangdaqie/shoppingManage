<template>
  <div class="searchWrap">
    <el-form
      :inline="true"
      :model="searchForm"
      size="small"
      @keyup.enter="getProductList"
    >
      <el-form-item>
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索关键词"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.isUsed" placeholder="选择是否上架">
          <el-option label="全部" value></el-option>
          <el-option label="上架" :value="1"></el-option>
          <el-option label="下架" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.brandId" placeholder="车型">
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in carCategoryList"
            :key="item.id"
            :label="item.brandName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getProductList">查询</el-button>
        <el-button type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="content">
    <el-table
      border
      ref="multipleTable"
      :data="carList"
      style="width: 100%"
      v-loading="loading"
      :element-loading-svg="svg"
      class="custom-loading-svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="expand">
        <template #default="props">
          <el-row :gutter="20" style="margin-bottom:20px;">
            <el-col :span="4">产品编号</el-col>
            <el-col :span="4">钯金重量</el-col>
            <el-col :span="4">铂金重量</el-col>
            <el-col :span="4">铑金重量</el-col>
            <el-col :span="4">粉重</el-col>
            <el-col :span="4">价格</el-col>
          </el-row>
          <el-row
            :gutter="20"
            v-for="(item, index) in props.row.specificationList"
            :key="index"
            style="margin-bottom:20px;"
          >
            <el-col :span="4">{{ item.specification }}</el-col>
            <el-col :span="4">{{ item.ba }}</el-col>
            <el-col :span="4">{{ item.bo }}</el-col>
            <el-col :span="4">{{ item.lao }}</el-col>
            <el-col :span="4">{{ item.weight }}</el-col>
            <el-col :span="4">{{ item.price }}</el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="产品主图" width="120">
        <template #default="scope">
          <el-image
            style="width:100px;height:100px;"
            :src="
              scope.row.picture.length > 0
                ? scope.row.picture[scope.row.picture.length - 1].url
                : ''
            "
            :preview-src-list="
              scope.row.picture.length > 0
                ? filterPicture(scope.row.picture)
                : []
            "
            :alt="scope.row.productName"
            fit="contain"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称"></el-table-column>
      <el-table-column prop="brandName" label="所属分类"></el-table-column>
      <el-table-column prop="pageView" label="浏览次数"></el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <span :style="{ color: scope.row.isUsed ? '' : 'red' }">{{
            scope.row.isUsed ? "上架" : "下架"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品详情">
        <template #default="scope">
          <span v-html="scope.row.description"></span>
        </template>
      </el-table-column>
      <el-table-column label="总粉重">
        <template #default="scope">
          {{ tableTotalWeightFun(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="总价">
        <template #default="scope">
          {{ tableTotalPricetFun(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in memberUserLevel"
        :key="item.id"
        :label="item.levelName + '价格'"
      >
        <template #default="scope">
          <span :style="{ color: color[index] }">{{
            (tableTotalPricetFun(scope.row) * item.discount).toFixed(2)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button @click="editCar(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteCar([scope.row.id])"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="d-flex align-items-center mt-3 justify-content-between">
    <div class="flex-shrink-0">
      <el-button type="success" size="small" @click="addCar"
        >新增车辆</el-button
      >
      <el-button type="danger" size="small" @click="deleteCar(selectedIdList)"
        >批量删除</el-button
      >
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchForm.total"
      :page-size="searchForm.pageSize"
      :currentPage="searchForm.page"
      :page-sizes="[5, 15, 25, 100]"
    ></el-pagination>
  </div>
  <el-dialog
    :title="dialogType ? '添加车辆' : '编辑车辆'"
    v-model="dialogVisible"
    width="1200px"
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
      <el-form-item label="产品名称:" prop="productName">
        <el-input
          v-model="dataForm.productName"
          placeholder="请输入产品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类:">
        <el-select
          v-model="dataForm.brandId"
          placeholder="请选择车辆类型"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in carCategoryList"
            :key="item.id"
            :label="item.brandName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品轮播图:">
        <Upload
          :imgList="dataForm.picture"
          @deleteImg="deletePicture"
          @getImgList="getImgList"
        ></Upload>
      </el-form-item>
      <el-form-item label="参数:" style="margin-bottom:0;">
        <el-row :gutter="20" style="margin-bottom:10px;">
          <el-col :span="3">产品编号</el-col>
          <el-col :span="3">钯金重量</el-col>
          <el-col :span="3">铂金重量</el-col>
          <el-col :span="3">铑金重量</el-col>
          <el-col :span="3" style="display:flex;justify-content:space-between;"
            ><span>粉重</span
            ><strong style="color:red;"
              >总重:{{ totalWeight.toFixed(3) }}</strong
            ></el-col
          >
          <el-col :span="3" style="display:flex;justify-content:space-between;"
            ><span>价格</span
            ><strong style="color:red;"
              >总价:{{ totalPrice.toFixed(2) }}</strong
            ></el-col
          >
          <el-col :span="3">是否精准含量</el-col>
          <el-col :span="3">操作</el-col>
        </el-row>
        <el-row
          :gutter="20"
          v-for="(item, index) in dataForm.specificationList"
          :key="index"
          :style="
            index == dataForm.specificationList.length - 1
              ? ''
              : 'margin-bottom:10px;'
          "
        >
          <el-col :span="3">
            <el-input type="text" v-model="item.specification"></el-input
          ></el-col>
          <el-col :span="3"
            ><el-input
              type="text"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="item.ba"
            ></el-input
          ></el-col>
          <el-col :span="3"
            ><el-input
              type="text"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="item.bo"
            ></el-input
          ></el-col>
          <el-col :span="3"
            ><el-input
              type="text"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="item.lao"
            ></el-input
          ></el-col>
          <el-col :span="3"
            ><el-input
              type="text"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="item.weight"
            ></el-input
          ></el-col>
          <el-col :span="3"
            ><el-input
              type="text"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="item.price"
            ></el-input
          ></el-col>
          <el-col :span="3">
            <el-select v-model="item.priceType" placeholder="Select">
              <el-option
                v-for="item in priceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3"
            ><el-button type="text" @click="removeSpecificationFun(index)"
              >删除</el-button
            ></el-col
          >
        </el-row>
      </el-form-item>
      <div style="text-align:center;margin-bottom:20px;">
        <el-button type="text" @click="newSpecificationFun">新增规格</el-button>
      </div>
      <el-form-item label="浏览次数:">
        <el-input
          type="number"
          v-model="dataForm.pageView"
          placeholder="浏览次数"
        ></el-input>
      </el-form-item>
      <el-form-item label="产品详情:">
        <TinyEditor v-model:content="dataForm.description"></TinyEditor>
      </el-form-item>
      <el-form-item label="状态:">
        <el-radio-group v-model="dataForm.isUsed">
          <el-radio :label="1">上架</el-radio>
          <el-radio :label="0">下架</el-radio>
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
  watch,
} from "vue";
import { ProductApi } from "@/api/product";
import { MemberApi } from "@/api/member";
import TinyEditor from "@/components/TinyEditor";
import Upload from "@/components/Upload";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "vehicleList",
  components: {
    TinyEditor,
    Upload,
  },
  setup() {
    const state = reactive({
      color: ["rgb(245,166,35)", "rgb(65,117,5)", "rgb(144,19,254)"],
      memberUserLevel: [],
      carCategoryList: [],
      searchForm: {
        keyword: "",
        isUsed: "",
        page: 1,
        pageSize: 10,
        total: 0,
        brandId: null,
      },
      carList: [],
      multipleSelection: [],
      selectedIdList: [],
      dataFormRef: null,
      dialogVisible: false,
      dataForm: {
        productName: "",
        brandId: "",
        picture: [],
        specificationList: [],
        isUsed: "",
        pageView: "",
        submitDataForm: "",
        description: "",
      },
      dialogType: false,
      loading: true,
      totalPrice: 0,
      totalWeight: 0, //粉重
    });
    const tableTotalWeightFun = (val) => {
      return val.specificationList.reduce((x, y) => {
        return (x*100 + y.weight*100)/100;
      }, 0);
    };
    const tableTotalPricetFun = (val) => {
      return val.specificationList.reduce((x, y) => {
        return (x*100 + y.price*100)/100;
      }, 0);
    };
    watch(
      () => state.dataForm.specificationList,
      (newValue, oldValue) => {
        state.totalWeight = 0;
        state.totalPrice = 0;
        newValue.forEach((item) => {
          state.totalWeight =
            (state.totalWeight * 1000 + Number(item.weight) * 1000) / 1000;
          state.totalPrice =
            (state.totalPrice * 100 + Number(item.price) * 100) / 100;
        });
      },
      {
        deep: true,
      }
    );
    const route = useRoute();
    const dataFormRules = {
      productName: [
        { required: true, message: "请输入产品名称", trigger: "blur" },
      ],
    };
    const priceTypeOptions = [
      {
        value: 1,
        label: "人工定价",
      },
      {
        value: 2,
        label: "未知",
      },
      {
        value: 3,
        label: "(枪)实测含量",
      },
    ];
    const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;

    const newSpecificationFun = function() {
      state.dataForm.specificationList.push({
        specification: "",
        ba: 0,
        bo: 0,
        lao: 0,
        weight: 0,
        price: 0,
        priceType: 1,
      });
    };
    const addCar = function() {
      state.dialogVisible = true;
      state.dialogType = true;
    };
    const getImgList = function(val) {
      if (val) {
        state.dataForm.picture = val;
      }
    };
    const filterPicture = (val) => {
      let temp = [];
      val.forEach((item) => {
        temp.push(item.url);
      });
      return temp;
    };
    const handleCurrentChange = function(page) {
      state.searchForm.page = page;
      getProductList();
    };
    const handleSizeChange = function(number) {
      if (state.searchForm.pageSize == number) {
        return;
      } else {
        state.searchForm.pageSize = number;
        getProductList();
      }
    };
    const handleSelectionChange = function(val) {
      let selectedIdList = [];
      val.forEach((item) => {
        selectedIdList.push(item.id);
      });
      state.selectedIdList = selectedIdList;
    };
    const editCar = function(row) {
      state.dataForm = Object.assign({}, row);
      state.dialogType = false;
      state.dialogVisible = true;
    };
    const removeSpecificationFun = function(index) {
      state.dataForm.specificationList.splice(index, 1);
    };
    const deleteCar = function(selectedIdList) {
      ElMessageBox.confirm("确认要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ProductApi.deleteProductById({
            idList: selectedIdList.join(","),
          })
            .then(() => {
              ElMessage.success("删除成功");
              state.selectedIdList = [];
              getProductList();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {});
    };
    const clearForm = function() {
      const form = unref(state.dataFormRef);
      form.resetFields();
      state.dataForm = {
        productName: "",
        brandId: "",
        picture: [],
        specificationList: [],
        isUsed: "",
        pageView: "",
        submitDataForm: "",
      };
    };
    const submitDataForm = function() {
      const form = unref(state.dataFormRef);
      if (!form) return;
      form
        .validate()
        .then(() => {
          //添加车辆
          if (!state.dialogType) {
            state.dataForm.picture.forEach((item) => {
              item.productId = state.dataForm.id;
            });
          }
          let postData = Object.assign({}, state.dataForm);
          ProductApi.editProduct(postData)
            .then(() => {
              ElMessage.success("操作成功");
              getProductList();
              state.dialogVisible = false;
            })
            .catch((err) => {});
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const deleteImg = function(index) {
      state.dataForm.picture.splice(index, 1);
    };
    const addImg = function(url) {
      state.dataForm.picture.push(url);
    };
    const deletePicture = function(index) {
      let targetPic;
      if (!state.dialogType) {
        targetPic = state.dataForm.picture[index];
      }
      state.dataForm.picture.splice(index, 1);
      ProductApi.deletePicture({
        idList: targetPic.id.toString(),
      });
    };
    const getProductList = function() {
      state.carList = [];
      ProductApi.getProductList(state.searchForm).then((res) => {
        state.carList = res.data.list;
        state.searchForm.total = res.data.total;
      });
    };
    const getMemberUserLevel = function() {
      state.memberUserLevel = [];
      MemberApi.getMemberUserLevel({
        page: 1,
        pageSize: 999,
      }).then((res) => {
        state.memberUserLevel = res.data;
      });
    };
    const getBrandList = function() {
      ProductApi.getBrandList({
        keyword: "",
        page: 1,
        pageSize: 99999,
        total: 0,
      }).then((res) => {
        state.carCategoryList = res.data.list;
        if (route.params.brandName) {
          let brandName = route.params.brandName;
          state.searchForm.brandId = state.carCategoryList.find(
            (x) => x.brandName === brandName
          ).id;
          getProductList();
        }
      });
    };
    const promiseFun = function() {
      state.loading = true;
      if (route.params.brandName) {
        Promise.all([getMemberUserLevel(), getBrandList()]).then(() => {
          state.loading = false;
        });
      } else {
        Promise.all([
          getMemberUserLevel(),
          getBrandList(),
          getProductList(),
        ]).then(() => {
          state.loading = false;
        });
      }
    };
    onMounted(() => {
      promiseFun();
    });
    return {
      ...toRefs(state),
      handleCurrentChange,
      handleSelectionChange,
      addCar,
      clearForm,
      submitDataForm,
      getProductList,
      addImg,
      deleteImg,
      deleteCar,
      editCar,
      getImgList,
      deletePicture,
      handleSizeChange,
      filterPicture,
      newSpecificationFun,
      priceTypeOptions,
      dataFormRules,
      svg,
      removeSpecificationFun,
      tableTotalWeightFun,
      tableTotalPricetFun,
      getMemberUserLevel,
      getBrandList,
    };
  },
});
</script>
<style scoped lang="scss">
.searchWrap {
  display: flex;
  align-items: center;

  ::v-deep .el-input {
    width: 150px;
  }

  ::v-deep .el-form-item {
    margin-right: 5px;
  }
}
</style>
