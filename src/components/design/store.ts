import { setFullscreen } from "@/common/browser";
import { useDebounceFn, useLocalStorage } from "@vueuse/core";
import { computed, ref, shallowRef, watchEffect, watch, nextTick, reactive, toRaw } from "vue"
import { defineStore } from "pinia";
import Utils from '@/common/utils'
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
import Api from '@/api'

// 当前实例
export const currentModelController = shallowRef(null);

// 截屏组件实例
export const screenshotInstance = ref();

// 所有截屏
export const screenshots = ref([])

export const lastestScreenshot = computed(() => {
    return screenshots.value[screenshots.value.length - 1]
})

export function saveScreenshot() {
    const base64 = currentModelController.value.getScreenshotBase64();
    screenshotInstance.value.execScreenshot(base64);

    if (screenshots.value.length >= 10) {
        screenshots.value.shift()
    }

    screenshots.value.push({
        base64: base64,
        createdTime: new Date().getTime()
    })
}




// 是否为暗色模式
export const isDarkMode = ref(false)

// 加载
export const isFirstPageLoading = shallowRef(true);

// 当前组件是否全屏
export const isFullScreen = ref(false)

watchEffect(() => setFullscreen(isFullScreen.value))

// 画布背景颜色 
export const canvasBgColor = ref(0x000000)

// 画布背景透明度
export const canvasBgOpacity = ref('0')

// 画布颜色随着暗色模式的变化而变化


// 是否展示基础模型选择菜单
export const showBaseModelSelect = ref(false);

// 当前操作的模型信息 , 如果不提供默认值 ， 会出现 【object】的问题
export const currentOperatingBaseModelInfo = ref({} as any)

// 是否展示场景控制弹窗
export const showSceneControl = ref(false)

// 是否展示图片贴图的弹窗
export const showImageSticker = ref(false)

watch(showImageSticker, (value) => {
    if (value) {
    }
})

// 是否展示艺术字弹窗
export const showTextSticker = ref(false)

// 是否展示工作台窗口
export const showWorkspace = ref(false)
watch(showWorkspace, (value) => {
    if (value) {
        clearRightLayout()
        showWorkspace.value = true
    }
})




// 是否展示贴画控制弹窗
export const showDecalControl = ref(false)
watch(showDecalControl, (value) => {
    if (value) {
        clearLeftLayout()
        showDecalControl.value = true
    }
})


// 展示自定义模型
export const showCustomModel = ref(false)

// 是否展示自定义文字贴纸
export const showCustomTextSticker = ref(false)
watch(showCustomTextSticker, (value) => {
    if (value) {
        clearLeftLayout()
        showCustomTextSticker.value = true
    }
})

// 是否展示二维码
export const showQrcode = ref(false)

// 当前正在操作的贴花实例
export const currentOperatingDecalController = shallowRef()

// 是否展示图片上传弹窗
export const showImageUplaod = ref(false)

// 是否展示字体上传弹窗
export const showFontUpload = ref(false)


/*
  切换主模型
  需要保留之前的操作
*/

watch(
    currentOperatingBaseModelInfo,
    async () => {
        if (!currentOperatingBaseModelInfo.value?.url) {
            return;
        }
        // await nextTick();
        await Utils.sleep(33)
        currentModelController.value?.setMainModel(currentOperatingBaseModelInfo.value?.url);
    },
    {
        immediate: true,
    }
);


// 改变画布背景颜色
watchEffect(() => {

    if (!currentModelController.value) {
        return
    }

    return
    currentModelController.value.setBgColor(canvasBgColor.value, canvasBgOpacity.value)
});

/*
  二维码
*/




export const qrCodeOptions = ref({
    text: "1s.design",
    width: 0,
    height: 0,
    colorDark: "#000000",
    colorLight: "rgba(0,0,0,0)",
    correctLevel: 2, // L, M, Q, H
})

/*
 条形码
*/
export const barCodeOptions = ref({

})

// 是否展示字体列表
export const showFontModal = ref(false)

