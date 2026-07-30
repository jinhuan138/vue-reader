# 在 epub.js iframe 中打开链接或运行脚本

epub.js 会在 iframe 中渲染 EPUB 内容，默认使用 `sandbox="allow-same-origin"`。若要在 EPUB 中打开链接或运行 JavaScript，需要通过 `epubOptions` 属性传入额外参数。

```vue
<vue-reader
  url='/files/啼笑因缘.epub' 
  :epubOptions='{
    allowPopups: true, // 为 sandbox 属性添加 `allow-popups`
    allowScriptedContent: true, // 为 sandbox 属性添加 `allow-scripts`
  }'
/>
```
