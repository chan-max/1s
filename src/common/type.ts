


const fontSuffix = ['eot', 'otf', 'ttf', 'woff', 'woff2'];

const imageSuffix = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

function isFontName(fileName) {
    const [name, extension] = fileName.split('.');

    return fontSuffix.includes(extension.toLowerCase());
}

function isImageName(fileName) {

    const [name, extension] = fileName.split('.');

    return imageSuffix.includes(extension.toLowerCase());
}


const modelSuffix = ['glb']
function isModelName(fileName) {

    const [name, extension] = fileName.split('.');

    return modelSuffix.includes(extension.toLowerCase());
}



export class Type {
    isFontName = isFontName
    isImageName = isImageName
    isModelName = isModelName
    modelSuffix = modelSuffix
}

