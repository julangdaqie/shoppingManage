
import request from "@/utils/request";

export const MoneyApi = {
    /**
     * 
     * 获取用户资金明细
     * page(int,页码)
        pageSize(int,每页数量)
        userLoginTel 用户登录手机号
     */
    searchUserFundsLog(params) {
        return request({
            url: '/manage/finance/searchUserFundsLog',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * 会员充值订单
     * page(int,页码)
        pageSize(int,每页数量)
    */
    getUserPaymentList(params) {
        return request({
            url: '/manage/payment/getUserPaymentList',
            method: 'post',
            data: params
        })
    },
    /**
 * 
 * 提现管理
 * loginTel page pageSize
*/
    searchFundsOutOrderList(params) {
        return request({
            url: '/manage/finance/searchFundsOutOrderList',
            method: 'post',
            data: params
        })
    },
};