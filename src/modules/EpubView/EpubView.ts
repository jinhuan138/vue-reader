//https://github.com/takuma-ru/vue-swipe-modal/blob/main/packages/lib/src/components/swipe-modal.ts
//https://github.com/KaygNas/rollup-plugin-vue-demi
//https://github.com/Shimada666/vue-demi-sfc-component-template.git
import "./style.css";
import { ref, h as _h, onMounted, onUnmounted, toRefs, watch, defineComponent, getCurrentInstance, type PropType, isVue3, onBeforeUnmount, version, unref } from "vue-demi";
import ePub, { Book, Rendition, Contents } from 'epubjs';
import { clickListener, swipListener, wheelListener, keyListener } from '../utils/listener/listener';

interface Props {
    url: string | ArrayBuffer,
    location?: number | string | Rendition['location']['start'], //当前页 
    tocChanged?: (toc: Book['navigation']['toc']) => void,
    getRendition?: (rendition: Rendition) => void,
    handleTextSelected?: (cfiRange: string, contents: Contents) => void,
    handleKeyPress?: () => void,
    epubInitOptions?: Book['settings'],
    epubOptions?: Rendition['settings'],
}

export default defineComponent({
    name: "EpubView",

    model: {
        prop: 'location',
        event: 'update:location',
    },

    emits: {
        'update:location'(location: Props['location']) {
            return true
        }
    },

    props: {
        url: {
            required: true,
            type: [String, ArrayBuffer]
        },
        location: {
            // type: [Number, String]
        },
        tocChanged: {
            type: Function as PropType<Props['tocChanged']>,
        },
        getRendition: {
            type: Function as PropType<Props['getRendition']>,
        },
        handleTextSelected: {
            type: Function as PropType<Props['handleTextSelected']>,
        },
        handleKeyPress: {
            type: Function as PropType<Props['handleKeyPress']>,
        },
        epubInitOptions: {
            type: Object as PropType<Props['epubInitOptions']>,
            default: () => ({})
        },
        epubOptions: {
            type: Object as PropType<Props['epubOptions']>,
            default: () => ({})
        },
    },

    setup(props, { emit, slots, expose }) {
        const vm = getCurrentInstance();
        const h = _h.bind(vm);

        const { url, location } = toRefs(props)
        const { tocChanged, getRendition, handleKeyPress, handleTextSelected, epubInitOptions, epubOptions } = props

        const viewer = ref<HTMLDivElement | 'viewer'>('viewer')
        const toc = ref<Book['navigation']['toc']>([])
        const isLoaded = ref(false)
        let book: null | Book = null, rendition: null | Rendition = null;

        const initBook = async () => {
            if (book) book.destroy()
            book = ePub(url.value, epubInitOptions);
            book!.loaded.navigation.then(({ toc: _toc }) => {
                isLoaded.value = true
                toc.value = _toc
                tocChanged && tocChanged(_toc)
                initReader()
            });
        };

        const initReader = () => {
            const dom = viewer.value as HTMLDivElement || vm?.refs['viewer'] as HTMLDivElement
            rendition = book!.renderTo(dom, {
                width: '100%',
                height: '100%',
                ...epubOptions
            });
            registerEvents();
            getRendition && getRendition(rendition)
            if (typeof location?.value === 'string') {
                rendition.display(location.value)
            } else if (typeof location?.value === 'number') {
                rendition.display(location.value)
            } else if (toc.value.length > 0 && toc?.value[0]?.href) {
                rendition.display(toc.value[0].href)
            } else {
                rendition.display()
            }
        }

        const flipPage = (direction: string) => {
            if (direction === 'next') nextPage();
            else if (direction === 'prev') prevPage();
        }

        const registerEvents = () => {
            if (rendition) {
                rendition.on('rendered', (e: Event, iframe: any) => {
                    iframe?.iframe?.contentWindow.focus()
                    // clickListener(iframe?.document, rendition as Rendition, flipPage);
                    // selectListener(iframe.document, rendition, toggleBuble);
                    if (!epubOptions?.flow?.includes('scrolled')) wheelListener(iframe.document, flipPage);
                    swipListener(iframe.document, flipPage);
                    keyListener(iframe.document, flipPage);
                });
                rendition.on('locationChanged', onLocationChange)
                rendition.on("displayError", () => console.error("error rendering book"))
                if (handleTextSelected) {
                    rendition.on('selected', handleTextSelected)
                }
                if (handleKeyPress) {
                    rendition.on('selected', handleKeyPress)
                }
            }
        };

        const onLocationChange = (loc: Rendition['location']) => {//监听翻页
            const newLocation = loc.start
            if (location.value !== newLocation) {
                emit('update:location', newLocation)
            }
        }

        const debounce = (func: Function, wait: number = 1000) => {
            let timeout: NodeJS.Timeout | null;
            return function executedFunction(...args: Array<any>) {
                const later = () => {
                    timeout = null;
                    func(...args);
                };
                clearTimeout(timeout as NodeJS.Timeout);
                timeout = setTimeout(later, wait);
            };
        };

        if (location) {
            watch(location, debounce((val: string | number, old: string | number) => {
                if (val && val === old) return
                if (typeof val === 'string') {
                    // rendition?.display(val)
                }
                if (typeof val === 'number') {
                    // rendition?.display(val)
                }
            }), {
                immediate: true
            })
        }

        watch(url, () => {
            initBook()
        })

        const nextPage = () => {
            rendition?.next();
        };

        const prevPage = () => {
            rendition?.prev();
        }

        const setLocation = (href: number | string) => {
            if (typeof (href) === 'string')
                rendition!.display(href);
            if (typeof (href) === 'number')
                rendition!.display(href);
        };

        onMounted(() => {
            initBook()
        })

        onUnmounted(() => {
            book?.destroy()
        })

        if (expose) {
            expose({ nextPage, prevPage, setLocation });
        }
        else {
            const expose = (exposing: Record<string, any>) => {
                const instance = getCurrentInstance()
                if (!instance) {
                    throw new Error('expose should be called in setup().')
                }

                const keys = Object.keys(exposing)

                keys.forEach(key => {
                    instance.proxy![key] = exposing[key]
                })

                onBeforeUnmount(() => {
                    keys.forEach(key => {
                        instance.proxy![key] = undefined
                    })
                })
            }
            expose({ nextPage, prevPage, setLocation });
        }

        // Vue 3 and Vue 2 have different vnode props format:
        // see https://v3-migration.vuejs.org/zh/breaking-changes/render-function-api.html
        return () => h('div', { class: 'reader' }, [
            h('div', { class: 'viewHolder' }, [
                h('div', {
                    ref: viewer,
                    class: 'view',
                    id: 'viewer',
                    attrs: { id: 'viewer' },
                    style: {
                        display: !isLoaded.value ? 'hidden' : undefined
                    }
                }),
                !isLoaded.value ? h('div', null, { loadingView: () => slots.loadingView?.() }) : null
            ])
        ])
    },
})