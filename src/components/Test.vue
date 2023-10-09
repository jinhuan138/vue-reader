<template>
  <div style="height: 100vh">
    <vue-reader
      ref="viewer"
      :epubOptions="{
        allowScriptedContent: true,
      }"
      url="/files/alice.epub"
      :getRendition="getRendition"
    >
    </vue-reader>
  </div>
</template>
<script setup>
import { VueReader } from "@/modules/index";
import { onMounted } from "vue";
const getRendition = (rendition) => {
  rendition.themes.default({});
  rendition.hooks.content.register((contents, view) => {});
};
onMounted(() => {});
</script>
