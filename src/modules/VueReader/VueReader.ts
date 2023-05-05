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
            required: true,
            type: [String, ArrayBuffer]
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
            const instance: any = epubRef.value
            instance.setLocation(href);
            expandedToc.value = false;
        };

        const next = () => {
            const instance: any = epubRef.value
            instance?.nextPage()
        }

        const pre = () => {
            const instance: any = epubRef.value
            instance.prevPage()
        }

        return () => h('div', { class: 'container' }, [
            h('div', { class: ['readerArea', { containerExpanded: expandedToc.value }] }, [
                // 展开目录
                showToc.value && h('button', {
                    class: ['tocButton', { tocButtonExpanded: expandedToc.value }],
                    type: 'button',
                    onClick: toggleToc
                }, [
                    h('span', { class: 'tocButtonBar', style: 'top: 35%' }),
                    h('span', { class: 'tocButtonBar', style: 'top: 66%' }),
                ]),
                // 书名
                h('div', { class: 'titleArea' }, slots.title || bookName.value),
                // 阅读
                h(EpubView, {
                    ref: epubRef,
                    url: url.value,
                    tocChanged: onTocChange,
                    getRendition: onGetRendition,
                    ...context.attrs,
                }, {
                    // loading
                    loadingView: () => h('template', slots.loadingView || h('div', { class: 'loadingView' }, 'Loading...'))
                }),
                // 翻页
                h('button', {
                    class: 'arrow pre',
                    onClick: pre,
                    disabled: currentLocation.value?.atStart
                }, '‹'),
                h('button', {
                    class: 'arrow next',
                    onClick: next,
                    disabled: currentLocation.value?.atEnd
                }, '›')
            ]),
            // 目录
            showToc.value && h('div', [
                h('div', { class: 'tocArea' }, toc.value.map((item, index) => {
                    return h('div', { key: index }, [
                        h('button', {
                            class: ['tocAreaButton', { active: currentLocation.value?.start.href.includes(item.href) }],
                            onClick: () => setLocation(item.href),
                        }, [
                            item.label,
                            // 展开
                            item.subitems && item.subitems.length > 0 && h('div', {
                                class: 'expansion',
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
                        item.subitems && item.subitems.length > 0 && h('div', { name: 'subitem' }, h('div', {
                            style: { display: expandedToc.value ? 'flex' : 'none', flexDirection: 'column' },
                            vShow: item.expansion,
                        }, item.subitems.map((subitem, subindex) => {
                            return h('button', {
                                key: subindex,
                                class: ['tocAreaButton', { active: currentLocation.value?.start.href.includes(subitem.href) }],
                                onClick: () => setLocation(subitem.href)
                            }, " ".repeat(4) + subitem.label)
                        })))
                    ])
                })),
                // 目录遮罩
                h('div', {
                    class: ['tocBackground', { expandedToc: expandedToc.value }],
                    onClick: toggleToc,
                    style: { display: expandedToc.value ? undefined : 'none' }
                })
            ])
        ])
    }
})