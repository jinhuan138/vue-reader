# Vue Reader - an easy way to embed a ePub into your webapp

An vue-reader for vue powered by EpubJS

## Document

[document](https://jinhuan138.github.io/vue-reader/)

## Basic usage

```bash
npm install vue-reader --save
```

And in your vue-component...

<details>
<summary>Vue 3</summary>

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/files/啼笑因缘.epub" />
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
</script>
```

</details>

<details>
<summary>Vue 2</summary>

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/files/啼笑因缘.epub"> </vue-reader>
  </div>
</template>
<script>
import { VueReader } from 'vue-reader'
export default {
  components: { VueReader },
}
</script>
```

</details>

## VueReader Attributes

| **Name** | **Description**         | **Type**               | **Default** |
| -------- | ----------------------- | ---------------------- | ----------- |
| url      | book url or arrayBuffer | `string`/`ArrayBuffer` | —           |
| title    | the title of the book   | `string`               | —           |
| showToc  | whether to show the toc | `boolean`              | true        |

## VueReader Slots

| **Name** | **Description**                                                                     |
| -------- | ----------------------------------------------------------------------------------- |
| title    | You have access to title by [slot](https://v3.vuejs.org/guide/component-slots.html) |

## VueReader props passed to inner EpubView

## EpubView Attributes

| **Name**        | **Description**                                                                                                                      | **Type**               | **Default** |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ----------- |
| url             | the path or arrayBuffer of the book                                                                                                  | `string`/`ArrayBuffer` | —           |
| location        | set / update location of the epub                                                                                                    | `string`/`number`      | —           |
| tocChanged      | when the reader has parsed the book you will receive an array of the chapters                                                        | `function(toc)`        | —           |
| epubInitOptions | pass custom properties to the epub init function, see [epub.js](http://epubjs.org/documentation/0.3/#epub)                           | `object`               | —           |
| epubOptions     | pass custom properties to the epub rendition, see [epub.js's book.renderTo function](http://epubjs.org/documentation/0.3/#rendition) | `object`               | —           |
| getRendition    | when epubjs has rendered the epub-file you can get access to the epubjs-rendition object here                                        | `function(rendition)`  | —           |

## EpubView Events

| **Name**        | **Description**                                                                                                                                          | **type**                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| update:location | a function that receives the current location while user is reading. This function is called everytime the page changes, and also when it first renders. | `function(location)`          |
| select          | when select text                                                                                                                                         | `function(cfirange,contents)` |
| keyPress        | when press the key                                                                                                                                       | `function(keyboardEvent)`     |

## EpubView Slots

| **Name**    | **Description**       |
| ----------- | --------------------- |
| loadingView | epub view loadingView |

## EpubView Exposes

| **Name**    | **Description**       | **Type**         |
| ----------- | --------------------- | ---------------- |
| nextPage    | display next page     | `function`       |
| prevPage    | display previous page | `function`       |
| setLocation | Set the page          | `function(href)` |

## Recipes and tips

## Save and retrieve progress from storage

Saving the current page on storage is pretty simple, but we need to keep in mind that `locationChanged` also gets called on the very first render of our app.

```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url="/files/啼笑因缘.epub"
      :location="location"
      @update:location="locationChange"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'

const location = ref(null)
const firstRenderDone = ref(false)
const locationChange = (epubcifi) => {
  // Since this function is also called on initial rendering, we are using custom state
  // logic to check if this is the initial render.
  // If you block this function from running (i.e not letting it change the page on the first render) your app crashes.

  if (!firstRenderDone.value) {
    location.value = localStorage.getItem('book-progress')
    return (firstRenderDone.value = true)
  }
  // This is the code that runs everytime the page changes, after the initial render.
  // Saving the current epubcifi on storage...
  localStorage.setItem('book-progress', epubcifi)
  // And then rendering it.
  location.value = epubcifi // Or setLocation(localStorage.getItem("book-progress"))
}
</script>
```

<details>
<summary>Vue 2</summary>

```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url="/files/啼笑因缘.epub"
      :location="location"
      @update:location="locationChange"
    >
    </vue-reader>
  </div>
</template>
<script>
import { VueReader } from 'vue-reader'
export default {
  components: { VueReader },
  data() {
    return {
      location: null,
      firstRenderDone: false,
    }
  },
  methods: {
    locationChange(epubcifi) {
      if (!this.firstRenderDone) {
        this.location = localStorage.getItem('book-progress')
        return (this.firstRenderDone = true)
      }
      localStorage.setItem('book-progress', epubcifi)
      this.location = epubcifi
    },
  },
}
</script>
```

</details>

## Display page number for current chapter

We store the epubjs rendition in a ref, and get the page numbers in the callback when location is changed. Note that in this example we also find them name of the current chapter from the toc. Also see limitation for pagination for the whole book.

```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url="/files/啼笑因缘.epub"
      :getRendition="getRendition"
      :tocChanged="tocChanged"
      @update:location="locationChange"
    >
    </vue-reader>
  </div>
  <div class="page">
    {{ page }}
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { VueReader } from 'vue-reader'

let rendition = null,
  toc = []
const page = ref('')

const getRendition = (val) => (rendition = val)
const tocChanged = (val) => (toc = val)

const getLabel = (toc, href) => {
  let label = 'n/a'
  toc.some((item) => {
    if (item.subitems.length > 0) {
      const subChapter = getLabel(item.subitems, href)
      if (subChapter !== 'n/a') {
        label = subChapter
        return true
      }
    } else if (item.href.includes(href)) {
      label = item.label
      return true
    }
  })
  return label
}
const locationChange = (epubcifi) => {
  if (epubcifi) {
    const { displayed, href } = rendition.location.start
    if (href !== 'titlepage.xhtml') {
      const label = getLabel(toc, href)
      page.value = `${displayed.page}/${displayed.total} ${label}`
    }
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

## Change font-size

Hooking into epubJS rendition object is the key for this also.

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/files/啼笑因缘.epub" :getRendition="getRendition">
    </vue-reader>
  </div>
  <div class="size">
    <button @click="changeSize(Math.max(80, size - 10))">-</button>
    <span>Current size: {{ size }}%</span>
    <button @click="changeSize(Math.min(130, size + 10))">+</button>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ref } from 'vue'

let rendition = null
const size = ref(100)
const changeSize = (val) => {
  size.value = val
  rendition.themes.fontSize(`${val}%`)
}
const getRendition = (val) => {
  rendition = val
  rendition.themes.fontSize(`${size.value}%`)
}
</script>
<style scoped>
.size {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 1;
  text-align: center;
  color: #000;
}
</style>
```

## Add / adjust custom css for the epub-html

EpubJS render the epub-file inside a iframe so you will need to create a custom theme and apply it.  
This is useful for when you want to set custom font families, custom background and text colors, and everything CSS related.

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/files/啼笑因缘.epub" :getRendition="getRendition">
    </vue-reader>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'

const getRendition = (rendition) => {
  rendition.themes.register('custom', {
    '*': {
      color: '#fff',
      'background-color': '#252525',
    },
    image: {
      border: '1px solid red',
    },
    p: {
      'font-family': 'Helvetica, sans-serif',
      'font-weight': '400',
      'font-size': '20px',
      border: '1px solid green',
    },
  })
  rendition.themes.select('custom')
}
</script>
```

## Hightlight selection in epub

This shows how to hook into epubJS annotations object and let the user highlight selection and store this in a list where user can go to a selection or delete it.

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/files/啼笑因缘.epub" :getRendition="getRendition">
    </vue-reader>
  </div>
  <div class="selection">
    Selection:
    <ul>
      <li v-for="({ text, cfiRange }, index) in selections" :key="index">
        {{ text || '' }}
        <button @click="rendition.display(cfiRange)">show</button>
        <button @click="remove(cfiRange, index)">x</button>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
import { ref, onUnmounted } from 'vue'

let rendition = null
const selections = ref([])

const setRenderSelection = (cfiRange, contents) => {
  selections.value.push({
    text: rendition.getRange(cfiRange).toString(),
    cfiRange,
  })
  rendition.annotations.add('highlight', cfiRange, {}, null, 'hl', {
    fill: 'red',
    'fill-opacity': '0.5',
    'mix-blend-mode': 'multiply',
  })
  contents.window.getSelection().removeAllRanges()
}

const getRendition = (val) => {
  rendition = val
  rendition.themes.default({
    '::selection': {
      background: 'orange',
    },
  })
  rendition.on('selected', setRenderSelection)
}

const remove = (cfiRange, index) => {
  rendition.annotations.remove(cfiRange, 'highlight')
  selections.value = selections.value.filter((item, j) => j !== index)
}

onUnmounted(() => {
  rendition.off('selected', setRenderSelection)
})
</script>
<style scoped>
.selection {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 1;
  background-color: white;
  color: #000;
}
</style>
```

## Handling missing mime-types on server

EpubJS will try to parse the epub-file you pass to it, but if the server send wrong mine-types or the file does not contain `.epub` you can use the epubInitOptions prop to force reading it right.

```vue
<template>
  <div style="height: 100vh">
    <vue-reader url="/my-epub-service" :epubInitOptions="{ openAs: 'epub' }">
    </vue-reader>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
</script>
```

## Display a scrolled epub-view

Pass options for this into epubJS in the prop `epubOptions`

```vue
<template>
  <div style="height: 100vh">
    <vue-reader
      url="/files/啼笑因缘.epub"
      :epubOptions="{
        flow: 'scrolled',
        manager: 'continuous',
      }"
    >
    </vue-reader>
  </div>
</template>
<script setup>
import { VueReader } from 'vue-reader'
</script>
```

## Enable opening links / running scripts inside epubjs iframe

Epubjs is rendering the epub-content inside and iframe which defaults to `sandbox="allow-same-origin"`, to enable opening links or running javascript in an epub, you will need to pass some extra params in the `epubOptions` prop.

```vue
<vue-reader
  url="/files/啼笑因缘.epub"
  :epubOptions="{
    allowPopups: true, // Adds `allow-popups` to sandbox-attribute
    allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
  }"
/>
```

## Related

- [react-reader](https://github.com/gerhardsletten/react-reader)
