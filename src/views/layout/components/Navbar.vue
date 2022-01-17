<template>
    <div class="navBar d-flex align-items-center justify-content-between">
        <div class="hamburger-container">
            <i class="el-icon-s-fold"></i>
            <!--            el-icon-s-unfold-->
        </div>
        <div class="user">
            <div>

            </div>
            <el-avatar icon="el-icon-user-solid" size="small"></el-avatar>
            <div class="ml-1">
                <el-dropdown @command="handleCommand">
                                <span class="el-dropdown-link pointer text-white">
                                  {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="logOut">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
import {defineComponent} from "vue";
import {useRouter} from 'vue-router';
import {useStore} from 'vuex'

export default defineComponent({
    name: "NavBar",
    setup() {
        const router = useRouter();
        const store = useStore();
        const userName = store.getters.name || '用户名';
        const handleCommand = async function (command) {
            switch (command) {
                case 'logOut':
                    //退出登录逻辑
                    await store.dispatch('auth/logout');
                    router.push('/login').then(() => {
                        location.reload();
                    });
                    break
            }
        };
        return {
            handleCommand,
            userName
        };
    },
});
</script>
<style scoped lang="scss">
.navBar {
    height: 50px;

    .hamburger-container {
        padding: 0 20px;
        height: 100%;
        line-height: 50px;
        cursor: pointer;
        transition: background .3s;

        &:hover {
            background: rgba(255, 255, 255, .025);
        }

        i {
            color: #fff;
            font-size: 26px;
            vertical-align: middle;

        }
    }

    .user {
        padding: 0 20px;
        display: flex;
        align-items: center;
    }
}
</style>
