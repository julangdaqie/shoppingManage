<template>
  <div class="content">
    <el-table ref="multipleTable" :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="订单编号" prop="orderId" width="200">
      </el-table-column>
      <el-table-column label="用户">
        <template #default="scope">
          <div>
            {{ scope.row.user.id ? scope.row.user.loginTel : "*用户已注销*" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="openingTime" label="月数"> </el-table-column>
      <el-table-column prop="price" label="金额"> </el-table-column>
      <el-table-column prop="createTime" label="订单时间" width="150">
      </el-table-column>
      <el-table-column label="支付状态">
        <template #default="scope">
          <el-tag
            :type="scope.row.status == 1 ? 'success' : 'danger'"
            size="medium"
            >{{ scope.row.status == 1 ? "已支付" : "未支付" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="支付渠道">
        <template #default="scope"> {{ payStyle(scope.row.method) }} </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="d-flex justify-content-end mt-3">
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
  name: "memberRechargeOrder",
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
    });
    const payStyle = function(val) {
      if (val == "wxPay") {
        return "微信";
      } else if (val == "aliPay") {
        return "支付宝";
      }
    };
    const getUserPaymentList = function() {
      MoneyApi.getUserPaymentList({
        page: D.currentPage,
        pageSize: D.pageSize,
      }).then((res) => {
        D.tableData = res.data.list;
        D.total = res.data.total;
      });
    };
    const handleCurrentChange = function(number) {
      if (D.currentPage == number) {
        return;
      } else {
        D.currentPage = number;
        getUserPaymentList();
      }
    };
    const handleSizeChange = function(number) {
      if (D.pageSize == number) {
        return;
      } else {
        D.pageSize = number;
        getUserPaymentList();
      }
    };
    onMounted(() => {
      getUserPaymentList();
    });
    return {
      ...toRefs(D),
      handleCurrentChange,
      getUserPaymentList,
      handleSizeChange,
      payStyle,
    };
  },
});
</script>
<style scoped lang="scss"></style>
