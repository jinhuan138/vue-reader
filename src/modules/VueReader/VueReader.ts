import './style.css'
import {
  ref,
  toRefs,
  reactive,
  defineComponent,
  getCurrentInstance,
  type PropType,
  onBeforeUnmount,
  version,
  Transition,
  h as _h,
} from 'vue-demi'
import { Rendition, Book } from 'epubjs'
import EpubView from '../EpubView/EpubView'

interface NavItem {
  id: string
  href: string
  label: string
  subitems: Array<NavItem>
  parent?: string
  expansion: boolean
}

interface Props {
  url: any
  title?: string
  showToc?: boolean
  tocChanged?: (toc: Book['navigation']['toc']) => void
  getRendition?: (rendition: Rendition) => void
}

interface TocProps {
  toc: Array<NavItem>
  current: String | Number
  setLocation: (href: string | number, close?: boolean) => void
  isSubmenu?: boolean
}

interface EpubBook {
  toc: Array<NavItem>
  expandedToc: boolean
}

const TocComponent = defineComponent({
  name: 'TocComponent',
  props: {
    toc: {
      type: Array as PropType<Array<NavItem>>,
      default: () => [],
    },
    current: {
      type: [String, Number],
      default: '',
    },
    setLocation: {
      type: Function as PropType<TocProps['setLocation']>,
      required: true,
    },
    isSubmenu: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props) {
    const vm = getCurrentInstance()
    const h = _h.bind(vm)

    const { setLocation, isSubmenu } = props
    const { toc, current } = toRefs(props)

    return () =>
      h(
        'div',
        null,
        toc.value.map((item, index) => {
          return h('div', { key: index }, [
            h(
              'button',
              {
                class: [
                  'tocAreaButton',
                  item.href === current!.value ? 'active' : '',
                ],
                on: {
                  click: () => {
                    if (item.subitems.length > 0) {
                      item.expansion = !item.expansion
                      setLocation(item.href, false)
                    } else {
                      setLocation(item.href)
                    }
                  },
                },
                onClick: () => {
                  if (item.subitems.length > 0) {
                    item.expansion = !item.expansion
                    setLocation(item.href, false)
                  } else {
                    setLocation(item.href)
                  }
                },
              },
              [
                isSubmenu ? ' '.repeat(4) + item.label : item.label,
                // 展开
                item.subitems &&
                  item.subitems.length > 0 &&
                  h('div', {
                    class: `${item.expansion ? 'open' : ''} expansion`,
                  }),
              ]
            ),
            //多级目录
            item.subitems &&
              item.subitems.length > 0 &&
              h(
                Transition,
                { name: 'collapse-transition' },
                {
                  default: () =>
                    h(
                      'div',
                      {
                        style: {
                          display: item.expansion ? undefined : 'none',
                        },
                      },
                      h(TocComponent, {
                        toc: item.subitems,
                        current: current.value,
                        setLocation,
                        isSubmenu: true,
                        attrs: {
                          toc: toc.value,
                          current: current.value,
                          setLocation,
                          isSubmenu: true,
                        },
                      })
                    ),
                }
              ),
          ])
        })
      )
  },
})

