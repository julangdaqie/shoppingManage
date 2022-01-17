import request from "@/utils/request";

export const AdvertisingApi = {
    /**
     * 
     * @param {Object} params 
     * @returns 
     *  id(int,有id编辑没id添加)
        categoryId(int,分类id)
        advertisingName(String,广告名称)
        status(int,状态:0关闭1启用)
        url(String,图片地址)
        sort(int,排序)
     */
    //编辑广告
    editaAdvertising(params) {
        return request({
            url: '/manage/config/editaAdvertising',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * @param {Object} params 
     * @returns 
     * categoryId(int,广告分类id 可不传,只查指定分类的时候传)
        page(int,页码)
        pageSize(int,每页数量)
     */
    //获取广告列表
    getAdvertisingList(params) {
        return request({
            url: '/manage/config/getAdvertisingList',
            method: 'post',
            data: params
        })
    },
    /**
     * @param {Object} params 
     * @returns 
     * id(int,广告id)
     */
    //删除广告
    deleteAdvertising(params) {
        return request({
            url: '/manage/config/deleteAdvertising',
            method: 'post',
            data: params
        })
    },
    /**
     * @param {Object} params 
     * @returns 
     * id(int,广告id)
     * 
     */
    //获取广告详情
    getAdvertisingInfo(params) {
        return request({
            url: '/manage/config/getAdvertisingInfo',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * @param {Object} params 
     * @returns 
        id(int,有id编辑没id添加)
        categoryName(String,分类名称)
        status(int,状态:0关闭1启用)
        width(int,宽)
        height(int,高)
        remark(String,备注)
     */
    //编辑广告分类 
    editaAdvertisingCategory(params) {
        return request({
            url: '/manage/config/editaAdvertisingCategory',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * @param {Object} params 
     * @returns 
        id(int,广告分类id)
     */
    //删除广告分类 
    deleteAdvertisingCategory(params) {
        return request({
            url: '/manage/config/deleteAdvertisingCategory',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * @param {Object} params 
     * @returns 
        id(int,广告分类id)
     */
    //获取广告分类详情 
    getAdvertisingCategoryInfo(params) {
        return request({
            url: '/manage/config/getAdvertisingCategoryInfo',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * @param {Object} params 
     * @returns 
        page(int,页码)
        pageSize(int,每页数量)
     */
    //获取广告分类列表
    getAdvertisingCategoryList(params) {
        return request({
            url: '/manage/config/getAdvertisingCategoryList',
            method: 'post',
            data: params
        })
    },
};