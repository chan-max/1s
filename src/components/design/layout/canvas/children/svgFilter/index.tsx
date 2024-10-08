import { canvasStickerOptions } from '@/components/design/layout/canvas/index.tsx'
import { formatSizeOptionToPixelValue } from '../../helper'

import { createFeDisplacementMap, createFeDisplacementMapDefaultOptions } from './effect/displacementMap'
import { createFeDropShadow, createFeDropShadowDefaultOptions } from './effect/dropShadow'
import { createFeGaussianBlurDefaultOptions, createFeGaussianBlur } from './effect/gaussianBlur'
import { createFeMorphology, createFeMorphologyDefaultOptions, } from './effect/morphology'

export { FeMorphologyOperator, FeMorphologyOperatorOptions } from './effect/morphology'

import { createFeFlood, createFeFloodDefaultOptions } from './effect/flood'

// 创建svg滤镜

/*
    svg 滤镜中统一使用 px 单位
*/


export enum SvgFilterResource {
    // 对于普通效果的例图
    NORMAL_PREVIEW_IMAGE_URL = '/svgFilter/preview.jpeg'
}



/*
    标准滤镜类型
*/
export enum SvgFilterEffects {
    DROP_SHADOW = 'drop-shadow',
    GAUSSIAN_BLUR = 'gaussian-blur',
    MORPHOLOGY = 'morphology',
    DISPLACEMENT_MAP = 'displacement-map',
    FLOOD = 'flood',
    TURBULENCE = 'turbulence',
    COMPOSITE = 'composite',
    Tile = 'tile'
}

/**/
export const SvgFilterEffectDisplayLabelMap = {
    [SvgFilterEffects.DROP_SHADOW]: '投影 (feDropShadow)',
    [SvgFilterEffects.GAUSSIAN_BLUR]: '模糊 (feGaussianBlur)',
    [SvgFilterEffects.MORPHOLOGY]: '形态 (feMorphology)',
    [SvgFilterEffects.DISPLACEMENT_MAP]: '位移图 (feDisplacementMap)',
    [SvgFilterEffects.FLOOD]: '颜色填充 (feFlood)',
    [SvgFilterEffects.TURBULENCE]: '湍流效果 (feTurbulence)',
    [SvgFilterEffects.COMPOSITE]: '组合 (feComposite)',
    [SvgFilterEffects.Tile]: '重复填充 (feTile)'
}


/* 滤镜默认配置创建映射 */
export const SvgFilterCreatorMap = {
    [SvgFilterEffects.DROP_SHADOW]: createFeDropShadowDefaultOptions,
    [SvgFilterEffects.GAUSSIAN_BLUR]: createFeGaussianBlurDefaultOptions,
    [SvgFilterEffects.MORPHOLOGY]: createFeMorphologyDefaultOptions,
    [SvgFilterEffects.DISPLACEMENT_MAP]: createFeDisplacementMapDefaultOptions,
    [SvgFilterEffects.FLOOD]: createFeFloodDefaultOptions,
    [SvgFilterEffects.TURBULENCE]: null
}

/* 滤镜默认dom创建映射 */
export const SvgFilterDOMCreatorMap = {
    [SvgFilterEffects.DROP_SHADOW]: createFeDropShadow,
    [SvgFilterEffects.GAUSSIAN_BLUR]: createFeGaussianBlur,
    [SvgFilterEffects.MORPHOLOGY]: createFeMorphology,
    [SvgFilterEffects.DISPLACEMENT_MAP]: createFeDisplacementMap,
    [SvgFilterEffects.FLOOD]: createFeFlood,
    [SvgFilterEffects.TURBULENCE]: null
}

/* 添加 过滤特效 */
export function addSvgFilterEffect(type) {

    let opt = SvgFilterCreatorMap[type]

    if (!opt) {
        return
    }

    canvasStickerOptions.value.svgFilter.children.push(
        opt.call()
    )
}




// 1. feBlend - 混合
// 将两个对象组合在一起，使用不同的混合模式
export const FeBlend = ({ in1, in2, mode = 'normal', result }) => (
    <feBlend in={in1} in2={in2} mode={mode} result={result} />
);

// 2. feColorMatrix - 颜色矩阵
// 通过矩阵乘法转换颜色
export const FeColorMatrix = ({ type, values, result }) => (
    <feColorMatrix type={type} values={values} result={result} />
);

// 3. feComponentTransfer - 组件转换
// 对颜色的每个通道进行独立操作
export const FeComponentTransfer = ({ children, result }) => (
    <feComponentTransfer result={result}>{children}</feComponentTransfer>
);

// 4. feComposite - 合成
// 将两个图像进行组合，使用 Porter-Duff 合成操作
export const FeComposite = ({ in1, in2, operator = 'over', result }) => (
    <feComposite in={in1} in2={in2} operator={operator} result={result} />
);

// 5. feConvolveMatrix - 卷积矩阵
// 应用矩阵卷积滤镜效果
export const FeConvolveMatrix = ({ kernelMatrix, result }) => (
    <feConvolveMatrix kernelMatrix={kernelMatrix} result={result} />
);

// 6. feDiffuseLighting - 漫反射光照
// 创建漫反射光照效果
export const FeDiffuseLighting = ({ surfaceScale, diffuseConstant, result, children }) => (
    <feDiffuseLighting surfaceScale={surfaceScale} diffuseConstant={diffuseConstant} result={result}>
        {children}
    </feDiffuseLighting>
);