// 是否展示贴纸
export const showSticker = ref(false)
watch(showSticker, async (value) => {
    if (value) {
        clearLeftLayout()
        showSticker.value = true
    }
})


// 是否展示已使用的贴纸列表
export const showDecalList = useLocalStorage('_1s_showDecalList', false)
watch(showDecalList, (value) => {
    if (value) {
        clearRightLayout()
        showDecalList.value = true
    }
})



// 展示徽章
export const showStamp = ref(false)

/* 是否展示上传 */
export const showUpload = ref(false)

// 是否展示模型信息
export const showModelInfo = ref(false)
watch(showModelInfo, async (value) => {
    if (value) {
        clearRightLayout()
        showModelInfo.value = true
    }
})

// 是否展示顶部菜单
export const showHeader = ref(true)

// 是否展示顶部副菜单
export const showSubHeader = ref(true)

export const showLeftMenu = ref(true)

export const showBottomMenu = ref(true)

// 清空左侧布局
export function clearLeftLayout() {
    showImageSticker.value = false
    showCustomTextSticker.value = false
    showTextSticker.value = false
    showSvgCanvas.value = false
    showCanvasLayout.value = false
    showSticker.value = false
    showDecalControl.value = false
}

// 清空右侧布局
export function clearRightLayout() {
    showDecalList.value = false
    showModelInfo.value = false
    showWorkspace.value = false
}


// 展示自定义画布布局
export const showCanvasLayout = ref(false);
watch(showCanvasLayout, (value) => {
    if (value) {
        clearLeftLayout()
        showCanvasLayout.value = true
        // showBasicCanvas.value = true
    } else {
        // showBasicCanvas.value = false
    }
})


// 清空所有布局元素
export function clearLayout() {
}

// 记录当前正在操作的贴纸信息
export const operatingTextStickerOptions = reactive({
    // 贴纸内容
    content: `天下第一`,
    // text color
    fontColor: '#333',
    fontGradientColor: '#333',
    // font-weight
    fontWeight: "500",
    // font-size
    fontSize: 30,
    // line-height rem
    lineHeight: 1,
    // font-style italic
    italic: false,
    // letter-spacing
    letterSpacing: .1,

    // 记录当前引用的字体信息 
    fontFamilyInfo: '',
    fontFamilyId: '',

    // 背景颜色
    backgroundColor: 'rgba(0,0,0,0)',
    gradientBackgroundColor: '#0099ff',
    backgroundBorderRadius: '5px',
    backgroundPadding: '',

    // 边框 
    borderColor: '#000',
    borderWidth: 0,
    borderStyle: 'solid'

    // 阴影效果暂时不考虑
})

export const operatingTextStickerWritingMode = ref('initial')
export const enum TextStickerWritingMode {
    INITIAL = 'initial',
    VERTICAL_RL = 'vertical-rl',
    VERTICAL_LR = 'vertical-lr',
}

export const operatingTextStickerTextOrientation = ref('upright')


// 是否展示模型上传弹窗
export const showSaveModel = ref(false)

// 系统是否成功连接 websocket
export const online = ref(false);
watch(online, (value) => {
})



// 是否为编辑模式 ,  分为编辑模式和 新建模式 ， 编辑模式也会分为编辑自己的和其他人的
export const isEdit = ref(false)
// 当前正在编辑的模型信息, 只有为编辑模型时才会赋值
export const currentEditingModelInfo = ref()


// 模型装饰品
export const showDecoration = ref(false)


/*
 是否展示基础画布
*/
export const showBasicCanvas = computed(() => {
    return (showCanvasLayout.value && showMainCanvas.value)
})

/*
 是否展示3d画布
*/
export const showThreeCanvas = ref(true)


/*
    延迟点击贴纸
*/

export const isUsingClickDelaySticker = ref(false)

export const clickDelaySticker = ref()


/*
    当前页面中使用并加载了哪些字体 , 并且字体是否在加载中
*/
export const cacheFontFamily = ref({})

