
import request from "@/utils/request";

export const GoodsApi = {
    /**
     * 
     * 获取用户收货列表 
     * page(int,页码)
        pageSize(int,每页数量)
     */
    getDeliverList(params) {
        return request({
            url: '/manage/deliver/getDeliverList',
            method: 'post',
            data: params
        })
    },
    
    /**
     * 
     * 修改处理状态
     * id(int,收货id)
     */
    changDeliverIsRead(params) {
        return request({
            url: '/manage/deliver/changDeliverIsRead',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * 删除用户收货信息
     * id(int,收货id)
     */
     deleteDeliverById(params) {
        return request({
            url: '/manage/deliver/deleteDeliverById',
            method: 'post',
            data: params
        })
    },
};