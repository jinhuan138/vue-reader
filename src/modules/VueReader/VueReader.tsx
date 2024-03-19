import './style.css'
import {
  ref,
  toRefs,
  reactive,
  defineComponent,
  getCurrentInstance,
  type PropType,
  onBeforeUnmount,
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
    const { setLocation, isSubmenu } = props
    const { toc, current } = toRefs(props)
    return () => (
      <>
        {toc.value.map((item, index) => (
          <>
            <button
              key={index}
              class={{
                tocAreaButton: true,
                active: item.href === current!.value,
              }}
              onClick={() => {
                if (item.subitems.length > 0) {
                  item.expansion = !item.expansion
                  setLocation(item.href, false)
                } else {
                  setLocation(item.href)
                }
              }}
            >
              {isSubmenu ? ' '.repeat(4) + item.label : item.label}
              {
                // 展开
                item.subitems && item.subitems.length > 0 && (
                  <div class={{ open: item.expansion, expansion: true }}></div>
                )
              }
            </button>
            {
              //多级目录
              item.subitems && item.subitems.length > 0 && (
                <div v-show={item.expansion}>
                  <TocComponent
                    toc={item.subitems}
                    current={current.value}
                    setLocation={setLocation}
                    isSubmenu={true}
                  />
                </div>
              )
            }
          </>
        ))}
      </>
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

    return () => (
      <div class="container">
        <div class={{ readerArea: true, containerExpanded: expandedToc.value }}>
          {/* 展开目录 */}
          {showToc.value && (
            <button
              class={{
                tocButton: true,
                tocButtonExpanded: expandedToc.value,
              }}
              onClick={toggleToc}
            >
              <span class="tocButtonBar" style="top: 35%"></span>
              <span class="tocButtonBar" style="top: 66%"></span>
            </button>
          )}
          {/* 书名 */}
          <div class="titleArea" title={bookName.value}>
            {slots.title ? slots.title?.() : title.value || bookName.value}
          </div>
          {/* 阅读区 */}
          <EpubView
            ref={epubRef}
            url={url.value}
            tocChanged={onTocChange}
            getRendition={onGetRendition}
            {...attrs}
            on={{ ...context.listeners }}
            v-slots={{
              loadingView: () => (
                <div class="loadingView">
                  {slots.loadingView ? slots.loadingView?.() : 'Loading...'}
                </div>
              ),
            }}
          ></EpubView>
          {/*  翻页 */}
          <button
            class="arrow pre"
            onClick={pre}
            disabled={currentLocation.value?.atStart}
          >
            ‹
          </button>
          <button
            class="arrow next"
            onClick={next}
            disabled={currentLocation.value?.atEnd}
          >
            ›
          </button>
        </div>
        {/* 目录 */}
        {showToc.value && (
          <div>
            <div class="tocArea">
              <TocComponent
                toc={toc.value}
                current={currentHref.value}
                setLocation={setLocation}
              />
            </div>
            {expandedToc.value && (
              //目录遮罩
              <div class="tocBackground" onClick={toggleToc}></div>
            )}
          </div>
        )}
      </div>
    )
  },
})
