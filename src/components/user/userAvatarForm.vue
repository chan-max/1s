<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-23 11:17:00
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-19 18:23:49
 * @FilePath: /yishe/src/components/user/userAvatarForm.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="user-avatar-form">
    <div class="flex" style="padding: 10px 0; border-bottom: 2px solid #f8f8f8">
      <el-avatar style="flex-shrink: 0" shape="circle" :src="avatar" />
      <div
        style="margin-left: 1em; flex-direction: column; flex: 1"
        class="flex justify-around"
      >
        <div class="font-bold">{{ userInfo.name || "--" }}</div>
        <div style="overflow: hidden; font-size: 1em">
          {{ userInfo.email || "--" }}
        </div>
      </div>
    </div>
    <div class="user-avatar-form-items">
      <div class="user-avatar-form-item">
        <icon-user></icon-user>
        个人信息
      </div>
      <div class="user-avatar-form-item">
        <icon-saved></icon-saved>
        我的收藏
      </div>
      <div class="user-avatar-form-item">
        <icon-admin></icon-admin>
        系统管理
      </div>
      <div @click="logout" class="user-avatar-form-item">
        <icon-logout></icon-logout>
        退出
      </div>
    </div>
  </div>
</template>
<script setup>
import { useLoginStatusStore } from "@/store/stores/login";
import { doLogout } from "@/store/stores/loginAction";
import { computed, ref, onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import iconLogout from "@/icon/user/logout.svg?component";
import iconUser from "@/icon/user/user.svg?component";
import iconAdmin from "@/icon/user/admin.svg?component";
import iconSaved from "@/icon/user/saved.svg?component";

let route = useRoute();

// 顶部头像
const loginStore = useLoginStatusStore();

const avatar = computed(() => {
  const loginStore = useLoginStatusStore();
  // 默认头像
  return loginStore.userInfo?.preview_avatar || "/defaultAvatar/avatar3.png";
});

const userInfo = computed(() => {
  return loginStore.userInfo || {};
});

function logout(params) {
  doLogout();
}
</script>

<style>
.user-avatar-form {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  width: 200px;
}

.user-avatar-form-items {
  display: flex;
  flex-direction: column;
}

.user-avatar-form-item {
  border-radius: 4px;
  display: flex;
  padding: 8px 12px;
  column-gap: 12px;
  align-items: center;
  font-size: 12px;
  svg {
    width: 14px;
    height: 14px;
  }
}

.user-avatar-form-item:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>
