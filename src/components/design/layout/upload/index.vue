<template>
  <div class="container">
    <!-- <div style="padding:1em 0;">
    <el-radio-group v-model="uploadTabType">
      <el-radio-button label="本地上传" value="local" />
      <el-radio-button label="扫码上传" value="scan"/>
    </el-radio-group>
  </div> -->
    <div v-if="uploadTabType == 'local'">
      <el-upload
        style="padding: 0"
        v-model:file-list="fileList"
        drag
        :auto-upload="false"
        multiple
        v-bind="$attrs"
        :on-change="fileListChange"
        accept="image/png, image/jpeg, image/svg+xml, font/ttf, font/woff"
      >
        <div class="placeholder">
          <icon-file-upload></icon-file-upload>
          <div style="font-size: 12px">点击或拖拽上传</div>
          <!-- <div> 
            <el-button size="small"> 扫码上传 </el-button>
            <el-button size="small">  扫码上传 </el-button>
          </div> -->
        </div>
        <template #tip>
          <div class="tip">
            <div>
              支持 jpg,png,svg等图片格式 ，图片格式会自动添加到贴纸中,
              ttf,woff等字体格式,字体可以在我的字体中查看
            </div>
          </div>
        </template>

        <template #file="{ file, url }">
          <template v-if="isImg(file.name)">
            <div>
              <div class="file-bar">
                <div class="file-bar-header">
                  <desimage
                    @focus="null"
                    :src="file.url"
                    style="height: 3.2em; width: 3.2em"
                    fit="contain"
                  ></desimage>
                  <div style="font-size: 1.2rem">{{ file.name }}</div>
                  <el-tooltip content="图片会自动上传到贴纸" placement="top">
                    <el-icon style="height: 2em" size="1.5rem"><Warning /></el-icon>
                  </el-tooltip>
                  <div style="flex: 1"></div>
                  <el-button
                    @click="removeFile(file)"
                    type="danger"
                    link
                    style="height: 2em"
                    ><el-icon size="2rem"><CircleCloseFilled /></el-icon
                  ></el-button>
                </div>
                <div class="file-bar-tags">
                  <tags-input v-model="file.tags"></tags-input>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="isFont(file.name)">
            <div>
              <div class="file-bar">
                <div class="file-bar-header">
                  <el-icon size="3.2em"
                    ><component :is="fileTypeIcons[getFileSuffix(file.name)]"></component
                  ></el-icon>
                  <div
                    style="font-size: 1.6em;"
                    @vue:mounted="initFontFamily(file, $event)"
                  >
                    {{ file.name }}
                  </div>
                  <el-tooltip content="左侧的文字会自动生成缩略图" placement="top">
                    <el-icon size="1.5rem"><Warning /></el-icon>
                  </el-tooltip>
                  <div style="flex: 1"></div>
                  <el-button @click="removeFile(file)" type="danger" link
                    ><el-icon size="2rem"><CircleCloseFilled /></el-icon
                  ></el-button>
                </div>
                <div class="file-bar-tags">
                  <tags-input v-model="file.tags"></tags-input>
                </div>
              </div>
            </div>
          </template>
        </template>
      </el-upload>
    </div>
    <div v-if="uploadTabType == 'scan'" class="flex flex-col justify-center items-center">
      <div class="qrcode" style="width: 10rem; height: 10rem"></div>
      <div class="tip">打开app扫码上传</div>
    </div>
    <footer>
      <div style="flex: 1"></div>
      <template v-if="uploadTabType == 'local'">
        <el-button round @click="uploadTabType = 'scan'" :icon="Iphone">
          APP 扫码上传
        </el-button>
        <el-button
          type="primary"
          round
          @click="doUpload"
          :loading="loading"
          :icon="UploadFilled"
          :disabled="fileList.length == 0"
        >
          {{ fileList.length ? `上传该 ${fileList.length} 个文件` : "选择文件"  }}
        </el-button>
      </template>
      <template v-if="uploadTabType == 'scan'">
        <el-button round @click="uploadTabType = 'local'"> 返回本地上传 </el-button>
      </template>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref ,toRaw} from "vue";
