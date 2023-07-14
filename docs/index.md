# Vue Reader - an easy way to embed a ePub into your webapp

An vue-reader for vue powered by EpubJS

## Basic usage

```bash
npm install vue-reader --save
```

And in your vue-component...
::: details Vue 3
:::demo basic usage

```vue
<template>
   <div style='height: 100vh'>
      <VueReader url='/docs/files/啼笑因缘.epub'/>
   </div>
</template>
```
:::

::: details Vue 2
```vue
<template>
  <div style='height: 100vh'>
    <VueReader url='/docs/files/啼笑因缘.epub'/>
  </div>
</template>
<script>
import { VueReader } from 'vue-reader'

export default {
  components: { VueReader }
}
</script>
```
:::


## VueReader Attributes

| **Name** | **Description**         | **Type**               | **Default** |
| -------- | ----------------------- | ---------------------- | ----------- |
| url      | book url or arrayBuffer | `string`/`ArrayBuffer` |— |
| title    | the title of the book   | `string`               | —           |
| showToc  | whether to show the toc | `boolean`              | true        |

## VueReader Slots

| **Name** | **Description**                                              |
| -------- | ------------------------------------------------------------ |
| title    | You have access to title by [slot](https://v3.vuejs.org/guide/component-slots.html) |

## VueReader props passed to inner EpubView

## EpubView Attributes

| **Name**           | **Description**                                              | **Type**                      | **Default** |
| ------------------ | ------------------------------------------------------------ | ----------------------------- | ----------- |
| url                | the path or arrayBuffer of the book                          | `string`/`ArrayBuffer` |—        |
| location           | set / update location of the epub                            | `string`/`number`             | —           |
| tocChanged         | when the reader has parsed the book you will receive an array of the chapters | `function(toc)`               | —           |
| handleKeyPress     | when press the key                                           | `function(event)`             |             |
| handleTextSelected | when select text                                             | `function(cfiRange,contents)` |             |
| epubInitOptions    | pass custom properties to the epub init function, see [epub.js](http://epubjs.org/documentation/0.3/#epub) | `object`                      | —           |
| epubOptions        | pass custom properties to the epub rendition, see [epub.js's book.renderTo function](http://epubjs.org/documentation/0.3/#rendition) | `object`                      | —           |
| getRendition       | when epubjs has rendered the epub-file you can get access to the epubjs-rendition object here | `function(rendition)`         | —           |

## EpubView Events

| **Name**        | **Description**                                              | **Parameters**       |
| --------------- | ------------------------------------------------------------ | -------------------- |
| update:location | a function that receives the current location while user is reading. This function is called everytime the page changes, and also when it first renders. | the updated location |

## EpubView  Slots

| **Name**    | **Description**       |
| ----------- | --------------------- |
| loadingView | epub view loadingView |

## EpubView Exposes

| **Name**    | **Description**        | **Type**         |
| ----------- | ---------------------- | ---------------- |
| nextPage    | display  next page     | `function`       |
| prevPage    | display  previous page | `function`       |
| setLocation | Set the page           | `function(href)` |

## Recipes and tips

## Save and retrieve progress from storage

Saving the current page on storage is pretty simple, but we need to keep in mind that `locationChanged` also gets called on the very first render of our app.

:::demo save progress 

```vue
<template>
    <div style='height: 100vh'>
        <VueReader :location='location' url='/docs/files/啼笑因缘.epub' @update:location='locationChange'/>
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

:::

<details>
<summary>Vue 2</summary>

```vue
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

```
</details>

## Display page number for current chapter

We store the epubjs rendition in a ref, and get the page numbers in the callback when location is changed. Note that in this example we also find them name of the current chapter from the toc. Also see limitation for pagination for the whole book.

:::demo display page number

```vue
<template>
    <div style='height: 100vh'>
        <VueReader 
            url='/docs/files/啼笑因缘.epub' 
            :getRendition='getRendition' 
            :tocChanged='tocChanged'
            @update:location='locationChange'>
        </VueReader>
    </div>
    <div class='page'>
        {{ page }}
    </div>
</template>
<script setup>
import { ref } from 'vue'

let rendition = null, toc = []
const page = ref('')
const firstRenderDone = ref(false)

const getRendition = val => rendition = val
const tocChanged = val => toc = val

const getLabel = (toc, href) => {
    let label = 'n/a';
    toc.some(item => {
        if (item.subitems.length > 0) {
            const subChapter = getLabel(item.subitems, href);
            if (subChapter !== 'n/a') {
                label = subChapter
                return true
            }
        } else if (item.href.includes(href)) {
            label = item.label
            return true
        }
    })
    return label;
}
const locationChange = (epubcifi) => {
    if (epubcifi) {
        const { displayed, href } = rendition.location.start
        const { cfi } = rendition.location.end
        if (href !== 'titlepage.xhtml') {
            const label = getLabel(toc, href)
            page.value = `${displayed.page}/${displayed.total} ${label}`
        }
    }
}
</script>
<style scoped>
.page {
    text-align: center;
    z-index: 1;
    color: #000;
}
</style>
```

:::

## Change font-size

Hooking into epubJS rendition object is the key for this also.

:::demo change font-size

```vue
<template>
    <div style='position: relative'>
        <div style='height: 100vh'>
            <VueReader url='/docs/files/啼笑因缘.epub' :getRendition='getRendition'>
            </VueReader>
        </div>
        <div class='size'>
            <button @click='changeSize(Math.max(80, size - 10))' class='reader-button'>-</button>
            <span>Current size: {{ size }}%</span>
            <button @click='changeSize(Math.min(130, size + 10))' class='reader-button'>+</button>
        </div>
    </div>
</template>
<script setup>
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

:::

## Add / adjust custom css for the epub-html

EpubJS render the epub-file inside a iframe so you will need to create a custom theme and apply it.  
This is useful for when you want to set custom font families, custom background and text colors, and everything CSS related.

:::demo custom css

```vue
<template>
    <div style='height:100vh'>
        <VueReader 
            url='/docs/files/啼笑因缘.epub' 
            :getRendition='getRendition'>
        </VueReader>
    </div>
</template>
<script setup>

const getRendition = (rendition) => {
    rendition.themes.register('custom', {
        "*": {
            color: '#fff',
            'background-color': "#252525",
        },
        'image': {
            border: '1px solid red'
        },
        'p': {
            'font-family': 'Helvetica, sans-serif',
            'font-weight': '400',
            'font-size': '20px',
            border: '1px solid green'
        }
    })
    rendition.themes.select('custom')
}
</script>
```

:::

## Hightlight selection in epub

This shows how to hook into epubJS annotations object and let the user highlight selection and store this in a list where user can go to a selection or delete it.

:::demo hightlight 

```vue
<template>
    <div style='position: relative'>
        <div style='height: 100vh'>
            <VueReader url='/docs/files/啼笑因缘.epub' :getRendition='getRendition'>
            </VueReader>
        </div>
        <div class='selection'>
            Selection:
            <ul>
                <li v-for='({ text, cfiRange }, index) in selections' :key='index'>
                    {{ text || '' }}
                    <button @click='rendition.display(cfiRange)' class='reader-button'>show</button>
                    <button @click='remove(cfiRange, index)' class='reader-button'>x</button>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { ref, onUnmounted } from 'vue'

let rendition = null
const selections = ref([])

const setRenderSelection = (cfiRange, contents) => {
    selections.value.push({
        text: rendition.getRange(cfiRange).toString(),
        cfiRange
    })
    rendition.annotations.add(
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
    rendition = val
    rendition.themes.default({
        '::selection': {
            background: 'orange'
        }
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

:::

## Handling missing mime-types on server

EpubJS will try to parse the epub-file you pass to it, but if the server send wrong mine-types or the file does not contain `.epub` you can use the epubInitOptions prop to force reading it right.

```vue
<template>
    <div style='height: 100vh'>
        <VueReader 
            url='/my-epub-service' 
            :epubInitOptions="{ openAs: 'epub' }">
        </VueReader>
    </div>
</template>
```

## Display a scrolled epub-view

Pass options for this into epubJS in the prop `epubOptions`

:::demo scrolle

```vue
<template>
    <div style='height: 100vh'>
        <VueReader 
            url='/docs/files/啼笑因缘.epub' 
            :epubOptions='{
            flow: "scrolled",
            manager: "continuous"}'>
        </VueReader>
    </div>
</template>
```

:::

## Enable opening links / running scripts inside epubjs iframe

Epubjs is rendering the epub-content inside and iframe which defaults to `sandbox="allow-same-origin"`, to enable opening links or running javascript in an epub, you will need to pass some extra params in the `epubOptions` prop.

```vue
<VueReader
  url='/files/啼笑因缘.epub' 
  :epubOptions='{
    allowPopups: true, // Adds `allow-popups` to sandbox-attribute
    allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
  }'
/>
```

## Speak the text

:::demo speak the text

```vue
<template>
    <div style='position: relative'>
        <div style='height: 100vh'>
            <VueReader url='/docs/files/啼笑因缘.epub' :getRendition='getRendition' @update:location='locationChange' />
        </div>
        <div class='speak'>
            <button class='reader-button' @click='speak("click")'>
                {{ isReading ? 'cancel' : 'speak' }}
            </button>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'

let isAudioOn = false, text = '', rendition
let isReading = ref(false)

const getRendition = val => rendition = val
const locationChange = () => {
    const range = rendition.getRange(rendition.currentLocation().start.cfi);
    const endRange = rendition.getRange(rendition.currentLocation().end.cfi);
    range.setEnd(endRange.startContainer, endRange.startOffset);

    text = range.toString().replace(/\s\s/g, '')
        .replace(/\r/g, '')
        .replace(/\n/g, '')
        .replace(/\t/g, '')
        .replace(/\f/g, '')
}

const speak = (type) => {
    if (type === 'click') isReading.value = !isReading.value
    if (isReading.value) {
        voice(text)
    } else {
        isAudioOn = false
        window.speechSynthesis.cancel()
    }
}

const voice = (text, rate = 1) => {
    isAudioOn = true
    const msg = new SpeechSynthesisUtterance()
    msg.text = text;
    msg.voice = window.speechSynthesis.getVoices()[0];
    msg.rate = rate
    window.speechSynthesis.speak(msg);
    msg.onerror = (err) => {
        console.log(err);
    };
    msg.onend = async (event) => {
        if (!isReading.value && !isAudioOn) return
        rendition.next()
        speak()
    };
}
</script>
<style>
.speak {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    z-index: 1;
    text-align: center;
}
</style>
```

:::

## Zoom the image

::: demo use medium-zoom

```vue
<template>
    <div style='height: 100vh'>
        <VueReader 
            :epubOptions='{
            allowPopups: true,
            allowScriptedContent: true,
            script: "https://cdn.jsdelivr.net/npm/medium-zoom@1.0.8/dist/medium-zoom.min.js"}' 					        
            url='/docs/files/alice.epub' 
            :getRendition='getRendition'>
        </VueReader>
    </div>
