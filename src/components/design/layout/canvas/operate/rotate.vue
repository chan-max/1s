<template>
    <operate-form-item>
        <template #icon>
            <icon></icon>
        </template>
        <template #name> 元素旋转 </template>
        <template #content>
            <el-tooltip content="用于旋转元素，单位为旋转的角度" :hide-after="0" placement="top">
                <div>
                    <el-popover trigger="click" width="180" popper-class="el-popover-operation">
                        <template #reference>
                            <el-button link>
                                <div style="font-size: 1rem;display:flex;column-gap:.5rem;">
                                    <span>x:</span>
                                    <span> {{ x }} deg</span>
                                    <span> y:</span>
                                    <span> {{ y }}deg </span>
                                    <span>z:</span>
                                    <span>{{ z }}deg</span>
                                </div>
                            </el-button>
                        </template>
                        <el-row align="middle" justify="end" :gutter="12">
                            <el-col :span="6"> x轴 </el-col>
                            <el-col :span="18"> <el-slider :min="0" :max="360" v-model="x" :marks="marks"   :format-tooltip="formatTooltip"/></el-col>
                            <el-col :span="6"> y轴 </el-col>
                            <el-col :span="18"> <el-slider :min="0" :max="360" v-model="y" :marks="marks"   :format-tooltip="formatTooltip"/></el-col>
                            <el-col :span="6"> z轴 </el-col>
                            <el-col :span="18"> <el-slider :min="0" :max="360" v-model="z" :marks="marks"   :format-tooltip="formatTooltip"/></el-col>
                        </el-row>
                    </el-popover>
                </div>
            </el-tooltip>
        </template>
    </operate-form-item>
</template>
  
<script setup lang="ts">
import icon from "@/components/design/assets/icon/rotate.svg?component";
import { ref } from 'vue'



const x = defineModel('x', { default: '' })
const y = defineModel('y', { default: '' })
const z = defineModel('z', { default: '' })

const marks = ref({
    '45':'',
    '90':'',
    '190':'',
})




function formatTooltip(val) {

if (val == 45) {
    return '45°'
}


if (val == 90) {
    return '90°'
}

if (val == 180) {
    return '180'
}

return val
}

</script>
  
<style></style>
  