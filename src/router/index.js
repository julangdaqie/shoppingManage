import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
//引入在axios暴露出的clearPending函数
import { clearPending } from "@/utils/request"
import { getToken } from '@/utils/auth'
import Layout from '@/views/layout'

const Dashboard = () => import('@/views/dashboard');
import { ElMessage } from 'element-plus'

export const constantRoutes = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: Dashboard,
                meta: { title: '仪表盘', icon: 'el-icon-s-data', affix: true }
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        hidden: true,
        component: () => import(/* webpackChunkName: "Login" */ '@/views/login.vue')
    },
    {
        path: "/404",
        name: "404",
        hidden: true,
        component: () => import(/* webpackChunkName: "404" */ '@/views/errorPage/404.vue')
    }
];

export const asyncRoutes = [
    {
        path: '/systemManage',
        name: 'SystemManage',
        alwaysShow:true,
        component: Layout,
        meta: {
            title: '系统管理',
            icon: 'el-icon-s-tools',
        },
        children: [
            {
                path: 'permissionList',
                name: 'PermissionList',
                component: () => import(/* webpackChunkName: "permissionList" */ '@/views/systemManage/permissionList.vue'),
                meta: {
                    title: '权限列表'
                },
            },
            {
                path: 'rolePermission',
                name: 'RolePermission',
                component: () => import(/* webpackChunkName: "RolePermission" */ '@/views/systemManage/rolePermission.vue'),
                meta: {
                    title: '角色权限'
                },
            },
            // {
            //     path: 'buttonPermission',
            //     name: 'ButtonPermission',
            //     component: () => import(/* webpackChunkName: "ButtonPermission" */ '@/views/systemManage/buttonPermission.vue'),
            //     meta: {
            //         title: '按钮权限'
            //     },
            // },
            // {
            //     path: 'menuManage',
            //     name: 'MenuManage',
            //     component: () => import(/* webpackChunkName: "MenuManage" */ '@/views/systemManage/menuManage.vue'),
            //     meta: {
            //         title: '菜单管理'
            //     },
            //
            // },
        ]
    },
    {
        path: '/userManage',
        name: 'UserManage',
        alwaysShow:true,
        component: Layout,
        meta: {
            title: '用户管理',
            icon: 'el-icon-s-custom',
        },
        children: [
            {
                path: 'memberManage',
                name: 'MemberManage',
                component: () => import(/* webpackChunkName: "MemberManage" */ '@/views/userManage/memberManage.vue'),
                meta: {
                    title: '会员管理'
                },
            },
            {
                path: 'userLevelManage',
                name: 'UserLevelManage',
                component: () => import(/* webpackChunkName: "UserLevelManage" */ '@/views/userManage/userLevelManage.vue'),
                meta: {
                    title: '会员等级管理'
                },
            }
            ,
            {
                path: 'memberRoleManage',
                name: 'MemberRoleManage',
                component: () => import(/* webpackChunkName: "UserLevelManage" */ '@/views/userManage/memberRoleManage.vue'),
                meta: {
                    title: '会员角色管理'
                },
            }
        ]
    },
    {
        path: '/productManage',
        name: 'ProductManage',
        alwaysShow:true,
        component: Layout,
        meta: {
            title: '产品管理',
            icon: 'el-icon-s-goods',
        },
        children: [
            {
                path: 'vehicleCategory',
                name: 'VehicleCategory',
                component: () => import(/* webpackChunkName: "VehicleCategory" */ '@/views/productManage/vehicleCategory.vue'),
                meta: {
                    title: '车型分类'
                },
            },
            {
                path: 'vehicleList',
                name: 'VehicleList',
                component: () => import(/* webpackChunkName: "VehicleList" */ '@/views/productManage/vehicleList.vue'),
                meta: {
                    title: '车型列表',
                },
            },
        ]
    },
    {
        path: '/financialManage',
        name: 'FinancialManage',
        alwaysShow:true,
        component: Layout,
        meta: {
            title: '财务管理',
            icon: 'el-icon-money',
        },
        children: [
            {
                path: 'memberRechargeOrder',
                name: 'MemberRechargeOrder',
                component: () => import(/* webpackChunkName: "MemberRechargeOrder" */ '@/views/financialManage/memberRechargeOrder.vue'),
                meta: {
                    title: '会员充值订单'
                },
            },
            {
                path: 'userMoneyDetails',
                name: 'UserMoneyDetails',
                component: () => import(/* webpackChunkName: "UserMoneyDetails" */ '@/views/financialManage/userMoneyDetails.vue'),
                meta: {
                    title: '用户资金明细'
                },
            },
            {
                path: 'userWithdrawal',
                name: 'UserWithdrawal',
                component: () => import(/* webpackChunkName: "UserWithdrawal" */ '@/views/financialManage/userWithdrawal.vue'),
                meta: {
                    title: '用户提现管理'
                },
            },
            // {
            //     path: 'userBankCard',
            //     name: 'UserBankCard',
            //     component: () => import(/* webpackChunkName: "UserBankCard" */ '@/views/financialManage/userBankCard.vue'),
            //     meta: {
            //         title: '用户银行卡管理'
            //     },
            // },
            // {
            //     path: 'userMoneyManage',
            //     name: 'UserMoneyManage',
            //     component: () => import(/* webpackChunkName: "UserMoneyManage" */ '@/views/financialManage/userMoneyManage.vue'),
            //     meta: {
            //         title: '用户资金管理'
            //     },
            // },
        ]
    },
    {
        path: '/contentManage',
        name: 'ContentManage',
        alwaysShow:true,
        component: Layout,
        meta: {
            title: '网站内容管理',
            icon: 'el-icon-document',
        },
        children: [
            {
                path: 'adType',
                name: 'AdType',
                component: () => import(/* webpackChunkName: "AdType2" */ '@/views/contentManage/adType.vue'),
                meta: {
                    title: '广告类型'
                },
            },
            {
                path: 'adManage',
                name: 'AdManage',
                component: () => import(/* webpackChunkName: "AdManage" */ '@/views/contentManage/adManage.vue'),
                meta: {
                    title: '广告管理'
                },
            },
            {
                path: 'articleType',
                name: 'ArticleType',
                component: () => import(/* webpackChunkName: "ArticleType" */ '@/views/contentManage/articleType.vue'),
                meta: {
                    title: '文章类型'
                },
            },
            {
                path: 'articleList',
                name: 'ArticleList',
                component: () => import(/* webpackChunkName: "ArticleList" */ '@/views/contentManage/articleList.vue'),
                meta: {
                    title: '文章列表'
                },
            },
        ]
    },

    {
        path: '/basicInfo',
        name: 'BasicInfo',
        alwaysShow:true,
        component: Layout,
        meta: {
            title: '基础信息维护',
            icon: 'el-icon-info',
        },
        children: [
            {
                path: 'czParamManage',
                name: 'CzParamManage',
                component: () => import(/* webpackChunkName: "CzParamManage" */ '@/views/basicInfo/czParamManage.vue'),
                meta: {
                    title: '充值参数管理'
                },
            },
            {
                path: 'goldValueManage',
                name: 'GoldValueManage',
                component: () => import(/* webpackChunkName: "GoldValueManage" */ '@/views/basicInfo/goldValueManage.vue'),
                meta: {
                    title: '金价管理'
                },
            },
            {
                path: 'appVersion',
                name: 'AppVersion',
                component: () => import(/* webpackChunkName: "AppVersion" */ '@/views/basicInfo/appVersion.vue'),
                meta: {
                    title: 'APP版本管理'
                },
            },
            {
                path: 'receiveGoods',
                name: 'ReceiveGoods',
                component: () => import(/* webpackChunkName: "ReceiveGoods" */ '@/views/basicInfo/receiveGoods.vue'),
                meta: {
                    title: '用户联系收货'
                },
            },
            {
                path: 'onlineService',
                name: 'OnlineService',
                component: () => import(/* webpackChunkName: "OnlineService" */ '@/views/basicInfo/onlineService.vue'),
                meta: {
                    title: '在线客户'
                },
            },
            {
                path: 'timedTask',
                name: 'TimedTask',
                component: () => import(/* webpackChunkName: "OnlineService" */ '@/views/basicInfo/timedTask.vue'),
                meta: {
                    title: '定时任务'
                },
            },
        ]
    },
    {
        path: '/audit',
        name: 'Audit',
        alwaysShow:true,
        component: Layout,
        alwaysShow: true,
        meta: {
            title: '审核管理',
            icon: 'el-icon-s-check',
        },
        children: [
            {
                path: 'auditManage',
                name: 'AuditManage',
                component: () => import('@/views/audit/auditManage.vue'),
                meta: {
                    title: '审核表'
                },
            },
        ]
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/404",
        name: 'notFound',
        hidden: true
    }
]

let router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: constantRoutes
});

export function resetRouter() {
    const newRouter = createRouter({
        history: createWebHistory(process.env.BASE_URL),
        routes: constantRoutes
    });
    router = newRouter // reset router
}

/**
 * 根据权限匹配路由
 * @param {array} permission 权限列表（菜单列表）
 * @param {array} asyncRouter 异步路由对象
 */


const whiteList = ['/login'];
router.beforeEach(async (to, from, next) => {
    //在跳转路由之前，先清除所有的请求
    clearPending();
    // determine whether the user has logged in
    const hasToken = getToken()

    if (hasToken) {
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            const hasRoles = store.getters.roleId
            if (hasRoles) {
                next()
            } else {
                try {
                    const role = await store.dispatch('auth/getUserInfo')
                    const accessRoutes = await store.dispatch('permission/generateRoutes', role)
                    accessRoutes.forEach(item => {
                        router.addRoute(item); // 动态的添加路由
                    });
                    next({ ...to, replace: true })
                } catch (error) {
                    await store.dispatch('auth/resetToken')
                    ElMessage.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                }
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
});

export {
    router
};

