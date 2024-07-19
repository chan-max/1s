import Utils from '@/common/utils';

import { canvasOptions } from "./index"


export function updateCanvasOptionsUnit(currentUnit) {
    const unitKeys = [
        'width',
        'height',
        'top',
        'left',
        'right',
        'bottom',
        'fontSize',
        'leftTop',
        'rightTop',
        'leftBottom',
        'rightBottom',
        'borderWidth',
        'horizontal',
        'vertical',
        'blur'
    ]

    const absoluteUnits = ['px', 'cm', 'mm', 'in']

    function updateUnit(item) {
        if (Array.isArray(item)) {
            return item.forEach(updateUnit)
        }

        if (item == null || typeof item != 'object') {
            return
        }

        if (item && !isNaN(Number(item.value)) && item.unit && absoluteUnits.includes(item.unit)) {

            return item.unit = currentUnit
        }

        for (let key in item) {
            updateUnit(item[key])
        }
    }

    updateUnit(canvasOptions.value.children)
}


const isNumber = (val) => typeof val === 'number'



/*
    将所有尺寸转换为px单位
*/
export function formatSizeOptionToPixelValue(size, elementRealSize = null /* 当前元素中不能含有%w %h的相对属性 */) {

    if (!isNaN(Number(size))) {
        return size
    }

    var { value, unit } = size

    value = Number(value)

    if (!value) {
        return 0
    }

    if (unit == 'px') {
        return value
    }
    if (unit == 'cm') {
        return value * Utils.CM2PX
    }

    if (unit == 'mm') {
        return value * Utils.CM2PX / 10
    }

    if (unit == 'in') {
        return value * Utils.CM2PX * Utils.IN2CM
    }

    if (unit == '%w') {
        let real = formatSizeOptionToPixelValue(elementRealSize.width)
        return value / 100 * real
    }

    if (unit == '%h') {
        let real = formatSizeOptionToPixelValue(elementRealSize.height)
        return value / 100 * real
    }

    if (unit == 'vw') {
        let canvasPxWidth = formatSizeOptionToPixelValue({
            value: canvasOptions.value.width,
            unit: canvasOptions.value.unit,
        })
        return value * canvasPxWidth / 100
    }

    if (unit == 'vh') {
        let canvasPxHeight = formatSizeOptionToPixelValue({
            value: canvasOptions.value.height,
            unit: canvasOptions.value.unit,
        })
        return value * canvasPxHeight / 100
    }
}




export function formatToNativeSizeString(size, relativeElementSize = null) {
    const option = formatToNativeSizeOption(size, relativeElementSize)
    return option.value + option.unit
}

export function formatToNativeSizeOption(size, relativeElementSize = null) {
    let { value, unit } = size

    if (!value) {
        return {
            value: '0',
            unit: 'px'
        }
    }

    if (unit == 'px') {
        return {
            value,
            unit: 'px'
        }
    }

    if (unit == 'mm') {
        return {
            value,
            unit: 'mm'
        }
    }

    if (unit == 'cm') {
        return {
            value,
            unit: 'cm'
        }
    }

    if (unit == 'in') {
        return {
            value,
            unit: 'in'
        }
    }

    /*
        相对于画布的元素
    */

    if (unit == 'vw') {
        return {
            value: value * canvasOptions.value.width / 100,
            unit: canvasOptions.value.unit
        }
    }

    if (unit == 'vh') {
        return {
            value: value * canvasOptions.value.height / 100,
            unit: canvasOptions.value.unit
        }
    }

    if (unit == '%w') {
        m
        const { value: relativeSize, unit: relativeUnit } = formatToNativeSizeOption(relativeElementSize.width)
        return {
            unit,
            value: value / 100 * relativeSize
        }
    }

    if (unit == '%h') {
        const { value: relativeSize, unit: relativeUnit } = formatToNativeSizeOption(relativeElementSize.height)
        return {
            unit,
            value: value / 100 * relativeSize
        }
    }
}

let directionMap = {
    top: '上方',
    left: '左侧',
    bottom: '下方',
    right: '右侧'
}

/*
    处理元素位置
*/

