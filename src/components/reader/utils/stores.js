import { defineStore } from 'pinia'

export const useReaderStore = defineStore('reader', {
    state: () => {
        return { theme: 'default', }
    },
    actions: {
        setTheme(theme) {
            this.theme = theme;
        },
    },
    persist: {
        enabled: true,
        strategies: [
            { storage: localStorage, paths: ['theme'] },
        ],
    }
})