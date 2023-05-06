//https://github.com/takuma-ru/vue-swipe-modal/blob/main/packages/lib/src/components/swipe-modal.ts
//https://github.com/KaygNas/rollup-plugin-vue-demi
//git@github.com:takuma-ru/vue-swipe-modal.git
import "./style.css";
import { ref, h as _h, onMounted, onUnmounted, toRefs, watch, defineComponent, getCurrentInstance, type PropType, isVue3, onBeforeUnmount } from "vue-demi";
import ePub, { Book, Rendition, Contents } from 'epubjs';
import { clickListener, swipListener, wheelListener, keyListener } from '../utils/listener/listener';

interface Props {
    url: string | ArrayBuffer,
    location?: any, //当前页 number | string | Rendition['location']['start']
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

    props: {
        url: {
            required: true,
            type: [String, ArrayBuffer]
        },
        location: {
            type: Object as PropType<Props['location']>,
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

    emits: {
        'update:location'(location: Props['location'], loc: Rendition['location']) {
            return true
        }
    },

    setup(props, context) {
        const { emit, slots, expose } = context
        const vm = getCurrentInstance();
        const h = _h.bind(vm);

        const { url, location } = toRefs(props)
        const { tocChanged, getRendition, handleKeyPress, handleTextSelected, epubInitOptions, epubOptions } = props

        const viewer = ref<HTMLDivElement | null>(null)
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
            rendition = book!.renderTo('viewer', {
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
                    // // selectListener(iframe.document, rendition, toggleBuble);
                    swipListener(iframe.document, flipPage);
                    wheelListener(iframe.document, flipPage);
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
            const newLocation = loc && loc.start
            if (location?.value !== newLocation) {
                emit('update:location', newLocation, loc)
            }
        }

        const debounce = (func: Function, wait: number = 500) => {
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
                if (val === old) return
                if (typeof val === 'string') {
                    rendition?.display(val)
                }
                if (typeof val === 'number') {
                    rendition?.display(val)
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

        if (isVue3) {
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

        return () => h('div', { class: 'reader' }, [
            h('div', { class: 'viewHolder' }, [
                isLoaded.value
                    ? h('div', {
                        ref: viewer,
                        id: 'viewer',
                        domProps: {
                            id: 'viewer'
                        },
                        style: {
                            display: !isLoaded.value ? 'hidden' : undefined
                        }
                    })
                    : h('div', null, { loadingView: () => slots.loadingView?.() })
            ])
        ])
    },
})