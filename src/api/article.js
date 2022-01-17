import request from "@/utils/request";

export const ArticleApi = {
    /**
     * 
        id(int,有id编辑没id添加)
        categoryId(int,分类id)
        title(String,标题)
        keyword(String,关键字)
        description(String,描述)
        picPath(String,图片地址)
        status(int,状态:0关闭1启用)
        content(String,文章雷同)
        sort(int,排序)
     */
    //编辑文章
    editaArticle(params) {
        return request({
            url: '/manage/config/editaArticle   ',
            method: 'post',
            data: params
        })
    },
    /**
     * 
    categoryId(int,文章分类id 可不传,只查指定分类的时候传)
    page(int,页码)
    pageSize(int,每页数量)  
     */
    //获取文章列表
    getArticleList(params) {
        return request({
            url: '/manage/config/getArticleList   ',
            method: 'post',
            data: params
        })
    },
    /**
     * id(int,文章id)
     */
    //删除文章
    deleteArticle(params) {
        return request({
            url: '/manage/config/deleteArticle',
            method: 'post',
            data: params
        })
    },
    /**
     * id(int,文章id)
     */
    //获取文章详情
    getArticleInfo(params) {
        return request({
            url: '/manage/config/getArticleInfo',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * id(int,有id编辑没id添加)
        categoryName(String,分类名称)
        title(String,标题)
        keyword(String,关键字)
        description(String,描述)
        picPath(String,图片地址)
     */
    //编辑文章分类 
    editaArticleCategory(params) {
        return request({
            url: '/manage/config/editaArticleCategory',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * id(int,文章分类id)
     */
    //删除文章分类 
    deleteArticleCategory(params) {
        return request({
            url: '/manage/config/deleteArticleCategory',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * id(int,文章分类id)
     */
    //获取文章分类详情 
    getArticleCategoryInfo(params) {
        return request({
            url: '/manage/config/getArticleCategoryInfo',
            method: 'post',
            data: params
        })
    },
    /**
     * 
     * page(int,页码)
        pageSize(int,每页数量)
     */
    //获取文章分类列表 
    getArticleCategoryList(params) {
        return request({
            url: '/manage/config/getArticleCategoryList',
            method: 'post',
            data: params
        })
    },
};