<template>
    <div id="basic-canvas-canvas-container" v-if="showMainCanvas && showCanvasLayout">
        <div ref="panzoomRef">
            <canvass></canvass>
        </div>

        <div class="top-menu">
            <div style="flex:1;"></div>
            <div v-if="loading" class="italic font-bold"> 正在渲染贴纸... </div>
            <div>
                宽 {{ canvasStickerOptions.width }}{{ canvasStickerOptions.unit }} 高 {{ canvasStickerOptions.height }}{{
                    canvasStickerOptions.unit }}
            </div>
            <el-button type="danger" link @click="showMainCanvas = false">
                <el-icon size="18">
                    <CircleCloseFilled></CircleCloseFilled>
                </el-icon>
            </el-button>
        </div>
        <div class="bottom-menu">
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { CanvasController, showMainCanvas, canvasStickerOptions } from '@/components/design/layout/canvas/index.tsx'
import { useLoadingOptions } from "@/components/loading/index.tsx";
import { Delete, Plus, DeleteFilled, CircleCloseFilled, Link, CirclePlusFilled, FullScreen } from '@element-plus/icons-vue'
import { showCanvasLayout } from '@/components/design/store.ts';
import panzoom from 'panzoom'

const panzoomRef = ref()

let canvasController = new CanvasController({
    max: 320
});

const loading = computed(() => {
    return canvasController.loading.value;
});

let canvass = canvasController.getRender();

watch(panzoomRef, () => {
    if (panzoomRef.value) {
        panzoom(panzoomRef.value, {
            smoothScroll: false
        })
    }
})

</script>
  
<style scoped lang="less">
#basic-canvas-canvas-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eee;
    border: 1px solid #eee;
    position: relative;
    overflow: auto;

    * {
        flex-shrink: 0;
    }
}

.top-menu,
.bottom-menu {
    position: absolute;

    right: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    column-gap: 2rem;
}

.top-menu {
    top: 0;
}

.bottom-menu {
    bottom: 0;
}
</style>
  