# Open Links or Run Scripts Inside the epub.js iframe

epub.js renders EPUB content inside an iframe that uses `sandbox="allow-same-origin"` by default. To open links or run JavaScript inside an EPUB, pass the required options through the `epubOptions` prop.

```vue
<vue-reader
  url='/files/啼笑因缘.epub' 
  :epubOptions='{
    allowPopups: true, // Adds `allow-popups` to sandbox-attribute
    allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
  }'
/>
```
