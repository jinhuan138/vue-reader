<script lang="ts">
import { VueReader } from '../../src/modules/index'
export default {
 components:{VueReader}
}
// import { isVue2, isVue3, ref, version,onMounted } from 'vue-demi'
// import { VueReader } from '../../src/modules/index'
// const locationChange = (epubcifi) => {
//     console.log(epubcifi)
// }
// onMounted(()=>{

// })
</script>

<template>
  <div style='height: 100vh'>
    <VueReader url='/files/啼笑因缘.epub' @update:location='locationChange' :epubOptions='{
      flow: "scrolled",
      manager: "continuous"
    }'> </VueReader>
  </div>
</template>
