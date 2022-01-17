<template>
    <div class="searchWrap">
        <el-form :inline="true" :model="searchForm" size="small">
            <el-form-item>
                <el-input v-model="searchForm.keyword" placeholder="搜索关键词" style="width:150px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker type="date" placeholder="选择开始时间" v-model="searchForm.startTime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker type="date" placeholder="选择结束时间" v-model="searchForm.endTime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchForm.memberCategory">
                    <el-option label="全部" :value="0"></el-option>
                    <el-option label="1" :value="1"></el-option>
                    <el-option label="2" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">查询</el-button>
                <el-button type="primary">导出Excel</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="content">
        <el-table
            ref="multipleTable"
            :data="tableData"
            border
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                label="序号"
                width="120">
                <template #default="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="登录账号"
                width="120">
            </el-table-column>
            <el-table-column
                prop="address"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="address"
                label="身份证号码">
            </el-table-column>
            <el-table-column
                prop="address"
                label="卡号">
            </el-table-column>
            <el-table-column
                prop="address"
                label="银行名称">
            </el-table-column>
            <el-table-column
                prop="address"
                label="支行名称">
            </el-table-column>
            <el-table-column
                prop="address"
                label="创建时间">
            </el-table-column>
            <el-table-column
                prop="address"
                label="状态">
            </el-table-column>
            <el-table-column
                prop="address"
                label="银行编码">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="150">
                <template #default="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="d-flex align-items-center mt-3 justify-content-between">
        <div class="flex-shrink-0">

        </div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
            :current-page="1"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
        </el-pagination>
    </div>
</template>

<script>
import {defineComponent, reactive, toRefs} from "vue";

export default defineComponent({
    name: "userBankCard",
    setup() {
        const state = reactive({
            searchForm: {
                keyword: '',
                startTime: '',
                endTime: '',
                memberCategory: 0
            },
            tableData: [{
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-08',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-06',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-07',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            },{
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-08',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-06',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-07',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            },{
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-08',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-06',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-07',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
            multipleSelection: []
        });
        return {
            ...toRefs(state)
        }
    }
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
    :deep .el-form-item{
        margin-right: 5px;
    }
}
</style>
