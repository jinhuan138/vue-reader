# Vue Reader - an easy way to embed a ePub into your webapp
An vue-reader for vue powered by EpubJS

## Basic usage

```bash
npm install vue-reader --save
```

And in your vue-component...

:::demo basic usage

```vue
<template>
   <div style='height: 100vh'>
      <VueReader url='/docs/files/啼笑因缘.epub'/>
   </div>
</template>
```
:::

## VueReader Attributes

| **Name** | **Description**         | **Type**               | **Default** |
| -------- | ----------------------- | ---------------------- | ----------- |
| url      | book url or arrayBuffer | `string`|`ArrayBuffer` | —           |
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
| url                | the path or arrayBuffer of the book                          | `string`|`ArrayBuffer`        | —           |
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
    rendition.themes.fontSize(`${size}%`)
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

let rendition = null
const getRendition = (val) => {
    rendition = val
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
    if (rendition) {
        rendition.on('selected', setRenderSelection)
    }
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
            :epubInitOptions="{openAs: 'epub'}">
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

## speak the text

:::demo speak the text

```vue
<template>
    <div style='position: relative'>
        <div style='height: 100vh'>
            <VueReader url='/docs/files/啼笑因缘.epub' :getRendition='getRendition' />
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

let rendition = null, isAudioOn = false, text = null
let isReading = ref(false)

const getRendition = (val) => {
    rendition = val
    rendition.hooks.content.register((contents, view) => {
        let textContent = contents.document.body.textContent
        textContent = textContent
            .replace(/\s\s/g, '')
            .replace(/\r/g, '')
            .replace(/\n/g, '')
            .replace(/\t/g, '')
            .replace(/\f/g, '')
        text = textContent
    })
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


## get book information

::: demo get book information

```vue
<template>
    <VueReader 
       v-show='false'
       url='/docs/files/啼笑因缘.epub' :getRendition='getRendition'>      
	</VueReader>
</template>
<script setup>
let rendition = null, book = null
const image2Base64 = (url) => new Promise((resolve, reject) => {
    if (!url) return resolve('');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const data = canvas.toDataURL();
        resolve(data);
    };
    img.onerror = () => {
        reject('');
    };
})
const getRendition = (val) => {
    rendition = val
    book = rendition.book
    book.ready.then(() => {
        book.loaded.metadata.then(async (metadata) => {
            const cover = await book.coverUrl()
            const { title, identifier, creator, publisher, language, pubdate, description, modified_date } = metadata
         	 const  information = {
                identifier,//id
                title,//标题
                creator,//作者
                publisher,//出版社
                language,//语言
                pubdate,//出版日期
                modified_date,//修改日期
                description,//介绍
                cover: await image2Base64(cover),//封面
            }
            console.log('book',information)
        })
    })
}
</script>
```

:::

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
