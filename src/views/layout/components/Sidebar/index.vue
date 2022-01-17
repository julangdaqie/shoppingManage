<template>
    <div class="d-flex flex-column h-100">
        <div class="sidebar-logo-container">
            <a href="/" class="sidebar-logo-link router-link-active">
                <img src="@/assets/images/logo.png"
                     class="sidebar-logo">
                <h1 class="sidebar-title">佬斯夫后台管理系统</h1></a>
        </div>
        <el-scrollbar class="leftScrollBar">
            <el-menu
                :default-active="activeMenu"
                :unique-opened="false"
                class="left-nav"
                background-color="#324157"
                text-color="#fff"
                active-text-color="#ffd04b">
                <SidebarItem v-for="route in permission_routes" :key="route.path" :item="route"
                             :basePath="route.path"></SidebarItem>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import {computed, defineComponent} from "vue";
import {useRouter, useRoute} from 'vue-router';
import {useStore} from 'vuex'
import SidebarItem from './SidebarItem'

export default defineComponent({
    name: "SideBar",
    components: {
        SidebarItem
    },
    setup() {
        const route = useRoute();
        const store = useStore();
        const permission_routes = store.getters.permission_routes;
        const activeMenu = computed(() => {
            const {meta, path} = route
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu
            }
            return path
        })
        return {
            permission_routes,
            activeMenu
        };
    },
});
</script>
<style scoped lang="scss">
.sidebar-logo-container {
    flex-shrink: 0;
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #324157;
    padding: 0 20px;
    overflow: hidden;
    border-bottom: 1px solid #f3f3f3;

    a {
        display: inline-block;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .sidebar-logo {
        width: 32px;
        height: 32px;
        vertical-align: middle;
        margin-right: 12px;
    }

    .sidebar-title {
        display: inline-block;
        margin: 0;
        color: #fff;
        font-weight: 600;
        line-height: 50px;
        font-size: 14px;
        vertical-align: middle;
    }
}
.leftScrollBar {
    overflow: hidden auto;
    background-color: rgb(50, 65, 87);

    .el-menu {
        border-right: none;

        :deep .el-submenu .el-menu-item {
            background-color: #1f2d3d !important;

            &:hover {
                background-color: #001528 !important;
            }
        }

        :deep a {
            text-decoration: none;
        }

        :deep .sub-el-icon {
            color: currentColor;
            width: 1em;
            height: 1em;
        }

        :deep .svg-icon {
            margin-right: 16px;
        }
    }
}
</style>
