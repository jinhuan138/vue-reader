import { defineStore } from 'pinia'
import books from "../../../../public/books/books.json";

export const useReaderStore = defineStore('reader', {
    state: () => {
        return {
            theme: 'default',
            flow: 'paginated',
            font: '',
            lineSpacing: 1.5,
            fontSize: 100,
            bookList: books
        }
    },
    actions: {
        setTheme(theme) {
            this.theme = theme;
        },
        reset() {
            this.theme = 'default'
            this.flow = 'paginated'
            this.font = ''
            this.lineSpacing = 1.5
            this.fontSize = 100
        },
        setBook(id, info) {
            const index = this.bookList.findIndex(book => book.id === id)
            if (index > -1) {
                this.bookList[index] = info
            }
        },
        addBook() {

        },
        delBook(id) {
            const index = this.bookList.findIndex(item => id === item.id)
            if (index > -1) {
                this.bookList.splice(index, 1)
            }
        }
    },
    persist: true,
})