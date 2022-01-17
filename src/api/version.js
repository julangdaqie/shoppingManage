
import request from "@/utils/request";

export const VersionApi = {
    getGroupInfo(params){
        return request({
            url: '/manage/config/getGroupInfo',
            method: 'post',
            data: params
        })
    },
    editConfig(params){
        return request({
            url: '/manage/config/editConfig',
            method: 'post',
            data: params
        })
    },
};