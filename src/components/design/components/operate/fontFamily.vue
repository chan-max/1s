<template>
    <operate-form-item>
        <template #icon> <icon-font-family></icon-font-family> </template>
        <template #name> 个性字体</template>
        <template #content>
            <el-select v-model="model" size="small" filterable clearable :filter-method="filter">
                <el-option-group label="网络字体">
                    <template v-for="item in list" :key="item.id">
                        <el-option v-if="!item.hide" :label="item.name" :value="item">
                            <desimage :src="item.thumbnail" style="width: 240px; height: 32px"></desimage>
                        </el-option>
                    </template>
                </el-option-group>
            </el-select>
        </template>
    </operate-form-item>
</template>

<script setup lang="ts">
import iconFontFamily from "@/components/design/assets/icon/font-family.svg?component";
import { ref, onBeforeMount, watch } from "vue";
import { getFontListApi, fetchFile } from "@/api";
import { usePaging } from "@/hooks/data/paging.ts";
import desimage from "@/components/design/components/image.vue";
import { cacheFontFamily } from "@/components/design/store";
import { message } from "ant-design-vue";

const model = defineModel({});

const emits = defineEmits(['font-load'])

function filter(key) {
    list.value?.forEach((item) => {
        item.hide = !item.name.includes(key)
    });
}

watch(model, async () => {
    let info: any = model.value;
    if (!info) {
        return;
    }
    const { url, id, name } = info;
    if (cacheFontFamily.value[id]) {
        return;
    }

    message.loading({
        content: `正在加载字体${name}`,
        key: "loadfont",
        duration: 0,
    });
    const file = await fetchFile(url);

    const fontStyle = document.createElement("style");
    const fontId = `font_${id}`;
    fontStyle.innerHTML = `
                @font-face {
                    font-family: ${fontId};
                    src: url(${URL.createObjectURL(file)}); 
                }
    `;
    document.head.appendChild(fontStyle);
    fontStyle.setAttribute("font_id", fontId);
    cacheFontFamily.value[id] = fontStyle;

    message.success({
        content: `字体加载成功`,
        key: "loadfont",
    });

    emits('font-load')
},{
    immediate:true
});

const { list, getList } = usePaging(
    (params) => {
        return getFontListApi({
            ...params,
        });
    },
    {
        forEach(item) {
            item.thumbnail = "https://" + item.thumbnail;
            item.url = "https://" + item.url;
        },
    }
);
</script>

<style></style>
