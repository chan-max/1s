<template>
  <div class="banner flex flex-col items-center">
    <div class="title">开放式设计 & 交易平台</div>
    <div class="desc">开放式设计 & 交易平台</div>
    <div class="bar">
      <el-button
        size="large"
        type="primary"
        round
        @click="$router.push({ name: 'Design' })"
      >
        在线工具
      </el-button>
      <el-button size="large" plain round  @click="$router.push({ name: 'Market' })"> 逛一逛 </el-button>
    </div>
    <img src="/wave.svg" style="width: 100%;position:absolute;opacity:.3;bottom:-300px">
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
</script>

<style scoped lang="less">
.banner {
  width: 100vw;
  height: 100vh;
  background-color: #161616;
  padding-top: 200px;
  position: relative;
  overflow: hidden;
}

.title {
  font-size: 5em;
  color: #f5f5f7;
  font-weight: bold;
}

.desc {
  font-size: 2em;
  color: #f5f5f7;
  font-weight: 300;
}

.bar {
  padding: 20px;
}
</style>
