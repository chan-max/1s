<template>
    <div class="drag-to-move">
        <div class="swipe">
            <div class="touch-point"></div>
            <icon-finger-move class="icon"></icon-finger-move>
            <div class="text">点击并拖拽到模型上</div>
        </div>
    </div>
</template>
<script setup>
import iconFingerMove from "@/icon/mobile/fingerMove.svg?component";
</script>
<style lang="less" scoped>
.drag-to-move {
    position: absolute;
    z-index: 999;
}

.swipe {
    animation: swipe-animation 3s ease infinite;
    position: relative;
    width: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;;
    row-gap: 4px;
}


.icon {
    width: 30px;
    height: 30px;
    color: #fff;
    filter: drop-shadow(0px 1px 5px rgba(0, 0, 0, 0.4));
}
.touch-point {
    width: 10px;
    height: 10px;
    border-radius: 999999999px;
    transform: translate(-3px, 10px);
    background-color: rgba(105, 0, 255,.7);
    box-shadow: rgba(105, 0, 255,.5) 0px 0px 0px 3px, 
    rgba(105, 0, 255,.3) 0px 0px 0px 6px, 
    rgba(105, 0, 255,.1) 0px 0px 0px 9px, 
}

.text {
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    text-shadow: 0px 1px 5px rgba(0, 0, 0, 0.7);
    text-align: center;
}

@keyframes swipe-animation {
    0% {
        transform: translateX(0) translateY(0) rotate(0deg);
    }

    50% {
        transform: translateX(100px) translateY(10px) rotate(20deg);
    }

    100% {
        transform: translateX(0) translateY(0) rotate(0deg);
    }
}
</style>
  