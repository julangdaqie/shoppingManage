<template>
  <div class="uploadWrap d-flex">
    <div class="uploadList pointer" style="flex-shrink: 0;">
      <input
        type="file"
        ref="uploadInput"
        class="upload"
        :multiple="isSingle ? '' : 'multiple'"
        @change="upImg"
        accept="image/png, image/jpeg, image/gif, image/jpg"
      />
      <div class="uploadContent" @click="triggerUpload">
        <i class="el-icon-plus"></i>
      </div>
    </div>
    <draggable
      class="d-flex flex-wrap"
      v-model="filterList"
      item-key="id"
      @end="dragEnd"
    >
      <template #item="{ element, index }">
        <div class="uploadList">
          <el-image
            :src="element.url"
            :preview-src-list="filterPreviewSrcList"
          ></el-image>
          <a href="javascript:;" class="deleteImg" @click="removeImg(index)"
            >删除{{ imgList.length }}</a
          >
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  unref,
  computed,
  onMounted,
  watch,
} from "vue";
import { ElMessage } from "element-plus";
import { ossUtils } from "@/utils/oss";
import draggable from "vuedraggable";
import { toRefs } from "@vue/reactivity";

export default defineComponent({
  components: {
    draggable,
  },
  props: ["imgList", "isSingle"],
  setup(props, { emit }) {
    const obj = reactive({
      filterList: [],
    });
    onMounted(() => {
      obj.filterList = props.imgList;
    });
    watch(props, (newValue, oldValue) => {
      obj.filterList = props.imgList;
    });
    const VUE_APP_URL = process.env.VUE_APP_URL;
    const dragEnd = function() {
      emit("getImgList", obj.filterList);
    };
    const filterPreviewSrcList = computed(() => {
      let temp = [];
      props.imgList.forEach((x) => {
        temp.push(x.url);
      });
      return temp;
    });
    const uploadInput = ref(null);
    const upImg = async function(event) {
      if (obj.filterList && obj.filterList.length >= 1 && props.isSingle) {
        ElMessage.warning("只能传单张图片");
        return;
      }
      const files = event.target.files || event.dataTransfer.files;
      if (!files.length) {
        return;
      }
      for (const item of files) {
        await ossUtils
          .uploadFile(item)
          .then((url) => {
            obj.filterList.push({
              url,
            });
          })
          .catch((err) => {
            ElMessage.error("图片上传失败");
            console.log(err);
          });
      }
      emit("getImgList", obj.filterList);
      //清空input
      const input = unref(uploadInput);
      input.value = "";
    };
    // const createImage = function (file) {
    //   let reader = new FileReader();
    //   reader.onload = function (e) {
    //     emit("addImg", e.target.result);
    //   };
    //   reader.readAsDataURL(file);
    // };
    const triggerUpload = function() {
      const input = unref(uploadInput);
      input.dispatchEvent(new MouseEvent("click"));
    };
    const removeImg = function(index) {
      emit("deleteImg", index);
    };
    return {
      ...toRefs(obj),
      upImg,
      triggerUpload,
      uploadInput,
      removeImg,
      VUE_APP_URL,
      filterPreviewSrcList,
      dragEnd,
    };
  },
});
</script>
<style scoped lang="scss">
.uploadList {
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #cccccc;
  border-radius: 4px;
  width: 150px;
  height: 150px;
  margin-right: 5px;
  margin-bottom: 5px;

  &:hover {
    .deleteImg {
      display: block;
    }
  }

  i {
    font-size: 30px;
  }

  .deleteImg {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 30px;
    line-height: 30px;
    background-color: rgba(0, 0, 0, 0.25);
    text-align: center;
  }
}

.upload {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  opacity: 0;
  z-index: -1;
}

.uploadContent {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  cursor: pointer;
}
</style>