// 7. feDisplacementMap - 置换图
// 使用一个图像来置换另一个图像的像素
export const FeDisplacementMap = ({ in1, in2, scale, xChannelSelector, yChannelSelector, result }) => (
    <feDisplacementMap in={in1} in2={in2} scale={scale} xChannelSelector={xChannelSelector} yChannelSelector={yChannelSelector} result={result} />
);

// 8. feFlood - 填充
// 用指定的颜色和不透明度填充滤镜区域
export const FeFlood = ({ floodColor, floodOpacity, result }) => (
    <feFlood floodColor={floodColor} floodOpacity={floodOpacity} result={result} />
);

// 9. feGaussianBlur - 高斯模糊
// 创建模糊效果
export const FeGaussianBlur = ({ stdDeviation, result }) => (
    <feGaussianBlur stdDeviation={stdDeviation} result={result} />
);

// 10. feImage - 图像
// 引用外部图像作为滤镜输入
export const FeImage = ({ href, result }) => (
    <feImage href={href} result={result} />
);

// 11. feMerge - 合并
// 将多个滤镜效果层叠在一起
export const FeMerge = ({ children, result }) => (
    <feMerge result={result}>{children}</feMerge>
);

// 12. feMorphology - 形态学
// 对图像进行"胖化"或"瘦化"操作
export const FeMorphology = ({ operator, radius, result }) => (
    <feMorphology operator={operator} radius={radius} result={result} />
);

// 13. feOffset - 偏移
// 对图像进行平移
export const FeOffset = ({ dx, dy, result }) => (
    <feOffset dx={dx} dy={dy} result={result} />
);

// 14. feSpecularLighting - 镜面光照
// 创建镜面光照效果
export const FeSpecularLighting = ({ surfaceScale, specularConstant, specularExponent, result, children }) => (
    <feSpecularLighting surfaceScale={surfaceScale} specularConstant={specularConstant} specularExponent={specularExponent} result={result}>
        {children}
    </feSpecularLighting>
);

// 15. feTile - 平铺
// 重复平铺图像填充整个滤镜区域
export const FeTile = ({ in1, result }) => (
    <feTile in={in1} result={result} />
);

// 16. feTurbulence - 湍流
// 生成分形噪声图像
export const FeTurbulence = ({ baseFrequency, numOctaves, seed, stitchTiles, type, result }) => (
    <feTurbulence baseFrequency={baseFrequency} numOctaves={numOctaves} seed={seed} stitchTiles={stitchTiles} type={type} result={result} />
);

// 17. feDistantLight - 远光源
// 定义一个远光源，用于光照滤镜
export const FeDistantLight = ({ azimuth, elevation }) => (
    <feDistantLight azimuth={azimuth} elevation={elevation} />
);

// 18. fePointLight - 点光源
// 定义一个点光源，用于光照滤镜
export const FePointLight = ({ x, y, z }) => (
    <fePointLight x={x} y={y} z={z} />
);

// 19. feSpotLight - 聚光灯
// 定义一个聚光灯光源，用于光照滤镜
export const FeSpotLight = ({ x, y, z, pointsAtX, pointsAtY, pointsAtZ, specularExponent, limitingConeAngle }) => (
    <feSpotLight x={x} y={y} z={z} pointsAtX={pointsAtX} pointsAtY={pointsAtY} pointsAtZ={pointsAtZ} specularExponent={specularExponent} limitingConeAngle={limitingConeAngle} />
);

export function createFilter(props, children) {
    return <filter id={props.id} x="0" y="0">
        {children}
    </filter>
}

import { BuiltInSvgFilterRenderList } from './builtIn'



/**
 * 
 * @description every svg filter has its own classname for dom element , in order to support multiple filters in one element
 *  but it doesnt work because only one filter css property support
 */
export const SvgFilterStyleComponent = () => {
    return <style>
        {
        }
    </style>
}


/** 
 * @description 创建子元素的组合滤镜
 * 
*/

function SvgChildCompositeFilterComponent() {

    let compositeChildren = canvasStickerOptions.value.children.filter((child) => {

        if(!child.filter){
            return
        }

        let url = child.filter.filterUrl
        return url.isCompositeFilter && url.filterChildren.length
    })



    const filters = compositeChildren.map((child) => {
        let filterIds = child.filter.filterUrl.filterChildren.map((item) => item.filterId)
        let filterIdStr = filterIds.join('-')

        let mergeNodes = filterIds.map((name) => {
            return <feMergeNode in={name} />
        })

        return <filter id={filterIdStr}>
            <feMerge>
                {
                    mergeNodes
                }
            </feMerge>
        </filter>
    })


    return <>
        {filters}
    </>
}


/*
    定义所有的内置滤镜
*/
export function SvgFilterComponent(props) {
    return <svg id="filter-container-id" height="0" width="0">
        <defs>
            {/* 这里会改为每个元素有一个单独的 */}
            <filter id="rendering-filter" x="0" y="0">
                {canvasStickerOptions.value.svgFilter.children.map((child) => {
                    return SvgFilterDOMCreatorMap[child.type]?.call(null, child)
                })}
            </filter>
            {/* 各种内置滤镜 */}
            {
                BuiltInSvgFilterRenderList.map((opt) => {

                    // 这里可以写滤镜的参数配置
                    const options = {}

                    return opt.render({
                        filterId: opt.filterId,
                        ...options
                    })
                })
            }
            <SvgChildCompositeFilterComponent></SvgChildCompositeFilterComponent>
        </defs>
    </svg>
}