import fileUpload from "./fileUpload/index.vue";
import { message } from "ant-design-vue";
import { uploadManyFile, createStickerApi, uploadFile } from "@/api";
import { uploadToCOS } from "@/api/cos";
import { showUpload } from "@/components/design/store.ts";
import {
  UploadFilled,
  CircleCloseFilled,
  QuestionFilled,
  View,
  Warning,
  Iphone,
} from "@element-plus/icons-vue";
import iconFileUpload from "@/icon/file-upload.svg";
import iconImg from "@/icon/fileType/img.svg";
import iconFont from "@/icon/fileType/font.svg";
import iconGlb from "@/icon/fileType/glb.svg";
import tags from "@/components/design/components/tags.vue";
import tagsInput from "@/components/design/components/tagsInput.vue";
import {htmlToPngFile} from '@/common/transform'
import desimage from '@/components/design/components/image.vue';

import {createFontThumbnail} from '@/components/design/utils/utils'
import { toPng } from "html-to-image";


/*
  scan 
  local
*/
const uploadTabType = ref("local");

function fileListChange(file) {
  file.url = URL.createObjectURL(file.raw);
}

/* 获取文件后缀 */
function getFileSuffix(filename) {
  return filename.split(".").pop();
}

const fileTypeIcons = {
  jpg: iconImg,
  png: iconImg,
  svg: iconImg,
  ttf: iconFont,
  glb: iconGlb,
};

function isImg(name) {
  return ["png", "svg", "jpeg", "jpg"].includes(name.split(".").pop());
}

function isFont(name) {
  return ["otf", "ttf", "woff"].includes(name.split(".").pop());
}

function close() {
  loading.value = false;
}

/*
 如果上传的是字体的话，直接生成缩略图
*/
var id = 999;
function initFontFamily(file, e) {
  if (!isFont(file.name)) {
    return;
  }

  const el = e.el;
  const fontId = `font_${id++}`;
  const style = document.createElement("style");

  style.innerHTML = `
                @font-face {
                    font-family: ${fontId};
                    src: url(${URL.createObjectURL(file.raw)});
                }
              `;

  document.head.appendChild(style);

  el.style.fontFamily = fontId;
  // 在文件列表中保存当前元素，用于获取缩略图
  file.el = el;
}

// 文件列表
const fileList = ref([]);

function removeFile(file) {
  fileList.value.splice(fileList.value.indexOf(file), 1);
}

function getPreviewUrl(file) {
  return URL.createObjectURL(file);
}

const loading = ref(false);

async function uploadSingleFile(file) {

  file = toRaw(file)

  const keywords = file.tags && file.tags.join(",");
  if (isImg(file.name)) {
    const { url } = await uploadToCOS({ file: file.raw });
    const params = {
      name: file.raw.name,
      size: file.size,
      url,
      keywords,
      type: "image", // 默认为图片贴纸,
      thumbnail: url,
    };
    await createStickerApi(params);
  }

  if (isFont(file.name)) {
    /* 需要生成缩略图 */

    const png = await createFontThumbnail({
      file:file.raw,
    })


    const {url:thumbnailUrl} = await uploadToCOS({
      file:png
    })

    const {url:fileUrl} = await uploadToCOS({key:new Date().getTime(),file:file.raw})

    const params = {
      url:fileUrl,
      name: file.raw.name,
      size: file.size,
      thumbnail:thumbnailUrl
    };

    await uploadFile(params);
  }
}

async function doUpload() {
  if (!fileList.value.length) {
    return;
  }

  /*
   上传时区分 图片和字体等其他文件
   图片直接上传到 贴纸
   其他上传到文件
 */

  loading.value = true;

  try {
    await Promise.all(fileList.value.map(uploadSingleFile));
    message.success("上传成功!");
    // showUpload.value = false;
    loading.value = false;
    fileList.value = [];
  } catch (e) {
    message.error("上传失败!");
    loading.value = false;
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 1em;
  width: 600px;
}

.button {
  background: transparent;
  border-radius: 8px;
  border: 2px solid rgba(0, 0, 2505, 0.9);
  color: rgba(0, 0, 0, 0.9);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  padding: 1em;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
  opacity: 0.8;
  font-weight: bold;
}

.button:hover {
  opacity: 1;
  transform: scale(1.05);
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  row-gap: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

:deep .el-upload-dragger {
  background: #fff !important;
}

.tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  font-size: 1em;
  font-weight: bold;
  width: 100%;
  color: #ccc;
}

.file-bar {
  border-radius: 4px;
  padding: 1em 1em;
  border: 1px solid #eee;
  width: 100%;
  box-sizing: border-box;
}

.file-bar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 1em;
  display: flex;
  font-size: 12px;
}

.file-bar-tags {
  margin-top: 1em;
  display: flex;
  gap: 0.5em;
}

footer {
  display: flex;
  align-items: center;
  padding: 1em;
}

:deep(.el-upload-list) {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    display: none;
  }

}
</style>
