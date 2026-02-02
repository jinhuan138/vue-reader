# Enable opening links / running scripts inside epubjs iframe

Epubjs is rendering the epub-content inside and iframe which defaults to `sandbox="allow-same-origin"`, to enable opening links or running javascript in an epub, you will need to pass some extra params in the `epubOptions` prop.

```vue
<vue-reader
  url='/files/啼笑因缘.epub' 
  :epubOptions='{
    allowPopups: true, // Adds `allow-popups` to sandbox-attribute
    allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
  }'
/>
```
