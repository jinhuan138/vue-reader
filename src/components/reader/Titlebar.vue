<template>
  <el-header height="40px" :class="{ backdrop: props.backdrop }">
    <span id="left">
      <slot></slot>
    </span>
    <span id="center" :title="props.title">{{ trunc(props.title, 15) }}</span>

    <span id="right">
      <el-button size="small" :icon="Minus" circle @click="minimizeWindow" />
      <el-button
        size="small"
        :icon="FullScreen"
        circle
        @click="maximizeWindow"
      />
      <el-button size="small" :icon="Close" circle @click="closeWindow" />
    </span>
  </el-header>
</template>

<script setup>
import { Minus, FullScreen, Close } from '@element-plus/icons-vue'

const props = defineProps({
  backdrop: {
    default: false,
    type: Boolean,
  },
  title: {
    default: 'vue-reader',
    type: String,
  },
})

const trunc = (str, n) => {
  return str.length > n ? `${str.substr(0, n - 3)}...` : str
}

const closeWindow = () => {
  import('vitepress').then(({ useRouter }) => {
    const router = useRouter()
    router.go('/vue-reader/')
  })
}
const minimizeWindow = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
  if (typeof cfs != 'undefined' && cfs) {
    cfs.call(el)
  }
}
const maximizeWindow = () => {
  const el = document.documentElement
  const rfs =
    el.requestFullScreen ||
    el.webkitRequestFullScreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen
  if (typeof rfs != 'undefined' && rfs) {
    rfs.call(el)
  }
}
</script>

<style lang="scss" scoped>
$border-radius: 4px;
$margin: 4px;
$padding: 4px;

.el-header {
  text-align: center;
  vertical-align: middle;
  padding: $padding;
  -webkit-app-region: drag !important;
  -webkit-user-select: none;
}

.backdrop {
  backdrop-filter: blur(40px);
}

.el-button {
  margin-left: $margin;
}

#left {
  float: left;
  -webkit-app-region: no-drag !important;
  vertical-align: sub;
}

#left .el-button:first-of-type {
  margin-left: 0px;
}

#center {
  left: 50%;
  right: 50%;
  vertical-align: sub;
  font-size: 16px;
  line-height: 2;
  font-weight: 600;
}

#right {
  float: right;
  -webkit-app-region: no-drag !important;
  vertical-align: sub;
}
</style>
