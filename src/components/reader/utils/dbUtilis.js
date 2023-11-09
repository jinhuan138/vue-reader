/**
 * Parsh the toc provided by epubjs to required form by element-ui tree component
 * and store inforamtion related to toc item such as lable, href, cfi and percent.
 * @param {Object} Book - EPUBJS Book needed to be ready
 * @returns {Array} returns array of toc tree that easily adopted by el-tree
 */
const parshToc = async (book) => {
  const { toc } = book.navigation
  const { spine } = book

  /**
   * some epubs not uese standerd href or epubjs fails to process them
   * @param {String} href  The href to validate
   * @returns {String} href
   */
  const validateHref = (href) => {
    if (href.startsWith('..')) {
      href = href.substring(2)
    }
    if (href.startsWith('/')) {
      href = href.substring(1)
    }
    return href
  }

  /**
   * Return spin part from href
   *
   * TL;DR
   * Toc item points exact postion of chapter or subChapter by using hase ID
   * in href. In more genrale href looks like ch001#title.
   * The ch001 is spine item and title is element id for which tocitem is.
   * We can get cfi of toc from this two item.
   *
   * @param {String} href - The herf to get spine component
   * @returns {String} - The Spine item href
   */
  const getSpineComponent = (href) => {
    return href.split('#')[0]
  }

  /**
   * Returns elementId part of href
   * @param {String} href
   */
  const getPositonComponent = (href) => {
    return href.split('#')[1]
  }

  const tocTree = []

  /**
   * recursively go through toc and parsh it
   * @param {toc} toc
   * @param {parrent} parrent
   */
  const createTree = async (toc, parrent) => {
    for (let i = 0; i < toc.length; i += 1) {
      // get clean href
      const href = validateHref(toc[i].href)

      // get spin and elementId part from href
      const spineComponent = getSpineComponent(href)
      const positonComponent = getPositonComponent(href)

      // get spinItem from href
      const spineItem = spine.get(spineComponent)

      // load spin item
      await spineItem.load(book.load.bind(book))
      // get element by positionComponent which is basically elementId
      const el = spineItem.document.getElementById(positonComponent)
      // get cfi from element
      const cfi = spineItem.cfiFromElement(el)
      // get percent from cfi
      const percentage = book.locations.percentageFromCfi(cfi)
      // toc item which has
      parrent[i] = {
        label: toc[i].label.trim(),
        children: [],
        href,
        cfi,
        percentage,
      }

      // if toc has subitems recursively parsh it
      if (toc[i].subitems) {
        await createTree(toc[i].subitems, parrent[i].children)
      }
    }
  }

  await createTree(toc, tocTree)
  return tocTree
}

const image2Base64 = (url) =>
  new Promise((resolve, reject) => {
    if (!url) return resolve('')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      const data = canvas.toDataURL()
      resolve(data)
    }
    img.onerror = () => {
      reject('')
    }
  })

const getInfo = async (url, book, callback) => {
  // parameter validation
  if (!url || typeof url !== 'string') {
    return
  }
  // create a key from path
  // const key = generateKey(filePath);

  // file load on file protocol
  // const uri = fileUrl(filePath);

  book.ready
    .then(() => {
      return book.locations.generate()
    })
    .then(async (locations) => {
      const meta = book.package.metadata

      const info = {
        // id: key,
        title: meta.title,
        author: meta.creator,
        publisher: meta.publisher,
        path: url,
        bookmarks: [],
        highlights: [],
        bgColorFromCover: '',
        toc: await parshToc(book),
        locations,
      }

      if (callback) {
        callback(info, book)
      }
    })
}

const addToDB = (file, db, cb) => {
  getInfo(file, (info, book) => {
    let key = info.id
    info.lastOpen = new Date().getTime()
    // return if book is allready registered
    if (db.has(key)) {
      if (cb) {
        cb(info, db)
      }
      return
    }

    if (process.platform === 'win32') {
      key = key.split('\\').pop()
    }

    const coverPath = path.join(
      remote.app.getPath('appData'),
      'eplee',
      'cover',
      key
    )
  })
}

export { parshToc, image2Base64, getInfo, addToDB }
