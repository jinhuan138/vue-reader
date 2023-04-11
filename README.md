# Vue Reader - an easy way to embed a ePub into your webapp
An vue-reader for vue powered by EpubJS

## document
[document](sadasdad)|[demo](https://jinhuan138.github.io/reader/)

## Basic usage

```bash
npm install vue-reader --save
```

And in your vue-component...

```vue
<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader url="/files/啼笑因缘.epub"></VueReader>
    </div>
  </div>
</template>
<script setup>
import { VueReader } from "vue-reader";
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
</style>
```

### VueReader Attributes

| **Name** | **Description**         | **Type**               | **Default** |
| -------- | ----------------------- | ---------------------- | ----------- |
| url      | book url or arrayBuffer | `string`|`ArrayBuffer` | —           |
| title    | the title of the book   | `string`               | —           |
| showToc  | whether to show the toc | `boolean`              | true        |

### VueReader Slots

| **Name** | **Description**                                              |
| -------- | ------------------------------------------------------------ |
| title    | You have access to title by [slot](https://v3.vuejs.org/guide/component-slots.html) |

### VueReader props passed to inner EpubView

### EpubView Attributes

| **Name**           | **Description**                                              | **Type**                      | **Default** |
| ------------------ | ------------------------------------------------------------ | ----------------------------- | ----------- |
| url                | the path or arrayBuffer of the book                          | `string`                      | —           |
| location           | set / update location of the epub                            | `string`/`number`             | —           |
| tocChanged         | when the reader has parsed the book you will receive an array of the chapters | `function(toc)`               | —           |
| handleKeyPress     | when press the key                                           | `function()`                  |             |
| handleTextSelected | when select text                                             | `function(cfiRange,contents)` |             |
| epubInitOptions    | pass custom properties to the epub init function, see [epub.js](http://epubjs.org/documentation/0.3/#epub) | `object`                      | —           |
| epubOptions        | pass custom properties to the epub rendition, see [epub.js's book.renderTo function](http://epubjs.org/documentation/0.3/#rendition) | `object`                      | —           |
| getRendition       | when epubjs has rendered the epub-file you can get access to the epubjs-rendition object here | `function(rendition)`         | —           |

### EpubView Events

| **Name**        | **Description**                                              | **Parameters**       |
| --------------- | ------------------------------------------------------------ | -------------------- |
| update:location | a function that receives the current location while user is reading. This function is called everytime the page changes, and also when it first renders. | the updated location |

### EpubView  Slots

| **Name**    | **Description**       |
| ----------- | --------------------- |
| loadingView | epub view loadingView |

### EpubView Exposes

| **Name**    | **Description**        | **Type**         |
| ----------- | ---------------------- | ---------------- |
| nextPage    | display  next page     | `function`       |
| prevPage    | display  previous page | `function`       |
| setLocation | Set the page           | `function(href)` |

### Recipes and tips

### Save and retrieve progress from storage

·Saving the current page on storage is pretty simple, but we need to keep in mind that `locationChanged` also gets called on the very first render of our app.

```vue
<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader :location="location" url="/files/alice.epub" @update:location="locationChange" >
      </VueReader>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const location = ref(null)
const firstRenderDone = ref(false)
const locationChange = (epubcifi) => {
  // Since this function is also called on initial rendering, we are using custom state
  // logic to check if this is the initial render.
  // If you block this function from running (i.e not letting it change the page on the first render) your app crashes.

  if (!firstRenderDone.value) {
    location.value = localStorage.getItem('book-progress')
    return firstRenderDone.value = true

  }
  // This is the code that runs everytime the page changes, after the initial render.
  // Saving the current epubcifi on storage...
  localStorage.setItem('book-progress', epubcifi)
  // And then rendering it.
  location.value = epubcifi// Or setLocation(localStorage.getItem("book-progress"))
}
</script>
```

### Display page number for current chapter

We store the epubjs rendition in a ref, and get the page numbers in the callback when location is changed. Note that in this example we also find them name of the current chapter from the toc. Also see limitation for pagination for the whole book.

```vue
<template>
<div class="container">
    <div class="vueContainer">
        <VueReader 
                   :url="url" 
                   :getRendition="val => rendition = val" 
                   :tocChanged="val => toc = val"		                                        @update:location="locationChange">
    	</VueReader>
        <div class="page">
            {{ page }}
    	</div>
    </div>
</div>
</template>
<script setup>
import { ref } from "vue";

const url = ref("/files/啼笑因缘.epub")
const rendition = ref(null)
const toc = ref(null)
const page = ref('')

const locationChange = (epubcifi) => {
  const getLabel = (toc, href) => {
    const chapter = toc.find(item => {
      if (item.subitems.length) {
        return getLabel(item.subitems, href)
      } else {
        return item.href.includes(href)
      }
    })
    return chapter.label || 'n/a'
  }
  if (rendition.value && toc.value) {
    const { displayed, href } = rendition.value.location.start
    const label = getLabel(toc.value, href)
    page.value = `${displayed.page}/${displayed.total} ${label}`
  }
}
</script>
<style scoped>
.page {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  text-align: center;
  z-index: 1;
  color: #000;
}
</style>
```

### Change font-size

Hooking into epubJS rendition object is the key for this also.

```vue
<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader url="/files/啼笑因缘.epub" :getRendition="getRendition">
      </VueReader>
      <div class="size">
        <button @click='changeSize(Math.max(80, size - 10))'>-</button>
        <span>Current size: {{ size }}%</span>
        <button @click='changeSize(Math.min(130, size + 10))'>+</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
    
const rendition = ref(null)    
const size = ref(100)
const changeSize = (val) => {
  size.value = val
  rendition.value.themes.fontSize(`${val}%`)
}
const getRendition = (val) => {
  rendition.value = val
  rendition.value.themes.fontSize(`${size}%`)
}
</script>
<style scoped>
.size {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  text-align: center;
  z-index: 1;
  color: #000;
}
</style>
```

### Add / adjust custom css for the epub-html

EpubJS render the epub-file inside a iframe so you will need to create a custom theme and apply it.  
This is useful for when you want to set custom font families, custom background and text colors, and everything CSS related.

```vue
<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader url="/files/啼笑因缘.epub" :getRendition="getRendition">
      </VueReader>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const rendition = ref(null)       
const getRendition = (val) => {
  rendition.value = val
  rendition.value.themes.register('custom', {
    "*": {
      color: '#fff',
      'background-color': "#252525",
    },

    img: {
      border: '1px solid red'
    },
    p: {
      'font-family': 'Helvetica, sans-serif',
      'font-weight': '400',
      'font-size': '20px',
      border: '1px solid green'
    }
  })
  rendition.value.themes.select('custom')
}
</script>
```

### Hightlight selection in epub

This shows how to hook into epubJS annotations object and let the user highlight selection and store this in a list where user can go to a selection or delete it.

```vue
<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader url="/files/啼笑因缘.epub" :getRendition="getRendition">
      </VueReader>
      <div class="selection">
        Selection:
        <ul>
          <li v-for="({ text, cfiRange }, index) in selections" :key="index">
            {{ text || '' }}
            <button @click="rendition.display(cfiRange)">
              show
            </button>
            <button @click="remove(cfiRange, index)">
              x
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onUnmounted } from "vue";    
    
const rendition = ref(null)
const selections = ref([])

const setRenderSelection = (cfiRange, contents) => {
  selections.value.push({
    text: rendition.value.getRange(cfiRange).toString(),
    cfiRange
  })
  rendition.value.annotations.add(
    'highlight',
    cfiRange,
    {},
    null,
    'hl',
    { fill: 'red', 'fill-opacity': '0.5', 'mix-blend-mode': 'multiply' }
  )
  contents.window.getSelection().removeAllRanges()
}

const getRendition = (val) => {
  rendition.value = val
  rendition.value.themes.default({
    '::selection': {
      background: 'orange'
    }
  })
  if (rendition.value) {
    rendition.value.on('selected', setRenderSelection)
  }
}

const remove = (cfiRange, index) => {
  rendition.value.annotations.remove(cfiRange, 'highlight')
  selections.value = selections.value.filter((item, j) => j !== index)
}

onUnmounted(() => {
  rendition.value.off('selected', setRenderSelection)
})
</script>

<style scoped>
.selection {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 1;
  background-color: white;
  color: #000;
}
</style>
```

### Handling missing mime-types on server

EpubJS will try to parse the epub-file you pass to it, but if the server send wrong mine-types or the file does not contain `.epub` you can use the epubInitOptions prop to force reading it right.

```vue
<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader url="/my-epub-service" :epubInitOptions="{
        openAs: 'epub'
      }">
      </VueReader>
    </div>
  </div>
</template>
```

### Display a scrolled epub-view

Pass options for this into epubJS in the prop `epubOptions`

```vue
<template>
  <div class="container">
    <div class="vueContainer">
      <VueReader 
         url="/files/啼笑因缘.epub"
         :epubOptions="{
            flow: 'scrolled',
            manager: 'continuous'
          }">
      </VueReader>
    </div>
  </div>
</template>
```

