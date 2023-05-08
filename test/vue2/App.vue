<template>
  <div style='height: 100vh'>
    <VueReader url="/files/啼笑因缘.epub" :location='location' @update:location='locationChange'> </VueReader>
  </div>
</template>

<script>
import { VueReader } from 'vue-reader'
export default {
  components: { VueReader },
  data() {
    return {
      location: null,
      firstRenderDone: false
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
    }
  }
}
</script>
