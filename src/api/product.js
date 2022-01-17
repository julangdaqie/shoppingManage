import request from "@/utils/request";

export const ProductApi = {
    //获取车辆列表
    getProductList(params) {
        return request({
            url: '/manage/product/getProductList',
            method: 'post',
            data: params
        })
    },
    deleteProductById(params) {
        return request({
            url: '/manage/product/deleteProductById',
            method: 'post',
            data: params
        })
    },
    editProduct(params) {
        return request({
            url: '/manage/product/editProduct',
            method: 'post',
            data: params
        })
    },
    addPicture(params) {
        return request({
            url: '/manage/product/addPicture',
            method: 'post',
            data: params
        })
    },
    deletePicture(params) {
        return request({
            url: '/manage/product/deletePicture',
            method: 'post',
            data: params
        })
    },
    getBrandList(params) {
        return request({
            url: '/manage/product/getBrandList',
            method: 'post',
            data: params
        })
    },
    editBrand(params) {
        return request({
            url: '/manage/product/editBrand',
            method: 'post',
            data: params
        })
    },

    deleteBrand(params) {
        return request({
            url: '/manage/product/deleteBrand',
            method: 'post',
            data: params
        })
    },
    pictureSort(params){
        return request({
            url: '/manage/product/pictureSort',
            method: 'post',
            data: params
        })
    }
};