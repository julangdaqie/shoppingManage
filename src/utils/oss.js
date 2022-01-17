/**
 * @api:     阿里云OSS上传辅助工具
 * @author:  mandy
 */
import {UploadApi} from "@/api/upload";

export const ossUtils = {
    /**
     * 生成指定长度的随机名称
     * @param len         名称的长度
     * @return {string}   生成的随机名称
     */
    getRandomString(len) {
        const date = new Date();
        let month = date.getMonth() + 1;
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        let strDate = date.getDate();
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        const currentDate = date.getFullYear() + month + strDate;

        len = len || 32;
        const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        const maxPos = chars.length;
        let pwd = "";
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return currentDate + pwd;
    },
    /**
     * 获取文件后缀名
     * @return {string}   文件后缀名
     * @param filePath
     */
    getFileSuffix(filePath) {
        const pos = filePath.lastIndexOf(".");
        let suffix = "";
        if (pos !== -1) {
            suffix = filePath.substring(pos);
        }
        return suffix;
    },
    /**
     * 根据文件类型生成随机文件名
     * @param file
     */
    generateRandomFileName(file) {
        let randomName = ossUtils.getRandomString(8);
        randomName += ossUtils.getFileSuffix(file.name);
        return randomName;
    },

    /**
     * 获取OSS文件上传的校验签名
     * 1. 签名具备时效性，优先从浏览器缓存中获取
     * 2. 无缓存签名或签名过期，则重新向服务器请求
     * @return {Promise<unknown>} 在该promise的then方法中取得签名
     */
    getSignaturePromise() {
        return new Promise((resolve, reject) => {
            UploadApi.getOssInfo().then(res => {
                resolve(res.data);
            }).catch(error => {
                error.msg = "请求OSS校验签名失败";
                reject(error);
            });
        });
    },
    /**
     * 生成OSS文件上传的表单参数
     * @param ossSignature    OSS校验签名
     * @param file            要上传的文件
     * @return {FormData}     生成的表单数据
     */
    getFormData(ossSignature, file, ossFileName) {
        const ossData = new FormData();
        // policy、OSSAccessKeyId、signature 是OSS上传的校验参数
        ossData.append("host", ossSignature.host);
        ossData.append("policy", ossSignature.policy);
        ossData.append("OSSAccessKeyId", ossSignature.accessid);
        ossData.append("Signature", ossSignature.signature);
        // 上传成功后返回200状态码，不设置则默认返回204
        ossData.append("success_action_status", "200");
        // callback 是OSS上传成功的回调参数
        // ossData.append('callback', ossSignature.callback)
        // key 是文件在OSS上存储的路径
        ossData.append("key", ossSignature.dir + ossFileName);
        ossData.append("dir", ossSignature.dir);
        // file 是文件在OSS上存储的数据，注意放在最后避免校验参数不被识别导致403错误
        ossData.append("file", file);
        return ossData;
    },
    /**
     * 异步上传文件至OSS
     * @param file              要上传的文件
     * @return {Promise<void>}  axios创建的OSS上传请求对应的promise
     */
    async uploadFile(file) {
        return new Promise((resolve, reject) => {
            this.getSignaturePromise().then(
                (ossSignature) => {
                    const ossFileName = this.generateRandomFileName(file);
                    const ossData = ossUtils.getFormData(ossSignature, file, ossFileName);
                    const ossURL = ossSignature.host;
                    UploadApi.uploadOss(ossURL, ossData).then(res => {
                        resolve(ossSignature.host+'/' + ossSignature.dir + ossFileName)
                    }).catch(err => {
                        reject(err)
                    })
                },
                (error) => {
                    reject(error);
                }
            );
        });
    },
};
