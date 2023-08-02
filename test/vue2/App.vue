<template>
  <div style='height: 100vh'>
    <VueReader :url="url" :location='location' :title='title' @update:location='locationChange'>

    </VueReader>
    <input type="file" :multiple="false" accept=".epub" @change="onchange" class="input">
  </div>
</template>

<script>
import { VueReader } from '../../src/modules/index'
export default {
  components: { VueReader },
  data() {
    return {
      location: null,
      url: '/files/alice.epub',
      firstRenderDone: false,
      title:""
    }
  },
  methods: {
    locationChange(epubcifi) {
      if (!this.firstRenderDone) {
        this.location = localStorage.getItem('book-progress')
        return this.firstRenderDone = true

      }
      localStorage.setItem('book-progress', epubcifi)
      this.location = epubcifi
    },
    onchange(e) {
      const file = e.target.files[0];
      const { name } = file
      this.title = name.replace('.epub', '')
      if (window.FileReader) {
        var reader = new FileReader();
        reader.onloadend = e => this.url = reader.result
        reader.readAsArrayBuffer(file);
      }
    }
  }
}
</script>
