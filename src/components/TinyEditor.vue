<template>
    <editor :api-key="tinyApiKey" :init="tinymceInit" v-model="contentHtml" />
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from "vue";
import Editor from '@tinymce/tinymce-vue'
import { ossUtils } from "@/utils/oss";
import { ElMessage } from "element-plus";
export default defineComponent({
    props: ['content'],
    components: {
        Editor
    },
    setup(props, { emit }) {
        const handleImgUpload = function (blobInfo, success, failure) {
            // console.log(blobInfo)
            // let formData = new FormData();
            // formData.append('file', blobInfo.blob());
            ossUtils
                .uploadFile(blobInfo.blob())
                .then((url) => {
                    console.log(url)
                    success(url)
                })
                .catch((err) => {
                    alert("图片上传失败");
                    failure('图片上传失败')
                });
        };
        const state = reactive({
            contentHtml: '',
            tinyApiKey: 'cq62jh23yyvvxs4idil4zae2oxr774hszakvzwb7ab35lyk6',
            tinymceInit: {
                language: "zh_CN",
                height: 300,
                theme: "silver",
                browser_spellcheck: true, // 拼写检查
                branding: true, // 去水印
                // elementpath: false,  //禁用编辑器底部的状态栏
                statusbar: false, // 隐藏编辑器底部的状态栏
                menubar: true, // 隐藏最上方menu
                fontsize_formats:
                    "12px 13px 14px 15px 16px 17px 18px 20px 22px 24px 26px 30px 35px 40px 50px",
                plugins:
                    "print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount  imagetools textpattern help code",
                toolbar:
                    "formatselect | bold italic strikethrough forecolor backcolor fontsizeselect | link image  | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat| code",
                paste_webkit_styles: true,
                //    上传方式1：填写images_upload_url和images_upload_base_path
                paste_data_images: true,  //  设置为允许粘帖图片
                // images_upload_url: '/upload/file/tinymce', //  图片上传地址
                images_upload_handler: (blobInfo, success, failure) => {
                    handleImgUpload(blobInfo, success, failure)
                },
                image_prepend_url: '',
                contextmenu: `paste | inserttable | cell row column deletetable`,
                relative_urls: false,
                remove_script_host: false,
            },
        });
        watch(() => props.content, (newValue) => {
            state.contentHtml = newValue;
        }, {
            immediate: true,
        });
        watch(() => state.contentHtml, (newValue) => {
            emit('update:content', newValue)
        })
        return {
            ...toRefs(state)
        }
    }
});
</script>
<style lang="scss">
.tox-tinymce-aux {
    position: relative !important;
    z-index: 10055 !important;
}
</style>