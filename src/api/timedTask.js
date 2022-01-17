import request from "@/utils/request";

//添加定时任务
//id 
//cron cron表达式
// packageName 包名
export const TimedTaskApi = {
    addTimedTask(params) {
        return request({
            url: '/manage/timedtask/addTimedTask',
            method: 'post',
            data: params
        })
    },
    //删除定时任务
    //timedTaskId
    deleteTimedTask(params) {
        return request({
            url: '/manage/timedtask/deleteTimedTask',
            method: 'get',
            params: params
        })
    },
    //获取定时任务列表
    getTimedTaskList(params) {
        return request({
            url: '/manage/timedtask/getTimedTaskList',
            method: 'post',
            data: params
        })
    },
    //开启定时任务
    start(params) {
        return request({
            url: '/manage/timedtask/start',
            method: 'get',
            params: params
        })
    },
    //关闭定时任务
    //timedTaskId 任务id
    stop(params) {
        return request({
            url: '/manage/timedtask/stop',
            method: 'get',
            params: params
        })
    }
}