//https://dexie.org/docs/Tutorial/Vue
import Dexie from 'dexie'

export const db = new Dexie('library')
db.version(1).stores({
  books: '++id, name, buffer, md5 ,size',
})
