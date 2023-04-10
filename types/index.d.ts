import ePub, { Book, Rendition, Contents } from 'epubjs';

declare module "*.vue" {
  import { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}