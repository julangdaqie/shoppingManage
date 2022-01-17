<template>
  <div class="content">
    <el-form :inline="true" :model="searchForm" size="small">
      <el-form-item>
        <el-input
          v-model="loginTel"
          placeholder="搜索关键词"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTable" :data="tableData" border style="width: 100%">
      <el-table-column prop="loginTel" label="登录账号"> </el-table-column>
      <el-table-column prop="money" label="提现金额"></el-table-column>
      <el-table-column prop="userName" label="姓名"></el-table-column>
      <el-table-column prop="fundsOutOrderId" label="订单号"></el-table-column>
      <el-table-column prop="createTime" label="提现时间"></el-table-column>
      <el-table-column prop="status" label="处理结果">
        <template #default="scope">
          <el-tag
            :type="scope.row.status == 1 ? 'success' : 'danger'"
            size="medium"
            >{{ scope.row.status == 1 ? "成功" : "失败" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="fundsOutTo" label="备注"></el-table-column>
    </el-table>
  </div>
  <div class="d-flex mt-3 justify-content-end">
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
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { MoneyApi } from "@/api/money";
export default defineComponent({
  name: "userWithdrawal",
  setup() {
    const D = reactive({
      loginTel: "",
      total: 0,
      currentPage: 1,
      pageSize: 5,
      tableData: [],
    });
    const searchFundsOutOrderList = function () {
      MoneyApi.searchFundsOutOrderList({
        page: D.currentPage,
        pageSize: D.pageSize,
        loginTel: D.loginTel,
      }).then((res) => {
        D.tableData = res.data.list;
        D.total = res.data.total;
      });
    };
    const handleCurrentChange = function (number) {
      if (D.currentPage == number) {
        return;
      } else {
        D.currentPage = number;
        searchFundsOutOrderList();
      }
    };
    const handleSizeChange = function (number) {
      if (D.pageSize == number) {
        return;
      } else {
        D.pageSize = number;
        searchFundsOutOrderList();
      }
    };
    onMounted(() => {
      searchFundsOutOrderList();
    });
    return {
      ...toRefs(D),
      handleCurrentChange,
      searchFundsOutOrderList,
      handleSizeChange,
    };
  },
});
</script>
<style scoped lang="scss">
</style>