export const cacheFontFamilyLoadingMap = ref({})




/*
    svg 画布
*/
export const showSvgCanvas = ref(false)

export const svgCanvasChildren = ref([])

// 当前操作画布的宽和高
export const svgCanvasWidth = ref(100)
export const svgCanvasHeight = ref(100)
// 是否展示主画布
export const svgCanvasSyncMainCanvas = ref(false)


export const viewDisplayController = ref({
    showStickerModal: false, // 贴纸模态，主要用于交互操作
    showProject: false, // 是否展示我的项目

    // 是否展示贴纸 
    showDecalControl: false
})



/*
    所有状态统一使用store管理
*/


import { canvasStickerOptions, currentOperatingCanvasChildId } from '@/components/design/layout/canvas/index.tsx'

import { stickerQueryTags, stickerQueryParams } from "@/components/design/layout/sticker/index.tsx";
import { showMainCanvas } from "@/components/design/layout/canvas/index.tsx";


// 当前仓库的名字
export const storageName = ref('')



/**
 * @define 当前工作台添加的本地文件。可以使用或上传
*/

export const currentWorkspaceLocalFiles = ref([])

/*
    最近更新时间
*/
export const lastModifiedTime = ref()


/**
 * @define 当前系统 用户在本地选择的文件资源
*/
export const localFileListResource = ref([])



export const useDesignStore = defineStore('_1s_design', () => {
    return {
        version: null,
        storageName: useLocalStorage('_1s_storageName', storageName),
        showWorkspace: useLocalStorage('_1s_showWorkspace', showWorkspace),
        // lastModifiedTime: useLocalStorage('_1s_lastModifiedTime', lastModifiedTime),
        showBaseModelSelect: useLocalStorage('_1s_showBaseModelSelect', showBaseModelSelect),
        showBasicCanvas: useLocalStorage('_1s_showBasicCanvas', showBasicCanvas),
        showThreeCanvas: useLocalStorage('_1s_showThreeCanvas', showThreeCanvas),
        showSticker: useLocalStorage('_1s_showSticker', showSticker),
        currentOperatingBaseModelInfo: useLocalStorage('_1s_currentOperatingBaseModelInfo', currentOperatingBaseModelInfo),
        showCanvasLayout: useLocalStorage('_1s_showCanvasLayout', showCanvasLayout),
        canvasStickerOptions: useLocalStorage('_1s_canvasStickerOptions', canvasStickerOptions),
        stickerQueryTags: useLocalStorage('_1s_stickerQueryTags', stickerQueryTags),
        currentOperatingCanvasChildId: useLocalStorage('currentOperatingCanvasChildId', currentOperatingCanvasChildId),
        showMainCanvas: useLocalStorage('_1s_showMainCanvas', showMainCanvas),
        viewDisplayController: useLocalStorage('_1s_viewDisplayController', viewDisplayController)
    }
})



const designStore = useDesignStore();




/*
 单独记录时间
*/
designStore.$subscribe((mutation, state) => {
    lastModifiedTime.value = new Date()
}, {
    deep: true
})

/*
    同步工作区所有个人状态
*/

/*
    开始同步 
    bug 请李缓存也会视为更改页面状态，也会触发更新
*/


// 同步状态
export const syncState = ref({
    loading: false, // 正在保存中
    success: false, // 成功
    failed: false // 失败
})

export function startSyncDesignStorage() {

    let sync = useDebounceFn(function sync(state) {

        let currentState = Utils.deepUnref(state)

        try {
            Api.updateUserMeta({
                metaKey: 'designStorage',
                data: {
                    ...currentState,
                    lastModifiedTime: lastModifiedTime.value
                }
            })
            syncState.value.success = true
        } catch (e) {
            syncState.value.failed = true
        } finally {
            syncState.value.loading = false
        }

    }, 999)



    designStore.$subscribe((mutation, state) => {
        syncState.value.loading = true
        sync(state)
    }, {
        deep: true,
    })

}



export {currentHoveringDecalController} from '@/components/design/core/decalController'


