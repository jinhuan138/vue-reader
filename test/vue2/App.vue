<script lang="ts">
import { VueReader } from '../../src/modules/index'
export default {
  components: { VueReader },
  methods: {
     change(val){
          console.log('change',val)
     }
  },
  mounted() {
    const readerRef =this.$refs['VueReader']
    console.log(readerRef)
    // this.$on('pdate:location',(epubcifi)=>{
    //   console.log(epubcifi)
    // })
  }

}
</script>

<template>
  <div style='height: 100vh'>
    <VueReader ref="VueReader" url='/files/啼笑因缘.epub' @update:location="change" :epubOptions='{
      flow: "scrolled",
      manager: "continuous"
    }'> </VueReader>
  </div>
</template>