function getPositionRealLabel(direction, size) {
    let { value, unit } = size


    if (unit == 'px') {
        return `距离${directionMap[direction]} ${value}px`
    }

    if (unit == 'cm') {
        return `距离${directionMap[direction]} ${value}cm`
    }

    if (unit == 'mm') {
        return `距离${directionMap[direction]} ${value}mm`
    }

    if (unit == 'in') {
        return `距离${directionMap[direction]} ${value}in`
    }

    if (unit == 'vw') {
        return `距离${directionMap[direction]} ${value / 100} 个画布宽度`
    }

    if (unit == 'vh') {
        return `距离${directionMap[direction]} ${value / 100} 个画布高度`
    }
}

export function getPositionInfoFromOptions(position) {
    const containerStyle: any = {}
    const style: any = {}
    const labels = []

    if (!position) {
        return {
            containerStyle,
            style, labels
        }
    }

    if (position.center) {
        containerStyle.display = 'flex'
        containerStyle.alignItems = 'center'
        containerStyle.justifyContent = 'center'
        labels.push('整体居中')
    } else if (position.verticalCenter && position.horizontalCenter) {
        containerStyle.display = 'flex'
        containerStyle.alignItems = 'center'
        containerStyle.justifyContent = 'center'
        labels.push('整体居中')
    } else if (!position.verticalCenter && position.horizontalCenter) {
        containerStyle.display = 'flex'
        containerStyle.justifyContent = 'center'
        style.position = 'absolute'

        if (isNumber(position.top.value)) {
            let top = formatToNativeSizeOption(position.top)
            style.top = top.value + top.unit
            labels.push(getPositionRealLabel('top', top))
        } else if (isNumber(style.bottom.value)) {
            let bottom = formatToNativeSizeOption(position.bottom)
            style.bottom = bottom.value + bottom.unit
            labels.push(getPositionRealLabel('bottom', bottom))
        }

        labels.push('水平居中')
    } else if (position.verticalCenter && !position.horizontalCenter) {
        containerStyle.display = 'flex'
        containerStyle.alignItems = 'center'
        // 按优先级排列
        style.position = 'absolute'

        if (isNumber(position.left.value)) {
            let left = formatToNativeSizeOption(position.left)
            style.left = left.value + left.unit
            labels.push(getPositionRealLabel('left', left))
        } else if (isNumber(style.right.value)) {
            let right = formatToNativeSizeOption(position.right)
            style.right = right.value + right.unit
            labels.push(getPositionRealLabel('right', right))
        }

        labels.push('垂直居中')
    } else {
        // 自定义属性
        style.position = 'absolute'

        if (isNumber(position.top.value)) {
            let top = formatToNativeSizeOption(position.top)
            style.top = top.value + top.unit
            labels.push(getPositionRealLabel('top', top))
        } else if (isNumber(position.bottom.value)) {
            let bottom = formatToNativeSizeOption(position.bottom)
            style.bottom = bottom.value + bottom.unit
            labels.push(getPositionRealLabel('bottom', bottom))
        }

        if (isNumber(position.left.value)) {
            let left = formatToNativeSizeOption(position.left)
            style.left = left.value + left.unit
            labels.push(getPositionRealLabel('left', left))
        } else if (isNumber(position.right.value)) {
            let right = formatToNativeSizeOption(position.right)
            style.right = right.value + right.unit
            labels.push(getPositionRealLabel('right', right))
        }
    }

    return {
        containerStyle,
        style,
        label: labels.length == 0 ? '未设置' : labels.join(' , ')
    }
}


/*
    处理内间距
*/

export function getPaddingRealLabel(direction, size) {
    let { value, unit } = size

    if (unit == 'currentUnit') {
        unit = canvasOptions.value.unit
    }

    if (unit == 'px') {
        return `距离${directionMap[direction]} ${value}px`
    }

    if (unit == 'cm') {
        return `距离${directionMap[direction]} ${value}cm`
    }

    if (unit == 'mm') {
        return `距离${directionMap[direction]} ${value}mm`
    }

    if (unit == 'in') {
        return `距离${directionMap[direction]} ${value}in`
    }

    if (unit == 'vw') {
        return `距离${directionMap[direction]} ${value / 100} 个画布宽度`
    }

    if (unit == 'vh') {
        return `距离${directionMap[direction]} ${value / 100} 个画布高度`
    }

    if (unit == '%w') {
        return `距离${directionMap[direction]} ${value / 100} 个元素宽度`
    }

    if (unit == '%h') {
        return `距离${directionMap[direction]} ${value / 100} 个元素高度`
    }
}

