<template>
    <div class="row">
        <div class="col-3">
            <el-tabs tab-position="left" style="height: 200px;">
                <el-tab-pane label="页面权限">页面权限</el-tab-pane>
                <el-tab-pane label="接口权限">接口权限</el-tab-pane>
            </el-tabs>
        </div>
        <div class="col-9">

        </div>
    </div>
</template>
<script>
import {defineComponent} from "vue";
import {AuthApi} from "@/api/auth";

export default defineComponent({
    name: "menuManage",
    setup(){

    }

});
</script>
<style scoped lang="scss">

</style>