import { defineStore } from 'pinia'
import books from "../../../../public/books/books.json";

export const useReaderStore = defineStore('reader', {
    state: () => {
        return {
            theme: 'default',
            bookList: books
        }
    },
    actions: {
        setTheme(theme) {
            this.theme = theme;
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
                reader.bookList.slice(index, 1)
            }
        }
    },
    persist: {
        enabled: true,
        strategies: [
            { storage: localStorage, paths: ['theme', 'bookList'] },
        ],
    }
})