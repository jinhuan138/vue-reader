//https://www.npmjs.com/package/epub
import EPub from "epub"
import { join, dirname } from 'node:path'
import fs from 'fs'
import { fileURLToPath } from 'node:url'
import Vibrant from 'node-vibrant'

const __dirname = dirname(fileURLToPath(import.meta.url))
const libraryPath = join(__dirname, '../public/books')
const booksJson = []
const parseBook = (name) => {
    return new Promise((resolve, reject) => {
        const filePath = join(libraryPath, name)
        const { size } = fs.statSync('path/to/file');
        const book = new EPub(filePath);
        book.on("end", async () => {
            // epub is now usable
            const { title, cover } = book.metadata
            console.log(book.metadata)
            await book.getImage(cover, async (error, img, mimeType) => {
                //img buffer
                if (error) return console.log(error)
                if (mimeType.includes('image')) {
                    const coverPath = join(libraryPath, 'cover', `./${name.replace(".epub", "")}.jpg`)
                    fs.writeFileSync(coverPath, img)
                    // 获取图书封面主题颜色,node-vibrant不支持webp直接使用buffer
                    const palette = await Vibrant.from(img).getPalette()
                    booksJson.push({ ...book.metadata, url: name, bgColorFromCover: palette.DarkVibrant.hex, size, })
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
    const arr = promise.filter(i => i)
    Promise.all(arr)
    const jsonPath = join(libraryPath, './books.json')//生成books.json
    setTimeout(() => {
        fs.writeFileSync(jsonPath, JSON.stringify(booksJson, null, 2))
    }, (books.length) * 500);
}
saveBookInfo()