export function getPaddingDispalyLabel(padding) {
    let labels = []
    for (let key in padding) {
        if (padding[key].value) {
            labels.push(getPaddingRealLabel(key, padding[key]))
        }
    }
    return labels.length ? labels.join(' , ') : '无间距'
}


export function getPaddingRealPixel(padding, elementRealSize) {
    return [
        formatToNativeSizeString(padding.top, elementRealSize),
        formatToNativeSizeString(padding.right, elementRealSize),
        formatToNativeSizeString(padding.bottom, elementRealSize),
        formatToNativeSizeString(padding.left, elementRealSize)
    ].join(' ')
}


/*
    处理圆角
*/

const borderRadiusPositionMap = {
    leftTop: '左上角',
    rightTop: '右上角',
    rightBottom: '右下角',
    leftBottom: '左下角'
}

export function getBorderRadiusRealLabel(position, size) {
    let { value, unit } = size

    if (unit == 'currentUnit') {
        unit = canvasOptions.value.unit
    }

    if (unit == 'px') {
        return `${borderRadiusPositionMap[position]} ${value}px`
    }

    if (unit == 'cm') {
        return `${borderRadiusPositionMap[position]} ${value}cm`
    }

    if (unit == 'mm') {
        return `${borderRadiusPositionMap[position]} ${value}mm`
    }

    if (unit == 'in') {
        return `${borderRadiusPositionMap[position]} ${value}in`
    }

    if (unit == 'vw') {
        return `${borderRadiusPositionMap[position]} ${value / 100} 个画布宽度`
    }

    if (unit == 'vh') {
        return `${borderRadiusPositionMap[position]} ${value / 100} 个画布高度`
    }

    if (unit == '%w') {
        return `${borderRadiusPositionMap[position]} ${value / 100} 个元素宽度`
    }

    if (unit == '%h') {
        return `${borderRadiusPositionMap[position]} ${value / 100} 个元素高度`
    }
}

export function getBroderRadiusDispalyLabel(borderRadius) {
    let labels = []

    for (let key in borderRadius) {
        if (borderRadius[key].value) {
            labels.push(getBorderRadiusRealLabel(key, borderRadius[key]))
        }
    }

    return labels.length ? labels.join(' , ') : '无圆角'
}

export function getBorderRadiusRealPixel(borderRadius, elementRealSize) {
    return [
        formatToNativeSizeString(borderRadius.leftTop, elementRealSize),
        formatToNativeSizeString(borderRadius.rightTop, elementRealSize),
        formatToNativeSizeString(borderRadius.rightBottom, elementRealSize),
        formatToNativeSizeString(borderRadius.leftBottom, elementRealSize)
    ].join(' ')
}



// 解析阴影效果
export function parseTextShadowOptionsToCSS(textShadowOption) {
    if (!Array.isArray(textShadowOption)) {
        return
    }

    const string = textShadowOption.map((option) => {
        const { horizontal, vertical, blur, color, disabled } = option

        if (disabled) {
            return null
        }

        return [
            formatToNativeSizeString(horizontal), formatToNativeSizeString(vertical), formatToNativeSizeString(blur), color.color
        ].join(' ')

    }).filter(Boolean).join(',')

    return string
}


/*
    处理滤镜
*/

export function createFilterFromOptions(options) {
    return [
        `blur(${formatToNativeSizeString(options.filterBlur)})`,
        `brightness(${options.filterBrightness}%)`,
        `contrast(${options.filterContrast}%)`,
        `sepia(${options.filterSepia}%)`,
        `grayscale(${options.filterGrayscale}%)`,
        `hue-rotate(${options.filterHueRotate}deg)`,
        `invert(${options.filterInvert}%)`,
        `opacity(${options.filterOpacity}%)`,
        `saturate(${options.filterSaturate}%)`,
        options.filterUrl && `url(#${options.filterUrl})`
    ].filter(Boolean).join(' ')
}



export function createTransformString(options) {
    
    let val = `
    scale3d(${options.scaleX ?? 1}, ${options.scaleY ?? 1},  ${options.scaleZ ?? 1}) 
    rotateX(${options.rotateX ?? 0}deg)
    rotateY(${options.rotateY ?? 0}deg)
    rotateZ(${options.rotateZ ?? 0}deg)
    translate3d(${formatToNativeSizeString(options.translateX)},${formatToNativeSizeString(options.translateY)},${formatToNativeSizeString(options.translateZ)})
    skew(${options.skewX ?? 0}deg, ${options.skewY ?? 0}deg)
    `
    return val
}