</template>
<script setup>
import { onBeforeUnmount } from 'vue'

let zoom = null
const closeZoom = () => {
    if (zoom && zoom.getZoomedImage()) zoom.close()
}
const getRendition = (rendition) => {
    rendition.hooks.content.register((contents, view) => {
        const contentsDom = contents.document
        const images = [...contentsDom.querySelectorAll('img'), ...contentsDom.querySelectorAll('image')]
        zoom = mediumZoom(images, {
            background: 'rgba(247, 249, 250, 0.97)'
        })
        contentsDom.addEventListener('click',async (e) => {
            if (zoom.getImages().includes(e.target)) {
                if (zoom.getZoomedImage()) await zoom.close()
                e.target.style.zIndex = 5
                zoom.open({ target: e.target })
            } else {
                zoom.close()
            }
        })
        document.addEventListener('click', closeZoom)
    })
}
onBeforeUnmount(() => {
    document.removeEventListener('click', closeZoom)
})
</script>
```

:::

## Get book information

::: demo get book information

```vue
<template>
    <VueReader v-show='false' url='/docs/files/啼笑因缘.epub' :getRendition='getRendition'>
    </VueReader>
    <div v-if='information' style='color: #000'>
        <img :src='information.cover' :alt='information.title' style="width: 100px">
        <p>标题:{{ information.title }}</p>
        <p>作者:{{ information.creator }}</p>
        <p>出版社:{{ information.publisher }}</p>
        <p>语言:{{ information.language }}</p>
        <p>出版日期:{{ information.pubdate }}</p>
        <p>修改日期:{{ information.modified_date }}</p>
        <p>介绍:{{ information.description }}</p>
    </div>