export default defineComponent({
  name: 'VueReader',

  props: {
    url: {
      required: true,
      // type: [string | ArrayBuffer],
    },
    title: String,
    showToc: {
      type: Boolean,
      default: true,
    },
    tocChanged: {
      type: Function as PropType<Props['tocChanged']>,
    },
    getRendition: {
      type: Function as PropType<Props['getRendition']>,
    },
  },

  setup(props, context: any) {
    const { emit, slots, expose, attrs } = context
    const vm = getCurrentInstance()
    const h = _h.bind(vm)

    const epubRef = ref<InstanceType<typeof EpubView> | null>(null)
    const currentLocation = ref<Rendition['location'] | null>(null)
    const currentHref = ref<string | number>('')

    const { tocChanged, getRendition } = props
    const { title, url, showToc } = toRefs(props)

    const book = reactive<EpubBook>({
      toc: [], //目录
      expandedToc: false, //目录展开
    })
    const { toc, expandedToc } = toRefs(book)

    const bookName = ref('')

    const toggleToc = () => {
      expandedToc.value = !expandedToc.value
    }

    const onTocChange = (_toc) => {
      toc.value = _toc.map((i) => ({ ...i, expansion: false }))
      tocChanged && tocChanged(_toc)
    }

    const onGetRendition = (rendition) => {
      getRendition && getRendition(rendition)
      rendition.on('relocated', (location) => {
        currentLocation.value = location
        // currentHref.value = location.start.href
      })
      const book = rendition.book
      book.ready.then(() => {
        const meta = book.package.metadata
        bookName.value = meta.title
      })
      rendition.hooks.content.register((contents) => {
        const { document } = contents
        const annotation = Array.from(
          document.querySelectorAll('a')
        ) as Array<HTMLAnchorElement>
        if (annotation.length) {
          const halfLength = Math.floor(annotation.length / 2)
          annotation.slice(0, halfLength).forEach((el: HTMLAnchorElement) => {
            if (el.href) {
              const id = el.href.split('#')[1]
              const target = annotation.find((a) => a.id === id)
              if (target && target.parentNode) {
                el.title = target.parentNode.textContent as string
              }
            }
          })
        }
      })
    }

    const setLocation = (href: string | number, close: boolean = true) => {
      const instance: any = epubRef.value || vm?.refs['epubRef']
      instance?.setLocation(href)
      currentHref.value = href
      expandedToc.value = !close
    }

    const next = () => {
      const instance: any = epubRef.value || vm?.refs['epubRef']
      instance?.nextPage()
    }

    const pre = () => {
      const instance: any = epubRef.value || vm?.refs['epubRef']
      instance?.prevPage()
    }

    if (expose) {
      expose({ setLocation, next, pre })
    } else {
      const expose = (exposing: Record<string, any>) => {
        if (!vm) {
          throw new Error('expose should be called in setup().')
        }

        const keys = Object.keys(exposing)

        keys.forEach((key) => {
          vm.proxy![key] = exposing[key]
        })

        onBeforeUnmount(() => {
          keys.forEach((key) => {
            vm.proxy![key] = undefined
          })
        })
      }
      expose({ setLocation, next, pre })
    }

    return () =>
      h('div', { class: 'container' }, [
        h(
          'div',
          { class: ['readerArea', { containerExpanded: expandedToc.value }] },
          [
            // 展开目录
            showToc.value &&
              h(
                'button',
                {
                  class: [
                    'tocButton',
                    { tocButtonExpanded: expandedToc.value },
                  ],
                  type: 'button',
                  on: {
                    click: toggleToc,
                  },
                  onClick: toggleToc,
                },
                [
                  h('span', { class: 'tocButtonBar', style: 'top: 35%' }),
                  h('span', { class: 'tocButtonBar', style: 'top: 66%' }),
                ]
              ),
            // 书名
            h(
              'div',
              { class: 'titleArea', title: bookName.value },
              slots.title ? slots.title?.() : title.value || bookName.value
            ),
            // 阅读区
            h(
              EpubView,
              {
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
                  ...context.listeners,
                },
              },
              {
                // loading
                loadingView: () =>
                  h(
                    'div',
                    { class: 'loadingView' },
                    slots.loadingView ? slots.loadingView?.() : 'Loading...'
                  ),
              }
            ),
            // 翻页
            h(
              'button',
              {
                class: 'arrow pre',
                on: {
                  click: pre,
                },
                onClick: pre,
                domProps: {
                  disabled: currentLocation.value?.atStart,
                },
                disabled: currentLocation.value?.atStart,
              },
              '‹'
            ),
            h(
              'button',
              {
                class: 'arrow next',
                on: {
                  click: next,
                },
                onClick: next,
                domProps: {
                  disabled: currentLocation.value?.atEnd,
                },
                disabled: currentLocation.value?.atEnd,
              },
              '›'
            ),
          ]
        ),
        // 目录
        showToc.value &&
          h('div', [
            h(
              'div',
              { class: 'tocArea' },
              h(TocComponent, {
                toc: toc.value,
                current: currentHref.value,
                setLocation,
                attrs: {
                  toc: toc.value,
                  current: currentHref.value,
                  setLocation,
                },
              })
            ),
            // 目录遮罩
            expandedToc.value &&
              h('div', {
                class: ['tocBackground'],
                onClick: toggleToc,
                on: {
                  click: toggleToc,
                },
              }),
          ]),
      ])
  },
})
