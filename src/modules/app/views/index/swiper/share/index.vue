<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-02-10 22:16:12
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-14 10:39:06
 * @FilePath: /yishe/src/modules/app/views/index/swiper/share/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
    <div class="ion-padding" style="margin-bottom: 24px">
        <h6>最近的朋友和群聊</h6>
        <div class="row"></div>
        <h6>分享给</h6>
        <div class="row">
            <div v-for="item in utils" class="item">
                <cr-image class="img" :src="item.src" @click="item.handler"></cr-image>
                <div class="label">{{ item.label }}</div>
            </div>
        </div>
    </div>

    <ion-modal :is-open="showFriend" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="showFriend = false">
        <div style="height: 70vh" class="ion-padding">
            <ion-header>
                <div>
                    <ion-searchbar></ion-searchbar>
                </div>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-item v-for="i in 20">
                    </ion-item>
                </ion-list>
                <ion-infinite-scroll @ionInfinite="ionInfinite">
                    <ion-infinite-scroll-content></ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </ion-content>
        </div>
    </ion-modal>
    <ion-modal :is-open="showGroup" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="showGroup = false">
        <div style="height: 70vh" class="ion-padding">
            <ion-header>
                <div>
                    <ion-searchbar></ion-searchbar>
                </div>
            </ion-header>
            <ion-content>
                <ion-list>
                    <ion-item v-for="i in 20">
                    </ion-item>
                </ion-list>
                <ion-infinite-scroll @ionInfinite="ionInfinite">
                    <ion-infinite-scroll-content></ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </ion-content>
        </div>
    </ion-modal>

    <ion-modal :is-open="showFollowing" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="showFollowing = false">
        <myfollowing :availableModelInfo="availableModelInfo"></myfollowing>
    </ion-modal>

    <ion-modal :is-open="showFollower" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="showFollower = false">
        <myfollower :availableModelInfo="availableModelInfo"></myfollower>
    </ion-modal>

    <ion-modal :is-open="showFriend" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="showFriend = false">
        <myfriend :availableModelInfo="availableModelInfo"></myfriend>
    </ion-modal>

    <ion-modal :is-open="showGroup" :initial-breakpoint="1" :breakpoints="[0, 1]" @didDismiss="showGroup = false">
        <mygroup :availableModelInfo="availableModelInfo"></mygroup>
    </ion-modal>
</template>

<script setup>
import { defineProps, ref } from "vue";
import crImage from "@/modules/app/components/image.vue";
import iconcustomerService from "@/icon/mobile/customer-service.svg?url";
import iconmyfriend from "@/icon/mobile/myfriend.svg?url";
import iconmygroup from "@/icon/mobile/mygroup.svg?url";
import iconmyfollowing from "@/icon/mobile/myfollowing.svg?url";
import iconmyfollower from "@/icon/mobile/myfollower.svg?url";
import myfollowing from './myfollowingModal.vue'
import myfollower from './myfollowerModal.vue'
import myfriend from './myfriendModal.vue'
import mygroup from './mygroupModal.vue'

const props = defineProps(["availableModelInfo"]);

// 是否展示好友列表弹层
const showFriend = ref(false);

// 是否展示群组弹层
const showGroup = ref(false);

// 是否展示粉丝弹层
const showFollower = ref(false);

/* 最近的好友和群聊 */
const recent = ref([]);

// 是否展示正在关注弹层
const showFollowing = ref(false);

function ionInfinite(e) {
    e.target.complete()
}

/* 功能 */
const utils = ref([
    {
        src: iconmyfriend,
        label: "我的好友",
        handler() {
            showFriend.value = true;
        },
    },
    {
        src: iconmygroup,
        label: "我的群聊",
        handler() {
            showGroup.value = true;
        },
    },
    {
        src: iconcustomerService,
        label: "发给客服",
        handler() {
        },
    },
    {
        src: iconmyfollowing,
        label: "我的关注",
        handler() {
            showFollowing.value = true;
        },
    },
    {
        src: iconmyfollower,
        label: "我的粉丝",
        handler() {
            showFollower.value = true;
        },
    },
]);
</script>
<style lang="less" scoped>
h6 {
    font-size: 12px;
}

.img {
    width: 48px;
    height: 48px;
}

.row {
    width: 100%;
    display: flex;
    padding: 5px;
    column-gap: 18px;
}

.label {
    font-size: 10px;
}

.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 8px;
}

ion-list {
    background: transparent;
}

ion-item {
    --background: transparent;
}
</style>
