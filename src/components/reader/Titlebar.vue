<template>
	<el-header height="40px" :class="{backdrop:backdrop}">
		<span id="left">
			<slot></slot>
		</span>
		<span id="center">{{ title }}</span>

		<span id="right">
			<el-button size="small" icon="minus" circle @click="minimizeWindow" />
			<el-button size="small" icon="full-screen" circle @click="maximizeWindow" />
			<el-button size="small" icon="close" circle @click="closeWindow" />
		</span>
	</el-header>
</template>

<script>
export default {
  name: 'Titlebar',
  props: {
    backdrop: {
      default: false,
      type: Boolean,
    },
    title: {
      default: 'vue-reader',
      type: String,
    },
  },
  methods: {
    closeWindow() {
      // this.$remote.getCurrentWindow().close();
    },
    minimizeWindow() {
      // this.$remote.getCurrentWindow().minimize();
    },
    maximizeWindow() {
      this.$el.requestFullscreen()
      // const win = this.$remote.getCurrentWindow();
      // if (win.isMaximized()) {
      //   win.unmaximize();
      // } else {
      //   win.maximize();
      // }
    },
  },
};
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
