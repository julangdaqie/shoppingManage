import request from "@/utils/request";

export const AuditApi = {
  //获取用户提交产品审核列表
  getProductCheckList(params) {
    return request({
      url: "/manage/check/getProductCheckList",
      method: "post",
      data: params,
    });
  },
  //获取用户提交产品审核列表详情
  getProductCheckById(params) {
    return request({
      url: "/manage/check/getProductCheckById",
      method: "post",
      data: params,
    });
  },
  //获取新产品审核列表
  getNewProductCheckList(params) {
    return request({
      url: "/manage/check/getNewProductCheckList",
      method: "post",
      data: params,
    });
  },
  //获取新产品审核列表详情
  getNewProductCheckById(params) {
    return request({
      url: "/manage/check/getNewProductCheckById",
      method: "post",
      data: params,
    });
  },
  //新产品审核
  checkNewProduct(params) {
    return request({
      url: "/manage/check/checkNewProduct",
      method: "post",
      data: params,
    });
  },
  //审核
  checkProduct(params) {
    return request({
      url: "/manage/check/checkProduct",
      method: "post",
      data: params,
    });
  },
};
