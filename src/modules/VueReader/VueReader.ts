import "./style.css";
import { ref, h as _h, toRefs, reactive, defineComponent, getCurrentInstance, type PropType, onBeforeUnmount, version } from "vue-demi";
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
            required: true,
            // type: [string | ArrayBuffer],
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

    setup(props, context: any) {
        const { emit, slots, expose, attrs } = context
        const vm = getCurrentInstance();
        const h = _h.bind(vm);

        const epubRef = ref<InstanceType<typeof EpubView>>()
        const currentLocation = ref<Rendition['location'] | null>(null)

        const { tocChanged, getRendition } = props
        const { title, url, showToc } = toRefs(props)

        const book = reactive<EpubBook>({
            toc: [],//目录
            expandedToc: false,//目录展开
        })
        const { toc, expandedToc } = toRefs(book)

        const bookName = ref('')

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
            const book = rendition.book
            book.ready.then(() => {
              const meta = book.package.metadata;
              bookName.value = meta.title
            })
        }

        const setLocation = (href: string | number) => {
            const instance: any = epubRef.value || vm?.refs['epubRef']
            instance?.setLocation(href);
            expandedToc.value = false;
        };

        const next = () => {
            const instance: any = epubRef.value || vm?.refs['epubRef']
            instance?.nextPage()
        }

        const pre = () => {
            const instance: any = epubRef.value || vm?.refs['epubRef']
            instance?.prevPage()
        }

        if (expose) {
            expose({ setLocation, next, pre });
        } else {
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
            expose({ setLocation, next, pre });
        }

        return () => h('div', { class: 'container' }, [
            h('div', { class: ['readerArea', { containerExpanded: expandedToc.value }] }, [
                // 展开目录
                showToc.value && h('button', {
                    class: ['tocButton', { tocButtonExpanded: expandedToc.value }],
                    type: 'button',
                    on: {
                        click: () => toggleToc()
                    },
                    onClick: toggleToc
                }, [
                    h('span', { class: 'tocButtonBar', style: 'top: 35%' }),
                    h('span', { class: 'tocButtonBar', style: 'top: 66%' }),
                ]),
                // 书名
                h('div', { class: 'titleArea' }, slots.title ? slots.title?.() : title || bookName),
                // 阅读
                h(EpubView, {
                    ref: parseFloat(version) < 2.7 ? 'epubRef' : epubRef,
                    url: url.value,
                    tocChanged: onTocChange,
                    getRendition: onGetRendition,
                    ...attrs,
                    //vue2
                    attrs: {
                        url: url.value,
                        tocChanged: onTocChange,
                        getRendition: onGetRendition,
                        ...attrs,
                    },
                    on: {
                        ...context.listeners
                    }
                }, {
                    // loading
                    loadingView: () => h('div', { class: 'loadingView' }, slots.loadingView ? slots.loadingView?.() : 'Loading...')
                }),
                // 翻页
                h('button', {
                    class: 'arrow pre',
                    on: {
                        click: () => pre()
                    },
                    onClick: pre,
                    domProps: {
                        disabled: currentLocation.value?.atStart
                    },
                    disabled: currentLocation.value?.atStart
                }, '‹'),
                h('button', {
                    class: 'arrow next',
                    on: {
                        click: () => next()
                    },
                    onClick: next,
                    domProps: {
                        disabled: currentLocation.value?.atEnd
                    },
                    disabled: currentLocation.value?.atEnd
                }, '›')
            ]),
            // 目录
            showToc.value && h('div', [
                h('div', { class: 'tocArea' }, toc.value.map((item, index) => {
                    return h('div', { key: index }, [
                        h('button', {
                            class: ['tocAreaButton', currentLocation.value && item.href.includes(currentLocation.value!.start.href) ? 'active' : ''],
                            on: {
                                click: () => setLocation(item.href)
                            },
                            onClick: () => setLocation(item.href),
                        }, [
                            item.label,
                            // 展开
                            item.subitems && item.subitems.length > 0 && h('div', {
                                class: 'expansion',
                                on: {
                                    click: (event) => {
                                        event.stopPropagation()
                                        item.expansion = !item.expansion
                                    }
                                },
                                onClick: (event) => {
                                    event.stopPropagation()
                                    item.expansion = !item.expansion
                                },
                                style: {
                                    transform: item.expansion ? 'rotate(180deg)' : 'rotate(0deg)'
                                }
                            }),
                        ]),
                        // 二级目录
                        item.subitems && item.subitems.length > 0 && h('div', { style: { display: item.expansion ? undefined : 'none' } },
                            item.subitems.map((subitem, subIndex) => {
                                return h('button', {
                                    key: subIndex,
                                    class: ['tocAreaButton', currentLocation.value && subitem.href.includes(currentLocation.value!.start.href) ? 'active' : ''],
                                    onClick: () => setLocation(subitem.href),
                                    on: {
                                        click: () => setLocation(subitem.href)
                                    },
                                }, " ".repeat(4) + subitem.label)
                            }))
                    ])
                })),
                // 目录遮罩
                expandedToc.value && h('div', {
                    class: ['tocBackground'],
                    onClick: toggleToc,
                    on: {
                        click: () => toggleToc()
                    }
                })
            ])
        ])
    }
})