</template>
<script setup>
import { ref } from 'vue'

const information = ref(null)
const getRendition = (rendition) => {
    const book = rendition.book
    book.ready.then(() => {
        book.loaded.metadata.then(async (metadata) => {
            const cover = await book.coverUrl()
            information.value = { ...metadata, cover }
        })
    })
}
</script>
```

:::

## Import file

::: demo input file

```vue
<template>
    <div style='position: relative' :style='{ height: url ? "100vh" : "50px" }'>
        <div style='height: 100vh' v-if="url">
            <VueReader :url='url'/>
        </div>
        <input type="file" :multiple="false" accept=".epub" @change="onchange" class="input">
    </div>
</template>
<script setup>
import { ref } from 'vue'

const url = ref(null)
const onchange = (e) => {
    const file = e.target.files[0];
    if (window.FileReader) {
        var reader = new FileReader();
        reader.onloadend = e => url.value = reader.result
        reader.readAsArrayBuffer(file);
    }
}
</script>
<style>
.input {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    z-index: 1;
}
</style>
```

:::

## Current progress

::: demo current progress

```vue
<template>
    <div style='position: relative'>
        <div style='height: 100vh'>
            <VueReader :getRendition="getRendition" url="/docs/files/啼笑因缘.epub">
            </VueReader>
        </div>
        <div class="progress">
            <input type="number" :value="current" :min="0" :max="100" @change="change">%
            <input type="range" :value="current" :min="0" :max="100" :step="1" @change="change">
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'

