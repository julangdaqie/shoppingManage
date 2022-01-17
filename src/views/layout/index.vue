<template>
    <el-container class="pageWrap">
        <el-aside class="left-aside">
            <Sidebar></Sidebar>
        </el-aside>
        <el-container>
            <el-header height="auto">
                <Navbar></Navbar>
                <TagsView></TagsView>
            </el-header>
            <el-main class="contentWrap">
                <AppMain></AppMain>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import {defineComponent} from "vue";
import {Sidebar, Navbar, AppMain, TagsView} from './components'

export default defineComponent({
    name: "Layout",
    components: {
        Sidebar,
        Navbar,
        AppMain,
        TagsView
    }
});
</script>
<style scoped lang="scss">
.pageWrap {
    height: 100%;

    .left-aside {
        overflow: hidden;
        position: relative;
        width: 250px !important;
    }

    .el-header {
        background-color: #242F42;
        padding: 0;
    }

    .contentWrap {
        padding: 0;
    }
}


</style>
