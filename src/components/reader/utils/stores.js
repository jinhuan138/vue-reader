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
        setInfo(id, info) {
            const index = this.bookList.findIndex(book => book.id === id)
            if (index > -1) {
                this.bookList[index] = info
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