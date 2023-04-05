//https://www.npmjs.com/package/epub
const EPub = require("epub")
const sharp = require("sharp")
const perfectJson = require('perfect-json')
const { join } = require('path')
const fs = require('fs')
const Vibrant = require('node-vibrant')
const libraryPath = join(__dirname, '../public/books')
const booksJson = []
const parseBook = (name) => {
    return new Promise((resolve, reject) => {
        const filePath = join(libraryPath, name)
        const book = new EPub(filePath);
        book.on("end", async () => {
            // epub is now usable
            const { title, cover } = book.metadata
            await book.getImage(cover, async function (error, img, mimeType) {
                if (error) return console.log(error)
                if (mimeType.includes('image')) {
                    const coverPath = join(libraryPath, 'cover', `./${name.replace(".epub", "")}.webp`)
                    const data = await sharp(img)//转换成webp生成封面
                        .webp({ lossless: true })
                        .toBuffer()

                    fs.writeFileSync(coverPath, data)
                    // 获取图书封面主题颜色,node-vibrant不支持webp直接使用buffer
                    const palette = await Vibrant.from(img).getPalette()
                    booksJson.push({ ...book.metadata, url: name, bgColorFromCover: palette.DarkVibrant.hex })
                }
            });
            console.log(name + ' 解析完成')
            resolve(title)
        });
        book.parse();
    })
}
const saveBookInfo = async () => {
    //不存在cover文件夹创建
    fs.stat(join(libraryPath, 'cover'), fs.constants.F_OK, (err) => {
        if (err)
            fs.mkdirSync(join(libraryPath, 'cover'))
    })
    const books = fs.readdirSync(libraryPath)
    const promise = books.map(name => {
        if (name.endsWith('epub'))
            return parseBook(name)
    })
    p = promise.filter(i => i)
    Promise.all(p)
    const jsonPath = join(libraryPath, './books.json')//生成books.json
    setTimeout(() => {
        fs.writeFileSync(jsonPath, perfectJson(booksJson))
    }, (books.length) * 500);
}
saveBookInfo()