import request from "@/utils/request";

export const DashboardApi = {
    //仪表盘
    getAppUserStatistics(params) {
        return request({
            url: '/manage/getAppUserStatistics',
            method: 'post',
            data: params
        })
    },
};