<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader url="/files/alice.epub">
        <template #title="props">
          <div class="title">
            {{ props.title }}
          </div>
        </template>
      </VueReader>
    </div>
  </div>
  <!-- <Library /> -->
  <!-- <div class="demo" v-drag="dragHandler" :dragOptions="dragOptions">

   </div> -->
</template>
<script setup>
// import { VueReader } from "../lib/index.min.js";
import VueReader from "./modules/VueReader/VueReader.vue";
import Library from '@/components/Library.vue'
import { dragDirective } from '@vueuse/gesture'
//滑动翻页
const vDrag = dragDirective({
  throttle: 1000,
  enabled: false
})
const dragOptions = {

}
const dragHandler = ({ movement: [x, y] }) => {
  if (x > 0) {
    console.log('right swipe')
  } else {
    console.log('left swipe')
  }
}

</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f2f2f2 0%, #333 100%);
  overflow: hidden;
}

.vueContainer {
  font-size: 16px;
  position: absolute;
  top: 0px;
  left: 0rem;
  right: 0rem;
  bottom: 0rem;
}

.demo {
  width: 100px;
  height: 100px;
  background-color: skyblue;
}

.title {
  text-align: center;
  color: skyblue;
}
</style>
