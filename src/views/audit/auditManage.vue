<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户提交产品审核表" name="1">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="产品名" prop="productName" width="100">
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <div v-html="statusConfirm(scope.row.status)"></div>
            </template>
          </el-table-column>
          <el-table-column label="图片">
            <template #default="scope">
              <div class="d-flex align-items-center">
                <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.picPath[0]"
                  fit="contain"
                  :preview-src-list="scope.row.picPath"
                ></el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-button
                @click.prevent="handleEditor(scope.row)"
                type="text"
                size="small"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="新产品审核表" name="2">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="产品名" prop="productName" width="100">
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <div v-html="statusConfirm(scope.row.status)"></div>
            </template>
          </el-table-column>
          <el-table-column label="图片">
            <template #default="scope">
              <div class="d-flex align-items-center">
                <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.picPath[0]"
                  fit="contain"
                  :preview-src-list="scope.row.picPath"
                ></el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-button
                @click.prevent="handleEditor(scope.row)"
                type="text"
                size="small"
                v-loading.fullscreen.lock="loading"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div>
    <el-dialog v-model="dialogTableVisible" title="详情" width="90%">
      <el-row>
        <el-col :span="status === '1' ? 12 : 24">
          <div style="text-align:center;font-weight:bold">
            {{ status === "1" ? "新数据" : "" }}
          </div>
          <el-form :model="newData" label-width="120px" label-position="left">
            <el-form-item label="品牌">
              <span>{{ newData.brandName }}</span>
            </el-form-item>
            <el-form-item label="图片">
              <el-image
                v-for="(item, index) in newData.picture"
                :key="index"
                style="width: 100px; height: 100px;margin:5px;"
                :src="item.url"
                fit="cover"
              ></el-image>
            </el-form-item>
            <el-form-item label="产品名">
              <span>{{ newData.productName }}</span>
            </el-form-item>
            <el-table :data="newData.specificationList" style="width: 100%">
              <el-table-column prop="specification" label="编号" />
              <el-table-column prop="ba" label="钯" />
              <el-table-column prop="bo" label="铂" />
              <el-table-column prop="lao" label="铑" />
              <el-table-column prop="weight" label="粉重" />
              <el-table-column prop="price" label="价格" />
            </el-table>
          </el-form>
        </el-col>
        <el-col v-if="status === '1'" :span="12">
          <div style="text-align:center;font-weight:bold">旧数据</div>
          <el-form :model="oldData" label-width="120px" label-position="left">
            <el-form-item label="品牌">
              {{ oldData.brandName }}
            </el-form-item>
            <el-form-item label="图片">
              <el-image
                v-for="(item, index) in oldData.picture"
                :key="index"
                style="width: 100px; height: 100px;margin:5px;"
                :src="item.url"
                fit="cover"
              ></el-image>
            </el-form-item>
            <el-form-item label="产品名">
              {{ oldData.productName }}
            </el-form-item>
            <el-table :data="oldData.specificationList" style="width: 100%">
              <el-table-column prop="specification" label="编号" />
              <el-table-column prop="ba" label="钯" />
              <el-table-column prop="bo" label="铂" />
              <el-table-column prop="lao" label="铑" />
              <el-table-column prop="weight" label="粉重" />
              <el-table-column prop="price" label="价格" />
            </el-table>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="check(false)"
            type="danger"
            :disabled="newData.status !== 1"
            >打回</el-button
          >
          <el-button
            type="primary"
            @click="check(true)"
            :disabled="newData.status !== 1"
            >通过</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
  <div class="mt-3 d-flex justify-content-end">
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      :page-size="pageSize"
      :currentPage="currentPage"
    ></el-pagination>
  </div>
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
import { AuditApi } from "@/api/audit";
import { ElMessageBox, ElMessage } from "element-plus";
export default defineComponent({
  name: "auditManage",
  setup() {
    const D = reactive({
      tableData: [],
      total: 0,
      currentPage: 1,
      status: "1", //审核类型
      pageSize: 10,
      activeName: "1",
      loading: false,
      dialogTableVisible: false,
      totalData: {},
      newData: {},
      oldData: {},
    });
    const filterName = function(val) {};
    const deleteRow = function(index, rows) {
      rows.splice(index, 1);
    };
    const statusConfirm = function(number) {
      if (number == "0") {
        return `<div style="color:#3eaf7c">通过</div>`;
      } else if (number == "2") {
        return `<div style="color:red">打回</div>`;
      } else {
        return `<div>待审核</div>`;
      }
    };
    const handleCurrentChange = function(number) {
      if (D.currentPage == number) {
        return;
      } else {
        D.currentPage = number;
        getProductCheckList();
      }
    };
    const handleSizeChange = function(val) {};
    //用户提交产品审核列表
    const getProductCheckList = function() {
      AuditApi.getProductCheckList({
        page: D.currentPage,
        pageSize: D.pageSize,
        status: D.status,
      }).then((res) => {
        D.tableData = res.data.list;
        D.tableData.forEach((item) => {
          item.picPath = item.picPath.split(",");
        });
        D.total = res.data.total;
      });
    };
    //获取新产品审核列表
    const getNewProductCheckList = function() {
      AuditApi.getNewProductCheckList({
        page: D.currentPage,
        pageSize: D.pageSize,
        status: null,
      }).then((res) => {
        D.tableData = res.data.list;
        D.tableData.forEach((item) => {
          item.picPath = item.picPath.split(",");
        });
        D.total = res.data.total;
      });
    };
    //审核
    const check = function(str) {
      ElMessageBox.prompt("确认操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(({ value }) => {
          if (str) {
            if (D.status === "1") {
              AuditApi.checkProduct({
                id: D.totalData.id,
                status: 0,
                receipt: value,
              }).then(() => {
                getProductCheckList();
                ElMessage.success("成功");
              });
            } else {
              AuditApi.checkNewProduct({
                id: D.totalData.id,
                status: 0,
                receipt: value,
              }).then(() => {
                getNewProductCheckList();
                ElMessage.success("成功");
              });
            }
          } else {
            if (D.status === "1") {
              AuditApi.checkProduct({
                id: D.totalData.id,
                status: 2,
                receipt: value,
              }).then(() => {
                getProductCheckList();
                ElMessage.success("成功");
              });
            } else {
              AuditApi.checkNewProduct({
                id: D.totalData.id,
                status: 2,
                receipt: value,
              }).then(() => {
                getNewProductCheckList();
                ElMessage.success("成功");
              });
            }
          }
          D.dialogTableVisible = false;
        })
        .catch(() => {
          ElMessage.message({
            type: "info",
            message: "已取消",
          });
        });
    };
    const handleEditor = function(val) {
      D.dialogTableVisible = true;
      D.loading = true;
      if (D.status === "1") {
        AuditApi.getProductCheckById({
          id: val.id,
        }).then((res) => {
          D.totalData = res.data;
          D.oldData = res.data.oldProduct;
          D.newData = res.data;
          delete D.newData.oldProduct;
          D.loading = false;
        });
      } else if (D.status === "2") {
        AuditApi.getNewProductCheckById({
          id: val.id,
        }).then((res) => {
          D.totalData = res.data;
          D.oldData = {};
          D.newData = res.data;
          D.loading = false;
        });
      }
    };
    const handleClick = function(tab, event) {
      D.status = tab.props.name;
      D.totalData = {};
      D.newData = {};
      D.oldData = {};
      if (D.status === "1") {
        getProductCheckList();
      } else if (D.status === "2") {
        getNewProductCheckList();
      }
    };
    onMounted(() => {
      getProductCheckList();
    });
    return {
      ...toRefs(D),
      deleteRow,
      getProductCheckList,
      getNewProductCheckList,
      check,
      statusConfirm,
      handleCurrentChange,
      handleClick,
      handleSizeChange,
      handleEditor,
    };
  },
});
</script>
<style scoped lang="scss">
.red {
  color: red;
}
</style>
