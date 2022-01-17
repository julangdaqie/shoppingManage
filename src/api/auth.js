import request from "@/utils/request";

export const AuthApi = {
    login(params) {
        return request({
            url: '/manage/login',
            method: 'post',
            data: params
        })
    },
    //编辑权限列表
    /**
     *
     * @param params
     * @returns {AxiosPromise}
     * 参数 anthority_name:权限名称,url:权限路径,is_manage:1后台权限0前台权限,auth_type:0接口权限1页面权限
     */
    editAuth(params) {
        return request({
            url: '/manage/auth/editAuth',
            method: 'post',
            data: params
        })
    },
    //删除权限
    deleteAuth(params) {
        return request({
            url: '/manage/auth/deleteAuth',
            method: 'get',
            params: params
        })
    },
    //获取所有接口权限
    getAllApiAuth(params) {
        return request({
            url: '/manage/auth/getAllApiAuth',
            method: 'post',
            data: params
        })
    },
    //获取所有页面权限
    getAllPageAuth(params) {
        return request({
            url: '/manage/auth/getAllPageAuth',
            method: 'post',
            data: params
        })
    },

    //授权给角色
    doAuth(params) {
        return request({
            url: '/manage/auth/doAuth',
            method: 'post',
            data: params
        })
    },

    //编辑角色
    editRole(params) {
        return request({
            url: '/manage/role/editRole',
            method: 'post',
            data: params
        })
    },

    //获取角色列表
    getRoleList(params) {
        return request({
            url: '/manage/role/getRoleList',
            method: 'post',
            data: params
        })
    },

    //获取角色信息
    getRoleInfo(params) {
        return request({
            url: '/manage/role/getRoleInfo',
            method: 'get',
            params: params
        })
    },

    //删除角色
    deleteRole(params) {
        return request({
            url: '/manage/role/deleteRole',
            method: 'get',
            params: params
        })
    },

    //编辑用户
    editUser(params) {
        return request({
            url: '/manage/manageUser/editUser',
            method: 'post',
            data: params
        })
    },

    //获取用户列表
    getUserList(params) {
        return request({
            url: '/manage/manageUser/getUserList',
            method: 'post',
            data: params
        })
    },

    getUserInfo(params) {
        return request({
            url: '/manage/manageUser/getUserInfo',
            method: 'post',
            data: params
        })
    }
};