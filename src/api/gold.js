
import request from "@/utils/request";

export const GoldApi = {
    /**
     * 
     * page(int,页码)
        pageSize(int,每页数量)
     */
    getMetalPriceList(params) {
        return request({
            url: '/manage/metalPrice/getMetalPriceList',
            method: 'post',
            data: params
        })
    },

    /**
     * 
     */
    editMetalPrice(params) {
        return request({
            url: '/manage/metalPrice/editMetalPrice',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * id(int,收货id)
     */
    deleteMetalPrice(params) {
        return request({
            url: '/manage/metalPrice/deleteMetalPrice',
            method: 'post',
            data: params
        })
    },
};