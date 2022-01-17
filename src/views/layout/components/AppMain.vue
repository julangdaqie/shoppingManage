<template>
    <div class="content">
        <el-scrollbar class="contentScrollBar">
            <router-view></router-view>
        </el-scrollbar>
    </div>
</template>

<script>
import {defineComponent} from "vue";
export default defineComponent({
    name: "AppMain",
});
</script>
<style scoped lang="scss">
.content {
    height: 100%;
    font-size: 14px;

    .contentScrollBar {
        padding: 20px;
    }
}
</style>
