import "./style.css";
import { ref, h as _h, toRefs, reactive, computed, defineComponent, getCurrentInstance, type PropType } from "vue-demi";
import { Rendition, Book } from 'epubjs';
import EpubView from "../EpubView/EpubView";

interface NavItem {
    id: string,
    href: string,
    label: string,
    subitems: Array<NavItem>,
    parent?: string,
    expansion: boolean
}

interface Props {
    url: any,
    title?: string,
    showToc?: boolean,
    tocChanged?: (toc: Book['navigation']['toc']) => void,
    getRendition?: (rendition: Rendition) => void,
}

interface EpubBook {
    toc: Array<NavItem>,
    expandedToc: boolean
}

export default defineComponent({
    name: "VueReader",
    props: {
        url: {
            required: true
        },
        title: String,
        showToc: {
            type: Boolean,
            default: true
        },
        tocChanged: {
            type: Function as PropType<Props['tocChanged']>,
        },
        getRendition: {
            type: Function as PropType<Props['getRendition']>,
        }
    },
    setup(props, context) {
        const { emit, slots } = context
        const vm = getCurrentInstance();
        const h = _h.bind(vm);

        const epubRef = ref<InstanceType<typeof EpubView>>()
        const currentLocation = ref<Rendition['location'] | null>(null)

        const { tocChanged, getRendition } = props
        const { title, url, showToc } = toRefs(props)

        const book: EpubBook = reactive({
            toc: [],//目录
            expandedToc: false,//目录展开
        })
        const { toc, expandedToc } = toRefs(book)

        const bookName = computed(() => {
            if (title?.value) {
                return title.value
            } else {
                let title = ''
                if (typeof (url.value) === 'string' && url.value.endsWith('.epub')) {
                    const num = url.value.lastIndexOf('/') + 1
                    const name = url.value.substring(num)
                    title = name.replace(".epub", '')
                }
                return title
            }
        })

        const toggleToc = () => {
            expandedToc.value = !expandedToc.value
        }

        const onTocChange = (_toc) => {
            toc.value = _toc.map(i => ({ ...i, expansion: false }))
            tocChanged && tocChanged(_toc)
        }

        const onGetRendition = (rendition) => {
            getRendition && getRendition(rendition)
            rendition.on("relocated", (location) => {
                currentLocation.value = location
            })
        }

        const setLocation = (href: string | number) => {
            epubRef?.value?.setLocation(href);
            expandedToc.value = false;
        };

        const next = () => {
            epubRef.value?.nextPage()
        }

        const pre = () => {
            epubRef.value?.prevPage()
        }

        return 
    }
})