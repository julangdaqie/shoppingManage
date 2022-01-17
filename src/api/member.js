import request from "@/utils/request";

export const MemberApi = {
    //获取会员列表
    getPagingAppMembers(params) {
        return request({
            url: '/manage/member/getPagingAppMembers',
            method: 'post',
            data: params
        })
    },
    disableMember(params) {
        return request({
            url: '/manage/member/disableMember',
            method: 'post',
            data: params
        })
    },
    changeMemberLevel(params) {
        return request({
            url: '/manage/member/changeMemberLevel',
            method: 'post',
            data: params
        })
    },
    getMemberUserLevel(params) {
        return request({
            url: '/manage/member/getMemberUserLevel',
            method: 'post',
            data: params
        })
    },
    editMember(params) {
        return request({
            url: '/manage/member/editMember',
            method: 'post',
            data: params
        })
    },

    patchDeleteMember(params) {
        return request({
            url: '/manage/member/patchDeleteMember',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * 会员等级管理
     * page(int,页码)
       pageSize(int,每页数量)
    */
    getMemberUserLevel(params) {
        return request({
            url: '/manage/member/getMemberUserLevel',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * 删除会员等级
     * id
    */
    deleteLevel(params) {
        return request({
            url: '/manage/memberConfig/deleteLevel',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * 编辑会员等级
     * id
     levelName
    priceForMouth 
    discount
    */
    editLevel(params) {
        return request({
            url: '/manage/memberConfig/editLevel',
            method: 'post',
            data: params
        })
    },
    /**
    * 
    * 编辑会员角色
    * id
    levelName
    priceForMouth 
    discount
    */
    editMemberRole(params) {
        return request({
            url: '/manage/memberConfig/editMemberRole',
            method: 'post',
            data: params
        })
    },
    /**
    * 
    * 删除会员角色
    * id
    */
    deleteMemberRole(params) {
        return request({
            url: '/manage/memberConfig/deleteMemberRole',
            method: 'post',
            data: params
        })
    },
    /**
    * 
    * 获取会员角色表
    ** page(int,页码)
    pageSize(int,每页数量)
    * 
    */
    getMemberRoleList(params) {
        return request({
            url: '/manage/memberConfig/getMemberRoleList',
            method: 'post',
            data: params
        })
    },
    /**
    * 
    * 解绑设备
    ** memberId
    * 
    */
    unbindDevice(params) {
        return request({
            url: '/manage/member/unbindDevice',
            method: 'get',
            params: params
        })
    },
};