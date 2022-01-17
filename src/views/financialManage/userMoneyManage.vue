<template>
  <div>
    <el-form :inline="true" :model="searchForm" size="small">
      <el-form-item>
        <el-input
          v-model="keyword"
          placeholder="搜索关键词"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchUserFundsLog()">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
  </div>
  <div class="d-flex justify-content-end">
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
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { MoneyApi } from "@/api/money";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "userMoneyManage",
  components: {
    // Upload,
  },
  setup() {
    const D = reactive({
      keyword: "",
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 5,
    });
    const searchUserFundsLog = function () {
      MoneyApi.searchUserFundsLog({
        pageSize: D.pageSize,
        page: D.currentPage,
        userLoginTel: D.keyword,
      }).then((res) => {
        D.total = res.data.total;
        D.tableData = res.data.list;
      });
    };
    const handleCurrentChange = function (number) {
      if (D.currentPage == number) {
        return;
      } else {
        D.currentPage = number;
        searchUserFundsLog();
      }
    };
    const handleSizeChange = function (number) {
      if (D.pageSize == number) {
        return;
      } else {
        D.pageSize = number;
        searchUserFundsLog();
      }
    };
    onMounted(() => {
      searchUserFundsLog();
    });
    return {
      ...toRefs(D),
      searchUserFundsLog,
      handleCurrentChange,
      handleSizeChange,
    };
  },
});
</script>
<style scoped lang="scss">
</style>