const current = ref(0)
let rendition, book, displayed

const getRendition = (val) => {
    rendition = val
    book = rendition.book
    displayed = rendition.display();
    book.ready.then(() => {
        return book.locations.generate(1600);
    }).then(locations => {
        // Wait for book to be rendered to get current page
        displayed.then(function () {
            // Get the current CFI
            var currentLocation = rendition.currentLocation();
            // Get the Percentage (or location) from that CFI
            const currentPage = book.locations.percentageFromCfi(currentLocation.start.cfi);
            current.value = currentPage
        });
        rendition.on('relocated', (location) => {
            const percent = book.locations.percentageFromCfi(location.start.cfi);
            const percentage = Math.floor(percent * 100);
            current.value = percentage
        });
    })
}

const change = (e) => {
    const value = e.target.value
    current.value = value
    var cfi = book.locations.cfiFromPercentage(value / 100);
    rendition.display(cfi);
}
</script>
<style>
.progress {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    z-index: 1;
    color: #000;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.progress>input[type=number] {
    text-align: center;
}

.progress>input[type=range] {
    width: 100%;
}
</style>
```

:::

## Search in the book

::: demo search in the book

```vue
<template>
    <div style='position: relative'>
        <div style='height: 100vh'>
            <VueReader url='/docs/files/啼笑因缘.epub' :getRendition='getRendition'>
            </VueReader>
        </div>
        <div class="search">
            <input v-model.trim="searchText" type="text" placeholder="search" @keyup.enter="search" />
            <div class="searchResults">
                <div class="item" v-for="(item, index) in searchResults" :key="index" @click="go(item.cfi, $event)">
                    <span
                        v-html='item.excerpt.trim().replace(searchText, `<span style="color: orange">${searchText}</span>`)'>
                    </span>
                </div>
                <div v-if="!searchResults.length">Empty</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'

let rendition = null
const searchText = ref('只在捻花一笑中')
const searchResults = ref([])
const getRendition = (val) => rendition = val

const search = async () => {
    if (!searchText.value) return searchResults.value = []
    const res = await doSearch(searchText.value)
    searchResults.value = res.slice(0, 5)
}

const doSearch = (value) => {
    const { book } = rendition
    return Promise.all(book.spine.spineItems.map(item => {
        return item.load(book.load.bind(book)).then(doc => {
            const res = item.find(value);
            item.unload();
            return Promise.resolve(res);
        });
    })).then(res => Promise.resolve([].concat.apply([], res)));
}

const go = (href, e) => {
    rendition.display(href)
    e.stopPropagation();
    e.preventDefault();
}

</script>
<style scoped>
.search {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    text-align: center;
    z-index: 1;
    color: #000;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}


.search .searchResults {
    width: 200px;
}

.search .searchResults .item {
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: 1px solid #000;
}

.search .searchResults .item:hover {
    background: rgba(0, 0, 0, 0.05);
}
</style>
```

:::

<script setup lang="ts">
import mediumZoom from 'medium-zoom'
</script>

<style>
    .reader-button{
        width: 48px;
        height: 24px;
        border:1px solid #dcdfe6;
        border-radius:4px;
        text-align: center;
        color:#606266;
    }
    .reader-button:hover,reader-button:focus{
        color: #409eff;
        border-color: #c6e2ff;
        background-color: ecf5ff;
        outline: none;
    }
</style>
