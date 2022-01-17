<template>
  <div class="model">
    <div class="con">
      <div class="header">
        <div>
          <span @click="activeIndex = 0" :class="{ active: activeIndex === 0 }"
            >菜单权限</span
          >
          <span
            class="ml-2"
            @click="activeIndex = 1"
            :class="{ active: activeIndex === 1 }"
            >接口权限</span
          >
        </div>
        <i class="el-icon-close" @click="closeMenu"></i>
      </div>
      <div class="list" v-show="activeIndex === 0">
        <el-checkbox-group v-model="permissionArr">
          <el-checkbox
            :label="item.id"
            v-for="item in pagePermissionData"
            :key="item.authorityName"
          >
            {{ item.authorityName }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="list" v-show="activeIndex === 1">
        <el-checkbox-group v-model="permissionArr">
          <el-checkbox
            :label="item.id"
            v-for="item in apiPermissionData"
            :key="item.authorityName"
          >
            {{ item.authorityName }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="footer">
        <el-button type="primary" @click="saveMenu">保存</el-button>
        <el-button type="info" @click="closeMenu">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs, watch } from "vue";
import { AuthApi } from "@/api/auth";

export default defineComponent({
  name: "PermissionMenu",
  props: ["editRolePermissionIdlist"],
  setup(props, { emit }) {
    const state = reactive({
      apiPermissionData: [],
      permissionArr: [],
      pagePermissionData: [],
      activeIndex: 0,
    });
    const getAllApiAuth = function () {
      AuthApi.getAllApiAuth().then((res) => {
        state.apiPermissionData = res.data;
      });
    };
    const getAllPageAuth = function () {
      AuthApi.getAllPageAuth().then((res) => {
        state.pagePermissionData = res.data;
      });
    };
    const closeMenu = function () {
      emit("closeMenu");
    };
    const saveMenu = function () {
      closeMenu();
      emit("saveMenu", state.permissionArr);
      state.permissionArr = [];
    };
    watch(
      () => props.editRolePermissionIdlist,
      (newValue, oldValue) => {
        state.activeIndex = 0;
        state.permissionArr = newValue;
      }
    );
    onMounted(() => {
      getAllPageAuth();
      getAllApiAuth();
    });
    return {
      ...toRefs(state),
      closeMenu,
      saveMenu,
    };
  },
});
</script>

<style scoped lang="scss">
.model {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  border-bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 30000;

  .con {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 600px;
    background-color: #fff;
    border: 1px solid #ccc;

    .list {
      flex: 1;
      height: 0;
      overflow: auto;
      padding: 10px;

      :deep {
        .el-checkbox {
          display: block;
        }
      }
    }
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  background-color: #76accd;
  padding: 0 10px;
  color: #fff;
  span.active {
    color: green;
    text-decoration: underline;
  }
  span {
    cursor: pointer;
  }
  i {
    font-size: 24px;
    cursor: pointer;
  }
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  border-top: 1px solid #ccc;
}
</style>